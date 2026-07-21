import { PrismaClient } from '../generated/prisma';

const prisma = new PrismaClient();

async function deletePopups() {
    try {
        await prisma.popups.deleteMany({});
        console.log('All popups deleted successfully!');
    } catch (e) {
        console.error(e);
    }
}

deletePopups();
