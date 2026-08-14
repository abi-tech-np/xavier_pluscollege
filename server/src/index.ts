import express from 'express';
import cors from 'cors';
import path from 'path';
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


app.use(express.json());
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
            orderBy: { created_at: 'desc' }
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
            where: { status: true },
            orderBy: { created_at: 'desc' },
            ...(take ? { take } : {})
        });
        const ids = items.map(item => item.id);
        const media = await getMediaForModels('App\\Models\\LifeAtXavier', ids);

        const data = items.map(item => {
            const itemMedia = media.find(m => m.model_id === item.id);
            return {
                ...item,
                imageUrl: itemMedia ? `${req.protocol}://${req.get('host')}/storage/${itemMedia.id}/${itemMedia.file_name}` : null
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
            where: { slug: req.params.slug, status: true }
        });

        if (!item) {
            return res.status(404).json({ error: 'Not found' });
        }

        const media = await getMediaForModels('App\\Models\\LifeAtXavier', [item.id]);

        // Find all gallery images for this event
        const galleryMedia = media.filter(m => m.model_id === item.id);
        const galleryUrls = galleryMedia.map(m => `${req.protocol}://${req.get('host')}/storage/${m.id}/${m.file_name}`);

        const itemMedia = media.find(m => m.model_id === item.id);

        res.json({
            ...item,
            imageUrl: itemMedia ? `${req.protocol}://${req.get('host')}/storage/${itemMedia.id}/${itemMedia.file_name}` : null,
            galleryUrls
        });
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
            orderBy: { created_at: 'desc' },
            ...(take ? { take } : {})
        });
        const ids = items.map(item => item.id);
        const media = await getMediaForModels('App\\Models\\NewsAndEvent', ids);

        const data = items.map(item => {
            const itemMedia = media.find(m => m.model_id === item.id && m.collection_name === 'newsandevents.thumbnail');
            return {
                ...item,
                imageUrl: itemMedia ? `${req.protocol}://${req.get('host')}/storage/${itemMedia.id}/${itemMedia.file_name}` : null
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
            res.json({
                ...item,
                imageUrl: itemMedia ? `${req.protocol}://${req.get('host')}/storage/${itemMedia.id}/${itemMedia.file_name}` : null
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
            orderBy: { start_date: 'asc' },
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
        const imageUrls = media.map(m => `${req.protocol}://${req.get('host')}/storage/${m.id}/${m.file_name}`);

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
            where: {}
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

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
