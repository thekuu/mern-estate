import React from 'react'

export default function About() {
  return (
    <div className='bg-white min-h-screen'>
      <div className='py-20 px-6 max-w-4xl mx-auto'>
        <div className='space-y-16'>
          <div className='space-y-6'>
            <h2 className='text-xs font-bold text-gray-400 uppercase tracking-[0.3em]'>The Narrative</h2>
            <h1 className='text-5xl sm:text-7xl font-bold text-gray-900 leading-tight'>
              Redefining the <span className='italic font-display text-gray-400'>Standard</span> of Real Estate.
            </h1>
            <p className='text-xl text-gray-500 leading-relaxed max-w-2xl font-medium italic'>
              Homi Estate is a boutique consultancy dedicated to the most distinguished properties in Ethiopia.
            </p>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-16 text-gray-600 leading-relaxed font-medium'>
            <p>
              Founded on the principles of transparency and exceptional service, we've built a platform that marries local market expertise with world-class technology. Our collection features only the most refined listings, each hand-verified for quality and authenticity.
            </p>
            <p>
              Whether navigating the acquisition of a luxury residence in Bole or seeking a curated rental experience, our consultants provide the insights necessary for informed decision-making. We believe the search for home should be a journey of discovery, not a process of compromise.
            </p>
          </div>
          
          <div className='grid grid-cols-1 sm:grid-cols-3 gap-12 pt-16 border-t border-gray-100'>
            <div className='space-y-2'>
                <div className='text-3xl font-bold text-gray-900 tracking-tighter'>10+</div>
                <div className='text-[10px] font-black text-gray-400 uppercase tracking-widest'>Years of Excellence</div>
            </div>
            <div className='space-y-2'>
                <div className='text-3xl font-bold text-gray-900 tracking-tighter'>5,000+</div>
                <div className='text-[10px] font-black text-gray-400 uppercase tracking-widest'>Curated Residencies</div>
            </div>
            <div className='space-y-2'>
                <div className='text-3xl font-bold text-gray-900 tracking-tighter'>99%</div>
                <div className='text-[10px] font-black text-gray-400 uppercase tracking-widest'>Consultant Satisfaction</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}