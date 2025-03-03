import BlogPost from '../blog_elements/BlogPost';

export default function Preview({ blog, setPreview }) {

  return (
    <div>
{typeof setPreview === 'function' && (
  <button
    onClick={() => setPreview(false)}
    className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
  >
    Close Preview
  </button>
)}

      
      <BlogPost elements={blog?.elements} />
      
    </div>
  );
}
