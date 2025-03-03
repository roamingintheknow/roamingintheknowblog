// pages/view/[slug].js
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Preview from '../components/views/Preview';

const ViewBlog=() =>{
  const router = useRouter();
  const { slug } = router.query;
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBlog() {
      if (slug) {
        try {
          const response = await fetch(`/api/blogs/${slug}`);
          const data = await response.json();
          if (response.ok) {
            setBlog(data.blog);
          } else {
            console.error('Failed to fetch blog:', data.error);
          }
        } catch (error) {
          console.error('Error fetching blog:', error);
        } finally {
          setLoading(false);
        }
      }
    }

    fetchBlog();
  }, [slug]);

  if (loading) return <p>Loading...</p>;
  if (!blog) return <p>Blog not found.</p>;

  return (
    <div>
      <Preview blog={blog}/>
    </div>
  );
}
export default ViewBlog;