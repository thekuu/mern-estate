import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import {Swiper, SwiperSlide} from 'swiper/react'
import SwiperCore from 'swiper'
import { useSelector } from 'react-redux'
import {Navigation, Pagination, Autoplay} from 'swiper/modules'
import 'swiper/css/bundle'
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
    const [listing, setListing] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState (false)
    const[copied, setCopied] = useState(false)
    const [contact, setContact] = useState(false)
    const params =  useParams()
    const {currentUser} = useSelector((state)=> state.user)
    SwiperCore.use([Navigation, Pagination, Autoplay]) 

    useEffect(()=> {
        const fetchListing = async () => {
            try {
                setLoading(true)
                const res = await fetch(`/api/listing/get/${params.listingId}`)
                const data = await res.json()
                if(data.success === false) {
                    setError(true)
                    setLoading(false)
                    return
                }
            setListing(data)
            setLoading(false)
            setError(false)
            } catch (error) {
               setError(true) 
               setLoading(false)
            }
        }
        fetchListing()
    }
    , [params.listingId])

  return (
    <main className='bg-[#F5F6F7] min-h-screen pb-20'>
        {loading && (
            <div className='flex flex-col items-center justify-center h-[60vh] gap-4'>
                <div className='w-12 h-12 border-2 border-[#DDE1E6] border-t-[#1E4E91] rounded-full animate-spin'></div>
                <p className='text-[#64748B] text-sm font-medium'>Loading property details...</p>
            </div>
        )}
        {listing && !loading && !error && (
            <>
                <div className='relative border-b border-[#DDE1E6]'>
                    <Swiper navigation pagination={{clickable: true}} autoplay={{delay: 5000}} className='h-[400px] sm:h-[600px]'>
                        {listing.imageUrls.map((url)=>(
                            <SwiperSlide key={url}>
                                <div className='h-full w-full grayscale-[0.1]' style={{background: `url(${url}) center no-repeat`, backgroundSize: 'cover'}}></div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>

                <div className='max-w-6xl mx-auto px-4'>
                    <div className='-mt-12 relative z-20 bg-white border border-[#DDE1E6] rounded shadow-sm p-6 sm:p-10 mb-8'>
                        <div className='flex flex-col md:flex-row md:items-start justify-between gap-8'>
                            <div className='space-y-4 flex-1'>
                                <div className='flex flex-wrap gap-2'>
                                    <span className='px-2 py-0.5 bg-[#F3F4F6] text-[#1E4E91] border border-[#DDE1E6] rounded text-[10px] font-bold uppercase tracking-wider'>
                                        {listing.type === 'rent' ? 'For Rent' : 'For Sale'}
                                    </span>
                                    {listing.offer && (
                                        <span className='px-2 py-0.5 bg-[#FEF2F2] text-[#B91C1C] border border-[#FEE2E2] rounded text-[10px] font-bold uppercase tracking-wider'>
                                            Special Offer
                                        </span>
                                    )}
                                </div>
                                <h1 className='text-3xl font-bold text-[#111827] leading-tight'>
                                    {listing.name}
                                </h1>
                                <div className='flex items-center gap-2 text-[#64748B] text-sm font-medium'>
                                    <FaMapMarkerAlt className='text-[#9CA3AF]' />
                                    <span>{listing.address}</span>
                                </div>
                            </div>
                            
                            <div className='text-right md:min-w-[200px]'>
                                <p className='text-3xl font-bold text-[#111827]'>
                                    {listing.offer ? listing.discountPrice.toLocaleString('en-US') : listing.regularPrice.toLocaleString('en-US')}
                                    <span className='text-xs ml-2 font-bold text-[#64748B]'>ETB</span>
                                </p>
                                {listing.type === 'rent' && <p className='text-[#64748B] text-xs font-bold uppercase mt-1'>per month</p>}
                            </div>
                        </div>

                        <div className='grid grid-cols-1 lg:grid-cols-3 gap-12 mt-12 pt-10 border-t border-[#F3F4F6]'>
                            <div className='lg:col-span-2 space-y-10'>
                                <section>
                                    <h2 className='text-sm font-bold text-[#111827] uppercase tracking-widest mb-4'>Description</h2>
                                    <p className='text-[#4B5563] text-sm leading-relaxed whitespace-pre-line'>
                                        {listing.description}
                                    </p>
                                </section>

                                <section>
                                    <h2 className='text-sm font-bold text-[#111827] uppercase tracking-widest mb-6'>Highlights</h2>
                                    <div className='grid grid-cols-2 sm:grid-cols-4 gap-4'>
                                        <div className='bg-[#F9FAFB] p-4 rounded border border-[#DDE1E6] flex flex-col items-center gap-1'>
                                            <span className='text-[#111827] font-bold'>{listing.bedrooms}</span>
                                            <span className='text-[9px] text-[#9CA3AF] font-bold uppercase'>Bedrooms</span>
                                        </div>
                                        <div className='bg-[#F9FAFB] p-4 rounded border border-[#DDE1E6] flex flex-col items-center gap-1'>
                                            <span className='text-[#111827] font-bold'>{listing.bathrooms}</span>
                                            <span className='text-[9px] text-[#9CA3AF] font-bold uppercase'>Bathrooms</span>
                                        </div>
                                        <div className='bg-[#F9FAFB] p-4 rounded border border-[#DDE1E6] flex flex-col items-center gap-1'>
                                            <span className='text-[#111827] font-bold'>{listing.parking ? 'Yes' : 'No'}</span>
                                            <span className='text-[9px] text-[#9CA3AF] font-bold uppercase'>Parking</span>
                                        </div>
                                        <div className='bg-[#F9FAFB] p-4 rounded border border-[#DDE1E6] flex flex-col items-center gap-1'>
                                            <span className='text-[#111827] font-bold'>{listing.furnished ? 'Yes' : 'No'}</span>
                                            <span className='text-[9px] text-[#9CA3AF] font-bold uppercase'>Furnished</span>
                                        </div>
                                    </div>
                                </section>
                            </div>

                            <div className='lg:col-span-1'>
                                <div className='sticky top-28 space-y-6'>
                                    {currentUser && listing.userRef !== currentUser._id && !contact && (
                                        <button
                                            onClick={() => setContact(true)}
                                            className='w-full bg-[#1E4E91] text-white rounded py-4 font-bold uppercase text-xs hover:bg-[#163B6F] transition-all'
                                        >
                                            Contact Agent
                                        </button>
                                    )}
                                    {contact && <Contact listing={listing} />}
                                    
                                    <div className='bg-white border border-[#DDE1E6] rounded p-6 space-y-4'>
                                        <h3 className='text-xs font-bold text-[#111827] uppercase tracking-widest'>Safety Reminder</h3>
                                        <ul className='text-xs text-[#64748B] space-y-2 list-disc pl-4'>
                                            <li>Inspect property before payment</li>
                                            <li>Verify ownership documents</li>
                                            <li>Meet in public places</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        )}
    </main>
  )
}
