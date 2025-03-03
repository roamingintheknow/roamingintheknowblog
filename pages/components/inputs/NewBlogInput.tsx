import NewImageElement from './NewImageElement'

export function NewBlogInput({element,index, onChange, onImageUpload}) {

  return (
    <>
    {element.type =='title'&&
    <>

<div className="flex flex-col w-full">
  <label className="block text-gray-700 mb-2">Title</label>
  <input
    type="text"
    value={element.content}
    onChange={(event) => onChange(index, event)}
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
              onChange={(event) => onChange(index, event)}
              className="w-full px-3 py-2 border rounded"
              style ={{color:'black'}}
            />
</div>

    </>
  }
  {element.type =='body'&&
    <>
<div className="flex flex-col w-full">
<label className="block text-gray-700 mb-2">Body</label>
<textarea
  value={element.content}
  onChange={(event) => onChange(index, event)}
  className="w-full h-40 px-3 py-2 border border-gray-300 rounded resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
  placeholder="Enter your text here..."
  style ={{color:'black'}}
></textarea>
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


