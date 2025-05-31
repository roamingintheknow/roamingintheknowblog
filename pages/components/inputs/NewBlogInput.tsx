import NewImageElement from './NewImageElement'
import ListBuilder from './ListBuilder'
import QuillTextEditor from './quill'

interface NewBlogInputProps {
  element: { content: string, type: string }; 
  index: number;
  handleListAdd: (value: [string]) => void;
  onChange: (index: number, value: string) => void;
  onImageUpload: (index: number,imageUrl: string, lowResUrl:string, file: File) => void; 
}

export function NewBlogInput({ element, index, onChange, onImageUpload, handleListAdd }: NewBlogInputProps) {

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
  <ListBuilder index={index} onChange={(index, value) => onChange(index, value)} existingList={element?.content||[]}/>
    </>
}
  {element.type =='body'&&
    <>
<div className="flex flex-col w-full">
<label className="block text-gray-700 mb-2">Body</label>
<QuillTextEditor element ={element} onChange={onChange} index={index}/>
{/* <textarea
  value={element.content}
  onChange={(event) => onChange(index, event)}
  className="w-full h-40 px-3 py-2 border border-gray-300 rounded resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
  placeholder="Enter your text here..."
  style ={{color:'black'}}
></textarea> */}
</div>
    </>
  }
  {element.type =='image'&&
    <>
    <div className="flex flex-col w-full">
    <NewImageElement index={index} onUpload={onImageUpload} element={element}/>
    </div>
    </>
  }
    </>
  );
}


