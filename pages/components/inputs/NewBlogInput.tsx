import NewImageElement from './NewImageElement';
import ListBuilder from './ListBuilder';
import QuillTextEditor from './quill';
import { BlogElement } from'@/types/blog';
import { ImageUploadParams } from'@/types/images';

interface NewBlogInputProps {
  element: BlogElement;
  index: number;
  onChange: (index: number, value: string) => void;
  onImageUpload: (params: ImageUploadParams) => void;
}

export function NewBlogInput({ element, index, onChange, onImageUpload}: NewBlogInputProps) {

  return (
    <>
    {element.type =='title'&&
    <>

<div className="flex flex-col w-full">
  <label className="block text-gray-700 mb-2">Title</label>
  <input
    type="text"
    value={element.content}
    onChange={(event) => onChange(index, event.target.value)}
    className="w-full px-3 py-2 border rounded"
    style={{ color: 'black' }}
  />
</div>
    </>
  }
    {element.type =='header'&&
    <>
<div className="flex flex-col w-full">
<label className="block text-gray-700 mb-2">Header</label>
            <input
              type="text"
              value={element.content}
              onChange={(event) => onChange(index, event.target.value)}
              className="w-full px-3 py-2 border rounded"
              style ={{color:'black'}}
            />
</div>

    </>
  }
      {element.type =='sub_header'&&
    <>
<div className="flex flex-col w-full">
<label className="block text-gray-700 mb-2">Sub-Header</label>
            <input
              type="text"
              value={element.content}
              onChange={(event) => onChange(index, event.target.value)}
              className="w-full px-3 py-2 border rounded"
              style ={{color:'black'}}
            />
</div>

    </>
  }
        {element.type =='list'&&
    <>
    <ListBuilder
  index={index}
  onChange={(index, value) => onChange(index, value)}
  existingList={
    typeof element.content === 'string'
      ? JSON.parse(element.content)
      : element.content
  }
/>
    </>
}
  {element.type =='body'&&
    <>
<div className="flex flex-col w-full">
<label className="block text-gray-700 mb-2">Body</label>
{typeof element.content === 'string' && (
  <QuillTextEditor
    element={{ ...element, content: element.content }}
    onChange={onChange}
    index={index}
  />
)}
</div>
    </>
  }
  {element.type =='image'&&
    <>
      <div className="flex flex-col w-full">
        <NewImageElement index={index} 
                         onUpload={onImageUpload} 
                         element={element}/>
      </div>
    </>
  }
    </>
  );
}


