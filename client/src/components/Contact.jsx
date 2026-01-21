import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function Contact({ listing }) {
  const [landlord, setLandlord] = useState(null);
  const [message, setMessage] = useState('');
  const onChange = (e) => {
    setMessage(e.target.value);
  };

  useEffect(() => {
    const fetchLandlord = async () => {
      try {
        const res = await fetch(`/api/user/${listing.userRef}`);
        const data = await res.json();
        setLandlord(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchLandlord();
  }, [listing.userRef]);
  return (
    <>
      {landlord && (
        <div className='flex flex-col gap-4'>
          <div className='flex items-center gap-3 mb-2'>
            <div className='w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold'>
                {landlord.username.charAt(0).toUpperCase()}
            </div>
            <div>
                <p className='text-sm text-slate-500 font-medium uppercase tracking-widest'>Contact Landlord</p>
                <p className='text-lg font-black text-slate-800'>{landlord.username}</p>
            </div>
          </div>
          
          <div className='space-y-1'>
            <label className='text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1'>Your Message</label>
            <textarea
                name='message'
                id='message'
                rows='3'
                value={message}
                onChange={onChange}
                placeholder={`Hi ${landlord.username}, I'm interested in this property...`}
                className='w-full bg-white border border-slate-200 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 transition-all font-medium resize-none'
            ></textarea>
          </div>

          <Link
          to={`mailto:${landlord.email}?subject=Regarding ${listing.name}&body=${message}`}
          className='w-full bg-slate-900 text-white text-center py-4 rounded-xl font-bold uppercase hover:bg-slate-800 transition-all shadow-lg active:scale-95'
          >
            Send Email Inquiry
          </Link>
        </div>
      )}
    </>
  );
}