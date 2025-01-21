/*
  Warnings:

  - The primary key for the `user` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `user_id` on the `user` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.

*/
-- AlterTable
ALTER TABLE `user` DROP PRIMARY KEY,
    MODIFY `user_id` INTEGER NOT NULL,
    ADD PRIMARY KEY (`user_id`);

-- CreateTable
CREATE TABLE `post` (
    `post_id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191) NOT NULL,
    `content` VARCHAR(191) NOT NULL,
    `music` VARCHAR(191) NULL,
    `region` VARCHAR(191) NOT NULL,
    `detail_reg` VARCHAR(191) NOT NULL,
    `feeling` VARCHAR(191) NOT NULL,
    `feel_color` VARCHAR(191) NOT NULL,
    `photos` VARCHAR(191) NOT NULL,
    `views` INTEGER NOT NULL DEFAULT 0,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `author_id` INTEGER NOT NULL,

    PRIMARY KEY (`post_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `post` ADD CONSTRAINT `post_author_id_fkey` FOREIGN KEY (`author_id`) REFERENCES `user`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
