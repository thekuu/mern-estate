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
    <div className='flex flex-col md:flex-row bg-slate-50 min-h-screen'>
      <div className='p-7 bg-white border-b-2 md:border-r-2 md:w-80 lg:w-96 shadow-sm z-10'>
        <div className='flex items-center gap-2 mb-8'>
            <HiAdjustments className='text-indigo-600 text-2xl' />
            <h2 className='text-xl font-bold text-slate-800 uppercase tracking-tight'>Filters</h2>
        </div>
        <form onSubmit={handleSubmit} className='flex flex-col gap-10'>
          <div className='space-y-4'>
            <label className='text-sm font-bold text-slate-900 uppercase tracking-wider'>Search</label>
            <div className='relative'>
                <input
                    type='text'
                    id='searchTerm'
                    placeholder='Apartments, Houses...'
                    className='w-full bg-slate-50 border border-slate-200 rounded-xl p-4 pl-12 text-sm focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 outline-none transition-all'
                    value={sidebardata.searchTerm}
                    onChange={handleChange}
                />
                <HiSearch className='absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg' />
            </div>
          </div>

          <div className='space-y-4'>
            <label className='text-sm font-bold text-slate-900 uppercase tracking-wider'>Category</label>
            <div className='grid grid-cols-2 gap-3'>
              <label className='flex items-center gap-3 p-3 rounded-xl border border-slate-100 bg-slate-50 cursor-pointer hover:border-indigo-300 transition-colors has-[:checked]:bg-indigo-50 has-[:checked]:border-indigo-500'>
                <input type='checkbox' id='all' className='hidden' onChange={handleChange} checked={sidebardata.type === 'all'}/>
                <span className='text-sm font-medium'>All</span>
              </label>
              <label className='flex items-center gap-3 p-3 rounded-xl border border-slate-100 bg-slate-50 cursor-pointer hover:border-indigo-300 transition-colors has-[:checked]:bg-indigo-50 has-[:checked]:border-indigo-500'>
                <input type='checkbox' id='rent' className='hidden' onChange={handleChange} checked={sidebardata.type === 'rent'}/>
                <span className='text-sm font-medium'>Rent</span>
              </label>
              <label className='flex items-center gap-3 p-3 rounded-xl border border-slate-100 bg-slate-50 cursor-pointer hover:border-indigo-300 transition-colors has-[:checked]:bg-indigo-50 has-[:checked]:border-indigo-500'>
                <input type='checkbox' id='sale' className='hidden' onChange={handleChange} checked={sidebardata.type === 'sale'}/>
                <span className='text-sm font-medium'>Sale</span>
              </label>
              <label className='flex items-center gap-3 p-3 rounded-xl border border-slate-100 bg-slate-50 cursor-pointer hover:border-indigo-300 transition-colors has-[:checked]:bg-indigo-50 has-[:checked]:border-indigo-500'>
                <input type='checkbox' id='offer' className='hidden' onChange={handleChange} checked={sidebardata.offer}/>
                <span className='text-sm font-medium'>Offer</span>
              </label>
            </div>
          </div>

          <div className='space-y-4'>
            <label className='text-sm font-bold text-slate-900 uppercase tracking-wider'>Amenities</label>
            <div className='flex flex-col gap-3'>
              <label className='flex items-center gap-3 cursor-pointer group'>
                <div className='relative flex items-center justify-center w-5 h-5 border-2 border-slate-300 rounded-md group-hover:border-indigo-500 transition-colors'>
                    <input type='checkbox' id='parking' className='peer absolute opacity-0 w-full h-full cursor-pointer' onChange={handleChange} checked={sidebardata.parking}/>
                    <div className='w-3 h-3 bg-indigo-600 rounded-sm scale-0 peer-checked:scale-100 transition-transform'></div>
                </div>
                <span className='text-sm font-medium text-slate-600'>Parking Available</span>
              </label>
              <label className='flex items-center gap-3 cursor-pointer group'>
                <div className='relative flex items-center justify-center w-5 h-5 border-2 border-slate-300 rounded-md group-hover:border-indigo-500 transition-colors'>
                    <input type='checkbox' id='furnished' className='peer absolute opacity-0 w-full h-full cursor-pointer' onChange={handleChange} checked={sidebardata.furnished}/>
                    <div className='w-3 h-3 bg-indigo-600 rounded-sm scale-0 peer-checked:scale-100 transition-transform'></div>
                </div>
                <span className='text-sm font-medium text-slate-600'>Fully Furnished</span>
              </label>
            </div>
          </div>

          <div className='space-y-4'>
            <label className='text-sm font-bold text-slate-900 uppercase tracking-wider'>Sort Results</label>
            <select onChange={handleChange} defaultValue={'createdAt_desc'} id='sort_order' className='w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm font-medium outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400'>
                <option value='regularPrice_desc'>Price high to low</option>
                <option value='regularPrice_asc'>Price low to high</option>
                <option value='createdAt_desc'>Latest properties</option>
                <option value='createdAt_asc'>Oldest properties</option>
            </select>
          </div>
          
          <button className='w-full bg-indigo-600 text-white font-bold py-4 rounded-2xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 active:scale-95'>
            Apply Filters
          </button>
        </form>
      </div>

      <div className='flex-1 p-8'>
        <div className='flex items-center justify-between mb-8 pb-4 border-b border-slate-200'>
            <h1 className='text-2xl font-black text-slate-900'>Found {listings.length} Results</h1>
            <div className='text-sm text-slate-500 font-medium hidden sm:block'>Showing properties across Ethiopia</div>
        </div>
        
        <div className='grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-8'>
            {!loading && listings.length === 0 && (
                <div className='col-span-full flex flex-col items-center justify-center py-20 text-center space-y-4'>
                    <div className='bg-slate-100 p-6 rounded-full'>
                        <HiSearch className='text-5xl text-slate-300' />
                    </div>
                    <p className='text-xl font-bold text-slate-800'>No properties found!</p>
                    <p className='text-slate-500 max-w-xs'>Try adjusting your filters or search terms to find what you're looking for.</p>
                </div>
            )}
            {loading && (
                <div className='col-span-full flex flex-col items-center justify-center py-20 gap-4'>
                    <div className='w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin'></div>
                    <p className='text-slate-500 font-medium'>Fetching property listings...</p>
                </div>
            )}
            {!loading && listings && listings.map((listing) => (
                <ListingItem key={listing._id} listing={listing}/>
            ))}
        </div>
        
        {showMore && (
          <div className='flex justify-center mt-12'>
            <button 
                onClick={onShowMoreClick} 
                className='px-10 py-3 border-2 border-slate-200 text-slate-600 font-bold rounded-full hover:bg-indigo-600 hover:border-indigo-600 hover:text-white transition-all active:scale-95'
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
