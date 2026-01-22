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
    <div className='p-4 max-w-md mx-auto min-h-[calc(100vh-80px)] flex flex-col justify-center'>
      <div className='bg-white p-8 border border-gray-200 rounded-lg'>
        <div className='mb-8'>
          <h1 className='text-2xl font-bold text-gray-900 mb-1'>Create an account</h1>
          <p className='text-gray-500 text-sm'>Join Homi Estate to start managing properties</p>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className='space-y-1.5'>
            <label className='text-sm font-medium text-gray-700'>Username</label>
            <input type='text' placeholder='johndoe' className='w-full border border-gray-300 px-3 py-2 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm' id='username' onChange={handleChange} required/>
          </div>
          <div className='space-y-1.5'>
            <label className='text-sm font-medium text-gray-700'>Email</label>
            <input type='email' placeholder='you@example.com' className='w-full border border-gray-300 px-3 py-2 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm' id='email' onChange={handleChange} required/>
          </div>
          <div className='space-y-1.5'>
            <label className='text-sm font-medium text-gray-700'>Password</label>
            <input type='password' placeholder='••••••••' className='w-full border border-gray-300 px-3 py-2 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm' id='password' onChange={handleChange} required/>
          </div>
          <button disabled={loading} className='w-full bg-blue-600 text-white py-2 rounded-md font-semibold hover:bg-blue-700 disabled:opacity-50 transition-all mt-2 text-sm'>
            {loading ? 'Creating account...' : 'Sign up'}
          </button>
          <div className='relative my-2'>
            <div className='absolute inset-0 flex items-center'><span className='w-full border-t border-gray-200'></span></div>
            <div className='relative flex justify-center text-xs uppercase'><span className='bg-white px-2 text-gray-400'>or</span></div>
          </div>
          <OAuth/>
        </form>
        <div className="flex justify-center gap-1.5 mt-6 pt-6 border-t border-gray-100 text-sm">
          <p className='text-gray-500'>Already have an account?</p>
          <Link to='/sign-in'>
            <span className='text-blue-600 font-medium hover:underline'>Sign in</span>
          </Link>
        </div>
        {error && <p className='text-red-600 text-center text-sm font-medium mt-4 py-2 px-3 bg-red-50 rounded-md border border-red-100'>{error}</p>}
      </div>
    </div>
  )
}
