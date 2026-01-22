import React from 'react'
import { Link } from 'react-router-dom'
import {HiLocationMarker} from 'react-icons/hi'
import {FaBed, FaBath} from 'react-icons/fa'

export default function ListingItem({listing}) {
  return (
    <div className='group bg-white border border-gray-200 hover:border-gray-300 transition-all duration-300 overflow-hidden rounded-lg w-full'>
      <Link to={`/listing/${listing._id}`}>
        <div className='relative aspect-[16/10] overflow-hidden bg-gray-100'>
            <img src={listing.imageUrls[0]} alt="listing cover" className='h-full w-full object-cover group-hover:scale-105 transition-transform duration-500'/>
            <div className='absolute top-2.5 left-2.5 flex gap-1.5'>
                {listing.offer && (
                    <span className='bg-orange-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-tight shadow-sm'>Offer</span>
                )}
                <span className='bg-gray-900/90 text-white text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-tight shadow-sm'>
                    {listing.type === 'rent' ? 'For Rent' : 'For Sale'}
                </span>
            </div>
        </div>
        <div className='p-4 flex flex-col gap-2 w-full'>
            <div className='flex flex-col gap-0.5'>
                <h3 className='truncate text-base font-semibold text-gray-900'>{listing.name}</h3>
                <div className='flex items-center gap-1'>
                    <HiLocationMarker className='h-3.5 w-3.5 text-gray-400'/>
                    <p className='text-xs text-gray-500 truncate w-full'>{listing.address}</p>
                </div>
            </div>
            
            <p className='text-xs text-gray-600 line-clamp-2 leading-snug h-8'>{listing.description}</p>
            
            <div className='flex items-center justify-between mt-1 pt-3 border-t border-gray-50'>
                <div className='flex items-center gap-2.5 text-gray-500'>
                    <div className='flex items-center gap-1 text-[11px] font-medium'>
                        <FaBed className='text-gray-400'/>
                        <span>{listing.bedrooms}</span>
                    </div>
                    <div className='flex items-center gap-1 text-[11px] font-medium'>
                        <FaBath className='text-gray-400'/>
                        <span>{listing.bathrooms}</span>
                    </div>
                </div>
                <p className='text-gray-900 font-bold text-base'>
                    {listing.offer ? listing.discountPrice.toLocaleString('en-US') : listing.regularPrice.toLocaleString('en-US')}
                    <span className='text-[10px] font-semibold ml-0.5'>ETB</span>
                    {listing.type === 'rent' && <span className='text-[10px] text-gray-400 font-normal'>/mo</span>}
                </p>
            </div>
        </div>
      </Link>
    </div>
  )
}


