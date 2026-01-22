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
        const res = await fetch('/api/listing/get?offer=true&limit=4')
        const data = await res.json()
        setOfferListings(data)
        fetchRentListings()
      } catch (error) {
        console.log(error)
      }
    }
    const fetchRentListings = async () => {
      try {
        const res = await fetch('/api/listing/get?type=rent&limit=4')
        const data = await res.json()
        setRentListings(data)
        fetchSaleListings()
      } catch (error) {
        console.log(error)
      }
    }
    const fetchSaleListings = async () => {
      try {
        const res = await fetch('/api/listing/get?type=sale&limit=4')
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
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20'>
        <div className='max-w-3xl'>
          <h1 className='text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#1A1D1F] mb-6'>
            Find a home that <br /> <span className='text-[#0059E1]'>truly fits</span> your life
          </h1>
          <p className='text-lg text-[#64748B] mb-8 max-w-xl'>
            Browse the most accurate listings, get detailed property info, and connect with verified agents in Ethiopia.
          </p>
          <div className='flex items-center gap-4'>
            <Link to='/search' className='bg-[#0059E1] text-white px-8 py-3 rounded font-bold hover:bg-[#0047B3] transition-colors'>
              Search Properties
            </Link>
            <Link to='/about' className='text-[#4B5563] font-bold hover:text-[#0059E1] px-4 py-3 transition-colors'>
              How it works
            </Link>
          </div>
        </div>
      </div>

      {/* Featured Slider - Simplified */}
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20'>
        <div className='rounded-lg overflow-hidden border border-[#E5E7EB]'>
            <Swiper 
                navigation 
                pagination={{ clickable: true }}
                autoplay={{ delay: 6000 }}
                className='h-[350px] sm:h-[500px]'
            >
                {saleListings && saleListings.length > 0 && saleListings.map((listing) => (
                <SwiperSlide key={listing._id}>
                    <div 
                        style={{background:`linear-gradient(to top, rgba(0,0,0,0.6), transparent), url(${listing.imageUrls[0]}) center no-repeat`, backgroundSize: 'cover'}} 
                        className='h-full relative flex items-end p-8'
                    >
                        <div className='max-w-lg'>
                            <h2 className='text-white text-2xl font-bold mb-1'>{listing.name}</h2>
                            <p className='text-white/90 text-sm mb-4'>{listing.address}</p>
                            <Link to={`/listing/${listing._id}`} className='inline-block bg-white text-[#1A1D1F] px-5 py-2 rounded text-xs font-bold hover:bg-[#F3F4F6] transition-colors uppercase tracking-wider'>
                                View Listing
                            </Link>
                        </div>
                    </div>
                </SwiperSlide>)
                )}
            </Swiper>
        </div>
      </div>

      {/* Listings Groups */}
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 space-y-24'>
        {offerListings && offerListings.length > 0 && (
          <section>
            <div className="flex items-end justify-between mb-8">
              <div>
                <h2 className='text-2xl font-bold text-[#1A1D1F] mb-1'>Newest Offers</h2>
                <p className='text-sm text-[#64748B] font-medium'>Properties with recent price adjustments</p>
              </div>
              <Link className='text-[#0059E1] text-sm font-bold hover:underline' to={'/search?offer=true'}>
                Browse all offers
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {offerListings.map((listing) => 
                <ListingItem listing={listing} key={listing._id}/>
              )}
            </div>
          </section>
        )}

        {rentListings && rentListings.length > 0 && (
          <section>
            <div className="flex items-end justify-between mb-8">
              <div>
                <h2 className='text-2xl font-bold text-[#1A1D1F] mb-1'>Recent Rentals</h2>
                <p className='text-sm text-[#64748B] font-medium'>Available apartments and houses for rent</p>
              </div>
              <Link className='text-[#0059E1] text-sm font-bold hover:underline' to={'/search?type=rent'}>
                Browse all rentals
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {rentListings.map((listing) => 
                <ListingItem listing={listing} key={listing._id}/>
              )}
            </div>
          </section>
        )}

        {saleListings && saleListings.length > 0 && (
          <section>
            <div className="flex items-end justify-between mb-8">
              <div>
                <h2 className='text-2xl font-bold text-[#1A1D1F] mb-1'>Properties for Sale</h2>
                <p className='text-sm text-[#64748B] font-medium'>Investment opportunities and family homes</p>
              </div>
              <Link className='text-[#0059E1] text-sm font-bold hover:underline' to={'/search?type=sale'}>
                Browse all for sale
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {saleListings.map((listing) => 
                <ListingItem listing={listing} key={listing._id}/>
              )}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
