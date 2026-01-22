import React from 'react'
import { Link } from 'react-router-dom'
import { HiLocationMarker } from 'react-icons/hi'

export default function ListingItem({listing}) {
  return (
    <div className='bg-white border border-[#E5E7EB] rounded overflow-hidden shadow-sm hover:shadow-md transition-shadow w-full'>
      <Link to={`/listing/${listing._id}`}>
        <div className='relative aspect-[16/10] overflow-hidden'>
            <img src={listing.imageUrls[0]} alt="listing cover" className='h-full w-full object-cover'/>
            <div className='absolute top-2 left-2'>
                {listing.offer && (
                    <span className='bg-[#E11D48] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-sm uppercase tracking-tight'>Offer</span>
                )}
            </div>
        </div>
        <div className='p-3 flex flex-col gap-1.5'>
            <div className='flex items-center justify-between'>
                <p className='text-lg font-bold text-[#1A1D1F]'>
                    {listing.type === 'rent' ? `${listing.regularPrice.toLocaleString('en-US')}/mo` : listing.regularPrice.toLocaleString('en-US')}
                    <span className='text-[10px] ml-1 font-semibold text-[#6B7280]'>ETB</span>
                </p>
            </div>
            <h3 className='truncate text-sm font-semibold text-[#1F2937]'>{listing.name}</h3>
            <div className='flex items-center gap-1 text-[#6B7280]'>
                <HiLocationMarker className='h-3.5 w-3.5 flex-shrink-0'/>
                <p className='text-xs truncate font-medium'>{listing.address}</p>
            </div>
            <div className='flex items-center gap-3 mt-1.5 text-[#4B5563] border-t border-[#F3F4F6] pt-2'>
                <p className='text-[11px] font-medium'>
                    <span className='font-bold'>{listing.bedrooms}</span> beds
                </p>
                <p className='text-[11px] font-medium'>
                    <span className='font-bold'>{listing.bathrooms}</span> baths
                </p>
                <p className='text-[11px] font-medium uppercase text-[#9CA3AF] ml-auto tracking-tighter'>
                    {listing.type}
                </p>
            </div>
        </div>
      </Link>
    </div>
  )
}
