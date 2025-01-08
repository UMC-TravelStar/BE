-- CreateTable
CREATE TABLE `user` (
    `email` VARCHAR(191) NOT NULL,
    `id` VARCHAR(191) NOT NULL,
    `pw` VARCHAR(191) NOT NULL,
    `birth` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NOT NULL,
    `planet` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `user_email_key`(`email`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
