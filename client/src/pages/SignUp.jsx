import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import OAuth from '../components/OAuth';


export default function SignUp() {
  const [formData, setFormData] = useState({})
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate();
  const handleChange = (e) => {
    setFormData({
      ...formData, //to keep the unchanged data as it is
      [e.target.id]: e.target.value,
    });
  };
  const handleSubmit = async (e) => {
    setLoading(true)
    e.preventDefault();
    try {
      const res = await fetch ('/api/auth/signup', { //proxy needs to be created inside vite.config.js
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json(); 
      if (data.success === false) {
        setError(data.message)
        setLoading(false)
        return;
      }
      setLoading(false) 
      setError(null);
      navigate('/sign-in');     
    } catch (error) {
      setLoading(false)
      setError(error.message)
    }

    
  }
  console.log(formData)
  return (
    <div className='p-6 max-w-lg mx-auto min-h-[calc(100vh-160px)] flex flex-col justify-center'>
      <div className='bg-white p-10 border border-gray-100 rounded-sm shadow-sm'>
        <div className='text-center mb-12'>
          <h1 className='text-4xl font-bold text-gray-900 mb-3 leading-tight'>Sign Up</h1>
          <p className='text-gray-400 text-sm font-medium tracking-wide uppercase opacity-80'>Begin your property journey</p>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className='space-y-2'>
            <label className='text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1'>Full Name</label>
            <input type='text' placeholder='Your Name' className='w-full border-b border-gray-200 px-1 py-3 focus:border-gray-900 outline-none transition-all text-sm font-medium bg-transparent' id='username' onChange={handleChange} required/>
          </div>
          <div className='space-y-2'>
            <label className='text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1'>Email Address</label>
            <input type='email' placeholder='name@domain.com' className='w-full border-b border-gray-200 px-1 py-3 focus:border-gray-900 outline-none transition-all text-sm font-medium bg-transparent' id='email' onChange={handleChange} required/>
          </div>
          <div className='space-y-2'>
            <label className='text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1'>Password</label>
            <input type='password' placeholder='••••••••' className='w-full border-b border-gray-200 px-1 py-3 focus:border-gray-900 outline-none transition-all text-sm font-medium bg-transparent' id='password' onChange={handleChange} required/>
          </div>
          <button disabled={loading} className='btn-primary mt-4 uppercase text-xs tracking-widest font-bold h-14'>
            {loading ? 'Creating...' : 'Create Account'}
          </button>
          <div className='relative my-4'>
            <div className='absolute inset-0 flex items-center'><span className='w-full border-t border-gray-50'></span></div>
            <div className='relative flex justify-center text-[10px] uppercase tracking-[0.2em]'><span className='bg-white px-4 text-gray-300 font-bold'>Third Party</span></div>
          </div>
          <OAuth/>
        </form>
        <div className="flex justify-center gap-2 mt-10 pt-10 border-t border-gray-50 text-xs font-bold uppercase tracking-widest">
          <p className='text-gray-400'>Have an account?</p>
          <Link to='/sign-in'>
            <span className='text-gray-900 hover:text-gray-600 transition-colors underline decoration-gray-200 underline-offset-4'>Sign In</span>
          </Link>
        </div>
        {error && <p className='text-red-500 text-center text-xs font-bold mt-6 tracking-wide italic'>* {error}</p>}
      </div>
    </div>
  )
}
