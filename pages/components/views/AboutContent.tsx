import React, { useState, useEffect } from 'react';
import Image from 'next/image'
import { signIn, useSession } from 'next-auth/react';


export  function AboutContent(){
  const { data: session, status } = useSession();
  const [currentAboutImageIndex, setCurrentAboutImageIndex] = useState(0);
  const about_images = [
    'https://res.cloudinary.com/busy-bee/image/upload/v1681391705/main/homePageHorizontal_ctpbfa.jpg',
  'https://res.cloudinary.com/busy-bee/image/upload/v1681391649/about/aboutPic15_n3eokt.jpg',
    'https://res.cloudinary.com/busy-bee/image/upload/v1681391680/blogPics/inTheKnowArequipa/arequipa1_gjwlqi.jpg'
  ];
  useEffect(() => {
    const interval = setInterval(() => {
      const nextIndex = (currentAboutImageIndex + 1) % about_images.length;
      setCurrentAboutImageIndex(nextIndex);
    },  3000); // Switch images every 3 seconds

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, [currentAboutImageIndex, about_images.length]);

  
  return(
    <div className="relative w-screen h-auto flex items-center justify-center p-8 bg-white" style={{ paddingTop: '10vh', paddingBottom: '10vh' }}>
  <div className="flex flex-col lg:flex-row w-4/5 lg:w-2/3 space-y-8 lg:space-y-0 lg:space-x-8 justify-center items-center">
    {/* Image Block */}
    <div className="relative w-full lg:w-1/2 bg-white shadow-2xl rounded-sm overflow-hidden" style={{ height: '60vh' }}>
      <Image
        src={about_images[currentAboutImageIndex]}
        alt={`About Slide ${currentAboutImageIndex}`}
        fill 
        style={{ objectFit: 'cover' }}
        className="rounded-sm"
      />
    </div>

    {/* Text Block */}
    <div className="w-full lg:w-1/2 flex flex-col items-start justify-center roaming-white p-6 bg-gray-50 rounded-sm shadow-lg">
      {/* Header Text */}
      <h1 className="text-3xl lg:text-4xl font-bold text-gray-800">Hi! We're Roaming In The Know!</h1>
      
      {/* Yellow Dash */}
      <div className="w-20 h-1 bg-yellow-500 mt-2 rounded-full"></div>
      
      {/* Paragraph Text */}
      <p className="text-base lg:text-lg text-gray-600 mt-4 leading-relaxed">
        {/* {settings.aboutBlurb} */}
        We create comprehinsive guides for independent travel. We've spent the last 3 years travelling to over 50 countries, and now we're condensing those experiences into guides to help you plan your next trip.
      </p>
    </div>
  </div>
</div>

  )
}