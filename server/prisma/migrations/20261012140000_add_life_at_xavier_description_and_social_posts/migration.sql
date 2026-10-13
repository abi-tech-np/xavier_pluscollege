-- AlterTable
ALTER TABLE `life_at_xaviers` ADD COLUMN `description` TEXT NULL;

-- CreateTable
CREATE TABLE `life_at_xavier_social_posts` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `life_at_xavier_id` BIGINT UNSIGNED NOT NULL,
    `platform` VARCHAR(50) NOT NULL,
    `post_url` TEXT NOT NULL,
    `thumbnail_url` TEXT NULL,
    `title` VARCHAR(255) NULL,
    `sort_order` INTEGER NOT NULL DEFAULT 0,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,

    INDEX `life_at_xavier_social_posts_life_at_xavier_id_foreign`(`life_at_xavier_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `life_at_xavier_social_posts` ADD CONSTRAINT `life_at_xavier_social_posts_life_at_xavier_id_foreign` FOREIGN KEY (`life_at_xavier_id`) REFERENCES `life_at_xaviers`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;
