import { useEffect, useState, useCallback } from 'react';
import { NewBlogInput } from './NewBlogInput';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import ImageInput from './ImageInput';
import ImagePreview from '../ImagePreview';
import { v4 as uuidv4 } from 'uuid'; 

function Edit({ blog = null, setPreview, hideTitle = false, forcedSlug }) {
  const defaultElements = hideTitle 
  ? [] 
  : blog?.elements || [
      {
        type: 'title',
        subType: 'normal',
        content: '',
        imageUrls: [],
        id:uuidv4(),
      }
    ];


  const [elements, setElements] = useState(defaultElements);
  const [errors, setErrors] = useState(null);
  const [currentBlog, setCurrentBlog] = useState({
    elements: defaultElements,
    title: forcedSlug ||'',
    slug: forcedSlug ||'',
    country: '',
    continent: '',
    tags: [],
    published: false,
    category: '',
    version: 1,
    coverH: '',
    coverV: '',
    coverS: '',
  });

  useEffect(() => {
    if (blog) {
      console.log('updating blogs and elements by blog+elements dep...',elements)
      setElements(elements.length > 0 ? elements : blog.elements || defaultElements);
      setCurrentBlog((prevBlog) => ({
        ...prevBlog,
        ...blog,
        elements: elements.length > 0 ? elements : blog.elements || defaultElements,
      }));
      console.log('current blog data...',blog)
    }
  }, [blog, elements]);

  // const addElement = (type) => {
  //   setElements((prevElements) => [
  //     ...prevElements,
  //     { type: type, content: '', imageUrls: [] }
  //   ]);
  // };
  const addElement = useCallback(
    (type) => {
      setElements((prev) => [
        ...prev,
        { id: uuidv4(), type, content: "", imageUrls: [] },
      ]);
      
    },
    [setElements]
  );

  const onDragEnd = useCallback(
    (result) => {
      if (!result.destination) return;
      const reordered = Array.from(elements);
      const [removed] = reordered.splice(result.source.index, 1);
      reordered.splice(result.destination.index, 0, removed);
      console.log('re ordered...',reordered)
      setElements(reordered);
    },
    [elements]
  );

  useEffect(() => {
    // Only update the elements if they are missing an ID
    const updatedElements = elements.map((element) => ({
      ...element,
      id: element.id || uuidv4(), // Only assign a new ID if it doesn't exist
    }));
  
    // Set the currentBlog state only if the IDs have changed
    if (JSON.stringify(updatedElements) !== JSON.stringify(elements)) {
      console.log('updating blogs and elements by elements dep...',updatedElements)

      setElements(updatedElements);
      setCurrentBlog((prevBlog) => ({
        ...prevBlog,
        elements: updatedElements, // Update the elements with IDs
      }));
    }
  }, [elements]); // This effect will only run when elements change
  
  const handleContentChange = (index, event) => {
    const newElements = [...elements];
    newElements[index].content = event.target.value;
    setElements(newElements);
    
    setCurrentBlog((prevBlog) => ({
      ...prevBlog,
      elements: newElements,
      ...(newElements[index].type === 'title' && {
        title: newElements[index].content,
        slug: newElements[index].content
          .toLowerCase()
          .replace(/[^a-z0-9\s]/g, '')
          .replace(/\s+/g, '_'),
      }),
    }));      
  };


  const handleImageUpload = ({ index, url, subType, position }) => {

    setElements((prevElements) => {
      const newElements = [...prevElements];
  
      // Ensure the element exists and is of type 'image'
      if (!newElements[index] || newElements[index].type !== 'image') {
        return prevElements; // Return the original array if invalid
      }
  
      // Ensure `imageUrls` is an array
      if (!Array.isArray(newElements[index].imageUrls)) {
        newElements[index].imageUrls = [];
      }
  
      // Update the image URL at the specific position
      newElements[index].imageUrls[position] = url;
  
      // Set the subtype if provided
      newElements[index].subType = subType;

      return newElements;
    });

  };
  

  // const onDragEnd = (result) => {
  //   if (!result.destination) return;

  //   const updatedElements = Array.from(elements);
  //   const [movedElement] = updatedElements.splice(result.source.index, 1);
  //   updatedElements.splice(result.destination.index, 0, movedElement);

  //   setElements(updatedElements);
  // };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentBlog((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e) => {
    setCurrentBlog((prev) => ({ ...prev, [e.target.name]: e.target.checked }));
  };

  const handleTagsChange = (e) => {
    const value = e.target.value;
    setCurrentBlog((prev) => ({ ...prev, tags: value.split(',').map(tag => tag.trim()) }));
  };

  const handleCoverPhotoUpload = ({ url, type }) => {
    setCurrentBlog((prev) => ({ ...prev, [type]: url }));
  };

  const handleRemoveElement = (index) => {
    const newElements = elements.filter((_, i) => i !== index);
    setElements(newElements);

  };

  const prepareBlogSave = () => {
    const newErrors = [];
    if (currentBlog.title === ''&& !hideTitle) newErrors.push('Title is required.');
    if (currentBlog.slug === '') newErrors.push('Slug is required.');
    if (currentBlog.elements.length === 0) newErrors.push('At least one element is required.');
    if (currentBlog.category === '' && !hideTitle) newErrors.push('Category is required.');
    if (currentBlog.country === '' && !hideTitle) newErrors.push('Country is required.');
    if (currentBlog.coverH === '') newErrors.push('Horizontal cover image is required.');
    if (currentBlog.coverV === '') newErrors.push('Vertical cover image is required.');
    if (currentBlog.coverS === '') newErrors.push('Square cover image is required.');
    
    if (newErrors.length > 0) {
      setErrors(newErrors);
    } else {
      saveBlog();
    }
  };

  const saveBlog = async () => {
    const now = new Date();

    const blogData = {
      ...currentBlog,
      created_at: currentBlog.created_at || now,
      edited_at: now
    };

    try {
      const response = await fetch('/api/saveBlog', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ blog: blogData }),
      });

      const data = await response.json();
      if (response.ok) {
        console.log('response...',response)
        console.log('blog data...',blogData)
        // window.location.href = `/view/${blogData.slug}`;
      } else {
        console.error('Failed to save blog:', data.error);
      }
    } catch (error) {
      console.error('Error saving blog:', error);
    }
  };

  return (
    <div className="p-4 roaming-white">
      <div className='flex justify-center'>
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="droppable">
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="space-y-4"
              >
                {elements.map((element, index) => (
                  <Draggable key={element.id} draggableId={element.id} index={index}>
                    {/* {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className="bg-white p-4 border rounded shadow-sm"
                        style={{ width: '80vw' }}
                      > */}
                      {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className={`p-4 border rounded shadow-sm ${
                        snapshot.isDragging ? "bg-gray-200" : "bg-white"
                      }`}
                    >
                        <div className="flex justify-between items-center">
                        <div className="flex flex-col items-center ml-4">
                       
            
</div>



                          <NewBlogInput element={element} index={index} onChange={handleContentChange} onImageUpload={handleImageUpload} />
                          {element.type !== 'title' && (
                            <button
                              className="bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center ml-4"
                              onClick={() => handleRemoveElement(index)}
                            >
                              &times;
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>

      <div className="p-4 flex flex-wrap gap-4 justify-center">
        <button
          onClick={() => addElement('header')}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-700 transition-all duration-200"
        >
          + Header
        </button>
        <button
          onClick={() => addElement('body')}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-700 transition-all duration-200"
        >
          + Body
        </button>
        <button
          onClick={() => addElement('image')}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-700 transition-all duration-200"
        >
          + Image
        </button>
      </div>

      <div className="p-4 max-w-lg mx-auto bg-white rounded-lg shadow-md">
        {!hideTitle && (
          <>
            <div className="mb-4">
              <label htmlFor="country" className="block text-gray-700">Country</label>
              <input
                type="text"
                id="country"
                name="country"
                value={currentBlog.country}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                style={{ color: 'black' }}
              />
            </div>

            <div className="mb-4">
              <label htmlFor="continent" className="block text-gray-700">Continent</label>
              <select
                id="continent"
                name="continent"
                value={currentBlog.continent}
                onChange={handleInputChange}
                style={{ color: 'black' }}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option value="" disabled>Select a category</option>
                <option value="europe">Europe</option>
                <option value="south_america">South America</option>
                <option value="north_america">North America</option>
                <option value="asia">Asia</option>
                <option value="africa">Africa</option>
                <option value="oceania">Oceania</option>
              </select>
            </div>

            <div className="mb-4">
              <label htmlFor="tags" className="block text-gray-700">Tags</label>
              <input
                type="text"
                id="tags"
                name="tags"
                value={currentBlog.tags.join(', ')}
                onChange={handleTagsChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                style={{ color: 'black' }}
                placeholder="comma separated tags"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="category" className="block text-gray-700">Category</label>
              <input
                type="text"
                id="category"
                name="category"
                value={currentBlog.category}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                style={{ color: 'black' }}
              />
            </div>
          </>
        )}

        <div className="mb-6 items-center">
          <label className="block text-gray-700 font-medium mb-2 items-center">Cover Images</label>
          <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-1 items-center">
            <div>
              <label className=" text-sm text-gray-600 mb-1">Horizontal Cover</label>
              <ImageInput 
                type="coverH" 
                onUpload={handleCoverPhotoUpload} 
                className="w-full "
                existingImg ={currentBlog?.coverH}
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Vertical Cover</label>
              <ImageInput 
                type="coverV" 
                onUpload={handleCoverPhotoUpload} 
                className="w-full"
                existingImg ={currentBlog?.coverV}
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Square Cover</label>
              <ImageInput 
                type="coverS" 
                onUpload={handleCoverPhotoUpload} 
                className="w-full"
                existingImg ={currentBlog?.coverS}
              />
            </div>
          </div>
        </div>


        <div className="flex justify-end">
          <button
            onClick={prepareBlogSave}
            className="bg-green-600 text-white px-4 py-2 rounded shadow-md hover:bg-green-700 transition-all duration-200"
          >
            Save Blog
          </button>
        </div>

        {errors && (
          <div className="mt-4">
            <ul className="text-red-500 list-disc list-inside">
              {errors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default Edit;
