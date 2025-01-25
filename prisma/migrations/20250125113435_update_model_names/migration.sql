/*
  Warnings:

  - Added the required column `updated_at` to the `day_schedule` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `friend_add` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `friends` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `post_image` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `schedule` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `search` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `star` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `stars` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `subscrition` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `user_bgimage` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `user_image` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `day_schedule` ADD COLUMN `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updated_at` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `friend_add` ADD COLUMN `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updated_at` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `friends` ADD COLUMN `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updated_at` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `post_image` ADD COLUMN `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updated_at` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `schedule` ADD COLUMN `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updated_at` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `search` ADD COLUMN `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updated_at` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `star` ADD COLUMN `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updated_at` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `stars` ADD COLUMN `updated_at` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `subscrition` ADD COLUMN `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updated_at` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `user_bgimage` ADD COLUMN `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updated_at` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `user_image` ADD COLUMN `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updated_at` DATETIME(3) NOT NULL;
