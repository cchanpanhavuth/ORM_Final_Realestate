import { PrismaClient } from "@prisma/client";
import { errorHandler } from "../utils/error.handler.js"
import bcrypt from 'bcrypt'

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
      createAt,
      updateAt,
      name,
      description,
      regularPrice,
      discountPrice,
      offer,
      type,
      propertyId,
      listingTypeId
    } = req.body;

    // Create a new listing
    const createdListing = await prisma.listing.create({
      data: {
        createAt,
        updateAt,
        name,
        description,
        regularPrice,
        discountPrice,
        offer,
        type,
        propertyRef: {
          connect: { id: propertyId }
        },
        listingType: {
          connect: { id: listingTypeId }
        }
      },
    });

    // Respond with the created listing
    return res.status(201).json(createdListing);
  } catch (error) {
    next(error);
  }
};




