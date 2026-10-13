-- AlterTable
ALTER TABLE `courses` ADD COLUMN `display_order` INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE `life_at_xaviers` ADD COLUMN `display_order` INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE `news_and_events` ADD COLUMN `display_order` INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE `popups` ADD COLUMN `display_order` INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE `upcoming_events` ADD COLUMN `display_order` INTEGER NOT NULL DEFAULT 0;
