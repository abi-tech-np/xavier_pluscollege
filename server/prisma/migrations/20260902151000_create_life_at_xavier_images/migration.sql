-- CreateTable
CREATE TABLE `life_at_xavier_images` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `life_at_xavier_id` BIGINT UNSIGNED NOT NULL,
    `imageUrl` VARCHAR(255) NOT NULL,
    `sortOrder` INTEGER NOT NULL DEFAULT 0,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,

    INDEX `life_at_xavier_images_life_at_xavier_id_foreign`(`life_at_xavier_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `life_at_xavier_images` ADD CONSTRAINT `life_at_xavier_images_life_at_xavier_id_foreign` FOREIGN KEY (`life_at_xavier_id`) REFERENCES `life_at_xaviers`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;
