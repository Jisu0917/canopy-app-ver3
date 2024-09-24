-- CreateTable
CREATE TABLE `Admin` (
    `admin_id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Admin_user_id_key`(`user_id`),
    PRIMARY KEY (`admin_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Buyer` (
    `buyer_id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `region` VARCHAR(191) NOT NULL,
    `supervisor_name` VARCHAR(191) NOT NULL,
    `supervisor_phone` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Buyer_user_id_key`(`user_id`),
    PRIMARY KEY (`buyer_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Location` (
    `location_id` INTEGER NOT NULL AUTO_INCREMENT,
    `region` VARCHAR(191) NOT NULL,
    `address` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`location_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Canopy` (
    `canopy_id` INTEGER NOT NULL AUTO_INCREMENT,
    `manage_number` VARCHAR(191) NOT NULL,
    `class_number` VARCHAR(191) NOT NULL,
    `location_id` INTEGER NOT NULL,
    `buyer_id` INTEGER NULL,
    `status_fold` BOOLEAN NULL,
    `status_motor` BOOLEAN NULL,
    `status_led` BOOLEAN NULL,
    `status_sound` BOOLEAN NULL,
    `status_inform` BOOLEAN NULL,
    `status_temperature` DOUBLE NULL,
    `status_transmit` BOOLEAN NULL,

    PRIMARY KEY (`canopy_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Control` (
    `control_id` INTEGER NOT NULL AUTO_INCREMENT,
    `canopy_id` INTEGER NOT NULL,
    `buyer_id` INTEGER NOT NULL,
    `fold` BOOLEAN NOT NULL,
    `motor` BOOLEAN NOT NULL,
    `led` BOOLEAN NOT NULL,
    `sound` BOOLEAN NOT NULL,
    `inform` BOOLEAN NOT NULL,
    `timestamp` DATETIME(3) NOT NULL,

    PRIMARY KEY (`control_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Canopy` ADD CONSTRAINT `Canopy_location_id_fkey` FOREIGN KEY (`location_id`) REFERENCES `Location`(`location_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Canopy` ADD CONSTRAINT `Canopy_buyer_id_fkey` FOREIGN KEY (`buyer_id`) REFERENCES `Buyer`(`buyer_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Control` ADD CONSTRAINT `Control_canopy_id_fkey` FOREIGN KEY (`canopy_id`) REFERENCES `Canopy`(`canopy_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Control` ADD CONSTRAINT `Control_buyer_id_fkey` FOREIGN KEY (`buyer_id`) REFERENCES `Buyer`(`buyer_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
