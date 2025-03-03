import { useState, useEffect } from 'react';
import axios from 'axios';
import ImagePreview from '../ImagePreview';

const ImageInput = ({type, onUpload, existingImg}) => {
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [imagePrev, setImagePrev] = useState(existingImg);

  // Update preview if existingImg changes
  useEffect(() => {
    setImagePrev(existingImg);
    console.log('existing image...',existingImg)
  }, [existingImg]);
  
  const onImageUpload = ({imageUrl,lowResUrl})=>{
    console.log('running callback...')
    console.log(imageUrl,lowResUrl)
    setImagePrev(imageUrl)
    onUpload({ imageUrl,lowResUrl, type });
  }

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  // const handleUpload = async () => {
  //   if (!image) return;
  
  //   setLoading(true);
  //   setError(null);
  
  //   const cloudName = process.env.NEXT_PUBLIC_CLOUD_NAME;
  //   const uploadPresets = {
  //     coverH: process.env.NEXT_PUBLIC_HORIZONTAL_UPLOAD_PRESET,
  //     coverV: process.env.NEXT_PUBLIC_VERTICAL_UPLOAD_PRESET,
  //     coverS: process.env.NEXT_PUBLIC_SQUARE_UPLOAD_PRESET,
  //     smallH: process.env.NEXT_PUBLIC_SMALL_HORIZONTAL_UPLOAD_PRESET,
  //     smallV: process.env.NEXT_PUBLIC_SMALL_VERTICAL_UPLOAD_PRESET,
  //   };
  
  //   // Determine the correct upload preset
  //   const uploadPreset = uploadPresets[type];
  //   if (!uploadPreset) {
  //     setError(`Invalid upload type: ${type}. Please check your configuration.`);
  //     setLoading(false);
  //     return;
  //   }
  
  //   const formData = new FormData();
  //   formData.append('file', image);
  //   formData.append('upload_preset', uploadPreset);
  
  //   try {
  //     const { data } = await axios.post(
  //       `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
  //       formData
  //     );
  //     const imageUrl = data.secure_url;
  //     onImageUpload(imageUrl); // Callback for successful upload
  //     setImage(null);
  //   } catch (error) {
  //     console.error('Upload error:', error.response?.data || error.message);
  //     setError('Error uploading image. Please try again.');
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  const handleUpload = async () => {
    if (!image) return;
  
    setLoading(true);
    setError(null);
  
    const cloudName = process.env.NEXT_PUBLIC_CLOUD_NAME;
    const uploadPresets = {
      coverH: process.env.NEXT_PUBLIC_HORIZONTAL_UPLOAD_PRESET,
      coverV: process.env.NEXT_PUBLIC_VERTICAL_UPLOAD_PRESET,
      coverS: process.env.NEXT_PUBLIC_SQUARE_UPLOAD_PRESET,
      smallH: process.env.NEXT_PUBLIC_SMALL_HORIZONTAL_UPLOAD_PRESET,
      smallV: process.env.NEXT_PUBLIC_SMALL_VERTICAL_UPLOAD_PRESET,
    };
  
    const uploadPreset = uploadPresets[type];
    if (!uploadPreset) {
      setError(`Invalid upload type: ${type}. Please check your configuration.`);
      setLoading(false);
      return;
    }
  
    const formData = new FormData();
    formData.append('file', image);
    formData.append('upload_preset', uploadPreset);
  
    try {
      const { data } = await axios.post(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        formData
      );
  
      const imageUrl = data.secure_url; // Main image URL
  
      // Create the low-res transformation URL
      const lowResUrl = imageUrl.replace(
        '/upload/',
        '/upload/w_10,c_scale,q_auto,e_blur:200/'
      );
      console.log('main...',imageUrl)
      console.log('low res...',lowResUrl)
      onImageUpload({ imageUrl, lowResUrl }); // Callback with both URLs
      setImage(null);
    } catch (error) {
      console.error('Upload error:', error.response?.data || error.message);
      setError('Error uploading image. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  
  

  return (
    !imagePrev ? (
      <div className="p-4 bg-white rounded-lg shadow-md ">
        {!image ? (
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            style={{maxWidth:'10vw'}}
          />
        ) : (
          <button
            type="button"
            onClick={handleUpload}
            disabled={loading}
            className="bg-indigo-500 text-white px-4 py-2 rounded-md shadow-sm hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {loading ? 'Uploading...' : 'Upload'}
          </button>
        )}
        {error && <p className="mt-2 text-red-500">{error}</p>}
      </div>
    ) : (

      <>
      {type == 'coverH'?
        <ImagePreview
        imageUrl={imagePrev}
        classes="object-cover rounded-md mb-4"
        width="360"
        height="220"
      />
        :null
      }

      {type == 'coverV'?
        <ImagePreview
        imageUrl={imagePrev}
        classes="object-cover rounded-md mb-4"
        width="220"
        height="360"
      />
        :null
      }
       {type == 'coverS'?
        <ImagePreview
        imageUrl={imagePrev}
        classes="object-cover rounded-md mb-4"
        width="220"
        height="220"
      />
        :null
      }
      </>
     
    )
  );
  
};

export default ImageInput;
