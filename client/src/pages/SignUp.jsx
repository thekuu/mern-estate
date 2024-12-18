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
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className = 'text-3xl text-center font-semibold my-7'>Sign Up</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input type = 'text' placeholder = 'username' className='border-0 p-3 rounded-lg' id='username' onChange = {handleChange} required/>
        <input type = 'email' placeholder = 'email' className='border-0 p-3 rounded-lg' id='email' onChange = {handleChange} required/>
        <input type = 'password' placeholder = 'password' className='border-0 p-3 rounded-lg' id='password' onChange = {handleChange} required/>
        <button disabled={loading} className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80'>{loading? 'Loading...' : 'Sign Up'}</button>
        <OAuth/>
      </form>
      <div className="flex gap-2 mt-5">
        <p>Have an account?</p>
        <Link to='/sign-in'>
          <span className='text-blue-700'>Sign in</span>
        </Link>
      </div>
      {error && <p className='text-red-500 mt-5'>{error}</p>}
    </div>
  )
}
