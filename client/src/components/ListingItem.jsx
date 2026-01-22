import React from 'react'
import { Link } from 'react-router-dom'
import { HiLocationMarker } from 'react-icons/hi'

export default function ListingItem({listing}) {
  return (
    <div className='bg-white border border-[#DDE1E6] rounded overflow-hidden shadow-sm hover:shadow-md transition-shadow w-full'>
      <Link to={`/listing/${listing._id}`}>
        <div className='relative aspect-[16/10] overflow-hidden bg-[#F3F4F6]'>
            <img src={listing.imageUrls[0]} alt="listing cover" className='h-full w-full object-cover grayscale-[0.2] hover:grayscale-0 transition-all duration-300'/>
            <div className='absolute top-3 left-3'>
                {listing.offer && (
                    <span className='bg-[#B91C1C] text-white text-[10px] font-bold px-2 py-0.5 rounded-sm uppercase tracking-wider'>Offer</span>
                )}
            </div>
        </div>
        <div className='p-4 flex flex-col gap-2'>
            <div className='flex items-center justify-between'>
                <p className='text-lg font-bold text-[#111827]'>
                    {listing.type === 'rent' ? `${listing.regularPrice.toLocaleString('en-US')}/mo` : listing.regularPrice.toLocaleString('en-US')}
                    <span className='text-[10px] ml-1 font-bold text-[#6B7280]'>ETB</span>
                </p>
            </div>
            <h3 className='truncate text-sm font-bold text-[#374151]'>{listing.name}</h3>
            <div className='flex items-center gap-1.5 text-[#6B7280]'>
                <HiLocationMarker className='h-3.5 w-3.5 flex-shrink-0'/>
                <p className='text-xs truncate font-medium tracking-tight'>{listing.address}</p>
            </div>
            <div className='flex items-center gap-4 mt-2 text-[#4B5563] border-t border-[#F3F4F6] pt-3'>
                <p className='text-[11px] font-bold'>
                    {listing.bedrooms} <span className='text-[#9CA3AF] font-medium uppercase ml-0.5'>Beds</span>
                </p>
                <p className='text-[11px] font-bold'>
                    {listing.bathrooms} <span className='text-[#9CA3AF] font-medium uppercase ml-0.5'>Baths</span>
                </p>
                <div className='ml-auto px-2 py-0.5 bg-[#F3F4F6] rounded text-[9px] font-black uppercase text-[#6B7280] tracking-widest'>
                    {listing.type}
                </div>
            </div>
        </div>
      </Link>
    </div>
  )
}
