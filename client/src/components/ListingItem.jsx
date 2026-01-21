import React from 'react'
import { Link } from 'react-router-dom'
import {HiLocationMarker} from 'react-icons/hi'
import {FaBed, FaBath} from 'react-icons/fa'

export default function ListingItem({listing}) {
  return (
    <div className='group bg-white border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden rounded-2xl w-full sm:w-[320px]'>
      <Link to={`/listing/${listing._id}`}>
        <div className='relative overflow-hidden aspect-[4/3]'>
            <img src={listing.imageUrls[0]} alt="listing cover" className='h-full w-full object-cover group-hover:scale-110 transition-transform duration-700'/>
            <div className='absolute top-3 left-3 flex gap-2'>
                {listing.offer && (
                    <span className='bg-amber-500 text-white text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider shadow-sm'>Offer</span>
                )}
                <span className='bg-indigo-600/90 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider shadow-sm'>
                    {listing.type === 'rent' ? 'For Rent' : 'For Sale'}
                </span>
            </div>
        </div>
        <div className='p-5 flex flex-col gap-3 w-full'>
            <div className='flex flex-col gap-1'>
                <h3 className='truncate text-lg font-bold text-slate-800 group-hover:text-indigo-600 transition-colors'>{listing.name}</h3>
                <div className='flex items-center gap-1'>
                    <HiLocationMarker className='h-4 w-4 text-slate-400'/>
                    <p className='text-xs text-slate-500 truncate w-full font-medium'>{listing.address}</p>
                </div>
            </div>
            
            <p className='text-sm text-slate-600 line-clamp-2 leading-relaxed h-10'>{listing.description}</p>
            
            <div className='flex items-center justify-between mt-2 pt-4 border-t border-slate-50'>
                <div className='flex items-center gap-3 text-slate-500'>
                    <div className='flex items-center gap-1 text-xs font-semibold'>
                        <FaBed className='text-indigo-400'/>
                        <span>{listing.bedrooms}</span>
                    </div>
                    <div className='flex items-center gap-1 text-xs font-semibold'>
                        <FaBath className='text-indigo-400'/>
                        <span>{listing.bathrooms}</span>
                    </div>
                </div>
                <p className='text-indigo-600 font-bold text-lg'>
                    {listing.offer ? listing.discountPrice.toLocaleString('en-US') : listing.regularPrice.toLocaleString('en-US')}
                    <span className='text-[10px] font-bold ml-1 uppercase'>ETB</span>
                    {listing.type === 'rent' && <span className='text-xs font-medium text-slate-400'>/mo</span>}
                </p>
            </div>
        </div>
      </Link>
    </div>
  )
}


