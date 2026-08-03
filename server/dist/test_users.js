"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = require("../generated/prisma");
const prisma = new prisma_1.PrismaClient();
async function listUsers() {
    try {
        const users = await prisma.users.findMany({
            select: { id: true, name: true, email: true }
        });
        console.log('Users:', users);
    }
    catch (e) {
        console.error(e);
    }
}
listUsers();
