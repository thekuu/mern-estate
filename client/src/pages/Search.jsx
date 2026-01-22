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
      <div className='p-6 bg-white border-b md:border-r md:w-72 lg:w-80'>
        <h2 className='text-sm font-bold text-gray-900 uppercase tracking-wider mb-6'>Filters</h2>
        <form onSubmit={handleSubmit} className='flex flex-col gap-8'>
          <div className='space-y-2'>
            <label className='text-xs font-semibold text-gray-500 uppercase'>Search</label>
            <div className='relative'>
                <input
                    type='text'
                    id='searchTerm'
                    placeholder='City, address, zip...'
                    className='w-full border border-gray-300 rounded-md py-2 pl-9 pr-3 text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all'
                    value={sidebardata.searchTerm}
                    onChange={handleChange}
                />
                <HiSearch className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg' />
            </div>
          </div>

          <div className='space-y-2'>
            <label className='text-xs font-semibold text-gray-500 uppercase'>Category</label>
            <div className='flex flex-col gap-2.5'>
              <label className='flex items-center gap-2 cursor-pointer'>
                <input type='checkbox' id='all' className='w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500' onChange={handleChange} checked={sidebardata.type === 'all'}/>
                <span className='text-sm text-gray-700'>All properties</span>
              </label>
              <label className='flex items-center gap-2 cursor-pointer'>
                <input type='checkbox' id='rent' className='w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500' onChange={handleChange} checked={sidebardata.type === 'rent'}/>
                <span className='text-sm text-gray-700'>For rent</span>
              </label>
              <label className='flex items-center gap-2 cursor-pointer'>
                <input type='checkbox' id='sale' className='w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500' onChange={handleChange} checked={sidebardata.type === 'sale'}/>
                <span className='text-sm text-gray-700'>For sale</span>
              </label>
              <label className='flex items-center gap-2 cursor-pointer'>
                <input type='checkbox' id='offer' className='w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500' onChange={handleChange} checked={sidebardata.offer}/>
                <span className='text-sm text-gray-700 font-medium text-blue-600'>Active offers</span>
              </label>
            </div>
          </div>

          <div className='space-y-2'>
            <label className='text-xs font-semibold text-gray-500 uppercase'>Amenities</label>
            <div className='flex flex-col gap-2.5'>
              <label className='flex items-center gap-2 cursor-pointer'>
                <input type='checkbox' id='parking' className='w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500' onChange={handleChange} checked={sidebardata.parking}/>
                <span className='text-sm text-gray-700'>Parking</span>
              </label>
              <label className='flex items-center gap-2 cursor-pointer'>
                <input type='checkbox' id='furnished' className='w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500' onChange={handleChange} checked={sidebardata.furnished}/>
                <span className='text-sm text-gray-700'>Furnished</span>
              </label>
            </div>
          </div>

          <div className='space-y-2'>
            <label className='text-xs font-semibold text-gray-500 uppercase'>Sort by</label>
            <select onChange={handleChange} defaultValue={'createdAt_desc'} id='sort_order' className='w-full border border-gray-300 rounded-md py-2 px-3 text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none'>
                <option value='regularPrice_desc'>Price (High to Low)</option>
                <option value='regularPrice_asc'>Price (Low to High)</option>
                <option value='createdAt_desc'>Newest arrivals</option>
                <option value='createdAt_asc'>Oldest listings</option>
            </select>
          </div>
          
          <button className='w-full bg-blue-600 text-white font-bold py-2.5 rounded-md hover:bg-blue-700 transition-all active:scale-[0.98] text-sm mt-2'>
            Apply Filters
          </button>
        </form>
      </div>

      <div className='flex-1 p-6 lg:p-10'>
        <div className='flex items-center justify-between mb-8 pb-4 border-b border-gray-100'>
            <h1 className='text-xl font-bold text-gray-900'>{listings.length} Results found</h1>
            <div className='text-xs text-gray-400 font-medium hidden sm:block uppercase tracking-wider'>Properties in Ethiopia</div>
        </div>
        
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6'>
            {!loading && listings.length === 0 && (
                <div className='col-span-full flex flex-col items-center justify-center py-24 text-center'>
                    <p className='text-lg font-bold text-gray-900 mb-2'>No properties matched your search</p>
                    <p className='text-gray-500 text-sm max-w-xs'>Try adjusting your filters or checking your spelling to find results.</p>
                </div>
            )}
            {loading && (
                <div className='col-span-full flex flex-col items-center justify-center py-24 gap-3'>
                    <div className='w-8 h-8 border-2 border-gray-200 border-t-blue-600 rounded-full animate-spin'></div>
                    <p className='text-gray-400 text-xs font-medium uppercase tracking-widest'>Updating results...</p>
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
                className='px-8 py-2 border border-gray-300 text-gray-700 font-semibold text-sm rounded-md hover:bg-gray-50 transition-all active:scale-[0.98]'
            >
                Load more listings
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Search
