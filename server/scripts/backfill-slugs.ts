import { PrismaClient } from '../generated/prisma';

const prisma = new PrismaClient();

function slugify(text: string): string {
    return text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')
        .replace(/[^\w\-]+/g, '')
        .replace(/\-\-+/g, '-')
        .replace(/^-+/, '')
        .replace(/-+$/, '');
}

async function backfillSlugs() {
    const events = await prisma.upcoming_events.findMany({
        where: { slug: null }
    });

    console.log(`Found ${events.length} events without slugs`);

    for (const event of events) {
        let baseSlug = slugify(event.title);
        let slug = baseSlug;
        let counter = 1;

        // Ensure uniqueness
        while (true) {
            const existing = await prisma.upcoming_events.findFirst({
                where: { slug, id: { not: event.id } }
            });
            if (!existing) break;
            slug = `${baseSlug}-${counter}`;
            counter++;
        }

        await prisma.upcoming_events.update({
            where: { id: event.id },
            data: { slug }
        });

        console.log(`  Updated: "${event.title}" -> "${slug}"`);
    }

    console.log('Done!');
    await prisma.$disconnect();
}

backfillSlugs().catch(console.error);
