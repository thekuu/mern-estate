import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useRef } from 'react'
import{getStorage, ref, uploadBytesResumable, getDownloadURL} from 'firebase/storage';
import { app } from '../firebase';
import { deleteUserFailure, deleteUserStart, deleteUserSuccess, signoutUserFailure, signoutUserStart, signoutUserSuccess, updateUserFailure, updateUserStart, updateUserSuccess } from '../redux/user/userSlice';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';

export default function Profile() {
  const fileRef = useRef(null);
  const {currentUser, loading, error} = useSelector((state) => state.user)
  const [file, setFile] = useState(undefined)
  const [filePerc, setFilePerc] = useState(0)
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({})
  const [showListingsError, setShowListingsError] = useState(false)
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [userListings, setUserListings] = useState([])
  const dispatch = useDispatch();
  useEffect(() => {
    if(file) {
      handleFileUpload(file);
    }
  }, [file])
  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName)
    const uploadTask = uploadBytesResumable(storageRef, file)
  
    uploadTask.on('state_changed', (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePerc(Math.round(progress))
    },
    (error) => {
      setFileUploadError(true)
    },
    () => {
      getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
        setFormData({...formData, avatar: downloadURL});
      });
    }
    )
  }
  
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value}) 
  }
  const handleSubmit = async(e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data.message))
        return;
      }

      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
    } catch (error) {
      dispatch(updateUserFailure(error.message))
    }
  }

  const handleDeleteUser = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: 'DELETE', 
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data))
  } catch (error) {
    dispatch(deleteUserFailure(error.message))
  }
    }
  
  const handleSignout = async () => {
    try {
      dispatch(signoutUserStart())
      const res = await fetch('/api/auth/signout');
      const data = await res.json();
      if (data.success === false) {
        dispatch(signoutUserFailure(data.message));
        return;
      }
      dispatch(signoutUserSuccess(data))
    } catch (error) {
        dispatch(signoutUserFailure(error.message))
    }
  }
  const handleShowListings = async () => {
    try {
      setShowListingsError(false)
      const res = await fetch (`/api/user/listings/${currentUser._id}`)
      const data = await res.json()
      if(data.success === false) {
        setShowListingsError(true);
        return;
      }
      setUserListings(data)
    } catch (error) {
      setShowListingsError(true)
    }
  }
  const handleDeleteListing = async(listingId) => {
    try {
      const res = await fetch (`/api/listing/delete/${listingId}`, {
        method: 'DELETE'
      });
      const data = await res.json()
      if (data.success === false) {
        console.log(data.message)
        return;
      }
      setUserListings((prev) => prev.filter(listing => listing._id !== listingId));
      console.log(userListings)
    } catch (error) {
      console.log(error.message)
    }
  }
  return (
    <div className='p-6 max-w-4xl mx-auto min-h-screen'>
      <div className='bg-white rounded-3xl shadow-xl shadow-slate-200 border border-slate-100 p-8 sm:p-12'>
        <h1 className='text-3xl font-black text-slate-900 text-center mb-10'>Profile Settings</h1>
        <form onSubmit={handleSubmit} className='flex flex-col gap-6'>
          <input onChange={(e) => setFile(e.target.files[0])} type='file' ref={fileRef} hidden accept='image/*'/>
          <div className='relative self-center group'>
            <img 
              onClick={() => fileRef.current.click()} 
              className='rounded-full h-32 w-32 object-cover cursor-pointer border-4 border-white shadow-lg group-hover:opacity-80 transition-opacity' 
              src={formData.avatar || currentUser.avatar || 'https://media.istockphoto.com/id/1300845620/vector/user-icon-flat-isolated-on-white-background-user-symbol-vector-illustration.jpg?s=612x612&w=0&k=20&c=yBeyba0hUkh14_jgv1OKqIH0CCSWU_4ckRkAoy2p73o='} 
              alt='Profile'
            />
            <div className='absolute bottom-0 right-0 bg-indigo-600 p-2 rounded-full text-white shadow-lg pointer-events-none'>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
          </div>
          <p className='text-sm self-center font-medium'>
            {fileUploadError ? (
              <span className='text-red-500 bg-red-50 px-3 py-1 rounded-full'>Upload failed (Max 2MB)</span>
            ) : filePerc > 0 && filePerc < 100 ? (
              <span className='text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full'>{`Uploading ${filePerc}%`}</span>
            ) : filePerc === 100 ? (
              <span className='text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full'>Image updated</span>
            ) : ""
            }
          </p>

          <div className='space-y-4'>
            <div className='space-y-1'>
              <label className='text-xs font-bold text-slate-400 uppercase ml-1'>Username</label>
              <input type="text" placeholder='username' defaultValue={currentUser.username} id='username' className='w-full bg-slate-50 border border-slate-200 p-4 rounded-xl outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 transition-all font-medium' onChange={handleChange}/>
            </div>
            <div className='space-y-1'>
              <label className='text-xs font-bold text-slate-400 uppercase ml-1'>Email</label>
              <input type="email" placeholder='email' defaultValue={currentUser.email} id='email' className='w-full bg-slate-50 border border-slate-200 p-4 rounded-xl outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 transition-all font-medium' onChange={handleChange}/>
            </div>
            <div className='space-y-1'>
              <label className='text-xs font-bold text-slate-400 uppercase ml-1'>Password</label>
              <input type="password" placeholder='••••••••' id='password' className='w-full bg-slate-50 border border-slate-200 p-4 rounded-xl outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 transition-all font-medium' onChange={handleChange}/>
            </div>
          </div>

          <button disabled={loading} className='bg-slate-900 text-white rounded-xl py-4 font-bold uppercase hover:bg-slate-800 disabled:opacity-50 transition-all shadow-xl shadow-slate-200 active:scale-95'>
            {loading ? 'Updating...' : 'Save Changes'}
          </button>
          <Link className='bg-indigo-600 text-white py-4 rounded-xl font-bold uppercase text-center hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 active:scale-95' to={"/create-listing"}>
            Post New Listing
          </Link>
        </form>

        <div className='flex justify-between mt-10 pt-10 border-t border-slate-100'>
          <button onClick={handleDeleteUser} className='text-red-500 font-bold hover:text-red-600 transition-colors flex items-center gap-1'>
            Delete Account
          </button>
          <button onClick={handleSignout} className='text-slate-500 font-bold hover:text-slate-800 transition-colors flex items-center gap-1'>
            Sign Out
          </button>
        </div>

        {error && <p className='text-red-500 text-center font-medium mt-4 bg-red-50 py-3 rounded-xl'>{error}</p>}
        {updateSuccess && !error && <p className='text-emerald-600 text-center font-medium mt-4 bg-emerald-50 py-3 rounded-xl'>Profile updated successfully!</p>}
        
        <button onClick={handleShowListings} className='text-indigo-600 font-bold w-full mt-8 py-4 border-2 border-indigo-50 rounded-2xl hover:bg-indigo-50 transition-all'>
          Manage My Listings
        </button>
        {showListingsError && <p className='text-red-500 text-center mt-2'>Failed to load listings</p>}
        
        {userListings && userListings.length > 0 &&
          <div className='mt-12 space-y-6'>
            <h2 className='text-2xl font-black text-slate-900'>My Listings</h2>
            <div className='grid gap-4'>
              {userListings.map((listing) => (
                <div className='bg-slate-50 border border-slate-100 rounded-2xl p-4 flex justify-between items-center group hover:bg-white hover:shadow-lg transition-all' key={listing._id}>
                  <Link to={`/listing/${listing._id}`} className='flex items-center gap-4 flex-1 truncate'>
                    <img className='h-16 w-16 object-cover rounded-xl shadow-sm' src={listing.imageUrls[0]} alt="Listing Cover" />
                    <p className='text-slate-800 font-bold hover:text-indigo-600 transition-colors truncate'>{listing.name}</p>
                  </Link>
                  <div className='flex gap-4 ml-4'>
                    <Link to={`/update-listing/${listing._id}`}>
                      <button className='text-emerald-600 font-bold text-sm uppercase hover:underline'>Edit</button>
                    </Link>
                    <button onClick={() => handleDeleteListing(listing._id)} className='text-red-500 font-bold text-sm uppercase hover:underline'>Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </div> 
        }
      </div>
    </div>
  )
}
