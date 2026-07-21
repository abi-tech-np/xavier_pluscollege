import { PrismaClient } from '../generated/prisma';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    const email = 'admin@xavier.edu.np';
    const password = 'password';

    const existingUser = await prisma.users.findUnique({
        where: { email }
    });

    if (existingUser) {
        console.log(`Admin user ${email} already exists.`);
        return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.users.create({
        data: {
            name: 'Admin',
            email,
            password: hashedPassword,
            created_at: new Date(),
            updated_at: new Date()
        }
    });

    console.log(`Admin user created: ${user.email} / ${password}`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
