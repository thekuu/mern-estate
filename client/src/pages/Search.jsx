import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ListingItem from '../components/ListingItem'
import { HiAdjustments, HiSearch } from 'react-icons/hi'

function Search() {
    const navigate = useNavigate ()
    const [sidebardata, setSidebardata] = useState({
        searchTerm: '',
        type: 'all',
        parking: false,
        furnished: false,
        offer: false,
        sort: 'createdAt',
        order:'desc',
    })
    const [loading, setLoading] = useState(false)
    const [listings, setListings] = useState([])
    const [showMore, setShowMore] = useState(false)
    
    useEffect(() => {
      const urlParams  = new URLSearchParams(location.search);
      const searchTermFromUrl = urlParams.get('searchTerm')
      const typeFromUrl = urlParams.get('type')
      const parkingFromUrl = urlParams.get('parking')
      const furnishedFromUrl = urlParams.get('furnished')
      const offerFromUrl = urlParams.get('offer')
      const sortFromUrl = urlParams.get('sort')
      const orderFromUrl = urlParams.get('order')
      if(
        searchTermFromUrl ||
        typeFromUrl ||
        parkingFromUrl ||
        furnishedFromUrl ||
        offerFromUrl ||
        sortFromUrl ||
        orderFromUrl
      ) {
        setSidebardata({
          searchTerm: searchTermFromUrl || '',
          type: typeFromUrl || 'all',
          parking: parkingFromUrl === 'true' ? true : false ,
          furnished: furnishedFromUrl === 'true' ? true : false,
          offer: offerFromUrl === 'true' ? true : false,
          sort: sortFromUrl || 'createdAt',
          order: orderFromUrl || 'desc',
        })
      }
      const fetchListings = async () => {
        setLoading(true)
        setShowMore(false)
        const searchQuery = urlParams.toString()
        const res = await fetch(`/api/listing/get?${searchQuery}`)
        const data = await res.json();
        if(data.length > 8) {
          setShowMore(true);
        } else {
          setShowMore(false)
        }
        setListings(data);
        setLoading(false)
      }
      fetchListings()
      
    }, [location.search])

    const handleChange = (e) => {
      if (e.target.id === 'all' || e.target.id === 'rent' || e.target.id === 'sale') {
        setSidebardata ({...sidebardata, type: e.target.id})
      }
      if(e.target.id === 'searchTerm') {
        setSidebardata ({...sidebardata, searchTerm: e.target.value})
      }
      if(e.target.id === 'parking' || e.target.id === 'furnished' || e.target.id === 'offer') {
        setSidebardata ({...sidebardata, [e.target.id]: e.target.checked || e.target.checked === 'true' ? true : false})
      }
      if (e.target.id === 'sort_order') {
        const sort = e.target.value.split('_')[0] || 'createdAt'
        const order = e.target.value.split('_')[1] || 'desc'
        setSidebardata ({...sidebardata, sort, order})
      }
    }

    const handleSubmit = (e) => {
      e.preventDefault()
      const urlParams = new URLSearchParams()
      urlParams.set('searchTerm', sidebardata.searchTerm)
      urlParams.set('type', sidebardata.type)
      urlParams.set('parking', sidebardata.parking)
      urlParams.set('furnished', sidebardata.furnished)
      urlParams.set('offer', sidebardata.offer)
      urlParams.set('sort', sidebardata.sort)
      urlParams.set('order', sidebardata.order)
      const searchQuery = urlParams.toString()
      navigate(`/search?${searchQuery}`)
    }

    const onShowMoreClick = async () => {
      const numberOfListings = listings.length
      const startIndex = numberOfListings
      const urlParams = new URLSearchParams(location.search)
      urlParams.set('startIndex', startIndex)
      const searchQuery = urlParams.toString()
      const res = await fetch(`/api/listing/get?${searchQuery}`)
      const data = await res.json()
      if (data.length < 9) {
        setShowMore(false)
      }
      setListings([...listings, ...data])
    }

  return (
    <div className='flex flex-col md:flex-row bg-white min-h-screen'>
      <div className='p-8 bg-white border-b md:border-r md:w-80 lg:w-96'>
        <div className='mb-10'>
            <h2 className='text-xs font-bold text-gray-400 uppercase tracking-[0.2em] mb-2'>Search & Refine</h2>
            <p className='text-gray-900 font-bold text-2xl'>Filters</p>
        </div>
        <form onSubmit={handleSubmit} className='flex flex-col gap-10'>
          <div className='space-y-3'>
            <label className='text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1'>Quick Search</label>
            <div className='relative group'>
                <input
                    type='text'
                    id='searchTerm'
                    placeholder='Addis Ababa, Bole...'
                    className='w-full border-b border-gray-200 py-3 pl-8 pr-3 text-sm font-medium focus:border-gray-900 outline-none transition-all placeholder:italic placeholder:opacity-50'
                    value={sidebardata.searchTerm}
                    onChange={handleChange}
                />
                <HiSearch className='absolute left-0 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-gray-900 transition-colors' />
            </div>
          </div>

          <div className='space-y-4'>
            <label className='text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1'>Classification</label>
            <div className='flex flex-col gap-3.5'>
              {[
                {id: 'all', label: 'All Properties'},
                {id: 'rent', label: 'Rentals Only'},
                {id: 'sale', label: 'For Purchase'},
                {id: 'offer', label: 'Active Promotions', color: 'text-orange-600'}
              ].map((item) => (
                <label key={item.id} className='flex items-center gap-3 cursor-pointer group'>
                    <div className='w-4 h-4 rounded-sm border border-gray-300 flex items-center justify-center transition-colors group-hover:border-gray-900'>
                        <input 
                            type='checkbox' 
                            id={item.id} 
                            className='peer absolute opacity-0 w-4 h-4 cursor-pointer' 
                            onChange={handleChange} 
                            checked={item.id === 'offer' ? sidebardata.offer : sidebardata.type === item.id}
                        />
                        <div className='w-2 h-2 bg-gray-900 scale-0 peer-checked:scale-100 transition-transform duration-200'></div>
                    </div>
                    <span className={`text-sm tracking-wide ${item.color || 'text-gray-600'} group-hover:text-gray-900 transition-colors`}>{item.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div className='space-y-4 pt-4 border-t border-gray-50'>
            <label className='text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1'>Essential Amenities</label>
            <div className='flex flex-col gap-3.5'>
              {[
                {id: 'parking', label: 'Dedicated Parking'},
                {id: 'furnished', label: 'Fully Furnished'}
              ].map((item) => (
                <label key={item.id} className='flex items-center gap-3 cursor-pointer group'>
                    <div className='w-4 h-4 rounded-sm border border-gray-300 flex items-center justify-center transition-colors group-hover:border-gray-900'>
                        <input 
                            type='checkbox' 
                            id={item.id} 
                            className='peer absolute opacity-0 w-4 h-4 cursor-pointer' 
                            onChange={handleChange} 
                            checked={sidebardata[item.id]}
                        />
                        <div className='w-2 h-2 bg-gray-900 scale-0 peer-checked:scale-100 transition-transform duration-200'></div>
                    </div>
                    <span className='text-sm tracking-wide text-gray-600 group-hover:text-gray-900 transition-colors'>{item.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div className='space-y-3 pt-4 border-t border-gray-50'>
            <label className='text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1'>Ordering</label>
            <select onChange={handleChange} defaultValue={'createdAt_desc'} id='sort_order' className='w-full border-b border-gray-200 py-3 text-sm font-medium focus:border-gray-900 outline-none cursor-pointer bg-transparent uppercase tracking-wider'>
                <option value='regularPrice_desc'>Price Descending</option>
                <option value='regularPrice_asc'>Price Ascending</option>
                <option value='createdAt_desc'>Newly Listed</option>
                <option value='createdAt_asc'>Established Listings</option>
            </select>
          </div>
          
          <button className='btn-primary mt-6 uppercase text-[10px] tracking-[0.2em] font-black h-14'>
            Apply Selection
          </button>
        </form>
      </div>

      <div className='flex-1 p-8 lg:p-16'>
        <div className='flex items-end justify-between mb-16 border-b border-gray-100 pb-8'>
            <div>
                <h1 className='text-4xl font-bold text-gray-900 mb-2'>{listings.length} Results Found</h1>
                <p className='text-xs text-gray-400 font-medium uppercase tracking-[0.2em]'>Selected Residencies • Ethiopia</p>
            </div>
        </div>
        
        <div className='grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-12'>
            {!loading && listings.length === 0 && (
                <div className='col-span-full flex flex-col items-center justify-center py-32 text-center'>
                    <p className='text-2xl font-bold text-gray-900 mb-4 font-display italic'>No matches found</p>
                    <p className='text-gray-400 text-sm max-w-xs leading-relaxed'>Refine your search parameters or explore our private collections for alternative options.</p>
                </div>
            )}
            {loading && (
                <div className='col-span-full flex flex-col items-center justify-center py-32 gap-4'>
                    <div className='w-10 h-10 border border-gray-100 border-t-gray-900 rounded-full animate-spin'></div>
                    <p className='text-gray-400 text-[10px] font-bold uppercase tracking-[0.3em]'>Refining...</p>
                </div>
            )}
            {!loading && listings && listings.map((listing) => (
                <ListingItem key={listing._id} listing={listing}/>
            ))}
        </div>
        
        {showMore && (
          <div className='flex justify-center mt-20'>
            <button 
                onClick={onShowMoreClick} 
                className='px-12 py-4 border border-gray-900 text-gray-900 font-bold text-[10px] uppercase tracking-[0.3em] hover:bg-gray-900 hover:text-white transition-all duration-500'
            >
                Load More Results
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Search
