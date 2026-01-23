import React, { useEffect, useState } from 'react'
import {HiSearch} from 'react-icons/hi'
import { Link , useNavigate} from 'react-router-dom'
import { useSelector } from 'react-redux'

export default function Header() {
    const {currentUser} = useSelector(state => state.user)
    const [searchTerm, setSearchTerm] = useState('')
    const navigate = useNavigate()
    const handleSubmit = (e) => {
        e.preventDefault()
        const urlParams = new URLSearchParams(window.location.search)
        urlParams.set('searchTerm', searchTerm)
        const searchQuery = urlParams.toString()
        navigate(`/search?${searchQuery}`)
    }

    useEffect(() => {
        const urlParams = new URLSearchParams(location.search)
        const searchTermFromUrl = urlParams.get('searchTerm')
        if(searchTermFromUrl) {
            setSearchTerm(searchTermFromUrl)
        }
    }, [location.search])
    return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className='flex justify-between items-center max-w-7xl mx-auto px-6 py-4'>
        <Link to='/'>
            <h1 className='font-bold text-xl sm:text-2xl tracking-tighter flex items-center gap-1'>
                <span className='text-gray-900 font-display italic'>Homi</span>
                <span className='text-gray-400 font-display'>Estate</span>
            </h1> 
        </Link>
        <form onSubmit={handleSubmit} className='hidden sm:flex bg-gray-50 border border-gray-100 px-4 py-2 rounded-full items-center transition-all focus-within:bg-white focus-within:shadow-sm focus-within:border-gray-200 w-64 lg:w-96'>
            <input type='text' placeholder='Find your sanctuary...' className='bg-transparent focus:outline-none w-full text-sm font-medium text-gray-600 placeholder:text-gray-400' 
            value={searchTerm} onChange={(e)=> setSearchTerm(e.target.value)}/>
            <button className='ml-2'>
                <FaSearch className='text-gray-400 text-sm hover:text-gray-600 transition-colors'/>
            </button>
        </form>
        <ul className='flex items-center gap-8 font-medium text-xs tracking-widest text-gray-500 uppercase'>
            <Link to='/'>
                <li className='hidden md:inline hover:text-gray-900 transition-colors cursor-pointer'>Home</li>
            </Link>
            <Link to='/about'>
                <li className='hidden md:inline hover:text-gray-900 transition-colors cursor-pointer'>Our Story</li>
            </Link>
            <Link to='/profile'>
                {currentUser ? (
                    <img className='rounded-full h-8 w-8 object-cover border border-gray-100' src={currentUser.avatar} alt='Profile'/>
                ) : (
                    <li className='hover:text-gray-900 transition-colors'>Sign in</li>
                )}
            </Link>    
        </ul>
        </div>
    </header>
  )
}

