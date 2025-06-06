import React, { useState, useEffect } from 'react';
import Image from 'next/image'
import { signIn, useSession } from 'next-auth/react';
import BlogPost from '../blog_elements/BlogPost'
import { useRouter } from 'next/router';

export  function CollabContent(){
  const [settings, setSiteSettings] = useState({});
  const collabImages = [
    settings?.collabPhoto1? settings?.collabPhoto1: 'https://res.cloudinary.com/dqiq7slio/image/upload/v1727065148/travel_blog_images/xzccreteken3eznpfzrp.webp',
    settings?.collabPhoto2? settings?.collabPhoto2:'https://res.cloudinary.com/dqiq7slio/image/upload/v1727065148/travel_blog_images/xzccreteken3eznpfzrp.webp',
    settings?.collabPhoto3? settings?.collabPhoto3:'https://res.cloudinary.com/dqiq7slio/image/upload/v1727065148/travel_blog_images/xzccreteken3eznpfzrp.webp'
  ];


    const router = useRouter();
    const currentPath = router.asPath;
  return(
    <>

<div className="full-width roaming-white blog-container flex flex-col space-y-4 text-center vertical-padding-md">
  <h1 className="text-4xl font-bold roaming-green-text">Work with Us!</h1>
  <p className="mt-4 text-lg text-gray-600 bottom-padding-lg">
    Partner with us to create meaningful travel stories and visuals that inspire.
  </p>

  <div className="image-container flex flex-wrap items-center justify-center gap-8 px-4">
  <div className="image-item max-w-sm relative image-item-padding-sm w-full sm:w-auto">
  <a
    href={`${currentPath}/hotels`}
    target="_blank"
    rel="noopener noreferrer"
    className="block group relative"
  >
    <Image
      src={collabImages[0]}
      alt="Hotel Portfolio cover image"
      width={300}
      height={400}
      layout="responsive"
      className="rounded-sm group-hover:scale-105 transition-transform duration-300"
    />
    <div className="absolute inset-0 flex items-center justify-center px-4">
      <p className="text-center img-caption roaming-yellow-text whitespace-normal leading-snug">
        Hotels
      </p>
    </div>
  </a>
</div>


    <div className="image-item max-w-sm relative image-item-padding-sm w-full sm:w-auto">
      <a
        href={`${currentPath}/tours`}
        target="_blank"
        rel="noopener noreferrer"
        className="block group relative"
      >
        <Image 
          src={collabImages[1]} 
          alt="Tours portfolio cover image" 
          width={300} 
          height={400} 
          layout="responsive" 
          className="rounded-sm group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 flex items-center justify-center px-4">
          <p className="text-center img-caption roaming-yellow-text whitespace-normal leading-snug">
            Tours
          </p>
        </div>
      </a>
    </div>

    <div className="image-item max-w-sm relative image-item-padding-sm w-full sm:w-auto">
      <a
        href={`${currentPath}/lifestyle`}
        target="_blank"
        rel="noopener noreferrer"
        className="block group relative"
      >
        <Image 
          src={collabImages[2]} 
          alt="Lifestyle portfolio cover image" 
          width={300} 
          height={400} 
          layout="responsive" 
          className="rounded-sm group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 flex items-center justify-center px-4">
          <p className="text-center img-caption roaming-yellow-text whitespace-normal leading-snug">
            Lifestyle
          </p>
        </div>
      </a>
    </div>
  </div>
</div>

</>

  )
}