import { BlogTitle } from './BlogTitle';
import { BlogHeader } from './BlogHeader';
import { BlogBody } from './BlogBody';
import { BlogImage } from './BlogImage';

export default function BlogPost({ elements ,hideTitle=false}) {
  return (
    <div 
      className="full-width roaming-white blog-container flex flex-col space-y-4 items-start " 
      style={{ margin: '0vh', paddingLeft: '0vh',paddingRight: '0vh', overflowX: 'hidden', minHeight: '100vh' }}
    >
      {elements.map((element, index) => (
        <div key={index} className="w-full " >
          {element.type === 'title' && !hideTitle && <BlogTitle text={element.content} />}
          {element.type === 'header' && <BlogHeader text={element.content} />}
          {element.type === 'body' && <BlogBody text={element.content} />}
          {element.type === 'image' && <BlogImage element={element} />}
        </div>
      ))}
    </div>
  );
}
