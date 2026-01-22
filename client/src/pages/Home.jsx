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
        <div className='max-w-7xl mx-auto pt-16 pb-12 px-6 sm:pt-24 sm:pb-20 lg:pt-32'>
          <div className='flex flex-col items-start text-left max-w-2xl'>
            <h1 className='text-5xl font-bold tracking-tight text-gray-900 sm:text-6xl mb-6 leading-[1.1]'>
              Discover a place you'll love to live.
            </h1>
            <p className='text-xl text-gray-500 leading-relaxed mb-8'>
              The largest marketplace for homes in Ethiopia. 
              Search properties for sale and rent with trusted listings.
            </p>
            <div className='flex flex-col sm:flex-row gap-4'>
              <Link to='/search' className='inline-flex items-center justify-center bg-blue-600 text-white px-8 py-3.5 rounded-md font-semibold text-base hover:bg-blue-700 transition-all shadow-sm active:scale-95'>
                Search properties
              </Link>
              <Link to='/about' className='inline-flex items-center justify-center bg-white text-gray-700 border border-gray-300 px-8 py-3.5 rounded-md font-semibold text-base hover:bg-gray-50 transition-all active:scale-95'>
                How it works
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Slider */}
      <div className='max-w-7xl mx-auto px-6 mb-24'>
        <div className='rounded-xl overflow-hidden shadow-sm border border-gray-100 bg-gray-50'>
            <Swiper 
                navigation 
                pagination={{ clickable: true }}
                autoplay={{ delay: 5000 }}
                className='h-[350px] sm:h-[500px]'
            >
                {saleListings && saleListings.length > 0 && saleListings.map((listing) => (
                <SwiperSlide key={listing._id}>
                    <div 
                        style={{background:`linear-gradient(rgba(0,0,0,0.1), rgba(0,0,0,0.5)), url(${listing.imageUrls[0]}) center no-repeat`, backgroundSize: 'cover'}} 
                        className='h-full relative flex items-end p-8 sm:p-12'
                    >
                        <div className='max-w-lg'>
                            <h2 className='text-white text-2xl sm:text-4xl font-bold mb-2'>{listing.name}</h2>
                            <p className='text-white/90 text-sm sm:text-lg line-clamp-1 mb-6'>{listing.address}</p>
                            <Link to={`/listing/${listing._id}`} className='inline-block bg-white text-gray-900 px-6 py-2.5 rounded-md text-sm font-semibold hover:bg-gray-100 transition-all'>
                                View listing
                            </Link>
                        </div>
                    </div>
                </SwiperSlide>)
                )}
            </Swiper>
        </div>
      </div>

      {/* Sections */}
      <div className='max-w-7xl mx-auto px-6 flex flex-col gap-24 pb-24'>
        {offerListings && offerListings.length > 0 && (
          <div>
            <div className="flex items-end justify-between mb-8 border-b border-gray-100 pb-4">
              <div className='space-y-1'>
                <h2 className='text-2xl font-bold text-gray-900'>Latest offers</h2>
                <p className='text-gray-500 text-sm'>Recently discounted properties for you</p>
              </div>
              <Link className='text-blue-600 text-sm font-semibold hover:underline flex items-center gap-1 transition-colors' to={'/search?offer=true'}>
                See all offers
                <HiArrowRight className='w-4 h-4' />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {offerListings.map((listing) => 
                <ListingItem listing={listing} key={listing._id}/>
              )}
            </div>
          </div>
        )}

        {rentListings && rentListings.length > 0 && (
          <div>
            <div className="flex items-end justify-between mb-8 border-b border-gray-100 pb-4">
              <div className='space-y-1'>
                <h2 className='text-2xl font-bold text-gray-900'>Homes for rent</h2>
                <p className='text-gray-500 text-sm'>Explore the best rental properties</p>
              </div>
              <Link className='text-blue-600 text-sm font-semibold hover:underline flex items-center gap-1 transition-colors' to={'/search?type=rent'}>
                Explore rentals
                <HiArrowRight className='w-4 h-4' />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {rentListings.map((listing) => 
                <ListingItem listing={listing} key={listing._id}/>
              )}
            </div>
          </div>
        )}

        {saleListings && saleListings.length > 0 && (
          <div>
            <div className="flex items-end justify-between mb-8 border-b border-gray-100 pb-4">
              <div className='space-y-1'>
                <h2 className='text-2xl font-bold text-gray-900'>Homes for sale</h2>
                <p className='text-gray-500 text-sm'>Find your forever home</p>
              </div>
              <Link className='text-blue-600 text-sm font-semibold hover:underline flex items-center gap-1 transition-colors' to={'/search?type=sale'}>
                View all sales
                <HiArrowRight className='w-4 h-4' />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
