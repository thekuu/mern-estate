import React from 'react'
import { Link } from 'react-router-dom'
import {FaBed, FaBath} from 'react-icons/fa'

export default function ListingItem({listing}) {
  return (
    <div className='premium-card rounded-sm w-full group'>
      <Link to={`/listing/${listing._id}`} className='block'>
        <div className='relative aspect-[3/2] overflow-hidden bg-gray-100'>
            <img src={listing.imageUrls[0]} alt="listing cover" className='h-full w-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out'/>
            <div className='absolute top-4 left-4 flex gap-2'>
            </div>
        </div>
        <div className='p-6 flex flex-col gap-4 w-full'>
            <div className='flex flex-col gap-1'>
                <h3 className='truncate text-xl font-bold text-gray-900 leading-tight group-hover:text-gray-600 transition-colors'>{listing.name}</h3>
                <p className='text-xs text-gray-400 truncate w-full uppercase tracking-wider font-medium'>{listing.address}</p>
            </div>
            
            <p className='text-sm text-gray-500 line-clamp-2 leading-relaxed h-10 italic'>{listing.description}</p>
            
            <div className='flex items-center justify-between mt-2 pt-6 border-t border-gray-50'>
                <div className='flex items-center gap-4 text-gray-400'>
                    <div className='flex items-center gap-1.5 text-xs font-medium'>
                        <FaBed className='text-gray-300'/>
                        <span>{listing.bedrooms} <span className='text-[10px] uppercase tracking-tighter opacity-60'>Beds</span></span>
                    </div>
                    <div className='flex items-center gap-1.5 text-xs font-medium'>
                        <FaBath className='text-gray-300'/>
                        <span>{listing.bathrooms} <span className='text-[10px] uppercase tracking-tighter opacity-60'>Baths</span></span>
                    </div>
                </div>
                <p className='text-gray-900 font-bold text-xl tracking-tight'>
                    {listing.offer ? listing.discountPrice.toLocaleString('en-US') : listing.regularPrice.toLocaleString('en-US')}
                    <span className='text-[10px] font-medium ml-1.5 text-gray-400'>ETB</span>
                    {listing.type === 'rent' && <span className='text-[10px] text-gray-400 font-normal italic'> / mo</span>}
                </p>
            </div>
        </div>
      </Link>
    </div>
  )
}


