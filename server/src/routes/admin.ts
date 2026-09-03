import { Router, Request, Response } from 'express';
import { PrismaClient } from '../../generated/prisma';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { authenticateJWT, AuthRequest } from '../middlewares/auth';
import { upload, imageUpload } from '../middlewares/upload';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

const router = Router();
const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key-for-development';

// Login
router.post('/login', async (req: Request, res: Response): Promise<any> => {
    try {
        const { email, password } = req.body;
        
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        const user = await prisma.users.findUnique({ where: { email } });
        if (!user || !user.password) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user.id.toString(), email: user.email }, JWT_SECRET, { expiresIn: '24h' });
        res.json({ token, user: { id: user.id.toString(), email: user.email, name: user.name } });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Protect all routes below
router.use(authenticateJWT);

// Dashboard Stats
router.get('/stats', async (req: AuthRequest, res: Response) => {
    try {
        const newsCount = await prisma.news_and_events.count();
        const upcomingEventsCount = await prisma.upcoming_events.count();
        const applicationsCount = await prisma.applies.count();
        const contactsCount = await prisma.contacts.count();
        const popupsCount = await prisma.popups.count();
        const lifeAtXavierCount = await prisma.life_at_xaviers.count({
            where: { deleted_at: null }
        });

        res.json({
            newsCount,
            upcomingEventsCount,
            applicationsCount,
            contactsCount,
            popupsCount,
            lifeAtXavierCount
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// News and Events CRUD
router.get('/news', async (req: AuthRequest, res: Response) => {
    try {
        const items = await prisma.news_and_events.findMany({
            orderBy: { created_at: 'desc' }
        });
        res.json(
            items.map(item => ({
                ...item,
                id: item.id.toString(),
                imageUrl: item.imageUrl || null
            }))
        );
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.post('/news', upload.single('image'), async (req: AuthRequest, res: Response) => {
    try {
        const { title, slug, content, status } = req.body;
        const isStatusTrue = status === 'true' || status === true;

        let imageUrl: string | null = null;
        if (req.file) {
            imageUrl = `/storage/${req.file.filename}`;
        }

        const newItem = await prisma.news_and_events.create({
            data: {
                title,
                slug,
                content,
                imageUrl,
                status: isStatusTrue,
                created_at: new Date(),
                updated_at: new Date()
            }
        });
        res.json({ ...newItem, id: newItem.id.toString() });
    } catch (error) {
        console.error('Error creating news:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.put('/news/:id', upload.single('image'), async (req: AuthRequest, res: Response) => {
    try {
        const id = BigInt(req.params.id as string);
        const { title, slug, content, status } = req.body;
        const isStatusTrue = status === 'true' || status === true;

        const updateData: any = {
            title,
            slug,
            content,
            status: isStatusTrue,
            updated_at: new Date()
        };

        if (req.file) {
            // New image uploaded: remove previous image file if it exists in storage
            const existing = await prisma.news_and_events.findUnique({ where: { id } });
            if (existing?.imageUrl && existing.imageUrl.startsWith('/storage/')) {
                const filename = path.basename(existing.imageUrl);
                const oldFilePath = path.join(__dirname, '../../storage', filename);
                if (fs.existsSync(oldFilePath)) {
                    try {
                        fs.unlinkSync(oldFilePath);
                    } catch (e) {
                        console.error('Error deleting old news image:', e);
                    }
                }
            }
            updateData.imageUrl = `/storage/${req.file.filename}`;
        } else if (req.body.imageUrl !== undefined) {
            // If explicit imageUrl passed (e.g. keeping existing or clearing)
            const newImageUrl = req.body.imageUrl || null;
            if (!newImageUrl || newImageUrl === '' || newImageUrl === 'null') {
                const existing = await prisma.news_and_events.findUnique({ where: { id } });
                if (existing?.imageUrl && existing.imageUrl.startsWith('/storage/')) {
                    const filename = path.basename(existing.imageUrl);
                    const oldFilePath = path.join(__dirname, '../../storage', filename);
                    if (fs.existsSync(oldFilePath)) {
                        try {
                            fs.unlinkSync(oldFilePath);
                        } catch (e) {
                            console.error('Error deleting old news image:', e);
                        }
                    }
                }
            }
            updateData.imageUrl = newImageUrl;
        }

        const updatedItem = await prisma.news_and_events.update({
            where: { id },
            data: updateData
        });
        res.json({ ...updatedItem, id: updatedItem.id.toString() });
    } catch (error) {
        console.error('Error updating news:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.delete('/news/:id', async (req: AuthRequest, res: Response) => {
    try {
        const id = BigInt(req.params.id as string);
        const existing = await prisma.news_and_events.findUnique({ where: { id } });
        if (existing?.imageUrl && existing.imageUrl.startsWith('/storage/')) {
            const filename = path.basename(existing.imageUrl);
            const oldFilePath = path.join(__dirname, '../../storage', filename);
            if (fs.existsSync(oldFilePath)) {
                try {
                    fs.unlinkSync(oldFilePath);
                } catch (e) {
                    console.error('Error deleting news image:', e);
                }
            }
        }
        await prisma.news_and_events.delete({ where: { id } });
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Applications (Applies)
router.get('/applications', async (req: AuthRequest, res: Response) => {
    try {
        const items = await prisma.applies.findMany({
            orderBy: { created_at: 'desc' }
        });
        res.json(items.map(item => ({
            ...item,
            id: item.id.toString(),
            contact: item.contact.toString()
        })));
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.delete('/applications/:id', async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        await prisma.applies.delete({ where: { id: BigInt(id as string) } });
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

// --- Helper to serialize BigInt ---
const serializeBigInt = (obj: any) => {
    return JSON.parse(JSON.stringify(obj, (key, value) =>
        typeof value === 'bigint' ? value.toString() : value
    ));
};

// --- Courses ---
router.get('/courses', async (req, res) => {
    try {
        const items = await prisma.courses.findMany({ where: { deleted_at: null } });
        res.json(serializeBigInt(items));
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
});
router.get('/courses/:id', async (req, res) => {
    try {
        const item = await prisma.courses.findFirst({
            where: { id: BigInt(req.params.id as string), deleted_at: null }
        });
        if (!item) return res.status(404).json({ error: 'Course not found' });
        res.json(serializeBigInt(item));
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
});
router.post('/courses', async (req, res) => {
    try {
        const { course } = req.body;
        const newItem = await prisma.courses.create({ data: { course, created_at: new Date(), updated_at: new Date() } });
        res.json(serializeBigInt(newItem));
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
});
router.put('/courses/:id', async (req, res) => {
    try {
        const { course } = req.body;
        const item = await prisma.courses.update({ where: { id: BigInt(req.params.id as string) }, data: { course, updated_at: new Date() } });
        res.json(serializeBigInt(item));
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
});
router.delete('/courses/:id', async (req, res) => {
    try {
        await prisma.courses.update({ where: { id: BigInt(req.params.id as string) }, data: { deleted_at: new Date() } });
        res.json({ success: true });
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
});

// --- Contacts ---
router.get('/contacts', async (req, res) => {
    try {
        const items = await prisma.contacts.findMany({ orderBy: { created_at: 'desc' } });
        res.json(serializeBigInt(items));
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
});
router.delete('/contacts/:id', async (req, res) => {
    try {
        await prisma.contacts.delete({ where: { id: BigInt(req.params.id as string) } });
        res.json({ success: true });
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
});

// --- Popups ---
router.get('/popups', async (req, res) => {
    try {
        const items = await prisma.popups.findMany({ orderBy: { created_at: 'desc' } });
        const media = await prisma.media.findMany({
            where: {
                model_type: 'App\\Models\\Popup',
                model_id: { in: items.map(p => p.id) }
            }
        });
        const itemsWithMedia = items.map(item => {
            const popupMedia = media.find(m => m.model_id === item.id);
            return {
                ...item,
                imageUrl: popupMedia ? `/storage/${popupMedia.id}/${popupMedia.file_name}` : null
            };
        });
        res.json(serializeBigInt(itemsWithMedia));
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
});

router.get('/popups/:id', async (req, res) => {
    try {
        const id = BigInt(req.params.id as string);
        const item = await prisma.popups.findUnique({ where: { id } });
        if (!item) return res.status(404).json({ error: 'Popup not found' });
        const popupMedia = await prisma.media.findFirst({
            where: {
                model_type: 'App\\Models\\Popup',
                model_id: id
            },
            orderBy: { id: 'desc' }
        });
        res.json(serializeBigInt({
            ...item,
            imageUrl: popupMedia ? `/storage/${popupMedia.id}/${popupMedia.file_name}` : null
        }));
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
});

router.post('/popups', upload.fields([{ name: 'image', maxCount: 1 }]), async (req, res) => {
    try {
        const { title, link, status } = req.body;
        const isStatusTrue = status === 'true' || status === true;
        
        const newItem = await prisma.popups.create({ 
            data: { 
                title, 
                link, 
                status: isStatusTrue, 
                created_at: new Date(), 
                updated_at: new Date() 
            } 
        });

        // Handle file uploads (Media table)
        const files = req.files as { [fieldname: string]: Express.Multer.File[] };
        
        if (files?.image?.[0]) {
            const file = files.image[0];
            const mediaRecord = await prisma.media.create({
                data: {
                    model_type: 'App\\Models\\Popup',
                    model_id: newItem.id,
                    uuid: crypto.randomUUID(),
                    collection_name: 'popup_image',
                    name: file.originalname.split('.')[0],
                    file_name: file.filename,
                    mime_type: file.mimetype,
                    disk: 'public',
                    size: file.size,
                    manipulations: '{}',
                    custom_properties: '{}',
                    generated_conversions: '{}',
                    responsive_images: '{}',
                    created_at: new Date(),
                    updated_at: new Date()
                }
            });

            const fs = require('fs');
            const path = require('path');
            const targetDir = path.join(__dirname, '../../storage', mediaRecord.id.toString());
            if (!fs.existsSync(targetDir)) {
                fs.mkdirSync(targetDir, { recursive: true });
            }
            fs.renameSync(file.path, path.join(targetDir, file.filename));
        }

        res.json(serializeBigInt(newItem));
    } catch (e) { 
        console.error('Error creating popup:', e);
        res.status(500).json({ error: 'Server error' }); 
    }
});
router.put('/popups/:id', upload.fields([{ name: 'image', maxCount: 1 }]), async (req, res) => {
    try {
        const id = BigInt(req.params.id as string);
        const { title, link, status, imageUrl } = req.body;
        const isStatusTrue = status === 'true' || status === true;

        const item = await prisma.popups.update({
            where: { id },
            data: {
                title,
                link,
                status: isStatusTrue,
                updated_at: new Date()
            }
        });

        const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;
        const file = files?.image?.[0] || (req as any).file;

        const fs = require('fs');
        const path = require('path');

        if (file) {
            // New image uploaded: remove previous media records and directory
            const oldMedia = await prisma.media.findMany({
                where: {
                    model_type: 'App\\Models\\Popup',
                    model_id: id
                }
            });
            for (const m of oldMedia) {
                const oldDir = path.join(__dirname, '../../storage', m.id.toString());
                if (fs.existsSync(oldDir)) {
                    fs.rmSync(oldDir, { recursive: true, force: true });
                }
            }
            await prisma.media.deleteMany({
                where: {
                    model_type: 'App\\Models\\Popup',
                    model_id: id
                }
            });

            // Create new media record
            const mediaRecord = await prisma.media.create({
                data: {
                    model_type: 'App\\Models\\Popup',
                    model_id: id,
                    uuid: crypto.randomUUID(),
                    collection_name: 'popup_image',
                    name: file.originalname.split('.')[0],
                    file_name: file.filename,
                    mime_type: file.mimetype,
                    disk: 'public',
                    size: file.size,
                    manipulations: '{}',
                    custom_properties: '{}',
                    generated_conversions: '{}',
                    responsive_images: '{}',
                    created_at: new Date(),
                    updated_at: new Date()
                }
            });

            const targetDir = path.join(__dirname, '../../storage', mediaRecord.id.toString());
            if (!fs.existsSync(targetDir)) {
                fs.mkdirSync(targetDir, { recursive: true });
            }
            fs.renameSync(file.path, path.join(targetDir, file.filename));
        } else if (imageUrl === '' || imageUrl === null || imageUrl === 'null') {
            // Existing image cleared
            const oldMedia = await prisma.media.findMany({
                where: {
                    model_type: 'App\\Models\\Popup',
                    model_id: id
                }
            });
            for (const m of oldMedia) {
                const oldDir = path.join(__dirname, '../../storage', m.id.toString());
                if (fs.existsSync(oldDir)) {
                    fs.rmSync(oldDir, { recursive: true, force: true });
                }
            }
            await prisma.media.deleteMany({
                where: {
                    model_type: 'App\\Models\\Popup',
                    model_id: id
                }
            });
        }

        const currentMedia = await prisma.media.findFirst({
            where: {
                model_type: 'App\\Models\\Popup',
                model_id: id
            },
            orderBy: { id: 'desc' }
        });

        res.json(serializeBigInt({
            ...item,
            imageUrl: currentMedia ? `/storage/${currentMedia.id}/${currentMedia.file_name}` : null
        }));
    } catch (e) {
        console.error('Error updating popup:', e);
        res.status(500).json({ error: 'Server error' });
    }
});
router.delete('/popups/:id', async (req, res) => {
    try {
        const id = BigInt(req.params.id as string);
        const oldMedia = await prisma.media.findMany({
            where: {
                model_type: 'App\\Models\\Popup',
                model_id: id
            }
        });
        const fs = require('fs');
        const path = require('path');
        for (const m of oldMedia) {
            const oldDir = path.join(__dirname, '../../storage', m.id.toString());
            if (fs.existsSync(oldDir)) {
                fs.rmSync(oldDir, { recursive: true, force: true });
            }
        }
        await prisma.media.deleteMany({
            where: {
                model_type: 'App\\Models\\Popup',
                model_id: id
            }
        });
        await prisma.popups.delete({ where: { id } });
        res.json({ success: true });
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
});

// --- Upcoming Events ---
router.get('/upcoming-events', async (req, res) => {
    try {
        const items = await prisma.upcoming_events.findMany({
            orderBy: { id: 'desc' }
        });
        res.json(serializeBigInt(items));
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
});

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

router.post('/upcoming-events', async (req, res) => {
    try {
        const { title, time, content, location, status, start_date, end_date } = req.body;
        const slug = slugify(title);
        const newItem = await prisma.upcoming_events.create({ 
            data: { 
                title, 
                slug, 
                time: time || null, 
                content: content || null, 
                location: location || null, 
                status: status !== undefined ? Boolean(status) : true, 
                start_date: start_date ? new Date(start_date) : null,
                end_date: end_date ? new Date(end_date) : null,
                created_at: new Date(), 
                updated_at: new Date() 
            } 
        });
        res.json(serializeBigInt(newItem));
    } catch (e) { 
        console.error('Error creating upcoming event:', e);
        res.status(500).json({ error: 'Server error' }); 
    }
});

router.put('/upcoming-events/:id', async (req, res) => {
    try {
        const { title, time, content, location, status, start_date, end_date } = req.body;
        const updateData: any = {
            updated_at: new Date()
        };
        if (title !== undefined) {
            updateData.title = title;
            updateData.slug = slugify(title);
        }
        if (time !== undefined) updateData.time = time || null;
        if (content !== undefined) updateData.content = content || null;
        if (location !== undefined) updateData.location = location || null;
        if (status !== undefined) updateData.status = Boolean(status);
        if (start_date !== undefined) updateData.start_date = start_date ? new Date(start_date) : null;
        if (end_date !== undefined) updateData.end_date = end_date ? new Date(end_date) : null;

        const item = await prisma.upcoming_events.update({ 
            where: { id: BigInt(req.params.id as string) }, 
            data: updateData 
        });
        res.json(serializeBigInt(item));
    } catch (e) { 
        console.error('Error updating upcoming event:', e);
        res.status(500).json({ error: 'Server error' }); 
    }
});
router.delete('/upcoming-events/:id', async (req, res) => {
    try {
        await prisma.upcoming_events.delete({ where: { id: BigInt(req.params.id as string) } });
        res.json({ success: true });
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
});

// --- Life At Xaviers ---
router.get('/life-at-xaviers', async (req, res) => {
    try {
        const items = await prisma.life_at_xaviers.findMany({ 
            where: { deleted_at: null },
            orderBy: { created_at: 'desc' },
            include: {
                life_at_xavier_images: {
                    orderBy: { sortOrder: 'asc' }
                }
            }
        });
        res.json(serializeBigInt(items));
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
});

router.get('/life-at-xaviers/:id', async (req, res) => {
    try {
        const id = BigInt(req.params.id as string);
        const item = await prisma.life_at_xaviers.findFirst({
            where: { id, deleted_at: null },
            include: {
                life_at_xavier_images: {
                    orderBy: { sortOrder: 'asc' }
                }
            }
        });

        if (!item) {
            return res.status(404).json({ error: 'Life at Xavier entry not found' });
        }

        const meta = await prisma.metas.findFirst({
            where: {
                metaable_type: 'App\\Models\\LifeAtXavier',
                metaable_id: id,
                deleted_at: null
            }
        });

        const media = await prisma.media.findMany({
            where: {
                model_type: 'App\\Models\\LifeAtXavier',
                model_id: id
            }
        });

        const thumbnail = media.find(m => m.collection_name === 'thumbnail' || (!m.collection_name && m.id));
        const ogImage = media.find(m => m.collection_name === 'og_image');

        const result = {
            id: item.id.toString(),
            title: item.title,
            slug: item.slug,
            status: item.status,
            meta_title: meta?.title || '',
            meta_description: meta?.description || '',
            meta_schema: meta?.schema || '',
            thumbnailUrl: thumbnail ? `/storage/${thumbnail.id}/${thumbnail.file_name}` : null,
            thumbnailName: thumbnail?.file_name || null,
            ogImageUrl: ogImage ? `/storage/${ogImage.id}/${ogImage.file_name}` : null,
            ogImageName: ogImage?.file_name || null,
            galleryImages: (item.life_at_xavier_images || []).map(img => ({
                id: img.id.toString(),
                imageUrl: img.imageUrl,
                sortOrder: img.sortOrder
            }))
        };

        res.json(serializeBigInt(result));
    } catch (e) {
        console.error('Error fetching life-at-xavier item:', e);
        res.status(500).json({ error: 'Server error' });
    }
});

router.post('/life-at-xaviers', imageUpload.fields([
    { name: 'thumbnail', maxCount: 1 },
    { name: 'og_image', maxCount: 1 },
    { name: 'galleryImages', maxCount: 50 }
]), async (req, res) => {
    try {
        const { title, slug, status, meta_title, meta_description, meta_schema } = req.body;
        const isStatusTrue = status === 'true' || status === true;

        // 1. Create main record
        const newItem = await prisma.life_at_xaviers.create({ 
            data: { 
                title, 
                slug, 
                status: isStatusTrue, 
                created_at: new Date(), 
                updated_at: new Date() 
            } 
        });

        // 2. Insert into metas
        if (meta_title || meta_description || meta_schema) {
            await prisma.metas.create({
                data: {
                    metaable_type: 'App\\Models\\LifeAtXavier',
                    metaable_id: newItem.id,
                    title: meta_title || null,
                    description: meta_description || null,
                    schema: meta_schema || null,
                    created_at: new Date(),
                    updated_at: new Date()
                }
            });
        }

        // 3. Handle thumbnail and og_image uploads (Media table)
        const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;
        
        const saveMedia = async (file: Express.Multer.File, collectionName: string) => {
            const mediaRecord = await prisma.media.create({
                data: {
                    model_type: 'App\\Models\\LifeAtXavier',
                    model_id: newItem.id,
                    uuid: crypto.randomUUID(),
                    collection_name: collectionName,
                    name: file.originalname.split('.')[0],
                    file_name: file.filename,
                    mime_type: file.mimetype,
                    disk: 'public',
                    size: file.size,
                    manipulations: '{}',
                    custom_properties: '{}',
                    generated_conversions: '{}',
                    responsive_images: '{}',
                    created_at: new Date(),
                    updated_at: new Date()
                }
            });

            // Move file to matching Spatie Media Library folder structure (server/storage/{media.id}/{filename})
            const targetDir = path.join(__dirname, '../../storage', mediaRecord.id.toString());
            if (!fs.existsSync(targetDir)) {
                fs.mkdirSync(targetDir, { recursive: true });
            }
            fs.renameSync(file.path, path.join(targetDir, file.filename));
        };

        if (files?.thumbnail?.[0]) {
            await saveMedia(files.thumbnail[0], 'thumbnail');
        }
        
        if (files?.og_image?.[0]) {
            await saveMedia(files.og_image[0], 'og_image');
        }

        // 4. Handle multiple gallery images
        if (files?.galleryImages && files.galleryImages.length > 0) {
            for (let i = 0; i < files.galleryImages.length; i++) {
                const galleryFile = files.galleryImages[i];
                await prisma.life_at_xavier_images.create({
                    data: {
                        life_at_xavier_id: newItem.id,
                        imageUrl: `/storage/${galleryFile.filename}`,
                        sortOrder: i,
                        created_at: new Date(),
                        updated_at: new Date()
                    }
                });
            }
        }

        res.json(serializeBigInt(newItem));
    } catch (e) { 
        console.error('Error creating life-at-xavier:', e); 
        res.status(500).json({ error: 'Server error' }); 
    }
});

router.put('/life-at-xaviers/:id', imageUpload.fields([
    { name: 'thumbnail', maxCount: 1 },
    { name: 'og_image', maxCount: 1 },
    { name: 'galleryImages', maxCount: 50 }
]), async (req, res) => {
    try {
        const id = BigInt(req.params.id as string);
        const { title, slug, status, meta_title, meta_description, meta_schema, deletedGalleryImageIds } = req.body;
        const isStatusTrue = status === 'true' || status === true;

        // 1. Update main record
        const updatedItem = await prisma.life_at_xaviers.update({
            where: { id },
            data: {
                title,
                slug,
                status: isStatusTrue,
                updated_at: new Date()
            }
        });

        // 2. Update/Create metas
        const existingMeta = await prisma.metas.findFirst({
            where: {
                metaable_type: 'App\\Models\\LifeAtXavier',
                metaable_id: id,
                deleted_at: null
            }
        });

        if (existingMeta) {
            await prisma.metas.update({
                where: { id: existingMeta.id },
                data: {
                    title: meta_title !== undefined ? meta_title : existingMeta.title,
                    description: meta_description !== undefined ? meta_description : existingMeta.description,
                    schema: meta_schema !== undefined ? meta_schema : existingMeta.schema,
                    updated_at: new Date()
                }
            });
        } else if (meta_title || meta_description || meta_schema) {
            await prisma.metas.create({
                data: {
                    metaable_type: 'App\\Models\\LifeAtXavier',
                    metaable_id: id,
                    title: meta_title || null,
                    description: meta_description || null,
                    schema: meta_schema || null,
                    created_at: new Date(),
                    updated_at: new Date()
                }
            });
        }

        // 3. Handle file replacements for thumbnail & og_image
        const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;

        const saveOrReplaceMedia = async (file: Express.Multer.File, collectionName: string) => {
            const oldMedia = await prisma.media.findFirst({
                where: {
                    model_type: 'App\\Models\\LifeAtXavier',
                    model_id: id,
                    collection_name: collectionName
                }
            });

            if (oldMedia) {
                const oldDir = path.join(__dirname, '../../storage', oldMedia.id.toString());
                if (fs.existsSync(oldDir)) {
                    fs.rmSync(oldDir, { recursive: true, force: true });
                }
                await prisma.media.delete({ where: { id: oldMedia.id } });
            }

            const mediaRecord = await prisma.media.create({
                data: {
                    model_type: 'App\\Models\\LifeAtXavier',
                    model_id: id,
                    uuid: crypto.randomUUID(),
                    collection_name: collectionName,
                    name: file.originalname.split('.')[0],
                    file_name: file.filename,
                    mime_type: file.mimetype,
                    disk: 'public',
                    size: file.size,
                    manipulations: '{}',
                    custom_properties: '{}',
                    generated_conversions: '{}',
                    responsive_images: '{}',
                    created_at: new Date(),
                    updated_at: new Date()
                }
            });

            const targetDir = path.join(__dirname, '../../storage', mediaRecord.id.toString());
            if (!fs.existsSync(targetDir)) {
                fs.mkdirSync(targetDir, { recursive: true });
            }
            fs.renameSync(file.path, path.join(targetDir, file.filename));
        };

        if (files?.thumbnail?.[0]) {
            await saveOrReplaceMedia(files.thumbnail[0], 'thumbnail');
        }

        if (files?.og_image?.[0]) {
            await saveOrReplaceMedia(files.og_image[0], 'og_image');
        }

        // 4. Handle deleting specific existing gallery images
        if (deletedGalleryImageIds) {
            let idsToRemove: bigint[] = [];
            if (Array.isArray(deletedGalleryImageIds)) {
                idsToRemove = deletedGalleryImageIds.map(i => BigInt(i));
            } else if (typeof deletedGalleryImageIds === 'string') {
                try {
                    const parsed = JSON.parse(deletedGalleryImageIds);
                    if (Array.isArray(parsed)) {
                        idsToRemove = parsed.map(i => BigInt(i));
                    } else {
                        idsToRemove = [BigInt(deletedGalleryImageIds)];
                    }
                } catch {
                    idsToRemove = deletedGalleryImageIds.split(',').map(s => s.trim()).filter(Boolean).map(s => BigInt(s));
                }
            }

            if (idsToRemove.length > 0) {
                const imagesToDelete = await prisma.life_at_xavier_images.findMany({
                    where: {
                        id: { in: idsToRemove },
                        life_at_xavier_id: id
                    }
                });

                for (const img of imagesToDelete) {
                    const filename = path.basename(img.imageUrl);
                    const filePath = path.join(__dirname, '../../storage', filename);
                    if (fs.existsSync(filePath)) {
                        try { fs.unlinkSync(filePath); } catch (e) { console.error('Error deleting gallery file:', e); }
                    }
                }

                await prisma.life_at_xavier_images.deleteMany({
                    where: { id: { in: idsToRemove }, life_at_xavier_id: id }
                });
            }
        }

        // 5. Handle adding new gallery images
        if (files?.galleryImages && files.galleryImages.length > 0) {
            const lastImage = await prisma.life_at_xavier_images.findFirst({
                where: { life_at_xavier_id: id },
                orderBy: { sortOrder: 'desc' }
            });
            let nextSortOrder = (lastImage?.sortOrder ?? -1) + 1;

            for (const file of files.galleryImages) {
                await prisma.life_at_xavier_images.create({
                    data: {
                        life_at_xavier_id: id,
                        imageUrl: `/storage/${file.filename}`,
                        sortOrder: nextSortOrder++,
                        created_at: new Date(),
                        updated_at: new Date()
                    }
                });
            }
        }

        res.json(serializeBigInt(updatedItem));
    } catch (e) {
        console.error('Error updating life-at-xavier:', e);
        res.status(500).json({ error: 'Server error' });
    }
});

router.delete('/life-at-xaviers/:id', async (req, res) => {
    try {
        const id = BigInt(req.params.id as string);

        // 1. Delete associated gallery images from disk and DB
        const galleryImages = await prisma.life_at_xavier_images.findMany({
            where: { life_at_xavier_id: id }
        });

        for (const img of galleryImages) {
            const filename = path.basename(img.imageUrl);
            const filePath = path.join(__dirname, '../../storage', filename);
            if (fs.existsSync(filePath)) {
                try { fs.unlinkSync(filePath); } catch (e) { console.error('Error deleting gallery file:', e); }
            }
        }

        await prisma.life_at_xavier_images.deleteMany({
            where: { life_at_xavier_id: id }
        });

        // 2. Delete media (thumbnail, og_image) from disk and DB
        const mediaList = await prisma.media.findMany({
            where: {
                model_type: 'App\\Models\\LifeAtXavier',
                model_id: id
            }
        });

        for (const m of mediaList) {
            const mediaDir = path.join(__dirname, '../../storage', m.id.toString());
            if (fs.existsSync(mediaDir)) {
                try { fs.rmSync(mediaDir, { recursive: true, force: true }); } catch (e) { console.error('Error deleting media folder:', e); }
            }
        }

        await prisma.media.deleteMany({
            where: {
                model_type: 'App\\Models\\LifeAtXavier',
                model_id: id
            }
        });

        // 3. Mark as deleted in life_at_xaviers
        await prisma.life_at_xaviers.update({
            where: { id },
            data: { deleted_at: new Date() }
        });

        res.json({ success: true });
    } catch (e) {
        console.error('Error deleting life-at-xavier:', e);
        res.status(500).json({ error: 'Server error' });
    }
});

// --- Permissions ---
router.get('/permissions', async (req, res) => {
    try {
        const items = await prisma.permissions.findMany();
        res.json(serializeBigInt(items));
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
});

// --- Roles ---
router.get('/roles', async (req, res) => {
    try {
        const items = await prisma.roles.findMany({
            include: {
                role_has_permissions: {
                    include: { permissions: true }
                }
            }
        });
        res.json(serializeBigInt(items));
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
});
router.post('/roles', async (req, res) => {
    try {
        const { name, permissions } = req.body;
        const newItem = await prisma.roles.create({ data: { name, guard_name: 'web', created_at: new Date(), updated_at: new Date() } });
        
        if (permissions && Array.isArray(permissions) && permissions.length > 0) {
            const rolePermissions = permissions.map((pid: any) => ({
                role_id: newItem.id,
                permission_id: BigInt(pid)
            }));
            await prisma.role_has_permissions.createMany({
                data: rolePermissions
            });
        }
        
        res.json(serializeBigInt(newItem));
    } catch (e) { console.error(e); res.status(500).json({ error: 'Server error' }); }
});
router.delete('/roles/:id', async (req, res) => {
    try {
        await prisma.roles.delete({ where: { id: BigInt(req.params.id as string) } });
        res.json({ success: true });
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
});

// --- Event Settings ---
router.get('/event-settings', async (req, res) => {
    try {
        let settings = await prisma.event_settings.findFirst();
        if (!settings) {
            settings = await prisma.event_settings.create({ data: { created_at: new Date(), updated_at: new Date() } });
        }
        res.json(serializeBigInt(settings));
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
});
router.put('/event-settings', async (req, res) => {
    try {
        const data = req.body;
        // Find first id
        const first = await prisma.event_settings.findFirst();
        if (first) {
            const updated = await prisma.event_settings.update({ where: { id: first.id }, data: { ...data, updated_at: new Date() } });
            res.json(serializeBigInt(updated));
        } else {
            res.status(404).json({ error: 'Settings not found' });
        }
    } catch (e) { console.error(e); res.status(500).json({ error: 'Server error' }); }
});

// --- Event Registrations ---
router.get('/event-registrations', async (req, res) => {
    try {
        const items = await prisma.event_registrations.findMany({ orderBy: { created_at: 'desc' } });
        res.json(serializeBigInt(items));
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
});
router.delete('/event-registrations/:id', async (req, res) => {
    try {
        await prisma.event_registrations.delete({ where: { id: BigInt(req.params.id as string) } });
        res.json({ success: true });
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
});

// --- SEO Metas ---
router.get('/metas', async (req, res) => {
    try {
        const items = await prisma.metas.findMany({ where: { deleted_at: null } });
        res.json(serializeBigInt(items));
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
});
router.post('/metas', async (req, res) => {
    try {
        const { metaable_type, metaable_id, title, description, schema, status } = req.body;
        const newItem = await prisma.metas.create({ 
            data: { 
                metaable_type, 
                metaable_id: BigInt(metaable_id), 
                title, 
                description, 
                schema, 
                status: status ?? true, 
                created_at: new Date(), 
                updated_at: new Date() 
            } 
        });
        res.json(serializeBigInt(newItem));
    } catch (e) { console.error(e); res.status(500).json({ error: 'Server error' }); }
});
router.put('/metas/:id', async (req, res) => {
    try {
        const { title, description, schema, status } = req.body;
        const item = await prisma.metas.update({ 
            where: { id: BigInt(req.params.id as string) }, 
            data: { title, description, schema, status, updated_at: new Date() } 
        });
        res.json(serializeBigInt(item));
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
});
router.delete('/metas/:id', async (req, res) => {
    try {
        await prisma.metas.update({ where: { id: BigInt(req.params.id as string) }, data: { deleted_at: new Date() } });
        res.json({ success: true });
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
});

// --- Activity Logs ---
router.get('/activity-logs', async (req, res) => {
    try {
        const items = await prisma.activity_log.findMany({ 
            orderBy: { created_at: 'desc' },
            take: 100 // Limit to recent 100
        });
        res.json(serializeBigInt(items));
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
});

// --- Users ---
router.get('/users', async (req, res) => {
    try {
        const items = await prisma.users.findMany({
            orderBy: { created_at: 'desc' }
        });
        
        const userRoles = await prisma.model_has_roles.findMany({
            where: {
                model_type: 'App\\Models\\User',
                model_id: { in: items.map(i => i.id) }
            },
            include: { roles: true }
        });

        const usersWithRoles = items.map(user => {
            const roles = userRoles
                .filter(ur => ur.model_id === user.id)
                .map(ur => ur.roles.name);
            return { ...user, roles };
        });

        res.json(serializeBigInt(usersWithRoles));
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
});
router.post('/users', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const hashedPassword = password ? await bcrypt.hash(password, 10) : undefined;
        const newItem = await prisma.users.create({ data: { name, email, password: hashedPassword, created_at: new Date(), updated_at: new Date() } });
        res.json(serializeBigInt(newItem));
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
});
router.put('/users/:id', async (req, res) => {
    try {
        const { name, email, role } = req.body;
        const userId = BigInt(req.params.id as string);
        
        // Update user
        const updatedUser = await prisma.users.update({
            where: { id: userId },
            data: { name, email }
        });

        // Update role if provided
        if (role) {
            // First find the role to get its ID
            const roleRecord = await prisma.roles.findFirst({ where: { name: role } });
            if (roleRecord) {
                // Delete existing roles for this user
                await prisma.model_has_roles.deleteMany({
                    where: { model_id: userId, model_type: 'App\\Models\\User' }
                });
                
                // Assign new role
                await prisma.model_has_roles.create({
                    data: {
                        role_id: roleRecord.id,
                        model_type: 'App\\Models\\User',
                        model_id: userId
                    }
                });
            }
        }
        
        res.json({ success: true, user: serializeBigInt(updatedUser) });
    } catch (e) {
        console.error('Update user error', e);
        res.status(500).json({ error: 'Server error' });
    }
});

router.delete('/users/:id', async (req, res) => {
    try {
        await prisma.users.delete({ where: { id: BigInt(req.params.id as string) } });
        res.json({ success: true });
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
});

export default router;
