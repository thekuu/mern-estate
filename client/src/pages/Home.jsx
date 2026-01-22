import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {Swiper, SwiperSlide} from 'swiper/react'
import 'swiper/css/bundle'
import SwiperCore from 'swiper'
import {Navigation, Pagination, Autoplay} from 'swiper/modules'
import ListingItem from '../components/ListingItem'
import { HiArrowRight } from 'react-icons/hi'

export default function Home() {
  const [offerListings, setOfferListings] = useState([])
  const [saleListings, setSaleListings] = useState([])
  const [rentListings, setRentListings] = useState([])
  SwiperCore.use([Navigation, Pagination, Autoplay]) 

  useEffect (() => {
    const fetchOfferListings = async () => {
      try {
        const res = await fetch('/api/listing/get?offer=true')
        const data = await res.json()
        setOfferListings(data)
        fetchRentListings()
      } catch (error) {
        console.log(error)
      }
    }
    const fetchRentListings = async () => {
      try {
        const res = await fetch('/api/listing/get?type=rent')
        const data = await res.json()
        setRentListings(data)
        fetchSaleListings()
      } catch (error) {
        console.log(error)
      }
    }
    const fetchSaleListings = async () => {
      try {
        const res = await fetch('/api/listing/get?type=sale')
        const data = await res.json()
        setSaleListings(data) 
      } catch (error) {
        console.log(error)
      }
    }
    fetchOfferListings()
  }, [])

  return (
    <div className='hero-gradient min-h-screen'>
      {/* Hero Section */}
      <div className='relative overflow-hidden'>
        <div className='max-w-7xl mx-auto pt-20 pb-16 px-4 sm:pt-32 sm:pb-24 lg:pt-40'>
          <div className='flex flex-col items-center text-center space-y-8'>
            <div className='inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-xs font-bold uppercase tracking-wider animate-fade-in'>
                <span className='relative flex h-2 w-2'>
                    <span className='animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75'></span>
                    <span className='relative inline-flex rounded-full h-2 w-2 bg-indigo-600'></span>
                </span>
                Find your dream home today
            </div>
            <h1 className='max-w-4xl text-4xl font-extrabold tracking-tight text-slate-900 sm:text-6xl lg:text-7xl'>
              Find your next <span className='text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-indigo-400'>perfect</span><br /> place with ease
            </h1>
            <p className='max-w-2xl text-lg text-slate-600 leading-relaxed'>
              Homi Estate is the best place to find your next perfect place to live. 
              We have a wide range of properties tailored specifically for your needs.
            </p>
            <div className='flex flex-col sm:flex-row gap-4 pt-4'>
              <Link to='/search' className='group inline-flex items-center justify-center bg-indigo-600 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 active:scale-95'>
                Start Searching
                <HiArrowRight className='ml-2 group-hover:translate-x-1 transition-transform' />
              </Link>
              <Link to='/about' className='inline-flex items-center justify-center bg-white text-slate-700 border border-slate-200 px-8 py-4 rounded-full font-bold text-lg hover:bg-slate-50 transition-all active:scale-95'>
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Slider */}
      <div className='max-w-7xl mx-auto px-4 mb-20'>
        <div className='rounded-3xl overflow-hidden shadow-2xl shadow-slate-200 border-4 border-white'>
            <Swiper 
                navigation 
                pagination={{ clickable: true }}
                autoplay={{ delay: 5000 }}
                className='h-[400px] sm:h-[600px]'
            >
                {saleListings && saleListings.length > 0 && saleListings.map((listing) => (
                <SwiperSlide key={listing._id}>
                    <div 
                        style={{background:`linear-gradient(to bottom, transparent, rgba(0,0,0,0.4)), url(${listing.imageUrls[0]}) center no-repeat`, backgroundSize: 'cover'}} 
                        className='h-full relative flex items-end p-8 sm:p-16'
                    >
                        <div className='bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-2xl max-w-lg'>
                            <h2 className='text-white text-2xl sm:text-3xl font-bold mb-2'>{listing.name}</h2>
                            <p className='text-white/90 text-sm sm:text-base line-clamp-1 mb-4'>{listing.address}</p>
                            <Link to={`/listing/${listing._id}`} className='inline-block bg-white text-slate-900 px-6 py-2 rounded-full text-sm font-bold hover:bg-indigo-600 hover:text-white transition-all'>
                                View Details
                            </Link>
                        </div>
                    </div>
                </SwiperSlide>)
                )}
            </Swiper>
        </div>
      </div>

      {/* Sections */}
      <div className='max-w-7xl mx-auto p-4 flex flex-col gap-20 pb-20'>
        {offerListings && offerListings.length > 0 && (
          <div>
            <div className="flex items-end justify-between mb-8">
              <div className='space-y-1'>
                <h2 className='text-3xl font-bold text-slate-900'>Exclusive Offers</h2>
                <p className='text-slate-500 font-medium'>Special prices on selected properties</p>
              </div>
              <Link className='text-indigo-600 font-bold hover:text-indigo-700 flex items-center gap-1 transition-colors' to={'/search?offer=true'}>
                View all
                <HiArrowRight />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {offerListings.map((listing) => 
                <ListingItem listing={listing} key={listing._id}/>
              )}
            </div>
          </div>
        )}

        {rentListings && rentListings.length > 0 && (
          <div>
            <div className="flex items-end justify-between mb-8">
              <div className='space-y-1'>
                <h2 className='text-3xl font-bold text-slate-900'>Premium Rentals</h2>
                <p className='text-slate-500 font-medium'>Find your perfect stay</p>
              </div>
              <Link className='text-indigo-600 font-bold hover:text-indigo-700 flex items-center gap-1 transition-colors' to={'/search?type=rent'}>
                View all
                <HiArrowRight />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {rentListings.map((listing) => 
                <ListingItem listing={listing} key={listing._id}/>
              )}
            </div>
          </div>
        )}

        {saleListings && saleListings.length > 0 && (
          <div>
            <div className="flex items-end justify-between mb-8">
              <div className='space-y-1'>
                <h2 className='text-3xl font-bold text-slate-900'>Properties for Sale</h2>
                <p className='text-slate-500 font-medium'>Invest in your future home</p>
              </div>
              <Link className='text-indigo-600 font-bold hover:text-indigo-700 flex items-center gap-1 transition-colors' to={'/search?type=sale'}>
                View all
                <HiArrowRight />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {saleListings.map((listing) => 
                <ListingItem listing={listing} key={listing._id}/>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
