"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = require("../generated/prisma");
const prisma = new prisma_1.PrismaClient();
async function deletePopups() {
    try {
        await prisma.popups.deleteMany({});
        console.log('All popups deleted successfully!');
    }
    catch (e) {
        console.error(e);
    }
}
deletePopups();
