/*
  Warnings:

  - You are about to drop the column `discountPrince` on the `listing` table. All the data in the column will be lost.
  - Added the required column `discountPrice` to the `listing` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "listing" DROP COLUMN "discountPrince",
ADD COLUMN     "discountPrice" INTEGER NOT NULL;
