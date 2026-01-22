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
    <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-slate-100 shadow-sm">
      <div className='flex justify-between items-center max-w-7xl mx-auto px-4 py-3'>
        <Link to='/'>
            <h1 className='font-bold text-xl sm:text-2xl tracking-tight flex items-center gap-1 group'>
                <span className='text-indigo-600 transition-colors group-hover:text-indigo-700'>Homi</span>
                <span className='text-slate-900'>Estate</span>
            </h1> 
        </Link>
        <form onSubmit={handleSubmit} className='bg-slate-50 border border-slate-200 px-4 py-2 rounded-full flex items-center transition-all focus-within:ring-2 focus-within:ring-indigo-100 focus-within:border-indigo-300 w-32 sm:w-80'>
            <input type='text' placeholder='Find your home...' className='bg-transparent focus:outline-none w-full text-sm placeholder:text-slate-400' 
            value={searchTerm} onChange={(e)=> setSearchTerm(e.target.value)}/>
            <button className='ml-2'>
                <HiSearch className='text-slate-500 text-lg hover:text-indigo-600 transition-colors'/>
            </button>
        </form>
        <ul className='flex items-center gap-6'>
            <Link to='/'>
                <li className='hidden md:inline text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors'>Home</li>
            </Link>
            <Link to='/about'>
                <li className='hidden md:inline text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors'>About</li>
            </Link>
            <Link to='/profile' className='flex items-center gap-2'>
                {currentUser ? (
                    <div className='flex items-center gap-3 bg-slate-50 rounded-full pl-3 pr-1 py-1 border border-slate-100 hover:bg-slate-100 transition-colors'>
                        <span className='text-xs font-semibold text-slate-700 hidden lg:block'>{currentUser.username}</span>
                        <img className='rounded-full h-8 w-8 object-cover border-2 border-white shadow-sm' src={currentUser.avatar || 'https://media.istockphoto.com/id/1300845620/vector/user-icon-flat-isolated-on-white-background-user-symbol-vector-illustration.jpg?s=612x612&w=0&k=20&c=yBeyba0hUkh14_jgv1OKqIH0CCSWU_4ckRkAoy2p73o='} alt='Profile'/>
                    </div>
                ) : (
                    <li className='text-sm font-semibold text-white bg-indigo-600 px-5 py-2 rounded-full hover:bg-indigo-700 transition-all shadow-sm active:scale-95'>Sign in</li>
                )}
            </Link>    
        </ul>
        </div>
    </header>
  )
}

