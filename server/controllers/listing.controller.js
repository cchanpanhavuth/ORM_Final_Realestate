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

    const parsedBathrooms = parseInt(bathrooms);
    const parsedBedrooms = parseInt(bedrooms);
    const parsedRegularPrice = parseInt(regularPrice);
    const parsedDiscountPrice = parseInt(discountPrice);
    

    const createdListing = await prisma.property.create({
      data: {
        bathrooms: parsedBathrooms,
        bedrooms: parsedBedrooms,
        furnished,
        parking,
        address,
        imageUrl,
        userId,
        listing: {
          create: {
            name,
            description,
            discountPrice: parsedDiscountPrice,
            regularPrice: parsedRegularPrice,
            offer,
            rent,
            sell,
            listingTypeId,
          }
        }
      },
    });

    

    res.status(201).json({ message: 'Listing has been Created!' });
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
  

    const parsedBathrooms = parseInt(req.body.bathrooms);
    const parsedBedrooms = parseInt(req.body.bedrooms);
    const parsedRegularPrice = parseInt(req.body.regularPrice);
    const parsedDiscountPrice = parseInt(req.body.discountPrice);
    let updatedProperty, updatedListing;

    // Start a transaction to update both property and listing
    await prisma.$transaction(async (prisma) => {
      // Update the property
      updatedProperty = await prisma.property.update({
        where: { id: req.params.id },
        data: {
          bathrooms: parsedBathrooms,
          bedrooms: parsedBedrooms,
          furnished: req.body.furnished,
          parking: req.body.parking,
          address: req.body.address,
          imageUrl: req.body.imageUrl,
        },
      });

      // Update the listing
      updatedListing = await prisma.listing.update({
        where: { propertyId: req.params.id },
        data: {
          name: req.body.name,
          description: req.body.description,
          discountPrice: parsedDiscountPrice,
          regularPrice: parsedRegularPrice,
          offer: req.body.offer,
          rent: req.body.rent,
          sell: req.body.sell,
          listingTypeId: req.body.listingTypeId,
        },
      });
    });

    // Respond with the updated property and listing
    res.status(200).json({
      message: 'Listing and property updated successfully!',
      property: updatedProperty,
      listing: updatedListing,
    });
  } catch (error) {
    next(error);
  }
};


export const getListing = async (req, res, next) => {
  try {
    const listing = await prisma.property.findUnique({
      where: { id: req.params.id },
      include: {
        listing: true,  // Include the related Property data
      },
    });

    if (!listing) {
      return next(errorHandler(404, 'Listing not found!'));
    }

    res.status(200).json(listing);
  } catch (error) {
    next(error);
  }
};


// export const getListings = async (req, res, next) => {
//   try {
//     const limit = parseInt(req.query.limit) || 9;
//     const startIndex = parseInt(req.query.startIndex) || 0;

//     // Parse query parameters
//     const offer = req.query.offer === 'true';
//     const furnished = req.query.furnished === 'true';
//     const parking = req.query.parking === 'true';
//     const type = req.query.type;

//     const searchTerm = req.query.searchTerm || '';
//     const sort = req.query.sort || 'createAt';
//     const order = req.query.order === 'asc' ? 'asc' : 'desc';

//     // Construct filter object
//     const filter = {
//       offer: req.query.offer !== undefined ? offer : undefined,
//       furnished: req.query.furnished !== undefined ? furnished : undefined,
//       parking: req.query.parking !== undefined ? parking : undefined,
//       type: type !== 'all' ? type : undefined,
//       OR: [
//         { name: { contains: searchTerm, mode: 'insensitive' } },
//         { description: { contains: searchTerm, mode: 'insensitive' } },
//       ],
//     };

//     // Remove undefined filters
//     Object.keys(filter).forEach((key) => filter[key] === undefined && delete filter[key]);

//     // Fetch listings with applied filters, sorting, and pagination
//     const listings = await prisma.property.findMany({
//       where: filter,
//       orderBy: { [sort]: order },
//       skip: startIndex,
//       take: limit,
//       // include:{
//       //   listing:true,
//       // },
      
//     });

//     return res.status(200).json(listings);
//   } catch (error) {
//     next(error);
//   }
// };

export const getListings = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 9;
    const startIndex = parseInt(req.query.startIndex) ||  0;

    // Parse query parameters
    const offer = req.query.offer === 'true' ? true : req.query.offer === 'false' ? false : undefined;
    const furnished = req.query.furnished === 'true' ? true : req.query.furnished === 'false' ? false : undefined;
    const parking = req.query.parking === 'true' ? true : req.query.parking === 'false' ? false : undefined;
    const type = req.query.type && req.query.type !== 'all' ? req.query.type : undefined;

    const searchTerm = req.query.searchTerm  ||'';
    const sort = req.query.sort  ||'createAt'; // Default to sorting by createAt in listing
    const order = req.query.order === 'asc' ? 'asc' : 'desc';

    // Construct filter object
    const filter = {
      OR: [
        {
          listing: {
            name: {
              contains: searchTerm,
              mode: 'insensitive'
            }
          }
        },
        {
          listing: {
            description: {
              contains: searchTerm,
              mode: 'insensitive'
            }
          }
        },
        ...(offer !== undefined || furnished !== undefined || parking !== undefined || type ? [{
          listing: {
            ...(offer !== undefined && { offer }),
            ...(type && { listingType: { name: type } })
          },
          ...(furnished !== undefined && { furnished }),
          ...(parking !== undefined && { parking })
        }] : [])
      ]
    };

    // Fetch listings with applied filters, sorting, and pagination
    const listings = await prisma.property.findMany({
      where: filter,
      orderBy: {
        listing: {
          [sort]: order // Sort by a field in the related listing model
        }
      },
      skip: startIndex,
      take: limit,
      include: {
        listing: true // Include the related listing model
      }
    });

    return res.status(200).json(listings);
  } catch (error) {
    console.error('Error fetching listings:', error);
    next(error);
  }
};