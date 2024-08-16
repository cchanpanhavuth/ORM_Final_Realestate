import { Link } from 'react-router-dom';
import { MdLocationOn } from 'react-icons/md';

export default function ListingItem({ property }) {
  const { listing, ...propertyDetails } = property;

  if (!listing) return null; // Ensure listing exists before rendering

  return (
    <div className='bg-white shadow-md hover:shadow-lg transition-shadow overflow-hidden rounded-lg w-full sm:w-[330px]'>
      <Link to={`/property/${propertyDetails.id}`}>
        <img
          src={
            propertyDetails.imageUrl[0] ||
            'https://53.fs1.hubspotusercontent-na1.net/hub/53/hubfs/Sales_Blog/real-estate-business-compressor.jpg?width=595&height=400&name=real-estate-business-compressor.jpg'
          }
          alt={`${listing.name} cover image`}
          className='h-[320px] sm:h-[220px] w-full object-cover hover:scale-105 transition-scale duration-300'
        />
        <div className='p-3 flex flex-col gap-2 w-full'>
          <p className='truncate text-lg font-semibold text-slate-700'>
            {listing.name}
          </p>
          <div className='flex items-center gap-1'>
            <MdLocationOn className='h-4 w-4 text-green-700' />
            <p className='text-sm text-gray-600 truncate w-full'>
              {propertyDetails.address}
            </p>
          </div>
          <p className='text-sm text-gray-600 line-clamp-2'>
            {listing.description}
          </p>
          <p className='text-slate-500 mt-2 font-semibold '>
            $
            {listing.offer
              ? listing.discountPrice.toLocaleString('en-US')
              : listing.regularPrice.toLocaleString('en-US')}
            {listing.rent && ' / month'}
          </p>
          <div className='text-slate-700 flex gap-4'>
            <div className='font-bold text-xs'>
              {propertyDetails.bedrooms > 1
                ? `${propertyDetails.bedrooms} beds `
                : `${propertyDetails.bedrooms} bed `}
            </div>
            <div className='font-bold text-xs'>
              {propertyDetails.bathrooms > 1
                ? `${propertyDetails.bathrooms} baths `
                : `${propertyDetails.bathrooms} bath `}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
