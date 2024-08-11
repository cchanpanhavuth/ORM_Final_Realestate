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

    res.status(200).json({ message: 'Listing has been deleted!' });
  } catch (error) {
    next(error);
  }
};


export const updateListing = async (req, res, next) => {
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

    const propertyId = req.params.id; // Assuming the property ID is passed as a URL parameter

    const imageUrlsArray = Array.isArray(imageUrl) ? imageUrl : [imageUrl];

    // Start a transaction to update both property and listing
    await prisma.$transaction(async (prisma) => {
      // Update the property
      await prisma.property.update({
        where: { id: propertyId },
        data: {
          bathrooms: req.body.bathrooms,
          bedrooms: req.body.bedrooms,
          furnished: req.body.furnished,
          parking: req.body.parking,
          address: req.body.address,
          imageUrl: req.body.imageUrl,
          
        },
      });

      // Update the listing
      await prisma.listing.update({
        where: { propertyId },
        data: {
          name: req.body.name,
          description: req.body.description,
          regularPrice: req.body.regularPrice,
          discountPrice: req.body.discountPrice,
          offer: req.body.offer,
          rent: req.body.rent,
          sell: req.body.sell,
          listingTypeId: req.body.listingTypeId
        },
      });
    });

    res.status(200).json({ message: 'Listing and property updated successfully!' });
  } catch (error) {
    next(error);
  }
};

export const getListings = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 9;
    const startIndex = parseInt(req.query.startIndex) || 0;

    // Parse query parameters
    const offer = req.query.offer === 'true';
    const furnished = req.query.furnished === 'true';
    const parking = req.query.parking === 'true';
    const type = req.query.type;

    const searchTerm = req.query.searchTerm || '';
    const sort = req.query.sort || 'createAt';
    const order = req.query.order === 'asc' ? 'asc' : 'desc';

    // Construct filter object
    const filter = {
      offer: req.query.offer !== undefined ? offer : undefined,
      furnished: req.query.furnished !== undefined ? furnished : undefined,
      parking: req.query.parking !== undefined ? parking : undefined,
      type: type !== 'all' ? type : undefined,
      OR: [
        { name: { contains: searchTerm, mode: 'insensitive' } },
        { description: { contains: searchTerm, mode: 'insensitive' } },
      ],
    };

    // Remove undefined filters
    Object.keys(filter).forEach((key) => filter[key] === undefined && delete filter[key]);

    // Fetch listings with applied filters, sorting, and pagination
    const listings = await prisma.listing.findMany({
      where: filter,
      orderBy: { [sort]: order },
      skip: startIndex,
      take: limit,
    });

    return res.status(200).json(listings);
  } catch (error) {
    next(error);
  }
};

