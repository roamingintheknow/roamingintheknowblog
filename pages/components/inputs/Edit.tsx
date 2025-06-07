import { useEffect, useState, useCallback } from 'react';
import { NewBlogInput } from './NewBlogInput';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import ImageInput from './ImageInputs/ImageInput';
import { v4 as uuidv4 } from 'uuid'; 
import { useIsAdmin } from "@/lib/auth";
import { Blog, ElementType} from "@/types/blog";
import { ImageUploadParams } from "@/types/images";
import Preview from '../views/Preview';
import type { DropResult } from 'react-beautiful-dnd';
import { ChangeEvent } from 'react';

interface EditProps {
  blog?: Blog | null;
  setPreview: (preview: boolean) => void;
  hideTitle?: boolean;
  forcedSlug?: string;
}
interface PreviewToggleProps {
  isPreview: boolean;
  setIsPreview: (preview: boolean) => void;
}

function PreviewToggle({ isPreview, setIsPreview }: PreviewToggleProps) {

  return(
    <>
     <div className="flex gap-2 centered-children bottom-padding-sm roaming-white">
    <button
      onClick={() => setIsPreview(false)}
      className={`px-6 py-3 rounded-sm shadow-md transition-all duration-200 ${
        isPreview ? 'text-black roaming-black hover:roaming-green' : 'roaming-green text-white '
      }`}    >
      Edit
    </button>
    <button
      onClick={() => setIsPreview(true)}
      className={`px-6 py-3 rounded-sm shadow-md transition-all duration-200 ${
        !isPreview ? 'text-black roaming-black hover:roaming-green' 
      : 'roaming-green text-white hover:roaming-green'
      }`}    >
      Preview
    </button>
  </div>
  </>
  )
}

const triggerRebuild = async (slug: string) => {
  try {
    const response = await fetch(`/api/revalidate?slug=${slug}`);
    const data = await response.json();
    if (data.revalidated) {
    }
  } catch (error) {
    console.error('Error triggering revalidation:', error);
  }
};

function Edit({ blog = null, setPreview, hideTitle = false, forcedSlug }: EditProps) {
  if (!blog) return;
  const { isAdmin, session} = useIsAdmin();

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
  const [errors, setErrors] = useState<string[]>([]);
  const [currentBlog, setCurrentBlog] = useState<Blog>({
    _id: '',
    hideTitle: false,        
    text: '',  
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
  const [isPreview, setIsPreview] = useState(false)
  useEffect(() => {
    if (blog) {
      const parsedElements = blog.elements.map((el) => ({
        ...el,
        content: el.type === 'list' && typeof el.content === 'string'
          ? JSON.parse(el.content)
          : el.content,
      }));
  
      setElements(parsedElements);
      setCurrentBlog((prevBlog) => ({
        ...prevBlog,
        ...blog,
        elements: parsedElements,
      }));
    }
  }, [blog]);
  
  const addElement = useCallback(
    (type: ElementType) => {
      setElements((prev) => [
        ...prev,
        { id: uuidv4(), type, content: "", imageUrls: [] },
      ]);
    },
    [setElements]
  );

  const onDragEnd = useCallback(
    (result: DropResult) => {
      if (!result.destination) return;
      const reordered = Array.from(elements);
      const [removed] = reordered.splice(result.source.index, 1);
      reordered.splice(result.destination.index, 0, removed);
      setElements(reordered);
      setCurrentBlog((prevBlog) => ({
        ...prevBlog,
        ...blog,
        elements: reordered,
      }));
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

      setElements(updatedElements);
      setCurrentBlog((prevBlog) => ({
        ...prevBlog,
        elements: updatedElements, // Update the elements with IDs
      }));
    }
  }, [elements]); // This effect will only run when elements change
  function ensureString(value: string | string[] | undefined): string {
    if (!value) return '';
    return Array.isArray(value) ? value[0] : value;
  }
  const handleContentChange = (index: number, value: string) => {
    const newElements = [...elements];
    newElements[index].content = value;
    setElements(newElements);
    setCurrentBlog((prevBlog: Blog) => ({
      ...prevBlog,
      ...blog, 
      title: ensureString(blog.title),
      slug: ensureString(blog.slug),
      elements: newElements,
    }));
    
  };

  const handleImageUpload = ({ index, url, subType, position }: ImageUploadParams) => {
    const newElements = [...elements];
  
    if (!newElements[index] || newElements[index].type !== 'image') return;
  
    if (!Array.isArray(newElements[index].imageUrls)) {
      newElements[index].imageUrls = [];
    }
  
    const safePosition = Number(position ?? 0);
    if (!isNaN(safePosition)) {
      newElements[index].imageUrls[safePosition] =
        typeof url === 'string' ? { imageUrl: url } : url;
    }
    newElements[index].subType = subType;
  
    setElements(newElements);
    setCurrentBlog((prevBlog) => ({
      ...prevBlog,
      elements: newElements,
    }));
  };
  
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  )=> {
    const { name, value } = e.target;
    setCurrentBlog((prev) => ({ ...prev, [name]: value }));
  };

  const handleTagsChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCurrentBlog((prev) => ({ ...prev, tags: value.split(',').map(tag => tag.trim()) }));
  };

  const handleCoverPhotoUpload = ({ imageUrl, lowResUrl, type }: { imageUrl: string; lowResUrl: string; type: string }) => {    console.log('handle cover photo Upload...', imageUrl, lowResUrl,type)
    setCurrentBlog((prev) => ({ ...prev, [type]: imageUrl }));
  };

  const handleRemoveElement = (index: number) => {
    const newElements = elements.filter((_, i) => i !== index);
    setElements(newElements);
    setCurrentBlog((prevBlog) => ({
      ...prevBlog,
      ...blog,
      elements: newElements,
    }));
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
      triggerRebuild(currentBlog.slug);
    }
  };

  const saveBlog = async () => {
    const now = new Date();

    // Convert the list arrays to strings before saving
  const normalizedElements = currentBlog.elements.map((el) => ({
    ...el,
    content: el.type !== 'list'
      ? el.content
      : JSON.stringify(el.content), 
  }));

  const blogData = {
    ...currentBlog,
    elements: normalizedElements,
    edited_at: now,
  };

    try {
      if (!session) {
        return;
      }
      const response = await fetch('/api/saveBlog', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.accessToken}`,
        },
        body: JSON.stringify({ blog: blogData }),
      });

      const data = await response.json();
      if (response.ok) {
        setIsPreview(true)
        // window.location.href = `/view/${blogData.slug}`;
      } else {
        console.error('Failed to save blog:', data.error);
      }
    } catch (error) {
      console.error('Error saving blog:', error);
    }
  };


  if (!isAdmin) return <p>Access Denied</p>;

  if (isPreview) return (
    <>
     <PreviewToggle isPreview={isPreview} setIsPreview={setIsPreview}/>
     <Preview blog={currentBlog} setPreview={setPreview} />
    </>
  )
  

  
  return (
    <>
    <div className="p-4 roaming-white">
     <PreviewToggle isPreview={isPreview} setIsPreview={setIsPreview}/>
      {/* Drag & Drop Section */}
      <div className="flex justify-center">
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="droppable">
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="space-y-4 w-full max-w-3xl"
              >
                {elements.map((element, index) => (
                  <Draggable key={element.id} draggableId={element.id} index={index}>
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
                          <NewBlogInput
                            element={element}
                            index={index}
                            onChange={handleContentChange}
                            onImageUpload={handleImageUpload}
                          />
                          {element.type !== "title" && (
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
  
      {/* Add Elements Section */}
      <div className="p-4 flex flex-wrap gap-4 justify-center">
        {(["header", "sub_header", "body", "list", "image"] as ElementType[]).map((type) => (
          <button
            key={type}
            onClick={() => addElement(type)}
            className="bg-blue-600 text-white px-6 py-3 rounded-sm shadow-md hover:bg-blue-700 transition-all duration-200"
          >
            + {type.replace("_", " ")}
          </button>
        ))}
      </div>
  
      {/* Blog Details Section */}
      <div className="p-4 max-w-lg mx-auto bg-white rounded-sm shadow-md">
        {!hideTitle && (
          <>
            {[
              { label: "Country", name: "country", type: "text", value: currentBlog.country },
              { label: "Category", name: "category", type: "text", value: currentBlog.category },
            ].map(({ label, name, type, value }) => (
              <div key={name} className="mb-4">
                <label htmlFor={name} className="block text-gray-700">{label}</label>
                <input
                  id={name}
                  name={name}
                  type={type}
                  value={value}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  style={{ color: "black" }}
                />
              </div>
            ))}
  
            {/* Continent Dropdown */}
            <div className="mb-4">
              <label htmlFor="continent" className="block text-gray-700">Continent</label>
              <select
                id="continent"
                name="continent"
                value={currentBlog.continent}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                style={{ color: "black" }}
              >
                <option value="" disabled>Select a category</option>
                {["Europe", "South America", "North America", "Asia", "Africa", "Oceania"].map((c) => (
                  <option key={c} value={c.toLowerCase()}>{c}</option>
                ))}
              </select>
            </div>
  
            {/* Tags Input */}
            <div className="mb-4">
              <label htmlFor="tags" className="block text-gray-700">Tags</label>
              <input
                id="tags"
                name="tags"
                type="text"
                value={currentBlog.tags.join(", ")}
                onChange={handleTagsChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                style={{ color: "black" }}
                placeholder="comma separated tags"
              />
            </div>
          </>
        )}
  
        {/* Cover Images Section */}
        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-2">Cover Images</label>
          <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-1">
            {["Horizontal", "Vertical", "Square"].map((type) => (
              <div key={type}>
                <label className="block text-sm text-gray-600 mb-1">{type} Cover</label>
                <ImageInput
                  type={`cover${type[0]}`}
                  onUpload={handleCoverPhotoUpload}
                  existingImg={currentBlog[`cover${type[0]}` as keyof Blog] as string | undefined}
                  // existingImg={currentBlog[`cover${type[0]}`]}
                />
              </div>
            ))}
          </div>
        </div>
  
        {/* Save Blog Button */}
        <div className="flex justify-end">
          <button
            onClick={prepareBlogSave}
            className="bg-green-600 text-white px-4 py-2 rounded shadow-md hover:bg-green-700 transition-all duration-200"
          >
            Save Blog
          </button>
        </div>
  
        {/* Errors Display */}
        {errors?.length > 0 && (
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
    </>
  );
  
}

export default Edit;
