import React, { useState, useEffect } from 'react';
import Image from 'next/image'
import { signIn, useSession } from 'next-auth/react';
import BlogPost from '../components/blog_elements/BlogPost'

export default function Hotels(){
  const { data: session, status } = useSession();
  const [settings, setSiteSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [currenthotelImageIndex, setCurrenthotelImageIndex] = useState(0);
  const hotel_images = [
    settings?.hotelPhoto1? settings?.hotelPhoto1: 'https://res.cloudinary.com/busy-bee/image/upload/v1681391705/main/homePageHorizontal_ctpbfa.jpg',
    settings?.hotelPhoto2? settings?.hotelPhoto2:'https://res.cloudinary.com/busy-bee/image/upload/v1681391649/hotel/hotelPic15_n3eokt.jpg',
    settings?.hotelPhoto3? settings?.hotelPhoto3:'https://res.cloudinary.com/busy-bee/image/upload/v1681391680/blogPics/inTheKnowArequipa/arequipa1_gjwlqi.jpg'
  ];
  useEffect(() => {
    const interval = setInterval(() => {
      const nextIndex = (currenthotelImageIndex + 1) % hotel_images.length;
      setCurrenthotelImageIndex(nextIndex);
    }, settings?.hotelSlideShowInterval ? settings?.hotelSlideShowInterval*1000 : 3000); // Switch images every 3 seconds

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, [currenthotelImageIndex, hotel_images.length]);

  const [hotelBlog, sethotelBlog] = useState(null);
  const slug='hotel'
  useEffect(() => {
    async function fetchBlog() {
      if (slug) {
        try {
          const response = await fetch(`/api/blogs/${slug}`);
          const data = await response.json();
          if (response.ok) {
            sethotelBlog(data.blog);
          } else {
            console.error('Failed to fetch blog:', data.error);
          }
        } catch (error) {
          console.error('Error fetching blog:', error);
        } finally {
          setLoading(false);
        }
      }
      else{
        // console.log('no slug')
      }
    }

    fetchBlog();
  }, [slug]);
    const hotelElements=hotelBlog?.elements
  
  return(
    <>
<BlogPost elements={hotelElements||[]} hideTitle={true}/>
</>
  )
}