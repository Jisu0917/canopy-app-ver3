-- Admin 테이블 데이터 삭제
DELETE FROM `admin`;

-- Buyer 테이블 데이터 삭제
DELETE FROM `buyer`;

-- Control 테이블 데이터 삭제
DELETE FROM `control`;

-- Location 테이블 데이터 삭제
DELETE FROM `location`;

-- Canopy 테이블 데이터 삭제
DELETE FROM `canopy`;


-- 기존 외래 키 제약 조건 삭제
ALTER TABLE `canopy` DROP FOREIGN KEY `Canopy_buyer_id_fkey`;
ALTER TABLE `canopy` DROP FOREIGN KEY `Canopy_location_id_fkey`;
ALTER TABLE `control` DROP FOREIGN KEY `Control_buyer_id_fkey`;
ALTER TABLE `control` DROP FOREIGN KEY `Control_canopy_id_fkey`;

-- 기존 컬럼 삭제 및 새 컬럼 추가
ALTER TABLE `admin`
DROP PRIMARY KEY,
DROP COLUMN `admin_id`,
ADD COLUMN `id` INT NOT NULL AUTO_INCREMENT,
ADD PRIMARY KEY (`id`);

ALTER TABLE `buyer`
DROP PRIMARY KEY,
DROP COLUMN `buyer_id`,
ADD COLUMN `id` INT NOT NULL AUTO_INCREMENT,
ADD PRIMARY KEY (`id`);

ALTER TABLE `canopy`
DROP PRIMARY KEY,
DROP COLUMN `canopy_id`,
ADD COLUMN `id` INT NOT NULL AUTO_INCREMENT,
ADD PRIMARY KEY (`id`);

ALTER TABLE `control`
DROP PRIMARY KEY,
DROP COLUMN `control_id`,
ADD COLUMN `id` INT NOT NULL AUTO_INCREMENT,
ADD PRIMARY KEY (`id`);

ALTER TABLE `location`
DROP PRIMARY KEY,
DROP COLUMN `location_id`,
ADD COLUMN `id` INT NOT NULL AUTO_INCREMENT,
ADD PRIMARY KEY (`id`);

-- 새 외래 키 제약 조건 추가
ALTER TABLE `canopy`
ADD CONSTRAINT `Canopy_location_id_fkey` FOREIGN KEY (`location_id`) REFERENCES `location`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE `canopy`
ADD CONSTRAINT `Canopy_buyer_id_fkey` FOREIGN KEY (`buyer_id`) REFERENCES `buyer`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE `control`
ADD CONSTRAINT `Control_canopy_id_fkey` FOREIGN KEY (`canopy_id`) REFERENCES `canopy`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE `control`
ADD CONSTRAINT `Control_buyer_id_fkey` FOREIGN KEY (`buyer_id`) REFERENCES `buyer`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
