import { signIn, useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import ImagePreview from './components/ImagePreview';
import Edit from './components/inputs/Edit';
import NewBlog from './new_blog';
import Search from './search';
import Settings from './settings'
import Link from 'next/link';

export default function Admin() {
  const { data: session, status } = useSession();
  const [view, setView]= useState('jump')
  const [blogs, setBlogs] = useState([]);
  
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBlogs() {
      try {
        const response = await fetch('/api/getRecentBlogs');
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



    if (session) {
      fetchBlogs();
    } else if (status !== 'loading') {
      // Redirect to sign-in page if user is not authenticated
      signIn();
    }
  }, [session, status]);

  const [aboutBlog, setAboutBlog] = useState(null);
  const [hotelsBlog, setHotelsBlog] = useState(null);
  const [toursBlog, setToursBlog] = useState(null);
  const [lifestyleBlog, setLifestyleBlog] = useState(null);


  
  useEffect(() => {
    async function fetchAboutBlog() {
        try {
          const response = await fetch(`/api/blogs/about`);
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
    async function fetchHotelsBlog() {
        try {
          const response = await fetch(`/api/blogs/hotels`);
          const data = await response.json();
          if (response.ok) {
            setHotelsBlog(data.blog);
          } else {
            console.error('Failed to fetch blog:', data.error);
          }
        } catch (error) {
          console.error('Error fetching blog:', error);
        } finally {
          setLoading(false);
        }
    }
    async function fetchToursBlog() {
      try {
        const response = await fetch(`/api/blogs/tours`);
        const data = await response.json();
        if (response.ok) {
          setToursBlog(data.blog);
        } else {
          console.error('Failed to fetch blog:', data.error);
        }
      } catch (error) {
        console.error('Error fetching blog:', error);
      } finally {
        setLoading(false);
      }
  }
  async function fetchLifestyleBlog() {
    try {
      const response = await fetch(`/api/blogs/lifestyle`);
      const data = await response.json();
      if (response.ok) {
        setLifestyleBlog(data.blog);
      } else {
        console.error('Failed to fetch blog:', data.error);
      }
    } catch (error) {
      console.error('Error fetching blog:', error);
    } finally {
      setLoading(false);
    }
}

    fetchAboutBlog();
    fetchHotelsBlog();
    fetchToursBlog();
    fetchLifestyleBlog();
  }, [ ]);

  if (loading || status === 'loading') {
    return <p>Loading...</p>;
  }

  if (!session) {
    return <p>Redirecting to sign-in...</p>;
  }


  function setPreview(blog){
    // console.log('preview...',blog)
  }



  return (
    <>
<div className="white pv-2  bg-gray-100">
  {/* Button Section */}
  <div className="flex justify-center items-center space-x-3"
  style={{paddingTop:'1em',paddingBottom:'1em'}}>

<Link href="/">
  <button
   onClick={() => setView('view')}
    className={`px-6 py-3 rounded-lg shadow hover:roaming-yellow transition inline-block ${view === 'view' ? 'roaming-yellow' : 'roaming-green'}`}
    >
    View Site
  </button>
  </Link>
  <button
    onClick={() => setView('new')}
    className={`px-6 py-3 rounded-lg shadow hover:roaming-yellow transition inline-block ${view === 'new' ? 'roaming-yellow' : 'roaming-green'}`}
    >
    + Blog
  </button>

  <button
    onClick={() => setView('find')}
    className={`px-6 py-3 rounded-lg shadow hover:roaming-yellow transition inline-block ${view === 'find' ? 'roaming-yellow' : 'roaming-green'}`}
    >
    Find A Blog
  </button>

  <button
    onClick={() => setView('settings')}
    className={`px-6 py-3 rounded-lg shadow hover:roaming-yellow transition inline-block ${view === 'settings' ? 'roaming-yellow' : 'roaming-green'}`}
    >
    Settings
  </button>


  <button
    onClick={() => setView('about')}
    className={`px-6 py-3 rounded-lg shadow hover:roaming-yellow transition inline-block ${view === 'about' ? 'roaming-yellow' : 'roaming-green'}`}
    >
    About
  </button>
  <button
    onClick={() => setView('hotels')}
    className={`px-6 py-3 rounded-lg shadow hover:roaming-yellow transition inline-block ${view === 'hotels' ? 'roaming-yellow' : 'roaming-green'}`}
    >
    Hotels
  </button>
  <button
    onClick={() => setView('tours')}
    className={`px-6 py-3 rounded-lg shadow hover:roaming-yellow transition inline-block ${view === 'tours' ? 'roaming-yellow' : 'roaming-green'}`}
    >
    Tours
  </button>
  <button
    onClick={() => setView('lifestyle')}
    className={`px-6 py-3 rounded-lg shadow hover:roaming-yellow transition inline-block ${view === 'lifestyle' ? 'roaming-yellow' : 'roaming-green'}`}
    >
    Lifestyle
  </button>

</div>

</div>
<div className="roaming-white">
    {view ==='jump'&&
      <>
        {/* "Jump Back In" Section */}
        <div className="mb-16 min-h-screen top-padding-md ">
          <h1 className="text-4xl font-bold text-center mb-10 roaming-black-text">Jump Back In:</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
            {blogs.map((blog, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-lg text-center">
                <p className="text-xl font-semibold mb-4 text-gray-800">{blog.title}</p>

                <div className="w-full mb-4">
                  <ImagePreview
                    imageUrl={blog.coverH}
                    classes="object-cover rounded-md"
                    width="240"
                    height="160"
                  />
                </div>

                <div className="flex justify-center space-x-4 text-blue-600 font-medium">
                  <a href={`view/${blog.slug}`} target="_blank" className="hover:underline">
                    View
                  </a>
                  <span>|</span>
                  <a href={`edit/${blog.slug}`} target="_blank" className="hover:underline">
                    Edit
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </>
    }
    {view === 'new' &&
    <>
      <div style={{ minWidth: '100vw', padding: 0, margin: 0 }}>
        <NewBlog />
      </div>
    </>
    }
    {view === 'find' &&
    <>
      <div>
        <Search/>
      </div>
    </>
    }
    {view === 'hotels' &&
    <>
      <Edit setPreview={setPreview} blog={hotelsBlog} hideTitle={true} forcedSlug='hotels'/>
    </>
    }
     {view === 'tours' &&
    <>
      <Edit setPreview={setPreview} blog={toursBlog} hideTitle={true} forcedSlug='tours'/>
    </>
    }
     {view === 'lifestlye' &&
    <>
      <Edit setPreview={setPreview} blog={lifestyleBlog} hideTitle={true} forcedSlug='lifestyle'/>
    </>
    }
    {view === 'about' &&
    <>
         <Edit setPreview={setPreview} blog={aboutBlog} hideTitle={true} forcedSlug='about'/>
    </>
    }
{view === 'settings' &&
    <>
    <Settings />

    </>
    }


</div>
</>
  );
}
