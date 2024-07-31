/*
  Warnings:

  - You are about to drop the column `address` on the `listing` table. All the data in the column will be lost.
  - You are about to drop the column `bathrooms` on the `listing` table. All the data in the column will be lost.
  - You are about to drop the column `bedrooms` on the `listing` table. All the data in the column will be lost.
  - You are about to drop the column `furnished` on the `listing` table. All the data in the column will be lost.
  - You are about to drop the column `imageUrl` on the `listing` table. All the data in the column will be lost.
  - You are about to drop the column `parking` on the `listing` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `listing` table. All the data in the column will be lost.
  - You are about to drop the column `Password` on the `users` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[propertyId]` on the table `listing` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[email]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `listingTypeId` to the `listing` table without a default value. This is not possible if the table is not empty.
  - Added the required column `propertyId` to the `listing` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "listing" DROP CONSTRAINT "listing_userId_fkey";

-- AlterTable
ALTER TABLE "listing" DROP COLUMN "address",
DROP COLUMN "bathrooms",
DROP COLUMN "bedrooms",
DROP COLUMN "furnished",
DROP COLUMN "imageUrl",
DROP COLUMN "parking",
DROP COLUMN "userId",
ADD COLUMN     "listingTypeId" TEXT NOT NULL,
ADD COLUMN     "propertyId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "Password",
ADD COLUMN     "password" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "listing_type" (
    "id" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "listing_type_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "property" (
    "id" TEXT NOT NULL,
    "bathrooms" INTEGER NOT NULL,
    "bedrooms" INTEGER NOT NULL,
    "furnished" BOOLEAN NOT NULL,
    "parking" BOOLEAN NOT NULL,
    "address" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "property_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "listing_propertyId_key" ON "listing"("propertyId");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_email_idx" ON "users"("email");

-- AddForeignKey
ALTER TABLE "listing" ADD CONSTRAINT "listing_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "property"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "listing" ADD CONSTRAINT "listing_listingTypeId_fkey" FOREIGN KEY ("listingTypeId") REFERENCES "listing_type"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "property" ADD CONSTRAINT "property_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
