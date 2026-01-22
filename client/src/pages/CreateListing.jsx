import { getDownloadURL, getStorage, uploadBytesResumable, ref } from 'firebase/storage';
import React, { useRef, useState } from 'react'
import { app } from '../firebase'
import{useSelector} from 'react-redux'
import { useNavigate } from 'react-router-dom';

export default function CreateListing() {
  const {currentUser} = useSelector(state => state.user)
  const navigate = useNavigate()
  const [files, setFiles] = useState([])
  const [formData, setFormData] = useState({
    imageUrls: [],
    name: '',
    description: '',
    address: '',
    type: 'rent',
    bedrooms: 1,
    bathrooms: 1,
    regularPrice: 0,
    discountPrice: 0,
    offer: false,
    parking: false,
    furnished: false,
  })
  const [imageUploadError, setImageUploadError] = useState (false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false)

  const handleImageSubmit = (e) => {
    if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
      setUploading(true);
      setImageUploadError(false);
      const promises = files.map(file => storeImge(file));
      Promise.all(promises)
        .then((urls) => {
          setFormData({ ...formData, imageUrls: formData.imageUrls.concat(urls) });
          setImageUploadError(false);
        })
        .catch((err) => {
          setImageUploadError('Image upload failed (max 2 MB per image).');
        })
        .finally(() => {
          setUploading(false);
        });
    } else if (files.length === 0) {
      setImageUploadError('You should upload at least one image.');
      setUploading(false);
    } else {
      setImageUploadError('You can only upload up to 6 images per listing.');
      setUploading(false);
    }
  };
  
  const storeImge = async (file) => {
    return new Promise((resolve, reject) => {
        const storage = getStorage(app);
        const fileName = new Date().getTime() + file.name;
        const storageRef = ref(storage, fileName);
        const uploadTask = uploadBytesResumable(storageRef, file);
        uploadTask.on (
            "state_changed",
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                console.log(`Upload is ${progress}% done`)
            },
            (error) => {
                reject(error);
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    resolve(downloadURL)
                });
            }
        )
    })
  }
  const handleRemoveImage = (index) => {
    setFormData({
      ...formData,
      imageUrls: formData.imageUrls.filter((_, i) => i !== index)  
    })
  };
  const handleChange = (e) => {
    if(e.target.id === 'sale' || e.target.id === 'rent'){
      setFormData({
        ...formData,
        type: e.target.id
      })
    }
    if(e.target.id === 'parking' || e.target.id === 'furnished' || e.target.id === 'offer'){
      setFormData({
        ...formData,
        [e.target.id]: e.target.checked
      })
    }
    if(e.target.type === 'number' || e.target.type === 'text' || e.target.type === 'textarea'){
      setFormData({
        ...formData,
        [e.target.id]: e.target.value
      })
    }
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if(formData.imageUrls.length < 1) return setError('You must upload at least one image')
      if(+formData.regularPrice < +formData.discountPrice) return setError('Discount price must be lower than regular price')
      setLoading(true)
      setError(false)
      const res = await fetch('/api/listing/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          userRef: currentUser._id,
        }),
      });
      const data = await res.json();
      setLoading(false);
      if (data.success === false){
        setError(data.message)
        return;
      }
      navigate(`/listing/${data._id}`)
    } catch (error) {
      setError(error.message)
      setLoading(false)
    }
  }
  return (
    <main className='p-6 max-w-5xl mx-auto min-h-screen'>
      <div className='bg-white rounded shadow-sm border border-[#DDE1E6] p-8 sm:p-12'>
        <div className='mb-10'>
          <h1 className='text-2xl font-bold text-[#111827] mb-1 text-center'>Create New Listing</h1>
          <p className='text-sm text-[#64748B] font-medium text-center'>Professional listing for the Ethiopian market</p>
        </div>
        
        <form onSubmit={handleSubmit} className='flex flex-col lg:flex-row gap-12'>
          <div className='flex flex-col gap-6 flex-1'>
            <div className='space-y-1.5'>
              <label className='text-[10px] font-bold text-[#64748B] uppercase tracking-wider ml-0.5'>Property Title</label>
              <input type="text" placeholder='Apartment in Bole' className='w-full border border-[#DDE1E6] p-3 rounded text-sm outline-none focus:ring-1 focus:ring-[#1E4E91] font-medium' id='name' maxLength='62' minLength='4' required onChange={handleChange} value={formData.name}/>
            </div>
            
            <div className='space-y-1.5'>
              <label className='text-[10px] font-bold text-[#64748B] uppercase tracking-wider ml-0.5'>Description</label>
              <textarea placeholder='Detailed property description...' className='w-full border border-[#DDE1E6] p-3 rounded text-sm outline-none focus:ring-1 focus:ring-[#1E4E91] font-medium h-32 resize-none' id='description' required onChange={handleChange} value={formData.description}/>
            </div>

            <div className='space-y-1.5'>
              <label className='text-[10px] font-bold text-[#64748B] uppercase tracking-wider ml-0.5'>Full Address</label>
              <input type="text" placeholder='Bole, Addis Ababa, Ethiopia' className='w-full border border-[#DDE1E6] p-3 rounded text-sm outline-none focus:ring-1 focus:ring-[#1E4E91] font-medium' id='address' maxLength='62' minLength='4' required onChange={handleChange} value={formData.address}/>
            </div>
            
            <div className='p-6 bg-[#F9FAFB] border border-[#DDE1E6] rounded space-y-6'>
              <div className='grid grid-cols-2 sm:grid-cols-3 gap-3'>
                <label className='flex items-center gap-2 cursor-pointer'>
                  <input type="checkbox" id='sale' className='w-4 h-4 rounded text-[#1E4E91]' onChange={handleChange} checked={formData.type==='sale'}/>
                  <span className='text-xs font-bold text-[#4B5563] uppercase'>Sell</span>
                </label>
                <label className='flex items-center gap-2 cursor-pointer'>
                  <input type="checkbox" id='rent' className='w-4 h-4 rounded text-[#1E4E91]' onChange={handleChange} checked={formData.type==='rent'}/>
                  <span className='text-xs font-bold text-[#4B5563] uppercase'>Rent</span>
                </label>
                <label className='flex items-center gap-2 cursor-pointer'>
                  <input type="checkbox" id='parking' className='w-4 h-4 rounded text-[#1E4E91]' onChange={handleChange} checked={formData.parking}/>
                  <span className='text-xs font-bold text-[#4B5563] uppercase'>Parking</span>
                </label>
                <label className='flex items-center gap-2 cursor-pointer'>
                  <input type="checkbox" id='furnished' className='w-4 h-4 rounded text-[#1E4E91]' onChange={handleChange} checked={formData.furnished}/>
                  <span className='text-xs font-bold text-[#4B5563] uppercase'>Furnished</span>
                </label>
                <label className='flex items-center gap-2 cursor-pointer'>
                  <input type="checkbox" id='offer' className='w-4 h-4 rounded text-[#1E4E91]'  onChange={handleChange} checked={formData.offer}/>
                  <span className='text-xs font-bold text-[#B91C1C] uppercase'>Offer</span>
                </label>
              </div>

              <div className='grid grid-cols-2 gap-4 border-t border-[#DDE1E6] pt-4'>
                <div className="space-y-1.5">
                  <label className='text-[9px] font-bold text-[#9CA3AF] uppercase tracking-widest'>Price {formData.type === 'rent' && '(ETB/mo)'}</label>
                  <input type="number" id='regularPrice' required className='w-full border border-[#DDE1E6] p-2.5 rounded font-bold text-[#1E4E91]' onChange={handleChange} value={formData.regularPrice}/>
                </div>
                {formData.offer && (
                  <div className="space-y-1.5">
                    <label className='text-[9px] font-bold text-[#B91C1C] uppercase tracking-widest'>Offer Price</label>
                    <input type="number" id='discountPrice' required className='w-full border border-[#DDE1E6] p-2.5 rounded font-bold text-[#B91C1C]' onChange={handleChange} value={formData.discountPrice}/>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className='flex flex-col flex-1 gap-8'>
            <div className='space-y-4'>
              <label className='text-[10px] font-bold text-[#64748B] uppercase tracking-wider'>Photos (Max 6)</label>
              <div className='border-2 border-dashed border-[#DDE1E6] rounded p-8 text-center bg-[#F9FAFB]'>
                <input onChange={(e)=> setFiles(Array.from(e.target.files))} className='hidden' type="file" id='images' accept='image/*' multiple/>
                <button type='button' onClick={() => document.getElementById('images').click()} className='text-[#1E4E91] font-bold text-xs uppercase hover:underline'>Add Images</button>
              </div>
              <button type='button' onClick={handleImageSubmit} className='w-full py-2.5 border border-[#1E4E91] text-[#1E4E91] rounded font-bold uppercase text-[10px] hover:bg-[#F3F4F6]' disabled={uploading}>{uploading ? 'Uploading...' : 'Confirm Images'}</button>
              
              <div className='grid grid-cols-2 gap-4 mt-4'>
                {formData.imageUrls.map((url, index) => (
                  <div key={url} className="relative group aspect-square rounded-sm overflow-hidden border border-[#DDE1E6]">
                    <img src={url} alt="listing" className='w-full h-full object-cover'/>
                    <button type='button' onClick={() => handleRemoveImage(index)} className='absolute top-1 right-1 bg-white p-1 rounded-sm text-[#B91C1C] shadow-sm opacity-0 group-hover:opacity-100 transition-opacity'>
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                  </div>   
                ))}
              </div>
            </div>

            <button disabled={loading || uploading} className='w-full bg-[#111827] text-white rounded py-4 font-bold uppercase text-xs hover:bg-black tracking-widest'>
              {loading ? 'Publishing...' : 'Publish Listing'}
            </button>
            {error && <p className='text-[#B91C1C] text-xs font-bold text-center'>{error}</p>}
          </div>
        </form>
      </div>
    </main>
  )
}
