import React from 'react'

export default function About() {
  return (
    <div className='hero-gradient min-h-screen'>
      <div className='py-20 px-6 max-w-4xl mx-auto'>
        <div className='bg-white rounded-3xl shadow-xl shadow-slate-200 border border-slate-100 p-8 sm:p-12 space-y-8'>
          <div className='inline-block px-4 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-xs font-bold uppercase tracking-widest'>
            Our Story
          </div>
          <h1 className='text-4xl sm:text-5xl font-black text-slate-900 leading-tight'>
            Elevating the <span className='text-indigo-600'>Real Estate</span> Experience
          </h1>
          <div className='space-y-6 text-lg text-slate-600 leading-relaxed font-medium'>
            <p>
              Homi Estate is more than just a real estate agency; we are a dedicated team of professionals 
              committed to transforming how you find your next home. Our expertise spans the most 
              desirable neighborhoods, ensuring that whether you're buying, selling, or renting, 
              you're always in good hands.
            </p>
            <p>
              Our mission is simple: to empower our clients with expert market insights and 
              personalized service. We believe that property transactions should be exciting 
              milestones, not stressful processes. By blending deep local knowledge with 
              modern technology, we bring ease to every step of your journey.
            </p>
            <p>
              We pride ourselves on the relationships we build. To us, you're not just a client; 
              you're a partner in finding a space where memories are made. Our agents bring 
              years of industry experience to the table, focused entirely on delivering 
              results that exceed your expectations.
            </p>
          </div>
          
          <div className='grid grid-cols-1 sm:grid-cols-3 gap-8 pt-8 border-t border-slate-100'>
            <div className='text-center space-y-1'>
                <div className='text-3xl font-black text-indigo-600'>10+</div>
                <div className='text-xs font-bold text-slate-400 uppercase tracking-widest'>Years Experience</div>
            </div>
            <div className='text-center space-y-1'>
                <div className='text-3xl font-black text-indigo-600'>5k+</div>
                <div className='text-xs font-bold text-slate-400 uppercase tracking-widest'>Properties Sold</div>
            </div>
            <div className='text-center space-y-1'>
                <div className='text-3xl font-black text-indigo-600'>99%</div>
                <div className='text-xs font-bold text-slate-400 uppercase tracking-widest'>Happy Clients</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}