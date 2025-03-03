import React, { useState, useEffect } from 'react';
import { useSession, signIn } from "next-auth/react"
import Image from 'next/image'
import StickyHeader from '../nav/StickyHeader'
import {humanizeText} from '../../helpers/helper_functions'
import { BsInstagram, BsYoutube } from "react-icons/bs";
import { SiTiktok } from "react-icons/si";
import { MdCopyright } from "react-icons/md";
import Link from 'next/link';
import {AboutContent} from './AboutContent'

export default function Home() {
  const { data: session, status } = useSession();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  const [isAdmin, setIsAdmin] =  useState(false)
  const [settings, setSiteSettings] = useState({})
  const [loading, setLoading] = useState(true);
  const [recentBlogs, setRecentBlogs] = useState([])
  // Define an array of image URLs
  const images = [
    settings?.landingPhoto1? settings?.landingPhoto1: 'https://res.cloudinary.com/busy-bee/image/upload/v1681391705/main/homePageHorizontal_ctpbfa.jpg',
    settings?.landingPhoto2? settings?.landingPhoto2:'https://res.cloudinary.com/busy-bee/image/upload/v1681391649/about/aboutPic15_n3eokt.jpg',
    settings?.landingPhoto3? settings?.landingPhoto3:'https://res.cloudinary.com/busy-bee/image/upload/v1681391680/blogPics/inTheKnowArequipa/arequipa1_gjwlqi.jpg'
  ];


  useEffect(() => {
    const interval = setInterval(() => {
      const nextIndex = (currentImageIndex + 1) % images.length;
      setCurrentImageIndex(nextIndex);
    }, settings?.slideShowInterval ? settings?.slideShowInterval*1000 : 3000); // Switch images every 3 seconds

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, [currentImageIndex, images.length]);


  
  useEffect(() => {
    async function fetchBlogs() {
      try {
        const response = await fetch('/api/getRecentBlogs');
        const data = await response.json();
        if (response.ok) {
          setRecentBlogs(data.blogs);
        } else {
          console.error('Failed to fetch blogs:', data.error);
        }
      } catch (error) {
        console.error('Error fetching blogs:', error);
      } finally {
        setLoading(false);
      }
    }
    async function fetchSettings() {
      try {
        const response = await fetch('/api/getSiteSettings');
        const data = await response.json();
        if (response.ok) {
          setSiteSettings(data.settings[0]);
        } else {
          console.error('Failed to fetch site settings:', data.error);
        }
      } catch (error) {
        console.error('Error fetching blogs:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchBlogs();
    fetchSettings();
    // if (session) {
    //   fetchBlogs();
    //   fetchSettings();
    // } else if (status !== 'loading') {
    //   // Redirect to sign-in page if user is not authenticated
    //   signIn();
    // }
  }, [session, status]);
  if(session && session.user.email =='shawn.hymers.developer@gmail.com' && !isAdmin){
    setIsAdmin(true)
  }
  return (
    <>
      <StickyHeader page="home"/>

      <div className="relative w-screen h-screen overflow-hidden flex items-center justify-center ">
  {/* Image Block with Overlay */}
  <div className="absolute inset-0">
    <Image
      src={images[currentImageIndex]}
      alt={`Slide ${currentImageIndex}`}
      fill 
      style={{ objectFit: 'cover' }}
      className="object-cover"
    />
    <div className="absolute inset-0 bg-black opacity-20"></div> {/* Add a subtle overlay */}
  </div>
  
  {/* Centered Content */}
  <div className="relative z-10 flex flex-col items-center space-y-4">
    <p className="text-4xl md:text-6xl font-bold roaming-yellow-text">Roaming In The Know</p>
    <p className="text-lg md:text-2xl romaing-yellow-text">{settings.landingCaption}</p>
  </div>
</div>

<AboutContent/>



    <TagSearch />
    {/* <RecentBlogs blogs={recentBlogs}/> */}
    <Footer/>
    </>
  );
}


const TagSearch = () => {
  const { data: session, status } = useSession();
  const [tags, setTags] = useState([]);
  const [selectedTag, setSelectedTag] = useState('');
  const [blogs, setBlogs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCat, setSelectedCat] = useState('');
  const [loading, setLoading] = useState(true);

  // Fetch categories
  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await fetch(`/api/getCategories`);
        const data = await response.json();
        if (response.ok) {
          setCategories(data.categories);
          setSelectedCat(data.categories[0])
        } else {
          console.error('Failed to fetch categories:', data.error);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    }
    fetchCategories();
  }, [session]);

  // Fetch tags based on selected category
  useEffect(() => {
    async function fetchTags() {
      if (selectedCat) {
        try {
          const response = await fetch(`/api/getTags?categories=${encodeURIComponent(selectedCat)}`);
          const data = await response.json();
          if (response.ok) {
            setTags(data.tags);
            if (data.tags.length > 0) {
              setSelectedTag(data.tags[0]); // Set the first tag as selected
            }
          } else {
            console.error('Failed to fetch tags:', data.error);
          }
        } catch (error) {
          console.error('Error fetching tags:', error);
        }
      }
    }
    fetchTags();
  }, [selectedCat]);

  // Fetch blogs based on selected tag
  useEffect(() => {
    async function fetchBlogs() {
      if (selectedTag) {
        try {
          const response = await fetch(`/api/getTagBlogs?searchString=${encodeURIComponent(selectedTag)}`);
          const data = await response.json();
          if (response.ok) {
            setBlogs(data.blogs);
          } else {
            console.error('Failed to fetch blogs:', data.error);
          }
        } catch (error) {
          console.error('Error fetching blogs:', error);
        }
      }
    }
    fetchBlogs();
  }, [selectedTag]);

  // Handle change in selected category
  const handleCategoryChange = (cat) => {
    setSelectedCat(cat);
    setSelectedTag(''); // Reset selected tag on category change
  };

  return (
    <div className='roaming-white' style={{ paddingLeft: '10vw', paddingRight: '10vw', paddingTop: '3em', overflowY: 'auto', paddingBottom: '8em' }}>
      <div className="flex flex-wrap gap-2" style={{ paddingTop: '1em', paddingBottom: '1.5em' }}>
        <h1 className='large-header-text roaming-green-text'>Quick Reads:</h1>
      </div>
      <div className="flex flex-wrap gap-2" style={{ paddingBottom: '1.5em' }}>
        {categories.map(cat => (
          <div
            key={cat}
            onClick={() => handleCategoryChange(cat)}
            className={`px-4 py-2 rounded-full cursor-pointer transition-colors duration-200 
              ${selectedCat === cat ? 'roaming-green roaming-white-text' : 'roaming-blue roaming-black-text'}`}
          >
            {humanizeText(cat)}
          </div>
        ))}
      </div>
      <div className="w-80 h-1 bg-yellow-500 mt-2 rounded-full"style={{marginBottom:'2em'}}></div>
      <div className="flex flex-wrap gap-2" style={{ paddingBottom: '3em' }}>
        {tags.map(tag => (
          <div
            key={tag}
            onClick={() => setSelectedTag(tag)}
            className={`px-4 py-2 rounded-full cursor-pointer transition-colors duration-200 
              ${selectedTag === tag ? 'roaming-green roaming-white-text' : 'roaming-blue roaming-black-text'}`}
          >
            {humanizeText(tag)}
          </div>
        ))}
      </div>
      <div className="flex gap-4 mt-8">
        {blogs.length > 0 && (
          <>
            <div className="w-1/2" style={{ minHeight: '90vh' }}>
              <BlogTileV blog={blogs[0]} />
            </div>
            <div className="w-1/2 flex flex-col gap-4" style={{ minHeight: '90vh' }}>
              {blogs.slice(1, 4).map((blog, index) => (
                <BlogTileH key={index} blog={blog} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const BlogTileV = ({ blog }) => {

  return(
<>
<a 
  href={`/view/${blog.title.replace(/[^a-zA-Z0-9 ]/g, '').replace(/\s+/g, '_').toLowerCase()}`}
  target="_blank" 
  rel="noopener noreferrer"
>
<div className="relative w-full h-full group">
  <Image
    src={blog.coverV}
    alt={`Blog Cover Img ${blog.title}`}
    fill 
    style={{ objectFit: 'cover' }}
    className="rounded-lg"
  />
<div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-opacity duration-300 rounded-lg" />
<div className="absolute inset-0 flex items-center justify-center px-4 ">
  <p className="text-center img-caption roaming-yellow-text whitespace-normal leading-snug">
    {blog.title.replace(/\b\w/g, (char) => char.toUpperCase())}
  </p>
</div>
</div>
</a>

           
</>
  )
}
const BlogTileH = ({ blog }) => {

  return(
<>

<div className="relative w-full h-full group" >
<a 
 href={`/view/${blog.title.replace(/[^a-zA-Z0-9 ]/g, '').replace(/\s+/g, '_').toLowerCase()}`}
  target="_blank" 
  rel="noopener noreferrer"
>
  <Image
    src={blog.coverH}
    alt={`Blog Cover Img ${blog.title}`}
    fill 
    style={{ objectFit: 'cover' }}
    className="rounded-lg"
  />
  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-opacity duration-300 rounded-lg" />
  <div className="absolute inset-0 flex items-center justify-center">
    <p className="text-center img-caption roaming-yellow-text">
          {blog.title.replace(/\b\w/g, (char) => char.toUpperCase())}
  </p>
</div>
</a>
</div>

          
</>
  )
}
const RecentBlogs = ({blogs})=>{
  return(
    <div className="flex gap-4 mt-8">
    {blogs.length > 0 && (
      <>
        <div className="w-1/2">
          <BlogTileV blog={blogs[0]} />
        </div>
        <div className="w-1/2 flex flex-col gap-4">
          {blogs.slice(1, 4).map((blog, index) => (
            <div key={index} className="flex-1">
              <BlogTileH blog={blog} />
            </div>
          ))}
        </div>
      </>
    )}
  </div>
  )
}
const Footer = () => {
  return (
    <div className="footer font-customTrebuchet" >
      <div className="left-section">
      <button className="ml-2 px-3 py-1 text-md roaming-yellow romaing-black-text rounded-md hover:bg-roaming-green">
        Contact
      </button>
      </div>
      
      <div className="right-section">
        <div className="text-row roaming-black-text">
          <div className="flex items-center space-x-4">
            <Link href="https://www.instagram.com/roamingintheknow/" target="_blank" rel="noopener noreferrer">
              <BsInstagram size="1.5em" className="text-gray-600 hover:text-gray-800 cursor-pointer" />
            </Link>
            
            <Link href="https://www.tiktok.com/@roamingintheknow" target="_blank" rel="noopener noreferrer">
              <SiTiktok size="1.5em" className="text-gray-600 hover:text-gray-800 cursor-pointer" />
            </Link>
            
            <Link href="https://www.youtube.com/@roamingintheknow" target="_blank" rel="noopener noreferrer">
              <BsYoutube size="1.5em" className="text-gray-600 hover:text-gray-800 cursor-pointer" />
            </Link>
            
            <span>@roamingintheknow</span>
          </div>
        </div>
        
        <div className="text-row roaming-black-text flex items-center space-x-2">
          <MdCopyright aria-label="Copyright" />
          <span>2024 Roaming In The Know. All Rights Reserved</span>
        </div>
        <div className="text-row roaming-black-text">
          <Link href="/terms">Terms & Conditions</Link>
        </div>
      </div>

    </div>
  );
};



  // {/* Text Block */}
  // <div
  //   className="absolute top-10 left-20 bg-white bg-opacity-95 rounded-lg shadow-lg p-4"
  //   style={{ maxWidth: '35vw'}}
    
  // >
  //   <p className=" roaming-brown-text web-header center-justified-text" >
  //    {"Hi! We're Roaming In The Know!"}
  //   </p>
  //   <p className=" roaming-brown-text web-text" >
  //    {"We're Canadian travel creators, totally married, and currently in Japan."}
  //   </p>
  // </div>