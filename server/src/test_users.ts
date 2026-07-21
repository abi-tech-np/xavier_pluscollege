import { PrismaClient } from '../generated/prisma';

const prisma = new PrismaClient();

async function listUsers() {
    try {
        const users = await prisma.users.findMany({
            select: { id: true, name: true, email: true }
        });
        console.log('Users:', users);
    } catch (e) {
        console.error(e);
    }
}

listUsers();
