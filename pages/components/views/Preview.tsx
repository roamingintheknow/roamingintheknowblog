import BlogPost from '../blog_elements/BlogPost';
import {BlogNavPanel} from '../blog_elements/BlogNavPanel';

export default function Preview({ blog, setPreview }) {

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
      <BlogPost elements={blog?.elements} 
                coverH={blog?.coverH} 
                coverV={blog?.coverV} 
                coverS={blog?.coverS} />
      
    </>
  );
}
