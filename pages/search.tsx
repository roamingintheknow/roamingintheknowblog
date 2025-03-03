import { signIn, useSession } from 'next-auth/react';
import { useState, useEffect} from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router'; 
import Image from 'next/image'
import { humanizeText } from './helpers/helper_functions';

export default function Search() {
  const { data: session, status } = useSession();
  const [isAdmin, setIsAdmin] =  useState(false)

  const router = useRouter(); 
  const search = router.query.query;
  const country= router.query.country || null;

  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedContinent, setSelectedContinent] = useState('');
  
  const [categories, setCategories] = useState([]);
  const [countries, setCountries] = useState([]);
  const [continents, setContinents] = useState([]);

  useEffect(() => {
    async function fetchBlogs() {
      try {
        const response = await fetch(`/api/getBlogs?search=${encodeURIComponent(searchQuery)}&category=${encodeURIComponent(selectedCategory)}&country=${encodeURIComponent(selectedCountry)}&continent=${encodeURIComponent(selectedContinent)}`);
        const data = await response.json();
        if (response.ok) {
          setBlogs(data.blogs);
        } else {
          console.error('Failed to fetch blogs:', data.error);
        }
      } catch (error) {
        console.error('Error fetching blogs:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchBlogs();
    // if (session) {
    //   fetchBlogs();
    // } else if (status !== 'loading') {
    //   signIn();
    // }
  }, [session, status, searchQuery, selectedCategory, selectedCountry, selectedContinent]);

  useEffect(() => {
    // Fetch filter data (categories, countries, continents) from the backend
    async function fetchFilters() {
      try {
        const response = await fetch('/api/getBlogFilters');
        const data = await response.json();
        setCategories(data.categories);
        setCountries(data.countries);
        setContinents(data.continents);
      } catch (error) {
        console.error('Error fetching filters:', error);
      }
    }
    fetchFilters();
  }, []);

  useEffect(() => {
    if (search) {
      setSearchQuery(search);
    }
    if (country){
      setSelectedCountry(country)
    }
  }, [search, country]);

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  const handleCountryChange = (event) => {
    setSelectedCountry(event.target.value);
  };

  const handleContinentChange = (event) => {
    setSelectedContinent(event.target.value);
  };

  if (loading || status === 'loading') {
    return <p>Loading blogs...</p>;
  }

  if(session && session?.user?.email =='shawn.hymers.developer@gmail.com' && !isAdmin){
    setIsAdmin(true)
  }

  return (
    <div className="roaming-white" style={{ minHeight: '100vh', margin: 'none', paddingTop: '3em' }}>
     
      {/* Filter controls */}
      <div className="flex justify-center bg-white blog-table"style={{maxWidth:'60vw'}}>
        <div className="w-4/5 max-w-7xl text-black space-y-6 py-8 blog-table">
          {/* Search Input */}
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={handleSearch}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {/* Dropdown Filters */}
          <div className="flex justify-between space-x-4">
            <select
              value={selectedCategory}
              onChange={handleCategoryChange}
              className="w-1/3 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>

            <select
              value={selectedCountry}
              onChange={handleCountryChange}
              className="w-1/3 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Countries</option>
              {countries.map((country) => (
                <option key={country} value={country}>
                  {country}
                </option>
              ))}
            </select>

            <select
              value={selectedContinent}
              onChange={handleContinentChange}
              className="w-1/3 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Continents</option>
              {continents.map((continent) => (
                <option key={continent} value={continent}>
                      {humanizeText(continent)}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
      {/* Blog list display */}
      <div className=" grid grid-cols-1 md:grid-cols-3 gap-8 p-8">
        {blogs.map((blog) => (
          <div key={blog.id} className="blog-item text-center w-full max-w-3xl">
           <a 
            href={`/view/${blog.title.replace(/[^a-zA-Z0-9 ]/g, '').replace(/\s+/g, '_').toLowerCase()}`}
            target="_blank" 
            rel="noopener noreferrer"
          >
        <div className="relative w-full h-64 group" style={{cursor:'pointer'}}>
          <Image
            src={blog.coverH}
            alt={`Blog Cover Img ${blog.title}`}
            fill 
            style={{ objectFit: 'cover' }}
            className="rounded-lg"
          />
        <div className="absolute inset-0 flex items-center justify-center px-4 ">
          <p className="text-center img-caption roaming-yellow-text whitespace-normal leading-snug">
            {blog.title.replace(/\b\w/g, (char) => char.toUpperCase())}
          </p>
        </div>
        </div>
        </a>


            {isAdmin && (
              <>
                <div className="actions flex justify-center space-x-4 roaming-black-text">
                  <a href={`view/${blog.slug}`} target="_blank" className="hover:underline">View</a>
                  <span>|</span>
                  <a href={`edit/${blog.slug}`} target="_blank" className="hover:underline">Edit</a>
                </div>
              </>
            )}
          </div>
          ))}
      </div>
    </div>
  );
}
