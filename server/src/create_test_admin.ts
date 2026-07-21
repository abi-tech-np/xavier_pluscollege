import { PrismaClient } from '../generated/prisma';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function createAdmin() {
    try {
        const email = 'developer@xavier.edu.np';
        const password = await bcrypt.hash('password123', 10);
        
        // Check if user exists
        let user = await prisma.users.findUnique({ where: { email } });
        
        if (user) {
            // Update password
            await prisma.users.update({
                where: { email },
                data: { password }
            });
            console.log('User password updated.');
        } else {
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
    } catch (e) {
        console.error(e);
    }
}

createAdmin();
