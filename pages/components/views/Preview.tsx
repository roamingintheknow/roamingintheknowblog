import BlogPost from '../blog_elements/BlogPost';
import {BlogNavPanel} from '../blog_elements/BlogNavPanel';
import { Blog } from '@/types/blog';

interface PreviewProps {
  blog: Blog;
  setPreview?: (preview: boolean) => void;
}

export default function Preview({ blog, setPreview }: PreviewProps) {

  return (
    <>
{typeof setPreview === 'function' && (
  <button
    onClick={() => setPreview(false)}
    className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
  >
    Close Preview
  </button>
)}

      <BlogNavPanel elements={blog?.elements} />
      <BlogPost blog={blog} />
      {/* <BlogPost elements={blog?.elements} 
                coverH={blog?.coverH} 
                coverV={blog?.coverV} 
                coverS={blog?.coverS} /> */}
      
    </>
  );
}
