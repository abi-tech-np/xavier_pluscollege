import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { execSync } from 'child_process';
import { PrismaClient } from '../generated/prisma';
import adminRouter from './routes/admin';

// Patch BigInt to serialize nicely in JSON
(BigInt.prototype as any).toJSON = function () {
    return this.toString();
};

const app = express();
const prisma = new PrismaClient({});
const PORT = process.env.PORT || 5000;

const serializeBigInt = (obj: any) => {
    return JSON.parse(JSON.stringify(obj, (key, value) =>
        typeof value === 'bigint'
            ? value.toString()
            : value // return everything else unchanged
    ));
};

const slugify = (text: string): string => {
    return text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')
        .replace(/[^\w\-]+/g, '')
        .replace(/\-\-+/g, '-')
        .replace(/^-+/, '')
        .replace(/-+$/, '');
};

// Robust CORS configuration handling Preflight OPTIONS requests
const corsOptions = {
    origin: process.env.ALLOWED_ORIGINS
        ? process.env.ALLOWED_ORIGINS.split(',')
        : ['http://localhost:5173', 'http://localhost:4173', 'https://plus.xavier.edu.np'],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
    credentials: false,
    optionsSuccessStatus: 204
};

app.use(cors(corsOptions));

// Normalize /plus-api prefix for reverse-proxies, Vite preview, and direct Express production
app.use((req, res, next) => {
    if (req.url.startsWith('/plus-api/')) {
        req.url = req.url.replace(/^\/plus-api/, '');
    }
    next();
});

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use('/storage', express.static(path.join(__dirname, '../storage'), {
    maxAge: '7d',
    immutable: false
}));

// Serve Vite production build with appropriate cache headers
const clientDistPath = path.join(__dirname, '../../client/dist');
// Hashed assets (JS/CSS/images) get long-lived immutable cache
app.use('/assets', express.static(path.join(clientDistPath, 'assets'), {
    maxAge: '365d',
    immutable: true
}));
// Other static files from public/ (images, videos, fonts) served with moderate cache
app.use(express.static(clientDistPath, {
    maxAge: '7d',
    setHeaders: (res, filePath) => {
        // HTML should not be cached aggressively
        if (filePath.endsWith('.html')) {
            res.setHeader('Cache-Control', 'no-cache');
        }
    }
}));

// GET /api/popups
app.get('/api/popups', async (req, res) => {
    try {
        const activePopups = await prisma.popups.findMany({
            where: { status: true },
            orderBy: [
                { display_order: 'asc' },
                { created_at: 'desc' }
            ]
        });

        // Fetch media for these popups
        const media = await prisma.media.findMany({
            where: {
                model_type: 'App\\Models\\Popup',
                model_id: { in: activePopups.map(p => p.id) }
            }
        });

        const data = activePopups.map(popup => {
            const popupMedia = media.find(m => m.model_id === popup.id);
            return {
                ...popup,
                imageUrl: popupMedia ? `/storage/${popupMedia.id}/${popupMedia.file_name}` : null
            };
        });

        res.json(serializeBigInt(data));
    } catch (e) {
        console.error('Failed to fetch popups', e);
        res.status(500).json({ error: 'Server error' });
    }
});

app.use('/api/admin', adminRouter);

// Helper to fetch media for polymorphic relations
const getMediaForModels = async (modelType: string, modelIds: bigint[]) => {
    if (modelIds.length === 0) return [];
    return await prisma.media.findMany({
        where: {
            model_type: modelType,
            model_id: { in: modelIds }
        }
    });
};

app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Backend is running' });
});

// GET /api/life-at-xavier
app.get('/api/life-at-xavier', async (req, res) => {
    try {
        const take = req.query.limit ? parseInt(req.query.limit as string, 10) : undefined;
        const items = await prisma.life_at_xaviers.findMany({
            where: { status: true, deleted_at: null },
            orderBy: [
                { display_order: 'asc' },
                { created_at: 'desc' }
            ],
            include: {
                life_at_xavier_images: {
                    orderBy: [
                        { image_order: 'asc' },
                        { sortOrder: 'asc' },
                        { id: 'asc' }
                    ]
                },
                life_at_xavier_social_posts: {
                    orderBy: { sort_order: 'asc' }
                }
            },
            ...(take ? { take } : {})
        });
        const ids = items.map(item => item.id);
        const media = await getMediaForModels('App\\Models\\LifeAtXavier', ids);
        const baseUrl = process.env.BASE_URL || `${req.protocol}://${req.get('host')}`;

        const data = items.map(item => {
            const itemMedia = media.find(m => m.model_id === item.id && (m.collection_name === 'thumbnail' || !m.collection_name));
            const galleryImages = (item.life_at_xavier_images || []).map(img => {
                if (img.imageUrl.startsWith('http')) return img.imageUrl;
                return `${baseUrl}${img.imageUrl.startsWith('/') ? '' : '/'}${img.imageUrl}`;
            });

            const socialPosts = (item.life_at_xavier_social_posts || []).map(p => {
                let thumb = p.thumbnail_url;
                if (thumb && !thumb.startsWith('http')) {
                    thumb = `${baseUrl}${thumb.startsWith('/') ? '' : '/'}${thumb}`;
                }
                return {
                    id: p.id.toString(),
                    platform: p.platform,
                    postUrl: p.post_url,
                    thumbnailUrl: thumb,
                    title: p.title,
                    caption: p.title,
                    sortOrder: p.sort_order
                };
            });

            return {
                ...item,
                imageUrl: itemMedia ? `${baseUrl}/storage/${itemMedia.id}/${itemMedia.file_name}` : null,
                imageUrls: galleryImages,
                galleryUrls: galleryImages,
                socialPosts
            };
        });
        res.json(serializeBigInt(data));
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// GET /api/life-at-xavier/:slug
app.get('/api/life-at-xavier/:slug', async (req, res) => {
    try {
        const item = await prisma.life_at_xaviers.findFirst({
            where: { slug: req.params.slug, status: true, deleted_at: null },
            include: {
                life_at_xavier_images: {
                    orderBy: [
                        { image_order: 'asc' },
                        { sortOrder: 'asc' },
                        { id: 'asc' }
                    ]
                },
                life_at_xavier_social_posts: {
                    orderBy: { sort_order: 'asc' }
                }
            }
        });

        if (!item) {
            return res.status(404).json({ error: 'Not found' });
        }

        const baseUrl = process.env.BASE_URL || `${req.protocol}://${req.get('host')}`;
        const media = await getMediaForModels('App\\Models\\LifeAtXavier', [item.id]);

        // Find thumbnail
        const itemMedia = media.find(m => m.model_id === item.id && (m.collection_name === 'thumbnail' || !m.collection_name));

        // Format gallery images
        const formattedGalleryItems = (item.life_at_xavier_images || []).map(img => {
            const url = img.imageUrl.startsWith('http') ? img.imageUrl : `${baseUrl}${img.imageUrl.startsWith('/') ? '' : '/'}${img.imageUrl}`;
            return {
                id: img.id.toString(),
                url,
                imageUrl: url,
                image_order: img.image_order ?? img.sortOrder ?? 0,
                sortOrder: img.sortOrder ?? 0
            };
        });

        // Also include any legacy media gallery items if existing
        const legacyMedia = media.filter(m => m.collection_name !== 'thumbnail' && m.collection_name !== 'og_image');
        for (const m of legacyMedia) {
            const url = `${baseUrl}/storage/${m.id}/${m.file_name}`;
            formattedGalleryItems.push({
                id: m.id.toString(),
                url,
                imageUrl: url,
                image_order: formattedGalleryItems.length,
                sortOrder: formattedGalleryItems.length
            });
        }

        const galleryUrls = formattedGalleryItems.map(item => item.url);

        const socialPosts = (item.life_at_xavier_social_posts || []).map(p => {
            let thumb = p.thumbnail_url;
            if (thumb && !thumb.startsWith('http')) {
                thumb = `${baseUrl}${thumb.startsWith('/') ? '' : '/'}${thumb}`;
            }
            return {
                id: p.id.toString(),
                platform: p.platform,
                postUrl: p.post_url,
                thumbnailUrl: thumb,
                title: p.title,
                caption: p.title,
                sortOrder: p.sort_order
            };
        });

        res.json(serializeBigInt({
            ...item,
            imageUrl: itemMedia ? `${baseUrl}/storage/${itemMedia.id}/${itemMedia.file_name}` : null,
            imageUrls: galleryUrls,
            galleryUrls: galleryUrls,
            galleryImages: formattedGalleryItems,
            socialPosts
        }));
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// GET /api/news-and-events
app.get('/api/news-and-events', async (req, res) => {
    try {
        const take = req.query.limit ? parseInt(req.query.limit as string, 10) : undefined;
        const items = await prisma.news_and_events.findMany({
            where: { status: true },
            orderBy: [
                { display_order: 'asc' },
                { created_at: 'desc' }
            ],
            ...(take ? { take } : {})
        });
        const ids = items.map(item => item.id);
        const media = await getMediaForModels('App\\Models\\NewsAndEvent', ids);

        const data = items.map(item => {
            const itemMedia = media.find(m => m.model_id === item.id && m.collection_name === 'newsandevents.thumbnail');
            let resolvedImageUrl = item.imageUrl || null;
            if (!resolvedImageUrl && itemMedia) {
                resolvedImageUrl = `${process.env.BASE_URL || `${req.protocol}://${req.get('host')}`}/storage/${itemMedia.id}/${itemMedia.file_name}`;
            }
            return {
                ...item,
                imageUrl: resolvedImageUrl
            };
        });
        res.json(serializeBigInt(data));
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// GET /api/news-and-events/:slug
app.get('/api/news-and-events/:slug', async (req, res) => {
    try {
        const item = await prisma.news_and_events.findFirst({
            where: { slug: req.params.slug, status: true }
        });

        if (item) {
            const media = await getMediaForModels('App\\Models\\NewsAndEvent', [item.id]);
            const itemMedia = media.find(m => m.model_id === item.id && m.collection_name === 'newsandevents.thumbnail');
            let resolvedImageUrl = item.imageUrl || null;
            if (!resolvedImageUrl && itemMedia) {
                resolvedImageUrl = `${process.env.BASE_URL || `${req.protocol}://${req.get('host')}`}/storage/${itemMedia.id}/${itemMedia.file_name}`;
            }
            res.json({
                ...item,
                imageUrl: resolvedImageUrl
            });
        } else {
            res.status(404).json({ error: 'News or event not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error fetching news and event' });
    }
});

// GET /api/upcoming-events
app.get('/api/upcoming-events', async (req, res) => {
    try {
        const take = req.query.limit ? parseInt(req.query.limit as string, 10) : undefined;
        const items = await prisma.upcoming_events.findMany({
            where: { status: true },
            orderBy: [
                { display_order: 'asc' },
                { created_at: 'desc' }
            ],
            ...(take ? { take } : {})
        });
        // Include slug in response (generate from title if DB slug is null)
        const data = items.map(item => ({
            ...item,
            slug: item.slug || slugify(item.title)
        }));
        res.json(serializeBigInt(data));
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// GET /api/upcoming-events/:slug
app.get('/api/upcoming-events/:slug', async (req, res) => {
    try {
        const { slug } = req.params;

        // First try to find by slug in DB
        let item = await prisma.upcoming_events.findFirst({
            where: { slug, status: true }
        });

        // If not found by slug, try matching by slugified title
        if (!item) {
            const allItems = await prisma.upcoming_events.findMany({
                where: { status: true }
            });
            item = allItems.find(e => slugify(e.title) === slug) || null;
        }

        if (!item) {
            return res.status(404).json({ error: 'Event not found' });
        }

        // Fetch media for this event
        const media = await getMediaForModels('App\\Models\\UpcomingEvent', [item.id]);
        const imageUrls = media.map(m => `${process.env.BASE_URL || `${req.protocol}://${req.get('host')}`}/storage/${m.id}/${m.file_name}`);

        res.json(serializeBigInt({
            ...item,
            slug: item.slug || slugify(item.title),
            imageUrls
        }));
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// POST /api/contact
app.post('/api/contact', async (req, res) => {
    try {
        const { name, email, contact, message } = req.body;
        if (!name || !email || !contact) {
            return res.status(400).json({ error: 'Name, email, and contact are required' });
        }
        const newContact = await prisma.contacts.create({
            data: {
                name,
                email,
                contact,
                message,
                created_at: new Date(),
                updated_at: new Date()
            }
        });
        res.status(201).json({ success: true, contact: serializeBigInt(newContact) });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// GET /api/courses
app.get('/api/courses', async (req, res) => {
    try {
        const courses = await prisma.courses.findMany({
            where: {},
            orderBy: [
                { display_order: 'asc' },
                { created_at: 'desc' }
            ]
        });
        res.json(serializeBigInt(courses));
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// POST /api/apply
app.post('/api/apply', async (req, res) => {
    try {
        const { name, email, address, contact, school, gpa, course } = req.body;

        if (!name || !email || !address || !contact || !school || !gpa || !course) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        const newApply = await prisma.applies.create({
            data: {
                name,
                email,
                address,
                contact: BigInt(contact),
                school,
                gpa,
                course,
                created_at: new Date(),
                updated_at: new Date()
            }
        });
        res.status(201).json({ success: true, application: serializeBigInt(newApply) });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

/**
 * Self-healing schema sync:
 * Guarantees all required columns and tables exist in the database upon server boot.
 * Essential for zero-terminal deployment environments (such as direct git-pull on AWS)
 * where developers do not have SSH/shell access to run Prisma CLI migration commands.
 */
async function ensureDatabaseSchema() {
    // 1. Column: news_and_events.imageUrl
    try {
        await prisma.$executeRawUnsafe(
            `ALTER TABLE \`news_and_events\` ADD COLUMN \`imageUrl\` VARCHAR(255) NULL`
        );
        console.log('[Schema Sync] Added imageUrl column to news_and_events');
    } catch { /* Column already exists — safe to ignore */ }

    // 2. Table: life_at_xavier_images
    try {
        await prisma.$executeRawUnsafe(`
            CREATE TABLE IF NOT EXISTS \`life_at_xavier_images\` (
                \`id\` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
                \`life_at_xavier_id\` BIGINT UNSIGNED NOT NULL,
                \`imageUrl\` VARCHAR(255) NOT NULL,
                \`sortOrder\` INTEGER NOT NULL DEFAULT 0,
                \`image_order\` INTEGER NOT NULL DEFAULT 0,
                \`created_at\` TIMESTAMP(0) NULL,
                \`updated_at\` TIMESTAMP(0) NULL,
                INDEX \`life_at_xavier_images_life_at_xavier_id_foreign\`(\`life_at_xavier_id\`),
                PRIMARY KEY (\`id\`),
                CONSTRAINT \`life_at_xavier_images_life_at_xavier_id_foreign\` 
                    FOREIGN KEY (\`life_at_xavier_id\`) REFERENCES \`life_at_xaviers\`(\`id\`) 
                    ON DELETE CASCADE ON UPDATE NO ACTION
            ) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
        `);
        console.log('[Schema Sync] Verified life_at_xavier_images table');
    } catch { /* Table or FK already exists — safe to ignore */ }

    try {
        await prisma.$executeRawUnsafe(
            `ALTER TABLE \`life_at_xavier_images\` ADD COLUMN \`image_order\` INT NOT NULL DEFAULT 0`
        );
        console.log('[Schema Sync] Added image_order column to life_at_xavier_images');
        await prisma.$executeRawUnsafe(
            `UPDATE \`life_at_xavier_images\` SET \`image_order\` = \`sortOrder\` WHERE \`image_order\` = 0 AND \`sortOrder\` != 0`
        );
    } catch { /* Column already exists — safe to ignore */ }

    // 3. Column: display_order across all 5 content tables
    const displayOrderTables = ['courses', 'life_at_xaviers', 'news_and_events', 'popups', 'upcoming_events'];
    for (const table of displayOrderTables) {
        try {
            await prisma.$executeRawUnsafe(
                `ALTER TABLE \`${table}\` ADD COLUMN \`display_order\` INT NOT NULL DEFAULT 0`
            );
            console.log(`[Schema Sync] Added display_order column to ${table}`);
        } catch { /* Column already exists (ER_DUP_FIELDNAME) — safe to ignore */ }
    }

    // 4. Column: life_at_xaviers.description
    try {
        await prisma.$executeRawUnsafe(
            `ALTER TABLE \`life_at_xaviers\` ADD COLUMN \`description\` TEXT NULL`
        );
        console.log('[Schema Sync] Added description column to life_at_xaviers');
    } catch { /* Column already exists — safe to ignore */ }

    // 5. Table: life_at_xavier_social_posts
    try {
        await prisma.$executeRawUnsafe(`
            CREATE TABLE IF NOT EXISTS \`life_at_xavier_social_posts\` (
                \`id\` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
                \`life_at_xavier_id\` BIGINT UNSIGNED NOT NULL,
                \`platform\` VARCHAR(50) NOT NULL,
                \`post_url\` TEXT NOT NULL,
                \`thumbnail_url\` TEXT NULL,
                \`title\` VARCHAR(255) NULL,
                \`sort_order\` INTEGER NOT NULL DEFAULT 0,
                \`created_at\` TIMESTAMP(0) NULL,
                \`updated_at\` TIMESTAMP(0) NULL,
                INDEX \`life_at_xavier_social_posts_life_at_xavier_id_foreign\`(\`life_at_xavier_id\`),
                PRIMARY KEY (\`id\`),
                CONSTRAINT \`life_at_xavier_social_posts_life_at_xavier_id_foreign\` 
                    FOREIGN KEY (\`life_at_xavier_id\`) REFERENCES \`life_at_xaviers\`(\`id\`) 
                    ON DELETE CASCADE ON UPDATE NO ACTION
            ) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
        `);
        console.log('[Schema Sync] Verified life_at_xavier_social_posts table');
    } catch { /* Table or FK already exists — safe to ignore */ }
}

/**
 * Automatically applies pending Prisma migrations on server startup.
 */
async function runAutomatedMigrations() {
    try {
        const rootDir = path.resolve(__dirname, '..');
        const output = execSync('npx prisma migrate deploy', {
            cwd: rootDir,
            encoding: 'utf8',
            stdio: 'pipe'
        });
        const cleaned = output
            .trim()
            .split('\n')
            .filter(line => !line.includes('Loaded Prisma config') && !line.includes('Prisma config detected'))
            .join('\n')
            .trim();
        if (cleaned) {
            console.log(`[Automated Migrations]\n${cleaned}`);
        }
    } catch (error: any) {
        console.error('[Automated Migrations] Auto-migration check encountered an error:', error.stdout || error.message);
    }
}

// Serve SPA index.html fallback for client-side routing in production (Express 5 compatible)
app.use((req, res, next) => {
    // Never intercept non-GET, API, or storage paths with index.html
    if (req.method !== 'GET' || req.url.startsWith('/api') || req.url.startsWith('/storage') || req.url.startsWith('/plus-api')) {
        return next();
    }
    const indexPath = path.join(clientDistPath, 'index.html');
    res.sendFile(indexPath, (err) => {
        if (err) {
            next();
        }
    });
});

app.listen(PORT, async () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    await runAutomatedMigrations();
    await ensureDatabaseSchema();
});
