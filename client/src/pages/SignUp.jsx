import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import OAuth from '../components/OAuth';

export default function SignUp() {
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    try {
      const res = await fetch('/api/auth/signup', {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        setError(data.message);
        setLoading(false);
        return;
      }
      setLoading(false);
      setError(null);
      navigate('/sign-in');
    } catch (error) {
      setLoading(false);
      setError(error.message);
    }
  };

  return (
    <div className='min-h-[calc(100vh-64px)] bg-[#F9F9FB] flex items-center justify-center p-4'>
      <div className='w-full max-w-md bg-white border border-[#E5E7EB] rounded-lg p-8 shadow-sm'>
        <div className='mb-8'>
          <h1 className='text-2xl font-bold text-[#1A1D1F] mb-1'>Create account</h1>
          <p className='text-sm text-[#64748B]'>Join HomiEstate to start listing properties</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className='block text-xs font-bold text-[#4B5563] uppercase tracking-wider mb-1.5 ml-0.5'>Username</label>
            <input type='text' placeholder='Enter username' className='w-full border border-[#D1D5DB] p-2.5 rounded text-sm focus:ring-1 focus:ring-[#0059E1] focus:border-[#0059E1] outline-none' id='username' onChange={handleChange} required/>
          </div>
          <div>
            <label className='block text-xs font-bold text-[#4B5563] uppercase tracking-wider mb-1.5 ml-0.5'>Email</label>
            <input type='email' placeholder='Enter your email' className='w-full border border-[#D1D5DB] p-2.5 rounded text-sm focus:ring-1 focus:ring-[#0059E1] focus:border-[#0059E1] outline-none' id='email' onChange={handleChange} required/>
          </div>
          <div>
            <label className='block text-xs font-bold text-[#4B5563] uppercase tracking-wider mb-1.5 ml-0.5'>Password</label>
            <input type='password' placeholder='Create a password' className='w-full border border-[#D1D5DB] p-2.5 rounded text-sm focus:ring-1 focus:ring-[#0059E1] focus:border-[#0059E1] outline-none' id='password' onChange={handleChange} required/>
          </div>
          
          <button disabled={loading} className='w-full bg-[#0059E1] text-white py-2.5 rounded font-semibold text-sm hover:bg-[#0047B3] transition-colors disabled:opacity-50 mt-2'>
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
          
          <div className='relative py-2'>
            <div className='absolute inset-0 flex items-center'><div className='w-full border-t border-[#F3F4F6]'></div></div>
            <div className='relative flex justify-center text-xs'><span className='bg-white px-2 text-[#9CA3AF] font-medium'>or</span></div>
          </div>
          
          <OAuth />
        </form>
        
        <div className="mt-8 pt-6 border-t border-[#F3F4F6] text-center">
          <p className='text-sm text-[#64748B]'>
            Already have an account? {' '}
            <Link to='/sign-in' className='text-[#0059E1] font-bold hover:underline'>Sign in</Link>
          </p>
        </div>
        {error && <p className='text-[#E11D48] text-sm text-center font-medium mt-4 py-2 bg-[#FFF1F2] rounded'>{error}</p>}
      </div>
    </div>
  );
}
