import React from 'react'

export default function About() {
  return (
    <div className='bg-white min-h-screen'>
      <div className='py-20 px-6 max-w-4xl mx-auto'>
        <div className='space-y-16'>
          <div className='space-y-6'>
            <h2 className='text-xs font-bold text-gray-400 uppercase tracking-[0.3em]'>The Project</h2>
            <h1 className='text-5xl sm:text-7xl font-bold text-gray-900 leading-tight'>
              Full-Stack <span className='italic font-display text-gray-400'>Portfolio</span> Demonstration.
            </h1>
            <p className='text-xl text-gray-500 leading-relaxed max-w-2xl font-medium italic'>
              This platform serves as a technical showcase for modern web development capabilities.
            </p>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-16 text-gray-600 leading-relaxed font-medium'>
            <p>
              This project was developed to demonstrate mastery of the MERN stack (MongoDB, Express, React, Node.js). It features secure user authentication, CRUD operations for property listings, advanced search filters, and image upload capabilities.
            </p>
            <p>
              The UI is built with Tailwind CSS, focusing on a premium, minimalist aesthetic that emphasizes user experience and clean code architecture. State management is handled via Redux Toolkit for seamless data flow across the application.
            </p>
          </div>
          
          <div className='grid grid-cols-1 sm:grid-cols-3 gap-12 pt-16 border-t border-gray-100'>
            <div className='space-y-2'>
                <div className='text-3xl font-bold text-gray-900 tracking-tighter'>MERN</div>
                <div className='text-[10px] font-black text-gray-400 uppercase tracking-widest'>Full-Stack Core</div>
            </div>
            <div className='space-y-2'>
                <div className='text-3xl font-bold text-gray-900 tracking-tighter'>Redux</div>
                <div className='text-[10px] font-black text-gray-400 uppercase tracking-widest'>State Management</div>
            </div>
            <div className='space-y-2'>
                <div className='text-3xl font-bold text-gray-900 tracking-tighter'>JWT</div>
                <div className='text-[10px] font-black text-gray-400 uppercase tracking-widest'>Secure Auth</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}