import { BlogTitle } from './BlogTitle';
import { BlogHeader } from './BlogHeader';
import { BlogSubHeader } from './BlogSubHeader';
import { BlogBody } from './BlogBody';
import { BlogImage } from './BlogImage';
import { BlogList } from './BlogList';

interface BlogElement {
  type: 'title' | 'header' | 'sub_header' | 'body' | 'image' | 'list';
  content: string;
  subType?: string;
  imageUrls?: { imageUrl: string; lowResUrl?: string }[];
}

interface BlogPostProps {
  elements: BlogElement[];
  hideTitle?: boolean;
  coverH?: string;
  coverV?: string;
  coverS?: string;
}

export default function BlogPost({ elements,coverH,coverV,coverS, hideTitle = false }: BlogPostProps) {
  return (
    <div
      className="full-width roaming-white blog-container flex flex-col space-y-4 items-start"
      style={{
        margin: '0vh',
        paddingLeft: '0vh',
        paddingRight: '0vh',
        paddingTop:'0vh',
        overflowX: 'hidden',
        minHeight: '100vh',
      }}
    >
      {elements.map((element, index) => (
        <div key={index} className="w-full">
          {element.type === 'title' && !hideTitle && <BlogTitle text={element.content} 
                                                                coverH={coverH}
                                                                coverV={coverV}
                                                                coverS={coverS} />}
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
