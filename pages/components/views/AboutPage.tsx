import React, { useState, useEffect } from 'react';
import Image from 'next/image'
import { signIn, useSession } from 'next-auth/react';
import BlogPost from '../blog_elements/BlogPost'

export  function AboutPage(){
  const { data: session, status } = useSession();
  const [settings, setSiteSettings] = useState({});
  const [loading, setLoading] = useState(true);
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

  const [aboutBlog, setAboutBlog] = useState(null);
  const slug='about'
  useEffect(() => {
    async function fetchBlog() {
      if (slug) {
        try {
          const response = await fetch(`/api/blogs/${slug}`);
          const data = await response.json();
          if (response.ok) {
            setAboutBlog(data.blog);
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
    const aboutElements=aboutBlog?.elements
  
  return(
    <>
<BlogPost elements={aboutElements||[]} hideTitle={true}/>
</>
  )
}