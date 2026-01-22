import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux'
import { signInFailure, signInStart, signInSuccess } from '../redux/user/userSlice';
import OAuth from '../components/OAuth';

export default function SignIn() {
  const [formData, setFormData] = useState({})
  const {loading, error} = useSelector((state) => state.user)
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleChange = (e) => {
    setFormData({
      ...formData, //to keep the unchanged data as it is
      [e.target.id]: e.target.value,
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(signInStart())
      const res = await fetch ('/api/auth/signin', { //proxy needs to be created inside vite.config.js
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json(); 
      if (data.success === false) {
        dispatch(signInFailure(data.message));
        return;
      }
      dispatch(signInSuccess(data))
      navigate('/');     
    } catch (error) {
      dispatch(signInFailure(error.message));
    }

    
  }
  console.log(formData)
  return (
    <div className='p-6 max-w-lg mx-auto min-h-screen flex flex-col justify-center'>
      <div className='bg-white rounded-3xl shadow-xl shadow-slate-200 border border-slate-100 p-8 sm:p-12'>
        <div className='text-center mb-10'>
          <h1 className='text-3xl font-black text-slate-900 mb-2'>Welcome Back</h1>
          <p className='text-slate-500 font-medium'>Sign in to manage your properties</p>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className='space-y-1'>
            <label className='text-xs font-bold text-slate-400 uppercase ml-1'>Email Address</label>
            <input type='email' placeholder='name@company.com' className='w-full bg-slate-50 border border-slate-200 p-4 rounded-xl outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 transition-all font-medium' id='email' onChange={handleChange} required/>
          </div>
          <div className='space-y-1'>
            <label className='text-xs font-bold text-slate-400 uppercase ml-1'>Password</label>
            <input type='password' placeholder='••••••••' className='w-full bg-slate-50 border border-slate-200 p-4 rounded-xl outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 transition-all font-medium' id='password' onChange={handleChange} required/>
          </div>
          <button disabled={loading} className='bg-slate-900 text-white p-4 rounded-xl font-bold uppercase hover:bg-slate-800 disabled:opacity-50 transition-all shadow-xl shadow-slate-200 active:scale-95 mt-2'>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
          <div className='relative my-4'>
            <div className='absolute inset-0 flex items-center'><span className='w-full border-t border-slate-100'></span></div>
            <div className='relative flex justify-center text-xs uppercase'><span className='bg-white px-2 text-slate-400 font-bold'>Or continue with</span></div>
          </div>
          <OAuth/>
        </form>
        <div className="flex justify-center gap-2 mt-8 pt-8 border-t border-slate-50">
          <p className='text-slate-500 font-medium'>Don't have an account?</p>
          <Link to='/sign-up'>
            <span className='text-indigo-600 font-bold hover:underline'>Sign up</span>
          </Link>
        </div>
        {error && <p className='text-red-500 text-center font-medium mt-4 bg-red-50 py-3 rounded-xl'>{error}</p>}
      </div>
    </div>
  )
}
