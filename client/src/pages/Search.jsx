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
        setSidebardata ({...sidebardata, [e.target.id]: e.target.checked})
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
    <div className='flex flex-col md:flex-row max-w-7xl mx-auto'>
      <div className='p-6 border-b md:border-b-0 md:border-r border-[#E5E7EB] md:w-72 lg:w-80'>
        <h2 className='text-sm font-bold text-[#1A1D1F] uppercase tracking-wider mb-6 flex items-center gap-2'>
            <HiAdjustments className="text-[#0059E1]" /> Filters
        </h2>
        <form onSubmit={handleSubmit} className='space-y-8'>
          <div className='space-y-2'>
            <label className='text-[11px] font-bold text-[#64748B] uppercase tracking-tight'>Keyword</label>
            <div className='relative'>
                <input
                    type='text'
                    id='searchTerm'
                    placeholder='City, zip, address...'
                    className='w-full border border-[#D1D5DB] rounded p-2.5 text-sm outline-none focus:ring-1 focus:ring-[#0059E1]'
                    value={sidebardata.searchTerm}
                    onChange={handleChange}
                />
            </div>
          </div>

          <div className='space-y-3'>
            <label className='text-[11px] font-bold text-[#64748B] uppercase tracking-tight'>Property Type</label>
            <div className='space-y-2'>
              {['all', 'rent', 'sale'].map((type) => (
                <label key={type} className='flex items-center gap-2 cursor-pointer group'>
                    <input type='checkbox' id={type} className='w-4 h-4 rounded text-[#0059E1] border-[#D1D5DB] focus:ring-[#0059E1]' onChange={handleChange} checked={sidebardata.type === type}/>
                    <span className='text-sm text-[#4B5563] group-hover:text-[#1A1D1F] capitalize'>{type === 'all' ? 'Rent & Sale' : type}</span>
                </label>
              ))}
              <label className='flex items-center gap-2 cursor-pointer group'>
                <input type='checkbox' id='offer' className='w-4 h-4 rounded text-[#0059E1] border-[#D1D5DB] focus:ring-[#0059E1]' onChange={handleChange} checked={sidebardata.offer}/>
                <span className='text-sm text-[#4B5563] group-hover:text-[#1A1D1F]'>Special Offers</span>
              </label>
            </div>
          </div>

          <div className='space-y-3'>
            <label className='text-[11px] font-bold text-[#64748B] uppercase tracking-tight'>Amenities</label>
            <div className='space-y-2'>
              <label className='flex items-center gap-2 cursor-pointer group'>
                <input type='checkbox' id='parking' className='w-4 h-4 rounded text-[#0059E1] border-[#D1D5DB] focus:ring-[#0059E1]' onChange={handleChange} checked={sidebardata.parking}/>
                <span className='text-sm text-[#4B5563] group-hover:text-[#1A1D1F]'>Parking</span>
              </label>
              <label className='flex items-center gap-2 cursor-pointer group'>
                <input type='checkbox' id='furnished' className='w-4 h-4 rounded text-[#0059E1] border-[#D1D5DB] focus:ring-[#0059E1]' onChange={handleChange} checked={sidebardata.furnished}/>
                <span className='text-sm text-[#4B5563] group-hover:text-[#1A1D1F]'>Furnished</span>
              </label>
            </div>
          </div>

          <div className='space-y-2'>
            <label className='text-[11px] font-bold text-[#64748B] uppercase tracking-tight'>Sort by</label>
            <select onChange={handleChange} defaultValue={'createdAt_desc'} id='sort_order' className='w-full border border-[#D1D5DB] rounded p-2 text-sm bg-white outline-none'>
                <option value='regularPrice_desc'>Price (High to Low)</option>
                <option value='regularPrice_asc'>Price (Low to High)</option>
                <option value='createdAt_desc'>Newest first</option>
                <option value='createdAt_asc'>Oldest first</option>
            </select>
          </div>
          
          <button className='w-full bg-[#0059E1] text-white font-bold py-2.5 rounded hover:bg-[#0047B3] transition-colors text-sm shadow-sm'>
            Apply Filters
          </button>
        </form>
      </div>

      <div className='flex-1 p-6'>
        <div className='flex items-center justify-between mb-6 pb-2 border-b border-[#F3F4F6]'>
            <h1 className='text-xl font-bold text-[#1A1D1F]'>{listings.length} Results Found</h1>
        </div>
        
        <div className='grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6'>
            {!loading && listings.length === 0 && (
                <div className='col-span-full py-20 text-center'>
                    <p className='text-lg font-bold text-[#1A1D1F]'>No matches found</p>
                    <p className='text-[#64748B] text-sm'>Try broadening your search or clearing filters.</p>
                </div>
            )}
            {loading && (
                <div className='col-span-full py-20 text-center'>
                    <div className='w-8 h-8 border-2 border-[#E5E7EB] border-t-[#0059E1] rounded-full animate-spin mx-auto mb-4'></div>
                    <p className='text-[#64748B] text-sm font-medium'>Searching properties...</p>
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
                className='px-8 py-2 border border-[#D1D5DB] text-[#4B5563] text-sm font-bold rounded hover:bg-[#F9F9FB] transition-colors'
            >
                Load more
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Search