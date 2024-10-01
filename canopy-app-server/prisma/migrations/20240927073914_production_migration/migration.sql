-- CreateTable
CREATE TABLE `Admin` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Admin_user_id_key`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Buyer` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `region` VARCHAR(191) NOT NULL,
    `supervisor_name` VARCHAR(191) NOT NULL,
    `supervisor_phone` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Buyer_user_id_key`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Location` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `region` VARCHAR(191) NOT NULL,
    `address` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Location_region_key`(`region`),
    UNIQUE INDEX `Location_address_key`(`address`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Canopy` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
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

    UNIQUE INDEX `Canopy_manage_number_key`(`manage_number`),
    UNIQUE INDEX `Canopy_class_number_key`(`class_number`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Control` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `canopy_id` INTEGER NOT NULL,
    `buyer_id` INTEGER NOT NULL,
    `fold` BOOLEAN NOT NULL,
    `motor` BOOLEAN NOT NULL,
    `led` BOOLEAN NOT NULL,
    `sound` BOOLEAN NOT NULL,
    `inform` BOOLEAN NOT NULL,
    `timestamp` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Canopy` ADD CONSTRAINT `Canopy_location_id_fkey` FOREIGN KEY (`location_id`) REFERENCES `Location`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Canopy` ADD CONSTRAINT `Canopy_buyer_id_fkey` FOREIGN KEY (`buyer_id`) REFERENCES `Buyer`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Control` ADD CONSTRAINT `Control_canopy_id_fkey` FOREIGN KEY (`canopy_id`) REFERENCES `Canopy`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Control` ADD CONSTRAINT `Control_buyer_id_fkey` FOREIGN KEY (`buyer_id`) REFERENCES `Buyer`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
