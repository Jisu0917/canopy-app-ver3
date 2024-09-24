/*
  Warnings:

  - A unique constraint covering the columns `[manage_number]` on the table `Canopy` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[class_number]` on the table `Canopy` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[region]` on the table `Location` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[address]` on the table `Location` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Canopy_manage_number_key` ON `Canopy`(`manage_number`);

-- CreateIndex
CREATE UNIQUE INDEX `Canopy_class_number_key` ON `Canopy`(`class_number`);

-- CreateIndex
CREATE UNIQUE INDEX `Location_region_key` ON `Location`(`region`);

-- CreateIndex
CREATE UNIQUE INDEX `Location_address_key` ON `Location`(`address`);
