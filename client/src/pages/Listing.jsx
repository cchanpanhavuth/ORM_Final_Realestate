import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore from 'swiper';
import { Navigation } from 'swiper/modules';
import { useSelector } from 'react-redux';
import 'swiper/css/bundle';
import {
  FaBath,
  FaBed,
  FaChair,
  FaMapMarkerAlt,
  FaParking,
  FaShare,
} from 'react-icons/fa';

import Contact from '../components/Contact';

export default function Listing() {
  SwiperCore.use([Navigation]);
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [copied, setCopied] = useState(false);
  const params = useParams();
  const [contact, setContact] = useState(false);
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/listing/getListing/${params.propertyId}`);
        const data = await res.json();

        if (!res.ok || data.success === false) {
          setError(data.message || 'Failed to fetch the listing');
          setProperty(null); // Reset property state in case of error
          return;
        }

        // Assuming the backend returns both property and listing in a combined object
        setProperty({
          ...data,    // Spread property fields
          ...data.listing,     // Spread listing fields
          imageUrl: data.imageUrl || [], // Ensure imageUrl is an array
        });
        setError(false);
      } catch (err) {
        console.error('Error fetching property:', err); // Log the error
        setError('Something went wrong. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchListing();
  }, [params.propertyId]);


  return (
    <main>
      {loading && <p className="text-center my-7 text-2xl">Loading...</p>}
      {error && (
        <p className="text-center my-7 text-2xl">Something went wrong!</p>
      )}
      {property && !loading && !error && (
        <div>
          <Swiper navigation>
            {property.imageUrl.map((url) => (
              <SwiperSlide key={url}>
                <div
                  className="h-[550px]"
                  style={{
                    background: `url(${url}) center no-repeat`,
                    backgroundSize: 'cover',
                  }}
                ></div>
              </SwiperSlide>
            ))}
          </Swiper>
          <div className='fixed top-[13%] right-[3%] z-10 border rounded-full w-12 h-12 flex justify-center items-center bg-slate-100 cursor-pointer'>
            <FaShare
              className='text-slate-500'
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                setCopied(true);
                setTimeout(() => {
                  setCopied(false);
                }, 2000);
              }}
            />
          </div>
          {copied && (
            <p className='fixed top-[23%] right-[5%] z-10 rounded-md bg-slate-100 p-2'>
              Link copied!
            </p>
          )}
          <div className='flex flex-col max-w-4xl mx-auto p-3 my-7 gap-4'>
            <p className='text-2xl font-semibold'>
              {property.name} - ${' '}
              {property.offer && property.discountPrice !== undefined
                ? property.discountPrice.toLocaleString('en-US')
                : property.regularPrice !== undefined
                  ? property.regularPrice.toLocaleString('en-US')
                  : 'Price not available'}
              {property.type === 'rent' && ' / month'}
            </p>
            <p className='flex items-center mt-6 gap-2 text-slate-600  text-sm'>
              <FaMapMarkerAlt className='text-green-700' />
              {property.address}
            </p>
            <div className='flex gap-4'>
              <p className='bg-red-900 w-full max-w-[200px] text-white text-center p-1 rounded-md'>
                {property.type === 'rent' ? 'For Rent' : 'For Sale'}
              </p>
              {property.offer && (
                <p className='bg-green-900 w-full max-w-[200px] text-white text-center p-1 rounded-md'>
                  ${+property.regularPrice - +property.discountPrice} OFF
                </p>
              )}
            </div>
            <p className='text-slate-800'>
              <span className='font-semibold text-black'>Description - </span>
              {property.description}
            </p>
            <ul className='text-green-900 font-semibold text-sm flex flex-wrap items-center gap-4 sm:gap-6'>
              <li className='flex items-center gap-1 whitespace-nowrap '>
                <FaBed className='text-lg' />
                {property.bedrooms > 1
                  ? `${property.bedrooms} beds `
                  : `${property.bedrooms} bed `}
              </li>
              <li className='flex items-center gap-1 whitespace-nowrap '>
                <FaBath className='text-lg' />
                {property.bathrooms > 1
                  ? `${property.bathrooms} baths `
                  : `${property.bathrooms} bath `}
              </li>
              <li className='flex items-center gap-1 whitespace-nowrap '>
                <FaParking className='text-lg' />
                {property.parking ? 'Parking spot' : 'No Parking'}
              </li>
              <li className='flex items-center gap-1 whitespace-nowrap '>
                <FaChair className='text-lg' />
                {property.furnished ? 'Furnished' : 'Unfurnished'}
              </li>
            </ul>
            {currentUser && property.userId !== currentUser.id && !contact && (
              <button
                onClick={() => setContact(true)}
                className='bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 p-3'
              >
                Contact landlord
              </button>
            )}
            {contact && <Contact property={property} />}
          </div>
        </div>
      )}
    </main>
  );
}
