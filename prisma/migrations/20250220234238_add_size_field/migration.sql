/*
  Warnings:

  - Made the column `word` on table `search` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `post` ADD COLUMN `size` INTEGER NULL,
    MODIFY `content` TEXT NULL;

-- AlterTable
ALTER TABLE `search` MODIFY `word` VARCHAR(191) NOT NULL,
    MODIFY `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);
