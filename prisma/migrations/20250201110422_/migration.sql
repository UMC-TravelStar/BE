-- DropForeignKey
ALTER TABLE `star` DROP FOREIGN KEY `star_stars_id_fkey`;

-- DropIndex
DROP INDEX `star_stars_id_fkey` ON `star`;

-- AlterTable
ALTER TABLE `star` MODIFY `stars_id` INTEGER NULL;

-- AlterTable
ALTER TABLE `user` ADD COLUMN `comment` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `planet` (
    `planet_id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`planet_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `star` ADD CONSTRAINT `star_stars_id_fkey` FOREIGN KEY (`stars_id`) REFERENCES `stars`(`stars_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `planet` ADD CONSTRAINT `planet_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;
