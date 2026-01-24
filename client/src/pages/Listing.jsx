import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
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
    <main className='bg-white min-h-screen'>
      {loading && (
        <div className='flex flex-col items-center justify-center min-h-[60vh] gap-4'>
            <div className='w-10 h-10 border border-gray-100 border-t-gray-900 rounded-full animate-spin'></div>
            <p className='text-gray-400 text-[10px] font-bold uppercase tracking-[0.3em]'>Acquiring Details...</p>
        </div>
      )}
      {error && (
        <div className='flex flex-col items-center justify-center min-h-[60vh] gap-6 text-center px-6'>
            <p className='text-4xl font-bold text-gray-900 font-display italic leading-tight'>Something went wrong.</p>
            <p className='text-gray-400 text-sm max-w-xs'>We were unable to retrieve the property details at this time.</p>
            <button onClick={() => window.location.reload()} className='text-gray-900 text-xs font-bold uppercase tracking-widest border-b border-gray-900 pb-1 hover:text-gray-500 hover:border-gray-500 transition-all'>Try again</button>
        </div>
      )}
      {listing && !loading && !error && (
        <div>
          <div className='relative group'>
            <Swiper pagination={{ clickable: true }} className='h-[500px] lg:h-[750px]'>
                {listing.imageUrls.map((url) => (
                <SwiperSlide key={url}>
                    <div
                    className='h-full w-full'
                    style={{
                        background: `linear-gradient(rgba(0,0,0,0), rgba(0,0,0,0.2)), url(${url}) center no-repeat`,
                        backgroundSize: 'cover',
                    }}
                    ></div>
                </SwiperSlide>
                ))}
            </Swiper>
            
            <div className='absolute top-8 right-8 z-10'>
                <button 
                    className='w-14 h-14 flex justify-center items-center bg-white/90 backdrop-blur-md border border-gray-100 rounded-full shadow-lg hover:bg-white transition-all active:scale-95 text-gray-900'
                    onClick={() => {
                        navigator.clipboard.writeText(window.location.href);
                        setCopied(true);
                        setTimeout(() => setCopied(false), 2000);
                    }}
                >
                    <FaShare size={18} />
                </button>
                {copied && (
                    <div className='absolute top-16 right-0 mt-3 bg-gray-900 text-white text-[10px] font-bold uppercase tracking-widest px-4 py-2 rounded-sm shadow-xl whitespace-nowrap animate-fade-in'>
                        Link Archived to Clipboard
                    </div>
                )}
            </div>
          </div>
          
          <div className='max-w-6xl mx-auto p-6 lg:p-16 my-16 lg:my-24'>
            <div className='flex flex-col lg:flex-row justify-between items-start gap-12 mb-16 border-b border-gray-100 pb-16'>
                <div className='flex-1 space-y-6'>
                    <div className='flex gap-4'>
                        {listing.offer && (
                            <span className='border border-gray-900 text-gray-900 text-[10px] font-bold px-4 py-1.5 rounded-sm uppercase tracking-[0.2em]'>
                                Private Collection
                            </span>
                        )}
                    </div>
                    <h1 className='text-5xl sm:text-7xl font-bold text-gray-900 leading-[1.1] tracking-tight'>
                        {listing.name}
                    </h1>
                    <div className='flex items-center gap-2.5 text-gray-400'>
                        <p className='text-sm uppercase tracking-[0.15em] font-medium'>{listing.address}</p>
                    </div>
                </div>
                
                <div className='lg:text-right min-w-[300px]'>
                    <div className='space-y-1 mb-6'>
                        <p className='text-gray-400 text-[10px] font-bold uppercase tracking-[0.3em]'>Financial Obligation</p>
                        <p className='text-5xl sm:text-6xl font-bold text-gray-900 tracking-tighter'>
                            {listing.offer ? listing.discountPrice.toLocaleString('en-US') : listing.regularPrice.toLocaleString('en-US')}
                            <span className='text-xs font-medium ml-3 text-gray-400 tracking-normal'>ETB</span>
                        </p>
                        {listing.type === 'rent' && <p className='text-gray-400 text-xs font-medium uppercase tracking-[0.2em] mt-2 italic'>Per Calendar Month</p>}
                    </div>
                    {listing.offer && (
                        <p className='text-gray-400 text-lg line-through font-medium italic opacity-60'>
                            ETB {listing.regularPrice.toLocaleString('en-US')}
                        </p>
                    )}
                </div>
            </div>

            <div className='grid grid-cols-1 lg:grid-cols-12 gap-20 lg:gap-32'>
                <div className='lg:col-span-8 space-y-20'>
                    <div className='space-y-8'>
                        <h2 className='text-xs font-bold text-gray-400 uppercase tracking-[0.3em]'>The Narrative</h2>
                        <p className='text-gray-600 leading-relaxed text-xl font-medium italic border-l-2 border-gray-100 pl-8'>
                            {listing.description}
                        </p>
                    </div>

                    <div className='space-y-8'>
                        <h2 className='text-xs font-bold text-gray-400 uppercase tracking-[0.3em]'>Specifications</h2>
                        <div className='grid grid-cols-2 sm:grid-cols-4 gap-12 py-12 border-y border-gray-50'>
                            {[
                                {icon: <FaBed/>, label: 'Bedrooms', value: listing.bedrooms},
                                {icon: <FaBath/>, label: 'Bathrooms', value: listing.bathrooms},
                                {icon: <FaParking/>, label: 'Parking', value: listing.parking ? 'Allocated' : 'None'},
                                {icon: <FaChair/>, label: 'Furnishing', value: listing.furnished ? 'Full' : 'None'}
                            ].map((item, i) => (
                                <div key={i} className='space-y-3'>
                                    <div className='text-gray-200 text-2xl'>{item.icon}</div>
                                    <div>
                                        <p className='text-sm font-bold text-gray-900 mb-1'>{item.value}</p>
                                        <p className='text-[10px] text-gray-400 uppercase tracking-[0.2em] font-black'>{item.label}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className='lg:col-span-4'>
                    <div className='sticky top-32 space-y-12'>
                        <div className='p-10 bg-gray-50 rounded-sm border border-gray-100'>
                            <h3 className='text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em] mb-10'>Consultancy</h3>
                            {currentUser && listing.userRef !== currentUser._id && !contact && (
                                <button
                                    onClick={() => setContact(true)}
                                    className='w-full btn-primary uppercase text-[10px] tracking-[0.3em] font-black h-16'
                                >
                                    Initiate Inquiry
                                </button>
                            )}
                            {!currentUser && (
                                <Link to='/sign-in' className='block w-full text-center py-5 text-gray-400 text-[10px] font-bold uppercase tracking-[0.2em] border border-gray-200 hover:text-gray-900 hover:border-gray-900 transition-all'>
                                    Authenticate to proceed
                                </Link>
                            )}
                            {contact && <Contact listing={listing} />}
                        </div>
                        
                        <div className='p-10 border border-gray-50'>
                            <h3 className='text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em] mb-6'>Safety Protocol</h3>
                            <ul className='text-[11px] text-gray-500 space-y-4 font-medium leading-relaxed italic'>
                                <li className='flex gap-3'><span className='text-gray-300'>•</span> Never transfer funds without physical verification.</li>
                                <li className='flex gap-3'><span className='text-gray-300'>•</span> All consultations should occur in public locales.</li>
                                <li className='flex gap-3'><span className='text-gray-300'>•</span> Verify all title documentation prior to commitment.</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
