import { PrismaClient } from "@prisma/client";
import { errorHandler } from "../utils/error.handler.js"

const prisma = new PrismaClient();


export const getAllListing = async (req, res, next) => {
  try {
    const listings = await prisma.listing.findMany();
    if (!listings) {
      return next(errorHandler(404, 'Listing not found!'));
    }
    res.status(200).json(listings);
  } catch (error) {
    next(error);
  }
};

export const createListing = async (req, res, next) => {
  try {
    const {
      name,
      description,
      regularPrice,
      discountPrice,
      offer,
      bathrooms,
      bedrooms,
      furnished,
      parking,
      address,
      rent,
      sell,
      imageUrl,
      userId,
      listingTypeId,

    } = req.body;

    const imageUrlsArray = Array.isArray(imageUrl) ? imageUrl : [imageUrl];
    
    const createdListing = await prisma.property.create({
      data: {
        bathrooms,
        bedrooms,
        furnished,
        parking,
        address,
        imageUrl,
        userId,
        listing: {
          create: {
            name,
            description,
            regularPrice,
            discountPrice,
            offer,
            rent,
            sell,
            listingTypeId,
          }
        }
      },
    });

    res.status(201).json(createdListing);
  } catch (error) {
    next(error);
  }
};

export const getListingType = async (req, res, next) => {
  try {
    const listing_type = await prisma.listing_type.findMany();
    if (!listing_type) {
      return next(errorHandler(404, 'Listing Type not found!'));
    }
    res.status(200).json(listing_type);
  } catch (error) {
    next(error);
  }
};

export const deleteListing = async (req, res, next) => {
  const listing = await prisma.property.findUnique({
    where: {
      id: req.params.id,
    },
  });

  if (!listing) {
    return next(errorHandler(404, 'Listing not found!'));
  }

  if (req.user.id !== listing.userId) {
    return next(errorHandler(401, 'You can only delete your own listings!'));
  }

  try {
    await prisma.property.delete({
      where: {
        id: req.params.id,
      },
    });

    res.status(200).json('Listing has been deleted!');
  } catch (error) {
    next(error);
  }
};

// export const deleteListing = async (req, res, next) => {
//   const { propertyId } = req.params;

//   if (!propertyId) {
//     return next(errorHandler(400, 'Property ID is required'));
//   }

//   try {
//     // Fetch the listing by propertyId
//     const listings = await prisma.listing.findUnique({
//       where: {
//         propertyId: propertyId,
//       },
//     });

//     // Check if the listing exists
//     if (!listings) {
//       return next(errorHandler(404, 'Listing not found!'));
//     }

//     // Check if the user is authorized to delete the listing
//     if (req.user.id !== listings.userId) {
//       return next(errorHandler(401, 'You can only delete your own listings!'));
//     }

//     // Delete the listing
//     await prisma.listing.delete({
//       where: {
//         propertyId: propertyId,
//       },
//     });

//     res.status(200).json('Listing has been deleted!');
//   } catch (error) {
//     next(error);
//   }
// };



