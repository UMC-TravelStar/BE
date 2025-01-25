/*
  Warnings:

  - You are about to drop the `Day_schedule` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Friend_add` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Friends` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Post` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Post_image` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Schedule` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Search` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Star` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Stars` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Subscrition` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User_bgimage` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User_image` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `Day_schedule` DROP FOREIGN KEY `Day_schedule_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `Friend_add` DROP FOREIGN KEY `Friend_add_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `Friends` DROP FOREIGN KEY `Friends_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `Post` DROP FOREIGN KEY `Post_star_id_fkey`;

-- DropForeignKey
ALTER TABLE `Post` DROP FOREIGN KEY `Post_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `Post_image` DROP FOREIGN KEY `Post_image_post_id_fkey`;

-- DropForeignKey
ALTER TABLE `Schedule` DROP FOREIGN KEY `Schedule_day_id_fkey`;

-- DropForeignKey
ALTER TABLE `Star` DROP FOREIGN KEY `Star_stars_id_fkey`;

-- DropForeignKey
ALTER TABLE `Stars` DROP FOREIGN KEY `Stars_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `Subscrition` DROP FOREIGN KEY `Subscrition_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `User_bgimage` DROP FOREIGN KEY `User_bgimage_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `User_image` DROP FOREIGN KEY `User_image_user_id_fkey`;

-- DropTable
DROP TABLE `Day_schedule`;

-- DropTable
DROP TABLE `Friend_add`;

-- DropTable
DROP TABLE `Friends`;

-- DropTable
DROP TABLE `Post`;

-- DropTable
DROP TABLE `Post_image`;

-- DropTable
DROP TABLE `Schedule`;

-- DropTable
DROP TABLE `Search`;

-- DropTable
DROP TABLE `Star`;

-- DropTable
DROP TABLE `Stars`;

-- DropTable
DROP TABLE `Subscrition`;

-- DropTable
DROP TABLE `User`;

-- DropTable
DROP TABLE `User_bgimage`;

-- DropTable
DROP TABLE `User_image`;

-- CreateTable
CREATE TABLE `user` (
    `user_id` VARCHAR(191) NOT NULL,
    `nickname` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NULL,
    `birth` DATETIME(3) NULL,
    `phonenum` VARCHAR(191) NULL,
    `email` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`user_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `post` (
    `post_id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191) NULL,
    `content` VARCHAR(191) NULL,
    `music` VARCHAR(191) NULL,
    `feeling` VARCHAR(191) NULL,
    `feel_color` VARCHAR(191) NULL,
    `views` INTEGER NOT NULL DEFAULT 0,
    `storage` INTEGER NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `star_id` INTEGER NOT NULL,

    PRIMARY KEY (`post_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `post_image` (
    `p_image_id` INTEGER NOT NULL AUTO_INCREMENT,
    `file_name` VARCHAR(191) NULL,
    `post_id` INTEGER NOT NULL,

    PRIMARY KEY (`p_image_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `stars` (
    `stars_id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NULL,
    `views` INTEGER NOT NULL DEFAULT 0,
    `vote_num` INTEGER NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `user_id` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `stars_user_id_key`(`user_id`),
    PRIMARY KEY (`stars_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `star` (
    `star_id` INTEGER NOT NULL AUTO_INCREMENT,
    `region` VARCHAR(191) NULL,
    `stars_id` INTEGER NOT NULL,

    PRIMARY KEY (`star_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `day_schedule` (
    `day_id` INTEGER NOT NULL AUTO_INCREMENT,
    `date` DATETIME(3) NULL,
    `title` VARCHAR(191) NULL,
    `content` VARCHAR(191) NULL,
    `user_id` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`day_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `schedule` (
    `schedule_id` INTEGER NOT NULL AUTO_INCREMENT,
    `location` VARCHAR(191) NULL,
    `date_time` DATETIME(3) NOT NULL,
    `day_id` INTEGER NOT NULL,

    PRIMARY KEY (`schedule_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `subscrition` (
    `sub_id` INTEGER NOT NULL AUTO_INCREMENT,
    `deadline` DATETIME(3) NULL,
    `method` INTEGER NULL,
    `user_id` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `subscrition_user_id_key`(`user_id`),
    PRIMARY KEY (`sub_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `friends` (
    `fr_id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`fr_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `friend_add` (
    `add_id` INTEGER NOT NULL AUTO_INCREMENT,
    `fr_id` INTEGER NOT NULL,
    `status` INTEGER NULL,
    `user_id` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`add_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_image` (
    `u_image_id` INTEGER NOT NULL AUTO_INCREMENT,
    `file_name` VARCHAR(191) NULL,
    `user_id` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `user_image_user_id_key`(`user_id`),
    PRIMARY KEY (`u_image_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_bgimage` (
    `bg_image_id` INTEGER NOT NULL AUTO_INCREMENT,
    `file_name` VARCHAR(191) NULL,
    `user_id` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `user_bgimage_user_id_key`(`user_id`),
    PRIMARY KEY (`bg_image_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `search` (
    `search_id` INTEGER NOT NULL AUTO_INCREMENT,
    `word` VARCHAR(191) NULL,
    `number` INTEGER NOT NULL DEFAULT 0,

    PRIMARY KEY (`search_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `post` ADD CONSTRAINT `post_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `post` ADD CONSTRAINT `post_star_id_fkey` FOREIGN KEY (`star_id`) REFERENCES `star`(`star_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `post_image` ADD CONSTRAINT `post_image_post_id_fkey` FOREIGN KEY (`post_id`) REFERENCES `post`(`post_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `stars` ADD CONSTRAINT `stars_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `star` ADD CONSTRAINT `star_stars_id_fkey` FOREIGN KEY (`stars_id`) REFERENCES `stars`(`stars_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `day_schedule` ADD CONSTRAINT `day_schedule_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `schedule` ADD CONSTRAINT `schedule_day_id_fkey` FOREIGN KEY (`day_id`) REFERENCES `day_schedule`(`day_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `subscrition` ADD CONSTRAINT `subscrition_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `friends` ADD CONSTRAINT `friends_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `friend_add` ADD CONSTRAINT `friend_add_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_image` ADD CONSTRAINT `user_image_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_bgimage` ADD CONSTRAINT `user_bgimage_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
