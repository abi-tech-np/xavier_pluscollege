import { Router, Request, Response } from 'express';
import { PrismaClient } from '../../generated/prisma';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { authenticateJWT, AuthRequest } from '../middlewares/auth';

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
        const lifeAtXavierCount = await prisma.life_at_xaviers.count();

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
                id: item.id.toString()
            }))
        );
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.post('/news', async (req: AuthRequest, res: Response) => {
    try {
        const { title, slug, content, status } = req.body;
        const newItem = await prisma.news_and_events.create({
            data: {
                title,
                slug,
                content,
                status: status ?? true,
                created_at: new Date(),
                updated_at: new Date()
            }
        });
        res.json({ ...newItem, id: newItem.id.toString() });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.put('/news/:id', async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const { title, slug, content, status } = req.body;
        const updatedItem = await prisma.news_and_events.update({
            where: { id: BigInt(id) },
            data: { title, slug, content, status, updated_at: new Date() }
        });
        res.json({ ...updatedItem, id: updatedItem.id.toString() });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.delete('/news/:id', async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        await prisma.news_and_events.delete({ where: { id: BigInt(id) } });
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Applications (Applies)
router.get('/applications', async (req: AuthRequest, res: Response) => {
    try {
        const items = await prisma.applies.findMany({
            orderBy: { created_at: 'desc' },
            include: { courses: true }
        });
        res.json(items.map(item => ({
            ...item,
            id: item.id.toString(),
            course_id: item.course_id.toString(),
            contact: item.contact.toString(),
            courses: {
                ...item.courses,
                id: item.courses.id.toString()
            }
        })));
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.delete('/applications/:id', async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        await prisma.applies.delete({ where: { id: BigInt(id) } });
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
        const item = await prisma.courses.update({ where: { id: BigInt(req.params.id) }, data: { course, updated_at: new Date() } });
        res.json(serializeBigInt(item));
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
});
router.delete('/courses/:id', async (req, res) => {
    try {
        await prisma.courses.update({ where: { id: BigInt(req.params.id) }, data: { deleted_at: new Date() } });
        res.json({ success: true });
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
});

// --- Contacts ---
router.get('/contacts', async (req, res) => {
    try {
        const items = await prisma.contacts.findMany();
        res.json(serializeBigInt(items));
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
});
router.delete('/contacts/:id', async (req, res) => {
    try {
        await prisma.contacts.delete({ where: { id: BigInt(req.params.id) } });
        res.json({ success: true });
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
});

// --- Popups ---
router.get('/popups', async (req, res) => {
    try {
        const items = await prisma.popups.findMany();
        res.json(serializeBigInt(items));
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
});
router.post('/popups', async (req, res) => {
    try {
        const { title, link, status } = req.body;
        const newItem = await prisma.popups.create({ data: { title, link, status: status ?? true, created_at: new Date(), updated_at: new Date() } });
        res.json(serializeBigInt(newItem));
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
});
router.put('/popups/:id', async (req, res) => {
    try {
        const { title, link, status } = req.body;
        const item = await prisma.popups.update({ where: { id: BigInt(req.params.id) }, data: { title, link, status, updated_at: new Date() } });
        res.json(serializeBigInt(item));
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
});
router.delete('/popups/:id', async (req, res) => {
    try {
        await prisma.popups.delete({ where: { id: BigInt(req.params.id) } });
        res.json({ success: true });
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
});

// --- Upcoming Events ---
router.get('/upcoming-events', async (req, res) => {
    try {
        const items = await prisma.upcoming_events.findMany();
        res.json(serializeBigInt(items));
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
});
router.post('/upcoming-events', async (req, res) => {
    try {
        const { title, time, content, location, status } = req.body;
        const newItem = await prisma.upcoming_events.create({ data: { title, time, content, location, status: status ?? true, created_at: new Date(), updated_at: new Date() } });
        res.json(serializeBigInt(newItem));
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
});
router.put('/upcoming-events/:id', async (req, res) => {
    try {
        const { title, time, content, location, status } = req.body;
        const item = await prisma.upcoming_events.update({ where: { id: BigInt(req.params.id) }, data: { title, time, content, location, status, updated_at: new Date() } });
        res.json(serializeBigInt(item));
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
});
router.delete('/upcoming-events/:id', async (req, res) => {
    try {
        await prisma.upcoming_events.delete({ where: { id: BigInt(req.params.id) } });
        res.json({ success: true });
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
});

// --- Life At Xaviers ---
router.get('/life-at-xaviers', async (req, res) => {
    try {
        const items = await prisma.life_at_xaviers.findMany({ where: { deleted_at: null } });
        res.json(serializeBigInt(items));
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
});
router.post('/life-at-xaviers', async (req, res) => {
    try {
        const { title, slug, status } = req.body;
        const newItem = await prisma.life_at_xaviers.create({ data: { title, slug, status: status ?? true, created_at: new Date(), updated_at: new Date() } });
        res.json(serializeBigInt(newItem));
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
});
router.put('/life-at-xaviers/:id', async (req, res) => {
    try {
        const { title, slug, status } = req.body;
        const item = await prisma.life_at_xaviers.update({ where: { id: BigInt(req.params.id) }, data: { title, slug, status, updated_at: new Date() } });
        res.json(serializeBigInt(item));
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
});
router.delete('/life-at-xaviers/:id', async (req, res) => {
    try {
        await prisma.life_at_xaviers.update({ where: { id: BigInt(req.params.id) }, data: { deleted_at: new Date() } });
        res.json({ success: true });
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
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
        await prisma.roles.delete({ where: { id: BigInt(req.params.id) } });
        res.json({ success: true });
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
});

// --- Users ---
router.get('/users', async (req, res) => {
    try {
        const items = await prisma.users.findMany();
        res.json(serializeBigInt(items));
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
router.delete('/users/:id', async (req, res) => {
    try {
        await prisma.users.delete({ where: { id: BigInt(req.params.id) } });
        res.json({ success: true });
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
});

export default router;
