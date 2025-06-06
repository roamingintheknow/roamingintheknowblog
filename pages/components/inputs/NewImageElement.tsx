import { useState } from 'react';
import ImageInput from './ImageInput';
import ImagePreview from'../ImagePreview';
const NewImageElement = ({ index, onUpload, element }) => {
  const [subType, setSubType] = useState(element?.subType || 'lh');
  const [imageUrl, setImageUrl] = useState([])
  // Available layouts for rendering
  const layouts = {
    lh: LargeHorizontal,
    lv: LargeVertical,
    vd: VerticalDiptych,
    hd: HorizontalDiptych,
    vt: VerticalTriptych,
    hs: HorizontalStack,
  };

  // Fallback to LargeHorizontal if subType is not in layouts
  const LayoutComponent = layouts[subType] || LargeHorizontal;

  // Render the appropriate layout
  const renderLayout = () => (
    <LayoutComponent
      index={index}
      onUpload={handleImageUpload}
      urls={element?.imageUrls || imageUrl} // Ensure imageUrls is an array
    />
  );
  const handleImageUpload = ({index, url,subType,position}) => {
    setImageUrl(url);
    onUpload({index, url,subType,position}); 
  };

  return (
    <div style={{minWidth:'55vw',maxWidth:'55vw'}}>
      <div className="mb-4">
        <label htmlFor="layout" className="block text-gray-700">Select Layout</label>
        <select
          id="layout"
          name="layout"
          value={subType}
          onChange={(e) => setSubType(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          style={{color:'black'}}
          disabled={imageUrl.length>0}
       >
          <option value="lh">Large Horizontal</option>
          <option value="lv">Large Vertical</option>
          <option value="vd">Vertical Diptych</option>
          <option value="hd">Horizontal Diptych</option>
          <option value="vt">Vertical Triptych</option>
          <option value="hs">Horizontal Stack</option>
        </select>
      </div>

      {renderLayout()}
    </div>
  );
};


const LargeHorizontal = ( {index, onUpload, urls} ) => {
  const [imageUrl, setImageUrl] = useState(urls?.[0] || null);
  const handleImageUpload = (url) => {
    setImageUrl(url);
    onUpload({ index, url, subType: 'lh', position: 0 });
  };

  return (
    <div className="p-4 bg-gray-100 flex space-x-4 flex justify-center items-center">
      {!imageUrl ? (
        <ImageInput onUpload={handleImageUpload} type='coverH'/>
      ) : (
        <ImagePreview imageUrl={imageUrl?.imageUrl} classes="w-full  " width='360' height='220'/>
      )}
    </div>
  );
};

const LargeVertical = ( {index, onUpload, urls} ) => {
  const [imageUrl, setImageUrl] = useState(urls?.[0] || null);

  const handleImageUpload = (url) => {
    setImageUrl(url);
    onUpload({ index, url, subType: 'lv', position: 0 });
  };

  return (
    <div className="p-4 bg-gray-100 flex space-x-4 justify-center items-center">
      {!imageUrl ? (
        <ImageInput onUpload={handleImageUpload}  type='coverV'/>
      ) : (
        <ImagePreview imageUrl={imageUrl?.imageUrl} classes="w-full  " width='220' height='360'/>
      )}
    </div>
  );
};

const VerticalDiptych = ( {index, onUpload, urls} )  => {
  const [imageUrl1, setImageUrl1] = useState(urls?.[0] || null);
  const [imageUrl2, setImageUrl2] = useState(urls?.[1] || null);

  const handleImageUpload1 = (url) => {
    setImageUrl1(url);
    onUpload({ index, url, subType: 'vd', position: 0 });
  };

  const handleImageUpload2 = (url) => {
    setImageUrl2(url);
    onUpload({ index, url, subType: 'vd', position: 1 });
  };

  return (
    
    <div className="p-4 bg-gray-100 flex space-x-4 flex justify-center items-center">
      {!imageUrl1 ? (
        <ImageInput onUpload={handleImageUpload1} type='smallV'/>
      ) : (
        <ImagePreview imageUrl={imageUrl1.imageUrl}  classes="w-1/2 w-48 object-cover "  width='600' height='600'/>
      )}
      
      {!imageUrl2 ? (
        <ImageInput onUpload={handleImageUpload2} type='smallV'/>
      ) : (
        <ImagePreview imageUrl={imageUrl2.imageUrl}  classes="w-1/2 w-48 object-cover" width='600' height='600'/>
      )}
    </div>
  );
};

const VerticalTriptych = ( {index, onUpload, urls} )  => {
  const [imageUrl1, setImageUrl1] = useState(urls?.[0] || null);
  const [imageUrl2, setImageUrl2] = useState(urls?.[1] || null);
  const [imageUrl3, setImageUrl3] = useState(urls?.[2] || null);

  const handleImageUpload1 = (url) => {
    setImageUrl1(url);
    onUpload(url); 
  };

  const handleImageUpload2 = (url) => {
    setImageUrl2(url);
    onUpload(url);
  };

  const handleImageUpload3 = (url) => {
    setImageUrl3(url);
    onUpload(url); 
  };

  return (
    <div className="p-4 bg-gray-100 flex space-x-4 flex justify-center items-center">
      {!imageUrl1 ? (
        <ImageInput onUpload={handleImageUpload1} type='smallV'/>
      ) : (
        <ImagePreview imageUrl={imageUrl1.imageUrl}  classes="w-1/3 w-48 object-cover" width={600} height={600}/>
      )}
      
      {!imageUrl2 ? (
        <ImageInput onUpload={handleImageUpload2} type='smallV'/>
      ) : (
        <ImagePreview imageUrl={imageUrl2.imageUrl}  classes="w-1/3 w-48 object-cover" width={600} height={600}/>
      )}
      
      {!imageUrl3 ? (
        <ImageInput onUpload={handleImageUpload3} type='smallV' />
      ) : (
        <ImagePreview imageUrl={imageUrl3.imageUrl}  classes="w-1/3 w-48 object-cover" width={600} height={600}/>
      )}
    </div>
  );
};

const HorizontalDiptych = ( {index, onUpload, urls} )  => {
  const [imageUrl1, setImageUrl1] = useState(urls?.[0] || null);
  const [imageUrl2, setImageUrl2] = useState(urls?.[1] || null);

  const handleImageUpload1 = (url) => {
    setImageUrl1(url);
    onUpload(url); 
  };

  const handleImageUpload2 = (url) => {
    setImageUrl2(url);
    onUpload(url); 
  };

  return (
    <div className="p-4 bg-gray-100 flex space-x-4 flex justify-center items-center">
      {!imageUrl1 ? (
        <ImageInput onUpload={handleImageUpload1} type='smallH'/>
      ) : (
        <ImagePreview imageUrl={imageUrl1.imageUrl} classes="w-1/2 h-48 object-cover" width='600' height='600'/>
      )}
      
      {!imageUrl2 ? (
        <ImageInput onUpload={handleImageUpload2} type='smallH'/>
      ) : (
        <ImagePreview imageUrl={imageUrl2.imageUrl} classes="w-1/2 h-48 object-cover" width='600' height='600'/>
      )}
    </div>
  );
};
const HorizontalStack = ( {index, onUpload, urls} )  => {
  const [imageUrl1, setImageUrl1] = useState(urls?.[0] || null);
  const [imageUrl2, setImageUrl2] = useState(urls?.[1] || null);

  const handleImageUpload1 = (url) => {
    setImageUrl1(url);
    onUpload(url); 
  };

  const handleImageUpload2 = (url) => {
    setImageUrl2(url);
    onUpload(url); 
  };

  return (
    <div className="p-4 bg-gray-100 flex flex-col justify-center items-center">
      {!imageUrl1 ? (
        <ImageInput onUpload={handleImageUpload1} type='smallH'/>
      ) : (
        <ImagePreview imageUrl={imageUrl1} classes="w-2/3 h-48 object-cover mb-4" width='600'/>
      )}

      {!imageUrl2 ? (
        <ImageInput onUpload={handleImageUpload2} type='smallH'/>
      ) : (
        <ImagePreview imageUrl={imageUrl2} classes="w-2/3 h-48 object-cover" width='600' height='600'/>
      )}
    </div>
  );
};
export default NewImageElement;