/*
  Warnings:

  - You are about to alter the column `regularPrice` on the `listing` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.

*/
-- AlterTable
ALTER TABLE "listing" ALTER COLUMN "regularPrice" SET DATA TYPE INTEGER;
