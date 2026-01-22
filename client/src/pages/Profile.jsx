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
      <div className='bg-white rounded-lg shadow-sm border border-[#DDE1E6] p-8 sm:p-12'>
        <h1 className='text-2xl font-bold text-[#111827] text-center mb-10'>Profile Settings</h1>
        <form onSubmit={handleSubmit} className='flex flex-col gap-6'>
          <input onChange={(e) => setFile(e.target.files[0])} type='file' ref={fileRef} hidden accept='image/*'/>
          <div className='relative self-center group'>
            <img 
              onClick={() => fileRef.current.click()} 
              className='rounded-full h-32 w-32 object-cover cursor-pointer border-2 border-[#DDE1E6] shadow-sm hover:opacity-80 transition-opacity' 
              src={formData.avatar || currentUser.avatar} 
              alt='Profile'
            />
          </div>
          <p className='text-xs self-center font-bold'>
            {fileUploadError ? (
              <span className='text-[#B91C1C]'>Upload failed (Max 2MB)</span>
            ) : filePerc > 0 && filePerc < 100 ? (
              <span className='text-[#1E4E91]'>{`Uploading ${filePerc}%`}</span>
            ) : filePerc === 100 ? (
              <span className='text-[#059669]'>Image updated</span>
            ) : ""
            }
          </p>

          <div className='space-y-4'>
            <div className='space-y-1.5'>
              <label className='text-[10px] font-bold text-[#64748B] uppercase tracking-wider ml-0.5'>Username</label>
              <input type="text" placeholder='username' defaultValue={currentUser.username} id='username' className='w-full border border-[#DDE1E6] p-3 rounded text-sm outline-none focus:ring-1 focus:ring-[#1E4E91] font-medium' onChange={handleChange}/>
            </div>
            <div className='space-y-1.5'>
              <label className='text-[10px] font-bold text-[#64748B] uppercase tracking-wider ml-0.5'>Email</label>
              <input type="email" placeholder='email' defaultValue={currentUser.email} id='email' className='w-full border border-[#DDE1E6] p-3 rounded text-sm outline-none focus:ring-1 focus:ring-[#1E4E91] font-medium' onChange={handleChange}/>
            </div>
          </div>

          <button disabled={loading} className='bg-[#111827] text-white rounded py-3 font-bold uppercase text-xs hover:bg-black disabled:opacity-50 transition-all'>
            {loading ? 'Updating...' : 'Save Changes'}
          </button>
          <Link className='bg-[#1E4E91] text-white py-3 rounded font-bold uppercase text-xs text-center hover:bg-[#163B6F] transition-all' to={"/create-listing"}>
            Post New Listing
          </Link>
        </form>

        <div className='flex justify-between mt-10 pt-8 border-t border-[#F3F4F6]'>
          <button onClick={handleDeleteUser} className='text-[#B91C1C] text-xs font-bold hover:underline'>
            Delete Account
          </button>
          <button onClick={handleSignout} className='text-[#64748B] text-xs font-bold hover:underline'>
            Sign Out
          </button>
        </div>
        
        <button onClick={handleShowListings} className='text-[#1E4E91] text-xs font-bold w-full mt-8 py-3 border border-[#DDE1E6] rounded hover:bg-[#F3F4F6] transition-all uppercase tracking-wider'>
          Manage My Listings
        </button>
        
        {userListings && userListings.length > 0 &&
          <div className='mt-12 space-y-6'>
            <h2 className='text-lg font-bold text-[#111827]'>My Listings</h2>
            <div className='grid gap-3'>
              {userListings.map((listing) => (
                <div className='bg-[#F9FAFB] border border-[#DDE1E6] rounded p-3 flex justify-between items-center group hover:bg-white transition-all' key={listing._id}>
                  <Link to={`/listing/${listing._id}`} className='flex items-center gap-4 flex-1 truncate'>
                    <img className='h-12 w-12 object-cover rounded shadow-sm' src={listing.imageUrls[0]} alt="Listing" />
                    <p className='text-[#111827] text-sm font-bold hover:text-[#1E4E91] transition-colors truncate'>{listing.name}</p>
                  </Link>
                  <div className='flex gap-4 ml-4'>
                    <Link to={`/update-listing/${listing._id}`}>
                      <button className='text-[#059669] font-bold text-[10px] uppercase hover:underline'>Edit</button>
                    </Link>
                    <button onClick={() => handleDeleteListing(listing._id)} className='text-[#B91C1C] font-bold text-[10px] uppercase hover:underline'>Delete</button>
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
