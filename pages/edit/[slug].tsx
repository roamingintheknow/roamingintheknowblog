// pages/edit/[slug].js
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Edit from '../components/inputs/Edit'

const EditBlog=() =>{
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
            const parsedElements = data.blog.elements.map((el: { type: string; content: any }) => ({
              ...el,
              content:
                el.type === 'list' && typeof el.content === 'string'
                  ? JSON.parse(el.content)
                  : el.content,
            }));
  
            setBlog({ ...data.blog, elements: parsedElements });
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
<Edit blog={blog} />
    </div>
  );
}
export default EditBlog;