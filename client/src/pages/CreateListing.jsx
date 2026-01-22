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
  console.log(formData)
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
      }
      navigate(`/listing/${data._id}`)
    } catch (error) {
      setError(error.message)
      setLoading(false)
    }
  }
  return (
    <main className='p-6 max-w-5xl mx-auto min-h-screen'>
      <div className='bg-white rounded-3xl shadow-xl shadow-slate-200 border border-slate-100 p-8 sm:p-12'>
        <div className='mb-10'>
          <h1 className='text-3xl font-black text-slate-900 mb-2 text-center'>Create New Listing</h1>
          <p className='text-slate-500 font-medium text-center'>Fill in the details to showcase your property</p>
        </div>
        
        <form onSubmit={handleSubmit} className='flex flex-col lg:flex-row gap-12'>
          <div className='flex flex-col gap-6 flex-1'>
            <div className='space-y-1'>
              <label className='text-xs font-bold text-slate-400 uppercase ml-1'>Property Title</label>
              <input type="text" placeholder='Modern Luxury Villa' className='w-full bg-slate-50 border border-slate-200 p-4 rounded-xl outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 transition-all font-medium' id='name' maxLength='62' minLength='4' required onChange={handleChange} value={formData.name}/>
            </div>
            
            <div className='space-y-1'>
              <label className='text-xs font-bold text-slate-400 uppercase ml-1'>Description</label>
              <textarea placeholder='Describe the beautiful features of your property...' className='w-full bg-slate-50 border border-slate-200 p-4 rounded-xl outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 transition-all font-medium h-32 resize-none' id='description' required onChange={handleChange} value={formData.description}/>
            </div>
            
            <div className='space-y-1'>
              <label className='text-xs font-bold text-slate-400 uppercase ml-1'>Full Address</label>
              <input type="text" placeholder='Bole, Addis Ababa, Ethiopia' className='w-full bg-slate-50 border border-slate-200 p-4 rounded-xl outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 transition-all font-medium' id='address' maxLength='62' minLength='4' required onChange={handleChange} value={formData.address}/>
            </div>

            <div className='p-6 bg-slate-50 rounded-2xl border border-slate-100 space-y-6'>
              <label className='text-sm font-bold text-slate-900 uppercase tracking-wider block mb-4'>Details & Amenities</label>
              <div className='grid grid-cols-2 sm:grid-cols-3 gap-4'>
                <label className='flex items-center gap-3 p-3 rounded-xl border border-white bg-white cursor-pointer shadow-sm hover:border-indigo-200 transition-all has-[:checked]:bg-indigo-50 has-[:checked]:border-indigo-500'>
                  <input type="checkbox" id='sale' className='hidden' onChange={handleChange} checked={formData.type==='sale'}/>
                  <span className='text-xs font-bold uppercase'>Sell</span>
                </label>
                <label className='flex items-center gap-3 p-3 rounded-xl border border-white bg-white cursor-pointer shadow-sm hover:border-indigo-200 transition-all has-[:checked]:bg-indigo-50 has-[:checked]:border-indigo-500'>
                  <input type="checkbox" id='rent' className='hidden' onChange={handleChange} checked={formData.type==='rent'}/>
                  <span className='text-xs font-bold uppercase'>Rent</span>
                </label>
                <label className='flex items-center gap-3 p-3 rounded-xl border border-white bg-white cursor-pointer shadow-sm hover:border-indigo-200 transition-all has-[:checked]:bg-indigo-50 has-[:checked]:border-indigo-500'>
                  <input type="checkbox" id='parking' className='hidden' onChange={handleChange} checked={formData.parking}/>
                  <span className='text-xs font-bold uppercase'>Parking</span>
                </label>
                <label className='flex items-center gap-3 p-3 rounded-xl border border-white bg-white cursor-pointer shadow-sm hover:border-indigo-200 transition-all has-[:checked]:bg-indigo-50 has-[:checked]:border-indigo-500'>
                  <input type="checkbox" id='furnished' className='hidden' onChange={handleChange} checked={formData.furnished}/>
                  <span className='text-xs font-bold uppercase'>Furnished</span>
                </label>
                <label className='flex items-center gap-3 p-3 rounded-xl border border-white bg-white cursor-pointer shadow-sm hover:border-indigo-200 transition-all has-[:checked]:bg-indigo-50 has-[:checked]:border-indigo-500'>
                  <input type="checkbox" id='offer' className='hidden'  onChange={handleChange} checked={formData.offer}/>
                  <span className='text-xs font-bold uppercase text-emerald-600'>Offer</span>
                </label>
              </div>

              <div className='grid grid-cols-2 gap-6 pt-4'>
                <div className="space-y-2">
                  <label className='text-[10px] font-black text-slate-400 uppercase tracking-widest'>Bedrooms</label>
                  <input type="number" id='bedrooms' min='1' max='10' required className='w-full bg-white border border-slate-200 p-3 rounded-xl' onChange={handleChange} value={formData.bedrooms}/>
                </div>
                <div className="space-y-2">
                  <label className='text-[10px] font-black text-slate-400 uppercase tracking-widest'>Bathrooms</label>
                  <input type="number" id='bathrooms' min='1' max='10' required className='w-full bg-white border border-slate-200 p-3 rounded-xl' onChange={handleChange} value={formData.bathrooms}/>
                </div>
              </div>

              <div className='space-y-4 pt-4 border-t border-slate-200'>
                <div className="flex items-center justify-between gap-4">
                  <div className='flex-1'>
                    <label className='text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1'>Regular Price {formData.type === 'rent' && '(ETB / mo)'}</label>
                    <input type="number" id='regularPrice' required className='w-full bg-white border border-slate-200 p-3 rounded-xl font-bold text-lg text-indigo-600' onChange={handleChange} value={formData.regularPrice}/>
                  </div>
                  {formData.offer && (
                    <div className='flex-1'>
                      <label className='text-[10px] font-black text-emerald-500 uppercase tracking-widest block mb-1'>Offer Price {formData.type === 'rent' && '(ETB / mo)'}</label>
                      <input type="number" id='discountPrice' required className='w-full bg-white border border-emerald-200 p-3 rounded-xl font-bold text-lg text-emerald-600' onChange={handleChange} value={formData.discountPrice}/>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className='flex flex-col flex-1 gap-8'>
            <div className='space-y-4'>
              <div className='flex items-center justify-between'>
                <label className='text-sm font-bold text-slate-900 uppercase tracking-wider'>Property Images</label>
                <span className='text-[10px] font-bold text-slate-400 uppercase'>(Max 6)</span>
              </div>
              <div className='bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl p-8 text-center space-y-4 group hover:border-indigo-400 transition-colors'>
                <div className='flex flex-col items-center gap-2'>
                  <div className='w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm text-slate-400 group-hover:text-indigo-600 transition-colors'>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <p className='text-xs font-bold text-slate-500'>Drag & drop or click to upload</p>
                </div>
                <input onChange={(e)=> setFiles(Array.from(e.target.files))} className='hidden' type="file" id='images' accept='image/*' multiple/>
                <button type='button' onClick={() => document.getElementById('images').click()} className='text-indigo-600 font-bold text-sm hover:underline'>Browse Files</button>
              </div>
              
              <button type='button' onClick={handleImageSubmit} className='w-full py-3 border-2 border-emerald-500 text-emerald-600 rounded-xl font-bold uppercase hover:bg-emerald-500 hover:text-white transition-all active:scale-95 text-xs' disabled={uploading}>{uploading ? 'Uploading...' : 'Confirm Upload'}</button>
              
              {imageUploadError && <p className='text-red-500 text-xs font-bold text-center bg-red-50 py-2 rounded-lg'>{imageUploadError}</p>}
              
              <div className='grid grid-cols-2 gap-4 mt-4'>
                {formData.imageUrls.map((url, index) => (
                  <div key={url} className="relative group aspect-square rounded-2xl overflow-hidden border border-slate-100 shadow-sm">
                    <img src={url} alt="listing" className='w-full h-full object-cover'/>
                    <div className='absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center'>
                      <button type='button' onClick={() => handleRemoveImage(index)} className='bg-red-500 text-white p-2 rounded-full hover:scale-110 transition-transform'>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>   
                ))}
              </div>
            </div>

            <div className='pt-8 border-t border-slate-100 space-y-4'>
              <button disabled={loading || uploading} className='w-full bg-slate-900 text-white rounded-2xl py-5 font-black uppercase hover:bg-slate-800 disabled:opacity-50 transition-all shadow-xl shadow-slate-200 active:scale-95 tracking-widest'>
                {loading ? 'Creating Listing...' : 'Publish Property'}
              </button>
              {error && <p className='text-red-500 text-sm font-bold text-center'>{error}</p>}
            </div>
          </div>
        </form>
      </div>
    </main>
  )
}
