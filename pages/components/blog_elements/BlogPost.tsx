import { BlogTitle } from './BlogTitle';
import { BlogHeader } from './BlogHeader';
import { BlogSubHeader } from './BlogSubHeader';
import { BlogBody } from './BlogBody';
import { BlogImage } from './BlogImage';
import { BlogList } from './BlogList';
import { Blog, BlogElement } from '@/types/blog';

interface BlogPostProps {
  blog: Blog;
}

export default function BlogPost({ blog }: BlogPostProps) {
  return (
    <div
      className="full-width bg-white blog-container flex flex-col space-y-4 items-start"
      style={{
        margin: '0vh',
        paddingLeft: '0vh',
        paddingRight: '0vh',
        paddingTop:'0vh',
        overflowX: 'hidden',
        minHeight: '100vh',
      }}
    >
      {blog.elements.map((element: BlogElement, index: number) => (
        <div key={index} className="w-full">
          {element.type === 'title' && !blog.hideTitle && <BlogTitle text={element.content} 
                                                                coverH={blog.coverH}
                                                                coverV={blog.coverV}
                                                                coverS={blog.coverS} />}
          {element.type === 'header' && (
  <div id={`header-${index}`}>
    <BlogHeader text={element.content} />
  </div>
)}
          {element.type === 'sub_header' && <BlogSubHeader text={element.content} />}
          {element.type === 'body' && <BlogBody text={element.content} />}
          {element.type === 'image' && <BlogImage element={element} />}
          {element.type === 'list' && <BlogList element={element} />}
        </div>
      ))}
    </div>
  );
}
