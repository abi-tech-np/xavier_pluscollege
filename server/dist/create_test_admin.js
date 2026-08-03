"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = require("../generated/prisma");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const prisma = new prisma_1.PrismaClient();
async function createAdmin() {
    try {
        const email = 'developer@xavier.edu.np';
        const password = await bcryptjs_1.default.hash('password123', 10);
        // Check if user exists
        let user = await prisma.users.findUnique({ where: { email } });
        if (user) {
            // Update password
            await prisma.users.update({
                where: { email },
                data: { password }
            });
            console.log('User password updated.');
        }
        else {
            // Create new
            user = await prisma.users.create({
                data: {
                    name: 'Test Developer',
                    email,
                    password
                }
            });
            console.log('User created.');
        }
    }
    catch (e) {
        console.error(e);
    }
}
createAdmin();
