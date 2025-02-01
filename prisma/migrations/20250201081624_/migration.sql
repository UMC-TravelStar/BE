/*
  Warnings:

  - You are about to drop the `friend_add` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `friends` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `friend_add` DROP FOREIGN KEY `friend_add_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `friends` DROP FOREIGN KEY `friends_user_id_fkey`;

-- DropTable
DROP TABLE `friend_add`;

-- DropTable
DROP TABLE `friends`;

-- CreateTable
CREATE TABLE `Friend` (
    `request_id` INTEGER NOT NULL AUTO_INCREMENT,
    `from_user_id` VARCHAR(191) NOT NULL,
    `to_user_id` VARCHAR(191) NOT NULL,
    `are_we_friend` BOOLEAN NOT NULL DEFAULT false,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`request_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Friend` ADD CONSTRAINT `Friend_from_user_id_fkey` FOREIGN KEY (`from_user_id`) REFERENCES `user`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Friend` ADD CONSTRAINT `Friend_to_user_id_fkey` FOREIGN KEY (`to_user_id`) REFERENCES `user`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
