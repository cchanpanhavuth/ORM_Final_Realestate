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
    let offer = req.query.offer;

    if (offer === undefined || offer === 'false') {
      offer = { $in: [false, true] };
    }

    let furnished = req.query.furnished;

    if (furnished === undefined || furnished === 'false') {
      furnished = { $in: [false, true] };
    }

    let parking = req.query.parking;

    if (parking === undefined || parking === 'false') {
      parking = { $in: [false, true] };
    }

    let type = req.query.type;

    if (type === undefined || type === 'all') {
      type = { $in: ['sale', 'rent'] };
    }

    const searchTerm = req.query.searchTerm || '';

    const sort = req.query.sort || 'createdAt';

    const order = req.query.order || 'desc';

    const listing = await listing.findMany({
      name: { $regex: searchTerm, $options: 'i' },
      offer,
      furnished,
      parking,
      type,
    })
      .sort({ [sort]: order })
      .limit(limit)
      .skip(startIndex);

    return res.status(200).json(listing);
  } catch (error) {
    next(error);
  }
};
