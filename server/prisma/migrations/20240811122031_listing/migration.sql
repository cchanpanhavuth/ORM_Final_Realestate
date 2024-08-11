-- DropForeignKey
ALTER TABLE "listing" DROP CONSTRAINT "listing_propertyId_fkey";

-- AddForeignKey
ALTER TABLE "listing" ADD CONSTRAINT "listing_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "property"("id") ON DELETE CASCADE ON UPDATE CASCADE;
