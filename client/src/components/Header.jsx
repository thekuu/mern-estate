import React, { useEffect, useState } from 'react'
import { HiSearch, HiUserCircle } from 'react-icons/hi'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

export default function Header() {
    const { currentUser } = useSelector(state => state.user)
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
        if (searchTermFromUrl) {
            setSearchTerm(searchTermFromUrl)
        }
    }, [location.search])

    return (
        <header className="bg-white border-b border-[#E5E7EB] sticky top-0 z-50">
            <div className='flex justify-between items-center max-w-7xl mx-auto px-4 sm:px-6 h-16'>
                <Link to='/' className="flex items-center gap-2">
                    <div className="bg-[#0059E1] p-1.5 rounded">
                        <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                    </div>
                    <span className='font-bold text-xl text-[#1A1D1F] tracking-tight'>HomiEstate</span>
                </Link>

                <form onSubmit={handleSubmit} className='hidden sm:flex flex-1 max-w-md mx-8 relative'>
                    <input 
                        type='text' 
                        placeholder='Search by location or property type' 
                        className='w-full bg-[#F3F4F6] border-none px-10 py-2.5 rounded text-sm focus:ring-1 focus:ring-[#0059E1] focus:bg-white transition-all outline-none' 
                        value={searchTerm} 
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <HiSearch className='absolute left-3 top-1/2 -translate-y-1/2 text-[#6B7280] text-lg'/>
                </form>

                <nav>
                    <ul className='flex items-center gap-4 sm:gap-8'>
                        <li><Link to='/search' className='text-sm font-medium text-[#4B5563] hover:text-[#0059E1] transition-colors'>Browse</Link></li>
                        <li className="hidden md:block"><Link to='/about' className='text-sm font-medium text-[#4B5563] hover:text-[#0059E1] transition-colors'>About</Link></li>
                        <Link to='/profile' className='flex items-center'>
                            {currentUser ? (
                                <img className='rounded-full h-8 w-8 object-cover border border-[#E5E7EB]' src={currentUser.avatar} alt='Profile'/>
                            ) : (
                                <span className='text-sm font-semibold text-white bg-[#0059E1] px-4 py-2 rounded hover:bg-[#0047B3] transition-colors'>Sign in</span>
                            )}
                        </Link>
                    </ul>
                </nav>
            </div>
        </header>
    )
}
