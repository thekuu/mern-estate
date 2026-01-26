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
    <div className='bg-white min-h-screen'>
      {/* Hero Section */}
      <div className='relative'>
        <div className='max-w-7xl mx-auto pt-12 pb-12 px-6 sm:pt-20 sm:pb-16 lg:pt-32'>
          <div className='flex flex-col items-center text-center max-w-4xl mx-auto'>
            <h1 className='text-5xl sm:text-7xl lg:text-8xl font-bold tracking-tight text-gray-900 mb-8 leading-[1]'>
              A <span className='italic font-display text-gray-400'>Portfolio</span> Real Estate Case Study.
            </h1>
            <p className='text-lg sm:text-xl text-gray-500 leading-relaxed mb-12 max-w-2xl'>
              This is a full-stack technical demonstration showcasing MERN development, 
              Redux state management, and modern architectural patterns.
            </p>
            <div className='flex flex-col sm:flex-row gap-6'>
              <Link to='/search' className='btn-primary'>
                Explore Collection
              </Link>
              <Link to='/about' className='inline-flex items-center justify-center bg-white text-gray-900 border border-gray-200 px-8 py-3 rounded-sm font-medium text-sm hover:bg-gray-50 transition-all'>
                Our Story
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Slider */}
      <div className='max-w-7xl mx-auto px-6 mb-32'>
        <div className='rounded-sm overflow-hidden bg-gray-50'>
            <Swiper 
                pagination={{ clickable: true }}
                autoplay={{ delay: 6000 }}
                className='h-[400px] sm:h-[600px]'
            >
                {saleListings && saleListings.length > 0 && saleListings.map((listing) => (
                <SwiperSlide key={listing._id}>
                    <div 
                        style={{background:`linear-gradient(rgba(0,0,0,0.05), rgba(0,0,0,0.4)), url(${listing.imageUrls[0]}) center no-repeat`, backgroundSize: 'cover'}} 
                        className='h-full relative flex items-end p-8 sm:p-16'
                    >
                        <div className='max-w-xl'>
                            <h2 className='text-white text-3xl sm:text-5xl font-bold mb-4 leading-tight'>{listing.name}</h2>
                            <p className='text-white/90 text-sm sm:text-lg mb-8 font-medium tracking-wide uppercase opacity-80'>{listing.address}</p>
                            <Link to={`/listing/${listing._id}`} className='inline-block bg-white text-gray-900 px-8 py-3 rounded-sm text-xs font-bold uppercase tracking-widest hover:bg-gray-100 transition-all'>
                                View Residence
                            </Link>
                        </div>
                    </div>
                </SwiperSlide>)
                )}
            </Swiper>
        </div>
      </div>

      {/* Sections */}
      <div className='max-w-7xl mx-auto px-6 flex flex-col gap-32 pb-32'>
        {offerListings && offerListings.length > 0 && (
          <div>
            <div className="flex items-baseline justify-between mb-12 border-b border-gray-100 pb-6">
              <div>
                <h2 className='text-3xl font-bold text-gray-900 mb-2'>Private Collections</h2>
                <p className='text-gray-400 text-sm uppercase tracking-widest font-medium'>Exclusive opportunities</p>
              </div>
              <Link className='text-gray-900 text-xs font-bold uppercase tracking-widest border-b border-gray-900 pb-1 hover:text-gray-500 hover:border-gray-500 transition-all' to={'/search?offer=true'}>
                View All
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
              {offerListings.map((listing) => 
                <ListingItem listing={listing} key={listing._id}/>
              )}
            </div>
          </div>
        )}

        {rentListings && rentListings.length > 0 && (
          <div>
            <div className="flex items-baseline justify-between mb-12 border-b border-gray-100 pb-6">
              <div>
                <h2 className='text-3xl font-bold text-gray-900 mb-2'>Exceptional Rentals</h2>
                <p className='text-gray-400 text-sm uppercase tracking-widest font-medium'>Temporary sanctuaries</p>
              </div>
              <Link className='text-gray-900 text-xs font-bold uppercase tracking-widest border-b border-gray-900 pb-1 hover:text-gray-500 hover:border-gray-500 transition-all' to={'/search?type=rent'}>
                Explore
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
              {rentListings.map((listing) => 
                <ListingItem listing={listing} key={listing._id}/>
              )}
            </div>
          </div>
        )}

        {saleListings && saleListings.length > 0 && (
          <div>
            <div className="flex items-baseline justify-between mb-12 border-b border-gray-100 pb-6">
              <div>
                <h2 className='text-3xl font-bold text-gray-900 mb-2'>For Purchase</h2>
                <p className='text-gray-400 text-sm uppercase tracking-widest font-medium'>Invest in your future</p>
              </div>
              <Link className='text-gray-900 text-xs font-bold uppercase tracking-widest border-b border-gray-900 pb-1 hover:text-gray-500 hover:border-gray-500 transition-all' to={'/search?type=sale'}>
                View Selection
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
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
