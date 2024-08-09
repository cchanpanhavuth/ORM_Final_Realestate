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
      imageUrl,
      userId,
      listingTypeId,

    } = req.body;
    const createdListing = await prisma.property.create({
      data: {
        bathrooms,
        bedrooms,
        furnished,
        parking,
        address,
        imageUrl,
        userId,
        listing:{
          create:{
            name,
            description,
            regularPrice,
            discountPrice,
            offer,
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




