/*
  Warnings:

  - You are about to drop the column `file_name` on the `post_image` table. All the data in the column will be lost.
  - You are about to drop the column `day_id` on the `schedule` table. All the data in the column will be lost.
  - You are about to drop the `Friend` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `day_schedule` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `user_id` to the `schedule` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Friend` DROP FOREIGN KEY `Friend_from_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `Friend` DROP FOREIGN KEY `Friend_to_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `day_schedule` DROP FOREIGN KEY `day_schedule_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `schedule` DROP FOREIGN KEY `schedule_day_id_fkey`;

-- DropIndex
DROP INDEX `schedule_day_id_fkey` ON `schedule`;

-- AlterTable
ALTER TABLE `post_image` DROP COLUMN `file_name`,
    ADD COLUMN `imageUrl` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `schedule` DROP COLUMN `day_id`,
    ADD COLUMN `user_id` VARCHAR(191) NOT NULL;

-- DropTable
DROP TABLE `Friend`;

-- DropTable
DROP TABLE `day_schedule`;

-- CreateTable
CREATE TABLE `friend` (
    `request_id` INTEGER NOT NULL AUTO_INCREMENT,
    `from_user_id` VARCHAR(191) NOT NULL,
    `to_user_id` VARCHAR(191) NOT NULL,
    `are_we_friend` BOOLEAN NOT NULL DEFAULT false,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`request_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `votes` (
    `vote_id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` VARCHAR(191) NOT NULL,
    `stars_id` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `votes_user_id_stars_id_key`(`user_id`, `stars_id`),
    PRIMARY KEY (`vote_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `schedule_user_id_fkey` ON `schedule`(`user_id`);

-- AddForeignKey
ALTER TABLE `schedule` ADD CONSTRAINT `schedule_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `friend` ADD CONSTRAINT `friend_from_user_id_fkey` FOREIGN KEY (`from_user_id`) REFERENCES `user`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `friend` ADD CONSTRAINT `friend_to_user_id_fkey` FOREIGN KEY (`to_user_id`) REFERENCES `user`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `votes` ADD CONSTRAINT `votes_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `votes` ADD CONSTRAINT `votes_stars_id_fkey` FOREIGN KEY (`stars_id`) REFERENCES `stars`(`stars_id`) ON DELETE CASCADE ON UPDATE CASCADE;
