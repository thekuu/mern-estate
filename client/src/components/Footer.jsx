import React from 'react';
import { Link } from 'react-router-dom';
import { FaGithub, FaLinkedin, FaTwitter, FaGlobe, FaXTwitter } from 'react-icons/fa6';

export default function Footer() {
  return (
    <footer className='bg-white border-t border-gray-100 pt-16 pb-8 px-6'>
      <div className='max-w-7xl mx-auto'>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-12 mb-16'>
          <div className='col-span-1 md:col-span-1'>
            <Link to='/'>
              <h2 className='text-xl font-bold tracking-tighter mb-4'>
                <span className='text-gray-900 font-display italic'>Homi</span>
                <span className='text-gray-400 font-display'>Portfolio</span>
              </h2>
            </Link>
            <p className='text-gray-500 text-sm leading-relaxed max-w-xs'>
              A technical demonstration of full-stack engineering excellence, 
              focusing on the MERN architecture and modern design patterns.
            </p>
          </div>
          
          <div>
            <h3 className='text-xs font-bold text-gray-900 uppercase tracking-widest mb-6'>Technical Stack</h3>
            <ul className='space-y-4 text-sm text-gray-500'>
              <li className='font-medium'>MERN (Mongo, Express, React, Node)</li>
              <li className='font-medium'>Redux Toolkit State Management</li>
              <li className='font-medium'>Tailwind CSS Styling</li>
            </ul>
          </div>

          <div>
            <h3 className='text-xs font-bold text-gray-900 uppercase tracking-widest mb-6'>Navigation</h3>
            <ul className='space-y-4 text-sm text-gray-500'>
              <li><Link to='/about' className='hover:text-gray-900 transition-colors'>Technical Details</Link></li>
              <li><Link to='/search' className='hover:text-gray-900 transition-colors'>Marketplace Demo</Link></li>
              <li><Link to='/profile' className='hover:text-gray-900 transition-colors'>Admin Dashboard</Link></li>
            </ul>
          </div>
        </div>
        
        <div className='pt-8 border-t border-gray-50 flex flex-col md:flex-row justify-between items-center gap-4'>
          <div className='flex flex-col gap-2'>
            <p className='text-xs text-gray-400'>
              © {new Date().getFullYear()} Homi Portfolio. Developed for professional showcase purposes.
            </p>
            <div className='flex gap-4 items-center'>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className='text-gray-400 hover:text-gray-900 transition-colors'>
                <FaGithub size={18} />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className='text-gray-400 hover:text-gray-900 transition-colors'>
                <FaLinkedin size={18} />
              </a>
              <a href="https://x.com" target="_blank" rel="noopener noreferrer" className='text-gray-400 hover:text-gray-900 transition-colors'>
                <FaXTwitter size={18} />
              </a>
              <a href="https://yourportfolio.com" target="_blank" rel="noopener noreferrer" className='text-gray-400 hover:text-gray-900 transition-colors'>
                <FaGlobe size={18} />
              </a>
            </div>
          </div>
          <div className='flex gap-6'>
            <Link to='/about' className='text-xs font-bold text-gray-900 uppercase tracking-widest hover:text-gray-500 transition-all'>
              View Case Study
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
