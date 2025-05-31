import React, { useState, useEffect } from 'react';
import Image from 'next/image'
import { signIn, useSession } from 'next-auth/react';
import BlogPost from '../components/blog_elements/BlogPost'
import { Blog, BlogElement } from '@/types/blog';

export default function Hotels(){
  const [loading, setLoading] = useState(true);
  const [hotelBlog, setHotelBlog] = useState<Blog | null>(null);
  const slug='hotel'
  useEffect(() => {
    async function fetchBlog() {
      if (slug) {
        try {
          const response = await fetch(`/api/blogs/${slug}`);
          const data = await response.json();
          if (response.ok) {
            setHotelBlog(data.blog);
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