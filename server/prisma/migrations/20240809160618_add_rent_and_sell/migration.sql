/*
  Warnings:

  - Added the required column `rent` to the `listing` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sell` to the `listing` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "listing" ADD COLUMN     "rent" BOOLEAN NOT NULL,
ADD COLUMN     "sell" BOOLEAN NOT NULL;
