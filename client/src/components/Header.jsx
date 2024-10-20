import React, { useEffect, useState } from 'react'
import {FaSearch} from 'react-icons/fa'
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
    <headers className="bg-slate-100 shadow-md">
      <div className='flex justify-between items-center max-w-6xl mx-auto p-3'>
        <Link to='/'>
            <h1 className='font-bold text-sm sm:text-xl flex flex-wrap'>
                <span className='text-slate-500'>Homi</span>
                <span className='text-slate-cd700'>Estate</span>
            </h1> 
        </Link>
        <form onSubmit={handleSubmit} className='bg-slate-100 p-3 rounded-lg flex items-center'>
            <input type='text' placeholder='Search...'  className='bg-transparent focus:outline-none w-24 sm:w-64' 
            value={searchTerm} onChange={(e)=> setSearchTerm(e.target.value)}/>
            <button>
                <FaSearch className='text-slate-600 '/>
            </button>
        </form>
        <ul className='flex gap-4'>
            <Link to='/'>
                <li className='hidden sm:inline text-slate-700 hover:underline'>Home</li>
            </Link>
            <Link to='/about'>
                <li className='hidden sm:inline text-slate-700 hover:underline'>About</li>
            </Link>
            <Link to='/profile'>
                {currentUser ? (
                    <img className='rounded-full h-7 w-7 object-cover' src={currentUser.avatar || 'data:image/jpeg;base64,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'} alt='Profile'/>
                ) : (
                    <li className='text-slate-700 hover:underline'>Sign in</li>
                )}
            </Link>    
        
                
            
        </ul>
        </div>
    </headers>
  )
}

