import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className='bg-white border-t border-gray-100 pt-16 pb-8 px-6'>
      <div className='max-w-7xl mx-auto'>
        <div className='grid grid-cols-1 md:grid-cols-4 gap-12 mb-16'>
          <div className='col-span-1 md:col-span-1'>
            <Link to='/'>
              <h2 className='text-xl font-bold tracking-tighter mb-4'>
                <span className='text-gray-900 font-display italic'>Homi</span>
                <span className='text-gray-400 font-display'>Estate</span>
              </h2>
            </Link>
            <p className='text-gray-500 text-sm leading-relaxed max-w-xs'>
              Defining the art of modern living through curated properties and exceptional service in Ethiopia.
            </p>
          </div>
          
          <div>
            <h3 className='text-xs font-bold text-gray-900 uppercase tracking-widest mb-6'>Explore</h3>
            <ul className='space-y-4 text-sm text-gray-500'>
              <li><Link to='/search?type=sale' className='hover:text-gray-900 transition-colors'>Buy</Link></li>
              <li><Link to='/search?type=rent' className='hover:text-gray-900 transition-colors'>Rent</Link></li>
              <li><Link to='/profile' className='hover:text-gray-900 transition-colors'>Sell</Link></li>
            </ul>
          </div>

          <div>
            <h3 className='text-xs font-bold text-gray-900 uppercase tracking-widest mb-6'>Company</h3>
            <ul className='space-y-4 text-sm text-gray-500'>
              <li><Link to='/about' className='hover:text-gray-900 transition-colors'>Our Story</Link></li>
              <li><Link to='/about' className='hover:text-gray-900 transition-colors'>Contact</Link></li>
            </ul>
          </div>

          <div>
            <h3 className='text-xs font-bold text-gray-900 uppercase tracking-widest mb-6'>Legal</h3>
            <ul className='space-y-4 text-sm text-gray-500'>
              <li><Link to='#' className='hover:text-gray-900 transition-colors'>Privacy Policy</Link></li>
              <li><Link to='#' className='hover:text-gray-900 transition-colors'>Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        
        <div className='pt-8 border-t border-gray-50 flex flex-col md:flex-row justify-between items-center gap-4'>
          <p className='text-xs text-gray-400'>
            © {new Date().getFullYear()} Homi Estate. All rights reserved.
          </p>
          <div className='flex gap-6'>
            {/* Social placeholders could go here */}
          </div>
        </div>
      </div>
    </footer>
  );
}
