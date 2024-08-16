/*
  Warnings:

  - You are about to drop the column `type` on the `listing` table. All the data in the column will be lost.
  - Added the required column `name` to the `listing_type` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "listing" DROP COLUMN "type";

-- AlterTable
ALTER TABLE "listing_type" ADD COLUMN     "name" TEXT NOT NULL;
