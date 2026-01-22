import React from 'react'

export default function About() {
  return (
    <div className='bg-[#F5F6F7] min-h-screen'>
      <div className='py-20 px-6 max-w-4xl mx-auto'>
        <div className='bg-white rounded-lg shadow-sm border border-[#DDE1E6] p-8 sm:p-12 space-y-8'>
          <div className='inline-block px-3 py-1 rounded bg-[#F3F4F6] border border-[#DDE1E6] text-[#1E4E91] text-[10px] font-bold uppercase tracking-wider'>
            Our Story
          </div>
          <h1 className='text-4xl sm:text-5xl font-bold text-[#111827] leading-tight'>
            Professional Real Estate <br/><span className='text-[#1E4E91]'>Across Ethiopia</span>
          </h1>
          <div className='space-y-6 text-lg text-[#4B5563] leading-relaxed font-medium'>
            <p>
              Homi Estate is a dedicated real estate platform committed to transforming how you find and invest in property. Our expertise spans the most desirable neighborhoods in Addis Ababa and beyond.
            </p>
            <p>
              Our mission is to empower our clients with expert market insights and professional service. We believe that property transactions should be transparent, efficient, and reliable milestones.
            </p>
          </div>
          
          <div className='grid grid-cols-1 sm:grid-cols-3 gap-8 pt-8 border-t border-[#F3F4F6]'>
            <div className='text-center space-y-1'>
                <div className='text-3xl font-bold text-[#1E4E91]'>10+</div>
                <div className='text-[10px] font-bold text-[#9CA3AF] uppercase tracking-widest'>Years Experience</div>
            </div>
            <div className='text-center space-y-1'>
                <div className='text-3xl font-bold text-[#1E4E91]'>5k+</div>
                <div className='text-[10px] font-bold text-[#9CA3AF] uppercase tracking-widest'>Properties Listed</div>
            </div>
            <div className='text-center space-y-1'>
                <div className='text-3xl font-bold text-[#1E4E91]'>99%</div>
                <div className='text-[10px] font-bold text-[#9CA3AF] uppercase tracking-widest'>Happy Clients</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}