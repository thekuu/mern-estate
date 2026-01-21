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
    <main className='bg-slate-50 min-h-screen pb-20'>
        {loading && (
            <div className='flex flex-col items-center justify-center h-[60vh] gap-4'>
                <div className='w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin'></div>
                <p className='text-slate-500 font-medium'>Finding property details...</p>
            </div>
        )}
        {error && (
            <div className='flex flex-col items-center justify-center h-[60vh] gap-4'>
                <p className='text-slate-800 text-xl font-bold'>Something went wrong!</p>
                <button onClick={() => window.location.reload()} className='text-indigo-600 font-bold hover:underline'>Try again</button>
            </div>
        )}
        {listing && !loading && !error && (
            <>
                <div className='relative'>
                    <Swiper navigation pagination={{clickable: true}} autoplay={{delay: 5000}} className='h-[400px] sm:h-[600px]'>
                        {listing.imageUrls.map((url)=>(
                            <SwiperSlide key={url}>
                                <div className='h-full w-full' style={{background: `url(${url}) center no-repeat`, backgroundSize: 'cover'}}></div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                    
                    <div className='absolute top-6 right-6 z-10'>
                        <button 
                            className='w-12 h-12 flex justify-center items-center bg-white/80 backdrop-blur-md border border-white/20 rounded-full shadow-lg hover:bg-white transition-all active:scale-95 text-slate-600'
                            onClick={() => {
                                navigator.clipboard.writeText(window.location.href);
                                setCopied(true);
                                setTimeout(() => setCopied(false), 2000);
                            }}
                        >
                            <FaShare size={18} />
                        </button>
                        {copied && (
                            <div className='absolute top-14 right-0 mt-2 bg-slate-900 text-white text-xs px-3 py-2 rounded-lg shadow-xl whitespace-nowrap animate-bounce'>
                                Link copied to clipboard!
                            </div>
                        )}
                    </div>
                </div>

                <div className='max-w-5xl mx-auto px-4'>
                    <div className='-mt-20 relative z-20 bg-white rounded-3xl shadow-xl shadow-slate-200/50 p-6 sm:p-10 border border-slate-100'>
                        <div className='flex flex-col md:flex-row md:items-start justify-between gap-6'>
                            <div className='space-y-4 flex-1'>
                                <div className='flex flex-wrap gap-2'>
                                    <span className='px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-bold uppercase tracking-wider'>
                                        {listing.type === 'rent' ? 'For Rent' : 'For Sale'}
                                    </span>
                                    {listing.offer && (
                                        <span className='px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold uppercase tracking-wider'>
                                            {+listing.regularPrice - +listing.discountPrice} ETB Discount
                                        </span>
                                    )}
                                </div>
                                <h1 className='text-3xl sm:text-4xl font-extrabold text-slate-900 leading-tight'>
                                    {listing.name}
                                </h1>
                                <div className='flex items-center gap-2 text-slate-500 font-medium'>
                                    <FaMapMarkerAlt className='text-indigo-500' />
                                    <span>{listing.address}</span>
                                </div>
                            </div>
                            
                            <div className='bg-slate-50 p-6 rounded-2xl border border-slate-100 text-right min-w-[240px]'>
                                <p className='text-sm font-semibold text-slate-400 uppercase tracking-widest mb-1'>Price</p>
                                <p className='text-4xl font-black text-indigo-600'>
                                    {listing.offer ? listing.discountPrice.toLocaleString('en-US') : listing.regularPrice.toLocaleString('en-US')}
                                    <span className='text-sm ml-2'>ETB</span>
                                </p>
                                {listing.type === 'rent' && <p className='text-slate-500 font-medium mt-1'>per month</p>}
                            </div>
                        </div>

                        <div className='grid grid-cols-1 lg:grid-cols-3 gap-12 mt-12 pt-12 border-t border-slate-100'>
                            <div className='lg:col-span-2 space-y-10'>
                                <section>
                                    <h2 className='text-xl font-bold text-slate-900 mb-4'>Description</h2>
                                    <p className='text-slate-600 leading-relaxed whitespace-pre-line'>
                                        {listing.description}
                                    </p>
                                </section>

                                <section>
                                    <h2 className='text-xl font-bold text-slate-900 mb-6'>Property Highlights</h2>
                                    <div className='grid grid-cols-2 sm:grid-cols-4 gap-6'>
                                        <div className='bg-slate-50 p-4 rounded-xl border border-slate-100 flex flex-col items-center text-center gap-2 group hover:border-indigo-200 transition-colors'>
                                            <FaBed className='text-2xl text-indigo-500 group-hover:scale-110 transition-transform' />
                                            <span className='text-slate-900 font-bold'>{listing.bedrooms}</span>
                                            <span className='text-xs text-slate-400 font-medium uppercase'>Bedrooms</span>
                                        </div>
                                        <div className='bg-slate-50 p-4 rounded-xl border border-slate-100 flex flex-col items-center text-center gap-2 group hover:border-indigo-200 transition-colors'>
                                            <FaBath className='text-2xl text-indigo-500 group-hover:scale-110 transition-transform' />
                                            <span className='text-slate-900 font-bold'>{listing.bathrooms}</span>
                                            <span className='text-xs text-slate-400 font-medium uppercase'>Bathrooms</span>
                                        </div>
                                        <div className='bg-slate-50 p-4 rounded-xl border border-slate-100 flex flex-col items-center text-center gap-2 group hover:border-indigo-200 transition-colors'>
                                            <FaParking className='text-2xl text-indigo-500 group-hover:scale-110 transition-transform' />
                                            <span className='text-slate-900 font-bold'>{listing.parking ? 'Available' : 'None'}</span>
                                            <span className='text-xs text-slate-400 font-medium uppercase'>Parking</span>
                                        </div>
                                        <div className='bg-slate-50 p-4 rounded-xl border border-slate-100 flex flex-col items-center text-center gap-2 group hover:border-indigo-200 transition-colors'>
                                            <FaChair className='text-2xl text-indigo-500 group-hover:scale-110 transition-transform' />
                                            <span className='text-slate-900 font-bold'>{listing.furnished ? 'Yes' : 'No'}</span>
                                            <span className='text-xs text-slate-400 font-medium uppercase'>Furnished</span>
                                        </div>
                                    </div>
                                </section>
                            </div>

                            <div className='lg:col-span-1'>
                                <div className='sticky top-28 space-y-6'>
                                    {currentUser && listing.userRef !== currentUser._id && !contact && (
                                        <button
                                            onClick={() => setContact(true)}
                                            className='w-full bg-slate-900 text-white rounded-2xl font-bold uppercase py-5 hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 active:scale-95 text-lg tracking-wide'
                                        >
                                            Contact Landlord
                                        </button>
                                    )}
                                    {contact && (
                                        <div className='bg-slate-50 p-6 rounded-3xl border border-slate-200'>
                                            <Contact listing={listing} />
                                        </div>
                                    )}
                                    
                                    <div className='bg-indigo-600 rounded-3xl p-8 text-white space-y-4 shadow-xl shadow-indigo-100'>
                                        <h3 className='text-xl font-bold'>Safety Tips</h3>
                                        <ul className='text-sm text-indigo-100 space-y-3 list-disc pl-4 font-medium'>
                                            <li>Never pay in advance without seeing the property</li>
                                            <li>Always meet the landlord in a public place</li>
                                            <li>Verify property ownership documents</li>
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
