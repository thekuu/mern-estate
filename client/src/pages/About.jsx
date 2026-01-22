import React from 'react'

export default function About() {
  return (
    <div className='bg-white min-h-screen'>
      <div className='py-16 px-6 max-w-3xl mx-auto'>
        <div className='space-y-12'>
          <div className='space-y-4'>
            <h1 className='text-4xl font-bold text-gray-900 leading-tight'>
              We're changing the way Ethiopians find home.
            </h1>
            <p className='text-lg text-gray-600 leading-relaxed'>
              Homi Estate is the leading real estate marketplace in Ethiopia, 
              connecting thousands of buyers, sellers, and renters every day.
            </p>
          </div>

          <div className='prose prose-gray max-w-none text-gray-600 space-y-6'>
            <p>
              Founded with the goal of bringing transparency and ease to the real estate journey, 
              we've built a platform that combines local expertise with professional technology. 
              Our marketplace features verified listings from trusted partners across the country.
            </p>
            <p>
              Whether you're looking for a modern apartment in Bole or a family home in the suburbs, 
              our team of experienced professionals is dedicated to helping you make informed decisions. 
              We believe that finding a home should be a straightforward, empowering experience.
            </p>
          </div>
          
          <div className='grid grid-cols-1 sm:grid-cols-3 gap-8 pt-12 border-t border-gray-100'>
            <div className='space-y-1'>
                <div className='text-2xl font-bold text-gray-900'>10+</div>
                <div className='text-xs font-semibold text-gray-400 uppercase tracking-wider'>Years in market</div>
            </div>
            <div className='space-y-1'>
                <div className='text-2xl font-bold text-gray-900'>5,000+</div>
                <div className='text-xs font-semibold text-gray-400 uppercase tracking-wider'>Trust listings</div>
            </div>
            <div className='space-y-1'>
                <div className='text-2xl font-bold text-gray-900'>99%</div>
                <div className='text-xs font-semibold text-gray-400 uppercase tracking-wider'>User satisfaction</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}