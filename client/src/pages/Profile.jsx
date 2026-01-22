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
    <div className='p-6 max-w-3xl mx-auto min-h-screen'>
      <div className='bg-white p-8 border border-gray-200 rounded-lg'>
        <h1 className='text-2xl font-bold text-gray-900 mb-8'>Account settings</h1>
        <form onSubmit={handleSubmit} className='flex flex-col gap-6'>
          <input onChange={(e) => setFile(e.target.files[0])} type='file' ref={fileRef} hidden accept='image/*'/>
          <div className='flex items-center gap-6 mb-4'>
            <div className='relative'>
              <img 
                onClick={() => fileRef.current.click()} 
                className='rounded-full h-24 w-24 object-cover cursor-pointer border border-gray-200' 
                src={formData.avatar || currentUser.avatar || 'https://media.istockphoto.com/id/1300845620/vector/user-icon-flat-isolated-on-white-background-user-symbol-vector-illustration.jpg?s=612x612&w=0&k=20&c=yBeyba0hUkh14_jgv1OKqIH0CCSWU_4ckRkAoy2p73o='} 
                alt='Profile'
              />
              <button 
                type='button'
                onClick={() => fileRef.current.click()}
                className='absolute -bottom-1 -right-1 bg-white border border-gray-200 p-1.5 rounded-full shadow-sm text-gray-500 hover:text-gray-700'
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>
            </div>
            <div className='space-y-1'>
              <p className='text-sm font-semibold text-gray-900'>Profile picture</p>
              <p className='text-xs text-gray-500'>PNG, JPG up to 2MB</p>
              {filePerc > 0 && (
                <p className='text-xs font-medium text-blue-600'>
                  {filePerc === 100 ? 'Upload complete' : `Uploading ${filePerc}%`}
                </p>
              )}
              {fileUploadError && <p className='text-xs font-medium text-red-600'>Upload failed</p>}
            </div>
          </div>

          <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
            <div className='space-y-1.5'>
              <label className='text-sm font-medium text-gray-700'>Username</label>
              <input type="text" placeholder='username' defaultValue={currentUser.username} id='username' className='w-full border border-gray-300 px-3 py-2 rounded-md focus:ring-1 focus:ring-blue-500 outline-none transition-all text-sm' onChange={handleChange}/>
            </div>
            <div className='space-y-1.5'>
              <label className='text-sm font-medium text-gray-700'>Email</label>
              <input type="email" placeholder='email' defaultValue={currentUser.email} id='email' className='w-full border border-gray-300 px-3 py-2 rounded-md focus:ring-1 focus:ring-blue-500 outline-none transition-all text-sm' onChange={handleChange}/>
            </div>
            <div className='col-span-full space-y-1.5'>
              <label className='text-sm font-medium text-gray-700'>New Password</label>
              <input type="password" placeholder='••••••••' id='password' className='w-full border border-gray-300 px-3 py-2 rounded-md focus:ring-1 focus:ring-blue-500 outline-none transition-all text-sm' onChange={handleChange}/>
            </div>
          </div>

          <div className='flex flex-col sm:flex-row gap-3 mt-4'>
            <button disabled={loading} className='bg-gray-900 text-white px-6 py-2 rounded-md font-semibold hover:bg-gray-800 disabled:opacity-50 transition-all text-sm'>
              {loading ? 'Saving...' : 'Save changes'}
            </button>
            <Link className='bg-blue-600 text-white px-6 py-2 rounded-md font-semibold text-center hover:bg-blue-700 transition-all text-sm' to={"/create-listing"}>
              Create new listing
            </Link>
          </div>
        </form>

        <div className='flex items-center gap-6 mt-12 pt-8 border-t border-gray-100'>
          <button onClick={handleDeleteUser} className='text-sm font-semibold text-red-600 hover:text-red-700'>
            Delete account
          </button>
          <button onClick={handleSignout} className='text-sm font-semibold text-gray-500 hover:text-gray-700'>
            Sign out
          </button>
        </div>

        {error && <p className='text-red-600 text-sm font-medium mt-4 py-2 px-3 bg-red-50 rounded-md border border-red-100'>{error}</p>}
        {updateSuccess && !error && <p className='text-emerald-600 text-sm font-medium mt-4 py-2 px-3 bg-emerald-50 rounded-md border border-emerald-100'>Profile updated successfully</p>}
        
        <div className='mt-12 pt-8 border-t border-gray-100'>
          <div className='flex items-center justify-between mb-6'>
            <h2 className='text-lg font-bold text-gray-900'>My property listings</h2>
            <button onClick={handleShowListings} className='text-sm font-semibold text-blue-600 hover:underline'>
              Show all
            </button>
          </div>

          {showListingsError && <p className='text-red-500 text-sm'>Failed to load listings</p>}
          
          {userListings && userListings.length > 0 &&
            <div className='space-y-3'>
              {userListings.map((listing) => (
                <div className='bg-white border border-gray-200 rounded-md p-3 flex justify-between items-center' key={listing._id}>
                  <Link to={`/listing/${listing._id}`} className='flex items-center gap-4 flex-1 truncate'>
                    <img className='h-12 w-12 object-cover rounded shadow-sm' src={listing.imageUrls[0]} alt="Listing Cover" />
                    <p className='text-gray-900 font-semibold hover:underline truncate text-sm'>{listing.name}</p>
                  </Link>
                  <div className='flex gap-4 ml-4'>
                    <Link to={`/update-listing/${listing._id}`}>
                      <button className='text-blue-600 font-bold text-xs uppercase hover:underline'>Edit</button>
                    </Link>
                    <button onClick={() => handleDeleteListing(listing._id)} className='text-red-600 font-bold text-xs uppercase hover:underline'>Delete</button>
                  </div>
                </div>
              ))}
            </div>
          }
        </div>
      </div>
    </div>
  )
}
