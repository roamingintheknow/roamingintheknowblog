import React, { useState, useEffect } from 'react';
import Image from 'next/image'
import { signIn, useSession } from 'next-auth/react';


export  function AboutContent({settings}){
  const { data: session, status } = useSession();
  const [currentAboutImageIndex, setCurrentAboutImageIndex] = useState(0);
  const about_images = [
    settings?.aboutPhoto1? settings?.aboutPhoto1: 'https://res.cloudinary.com/busy-bee/image/upload/v1681391705/main/homePageHorizontal_ctpbfa.jpg',
    settings?.aboutPhoto2? settings?.aboutPhoto2:'https://res.cloudinary.com/busy-bee/image/upload/v1681391649/about/aboutPic15_n3eokt.jpg',
    settings?.aboutPhoto3? settings?.aboutPhoto3:'https://res.cloudinary.com/busy-bee/image/upload/v1681391680/blogPics/inTheKnowArequipa/arequipa1_gjwlqi.jpg'
  ];
  useEffect(() => {
    const interval = setInterval(() => {
      const nextIndex = (currentAboutImageIndex + 1) % about_images.length;
      setCurrentAboutImageIndex(nextIndex);
    }, settings?.aboutSlideShowInterval ? settings?.aboutSlideShowInterval*1000 : 3000); // Switch images every 3 seconds

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, [currentAboutImageIndex, about_images.length]);

  
  return(
    <div className="relative w-screen h-auto flex items-center justify-center p-8 bg-white" style={{ paddingTop: '10vh', paddingBottom: '10vh' }}>
  <div className="flex flex-col lg:flex-row w-4/5 lg:w-2/3 space-y-8 lg:space-y-0 lg:space-x-8 justify-center items-center">
    {/* Image Block */}
    <div className="relative w-full lg:w-1/2 bg-white shadow-2xl rounded-lg overflow-hidden" style={{ height: '60vh' }}>
      <Image
        src={about_images[currentAboutImageIndex]}
        alt={`About Slide ${currentAboutImageIndex}`}
        fill 
        style={{ objectFit: 'cover' }}
        className="rounded-lg"
      />
    </div>

    {/* Text Block */}
    <div className="w-full lg:w-1/2 flex flex-col items-start justify-center roaming-white p-6 bg-gray-50 rounded-lg shadow-lg">
      {/* Header Text */}
      <p className="text-3xl lg:text-4xl font-bold text-gray-800">Hi! We're Roaming In The Know!</p>
      
      {/* Yellow Dash */}
      <div className="w-20 h-1 bg-yellow-500 mt-2 rounded-full"></div>
      
      {/* Paragraph Text */}
      <p className="text-base lg:text-lg text-gray-600 mt-4 leading-relaxed">
        {settings.aboutBlurb}
      </p>
    </div>
  </div>
</div>

  )
}