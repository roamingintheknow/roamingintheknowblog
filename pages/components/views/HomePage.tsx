import React, { useState, useEffect } from 'react';
import { useSession } from "next-auth/react"
import Image from 'next/image'
import StickyHeader from '../nav/StickyHeader'
import {humanizeText} from '../../helpers/helper_functions'
import { BsInstagram, BsYoutube } from "react-icons/bs";
import { SiTiktok } from "react-icons/si";
import { MdCopyright } from "react-icons/md";
import Link from 'next/link';
import {AboutContent} from './AboutContent'

// interface SiteSettings {
//   landingPhoto1?: string;
//   landingPhoto2?: string;
//   landingPhoto3?: string;
//   slideShowInterval?: number;
//   landingCaption?: string;
// }
interface Blog {
  id: string;
  title: string;
  category: string;
  tags: string[];
  coverH: string;
  coverV: string;
}
interface BlogTileProps {
  blog: Blog;
}
interface BlogListProps {
  blogs: [Blog];
}

export default function Home({recentBlogs, popularBlogs}) {
  // const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // const [settings, setSiteSettings] = useState<SiteSettings>({});
  // const [loading, setLoading] = useState(true);

  // Define an array of image URLs
  // const images = [
  //   settings.landingPhoto1 || 'https://res.cloudinary.com/busy-bee/image/upload/v1681391705/main/homePageHorizontal_ctpbfa.jpg',
  //   settings.landingPhoto2 || 'https://res.cloudinary.com/busy-bee/image/upload/v1681391649/about/aboutPic15_n3eokt.jpg',
  //   settings.landingPhoto3 || 'https://res.cloudinary.com/busy-bee/image/upload/v1681391680/blogPics/inTheKnowArequipa/arequipa1_gjwlqi.jpg'
  // ];


  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     const nextIndex = (currentImageIndex + 1) % images.length;
  //     setCurrentImageIndex(nextIndex);
  //   }, settings?.slideShowInterval ? settings?.slideShowInterval*1000 : 3000); // Switch images every 3 seconds

  //   return () => clearInterval(interval); // Cleanup interval on component unmount
  // }, [currentImageIndex, images.length]);


  // useEffect(() => {
  //   async function fetchData() {
  //     try {
  //       const [recentRes, popularRes] = await Promise.all([
  //         fetch('/api/getRecentBlogs'),
  //         fetch('/api/getPopularBlogs'),
  //       ]);
  
  //       const [recentData, popularData] = await Promise.all([
  //         recentRes.json(),
  //         popularRes.json(),
  //       ]);
  
  //       if (recentRes.ok) {
  //         setRecentBlogs(recentData.blogs);
  //       } else {
  //         console.error('Failed to fetch recent blogs:', recentData.error);
  //       }
  
  //       if (popularRes.ok) {
  //         setPopularBlogs(popularData.blogs);
  //       } else {
  //         console.error('Failed to fetch popular blogs:', popularData.error);
  //       }
  //     } catch (err) {
  //       console.error('Error fetching blogs:', err);
  //     }
  //   }
  
  //   fetchData();
  // }, []);
  
  // useEffect(() => {
  //   async function fetchRecentBlogs() {
  //     try {
  //       const response = await fetch('/api/getRecentBlogs');
  //       const data = await response.json();
  //       if (response.ok) {
  //         setRecentBlogs(data.blogs);
  //       } else {
  //         console.error('Failed to fetch blogs:', data.error);
  //       }
  //     } catch (error) {
  //       console.error('Error fetching blogs:', error);
  //     } finally {
  //       // setLoading(false);
  //     }
  //   }
  //   async function fetchPopularBlogs() {
  //     try {
  //       const response = await fetch('/api/getPopularBlogs');
  //       const data = await response.json();
  //       if (response.ok) {
  //         setPopularBlogs(data.blogs);
  //       } else {
  //         console.error('Failed to fetch blogs:', data.error);
  //       }
  //     } catch (error) {
  //       console.error('Error fetching blogs:', error);
  //     } finally {
  //       // setLoading(false);
  //     }
  //   }
  //   // async function fetchSettings() {
  //   //   try {
  //   //     const response = await fetch('/api/getSiteSettings');
  //   //     const data = await response.json();
  //   //     if (response.ok) {
  //   //       setSiteSettings(data.settings);
  //   //     } else {
  //   //       console.error('Failed to fetch site settings:', data.error);
  //   //     }
  //   //   } catch (error) {
  //   //     console.error('Error fetching blogs:', error);
  //   //   } finally {
  //   //     // setLoading(false);
  //   //   }
  //   // }
  //   // fetchSettings();
  //   fetchRecentBlogs();
  //   fetchPopularBlogs();

  // }, []);
  

  return (
    <>
      <StickyHeader page="home"/>
      {/* Most Popular Guides */}

      <BlogList blogs={popularBlogs}/>
      <CountryList />
      {/* <div className="relative w-screen h-screen overflow-hidden flex items-center justify-center "> */}
 
 
  {/* Image Block with Overlay */}
  {/* <div className="absolute inset-0">
    <Image
      src={images[currentImageIndex]}
      alt={`Slide ${currentImageIndex}`}
      fill 
      style={{ objectFit: 'cover' }}
      className="object-cover"
    />
    <div className="absolute inset-0 bg-black opacity-20"></div> 
  </div> */}
  
  {/* Centered Content */}
  {/* <div className="relative z-10 flex flex-col items-center space-y-4">
    <p className="text-4xl md:text-6xl font-bold roaming-yellow-text">Roaming In The Know</p> */}
    {/* <p className="text-lg md:text-2xl romaing-yellow-text">{settings.landingCaption}</p> */}
  {/* </div> */}
{/* </div> */}

<AboutContent />
<BlogGrid blogs={recentBlogs}/>
    {/* <TagSearch /> */}
    {/* <BlogList blogs={recentBlogs}/> */}
    <Footer/>
    </>
  );
}


const BlogGrid = ({blogs}) =>  {
  return(
    <div className="bg-white py-12 px-6">
    <h1 className="blog-header roaming-black-text blog-h1 mb-8 pl-2">
      Recent Posts:
    </h1>
  <div className="flex gap-4 mt-8">
    {/* Left Spacer */}
    <div className="w-4" />
  {blogs.length > 0 && (
    <>
      <div className="w-1/2 flex flex-col gap-4" style={{ minHeight: '90vh' }}>
        {blogs.slice(0, 3).map((blog, index) => (
          <BlogTileH key={index} blog={blog} />
        ))}
      </div>
      <div className="w-1/2 flex flex-col gap-4" style={{ minHeight: '90vh' }}>
        {blogs.slice(4, 7).map((blog, index) => (
          <BlogTileH key={index} blog={blog} />
        ))}
      </div>
    </>
  )}
  {/* Right Spacer */}
  <div className="w-4" />
</div>
</div>
)
}

const TagSearch = () => {
  const { data: session } = useSession();
  const [tags, setTags] = useState([]);
  const [selectedTag, setSelectedTag] = useState('');
  const [blogs, setBlogs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCat, setSelectedCat] = useState('');

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
  const handleCategoryChange = (cat: string) => {
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

const BlogTileV = ({ blog }: BlogTileProps) => {
  return (
    <a
      href={`/view/${blog.title.replace(/[^a-zA-Z0-9 ]/g, '').replace(/\s+/g, '_').toLowerCase()}`}
      target="_blank"
      rel="noopener noreferrer"
    >
      <div className="relative w-full aspect-[3/4] group overflow-hidden rounded-sm">
        <Image
          src={blog.coverV}
          alt={`Blog Cover Img ${blog.title}`}
          fill
          className="object-contain rounded-sm"
              style={{ objectFit: 'cover' }}

        />

        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-opacity duration-300" />
        <div className="absolute inset-0 flex items-center justify-center px-4">
          <p className="text-center img-caption roaming-yellow-text whitespace-normal leading-snug">
            {blog.title.replace(/\b\w/g, (char) => char.toUpperCase())}
          </p>
        </div>
      </div>
    </a>
  );
};

const BlogTileH = ({ blog }:BlogTileProps) => {

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
    className="rounded-sm"
  />
  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-opacity duration-300 rounded-sm" />
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

const CountryList = () => {
  const countryList = [
    { name: "Canada", image: "https://res.cloudinary.com/dqiq7slio/image/upload/v1735439799/travel_blog_images/pqejvutqsdvkpebpqofd.webp" },
    { name: "Japan", image: "/flags/japan.jpg" },
    { name: "Peru", image: "/flags/peru.jpg" },
    { name: "Korea", image: "/flags/korea.jpg" },
    { name: "Colombia", image: "/flags/colombia.jpg" },
    { name: "Ecuador", image: "/flags/ecuador.jpg" },
    { name: "India", image: "https://res.cloudinary.com/dqiq7slio/image/upload/v1741592390/travel_blog_images/rns09irklynmawbigsfh.webp" },
    { name: "Sri Lanka", image: "/flags/sri-lanka.jpg" },
    { name: "Vietnam", image: "/flags/vietnam.jpg" },
  ];

  return (
    <div className="bg-white py-8 px-6">
      <h1 className="blog-header roaming-black-text blog-h1 mb-8 pl-2">
        Explore By Country:
      </h1>

      <div className="flex flex-wrap gap-6 justify-center">
        {countryList.map(({ name, image }) => (
          <div key={name} className="flex flex-col items-center space-y-2">
            <div className="w-20 h-20 rounded-full overflow-hidden shadow-md">
              <Image
                src={image}
                alt={`${name} flag`}
                width={80}
                height={80}
                className="object-cover"
              />
            </div>
            <span className="text-sm text-gray-700">{name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const BlogList = ({ blogs }: BlogListProps) => {
  if (!blogs.length) return null;

  return (
    <div className="bg-white py-12 px-6">
      <h1 className="roaming-black-text blog-h1 mb-8 pl-2 text-3xl lg:text-4xl font-bold text-gray-800">
        Most Popular Guides:
      </h1>

      <div className="overflow-x-auto scrollbar-hide">
        <div className="flex gap-6 px-2 w-max">
          {blogs.map((blog, index) => (
            <div key={index} className="flex-shrink-0 w-64">
              <BlogTileV blog={blog} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// const BlogList = ({ blogs }: BlogListProps) => {
//   if (!blogs.length) return null;
//   console.log('popular blogs...',blogs)
//   return (
//     <div className="bg-white py-12 px-6">
//       <h1 className="blog-header roaming-black-text blog-h1 mb-8 pl-2">
//         Most Popular Guides:
//       </h1>

//       <div className="grid grid-cols-[1fr_repeat(3,auto)_1fr] gap-x-10 gap-y-12 justify-items-center w-full">
        // {/* Left Spacer */}
        // <div className="w-4" />

//         {/* Blog Tiles */}
//         {blogs.map((blog, index) => (
//           <div key={index} className="w-64">
//             <BlogTileV blog={blog} />
//           </div>
//         ))}

//         {/* Right Spacer */}
//         <div className="w-4" />
//       </div>
//     </div>
//   );
// };






const Footer = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    const { name, email, message } = formData;
  
    // Basic validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValid = name.trim() && emailRegex.test(email) && message.trim().length >= 10;
  
    if (!isValid) {
      alert("Please fill out all fields correctly:\n- Valid email\n- Message at least 10 characters");
      return;
    }
  
    setSending(true);
  
    try {
      await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      
  
      setSent(true);
      setFormData({ name: "", email: "", message: "" });
  
      setTimeout(() => {
        setIsModalOpen(false);
        setSent(false);
      }, 2000);
    } catch (error) {
      console.error("❌ Error sending message:", error);
    } finally {
      setSending(false);
    }
  };
  
  return (
    <>
    <div className="footer  roaming-white" >
      <div className="left-section">
      <button className="ml-2 px-3 py-1 text-md roaming-yellow romaing-black-text rounded-md hover:bg-roaming-green"
       onClick={() => setIsModalOpen(true)}>
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
          <span>2025 Roaming In The Know. All Rights Reserved</span>
        </div>
        <div className="text-row roaming-black-text">
          <Link href="/terms">Terms & Conditions</Link>
        </div>
      </div>
    </div>
     {/* Contact Modal */}
     {isModalOpen && (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
        <div className="bg-white rounded-xl p-6 max-w-md w-full relative shadow-xl">
          <button
            className="absolute top-2 right-3 text-gray-500 hover:text-black text-xl"
            onClick={() => setIsModalOpen(false)}
          >
            ×
          </button>
          <h2 className="text-xl font-bold mb-4">Send us a message</h2>
          {sent ? (
            <p className="roaming-green-text font-semibold">Thanks for your message!</p>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                name="name"
                placeholder="Your name"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 roaming-black-text"
              />
              <input
                type="email"
                name="email"
                placeholder="Your email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 roaming-black-text"
              />
              <textarea
                name="message"
                placeholder="Your message..."
                required
                rows={4}
                value={formData.message}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 roaming-black-text"
              />
              <button
                type="submit"
                disabled={sending}
                className="w-full roaming-yellow text-black rounded-md py-2 font-semibold hover:roaming-green"
              >
                {sending ? "Sending..." : "Send"}
              </button>
            </form>
          )}
        </div>
      </div>
    )}
    </>
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