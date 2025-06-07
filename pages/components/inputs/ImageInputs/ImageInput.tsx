import { useState, useEffect } from 'react';
import axios from 'axios';
import ImagePreview from '../../ImagePreview';
import { ChangeEvent } from 'react';

type UploadType = 'coverH' | 'coverV' | 'coverS' | 'smallH' | 'smallV';

interface ImageInputProps {
  type: string;
  onUpload: (args: {
    imageUrl: string;
    lowResUrl: string;
    type: string;
    position?: number;
  }) => void;
  existingImg?: string;
  position?: number;
}

const ImageInput = ({ type, onUpload, existingImg, position }: ImageInputProps) => {
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imagePrev, setImagePrev] = useState(existingImg);

  // Update preview if existingImg changes
  useEffect(() => {
    setImagePrev(existingImg);
  }, [existingImg]);
  
  const onImageUpload = ({
    imageUrl,
    lowResUrl,
    type,
    position,
  }: {
    imageUrl: string;
    lowResUrl: string;
    type: string;
    position?: number;
  }) => {
    setImagePrev(imageUrl);
    onUpload({ imageUrl, lowResUrl, type, position });
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>)  => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
    }
  };

  const handleUpload = async () => {
    if (!image) return;
  
    setLoading(true);
    setError(null);
  
    const cloudName = process.env.NEXT_PUBLIC_CLOUD_NAME;
    const uploadPresets: Record<UploadType, string | undefined> = {
      coverH: process.env.NEXT_PUBLIC_HORIZONTAL_UPLOAD_PRESET,
      coverV: process.env.NEXT_PUBLIC_VERTICAL_UPLOAD_PRESET,
      coverS: process.env.NEXT_PUBLIC_SQUARE_UPLOAD_PRESET,
      smallH: process.env.NEXT_PUBLIC_SMALL_HORIZONTAL_UPLOAD_PRESET,
      smallV: process.env.NEXT_PUBLIC_SMALL_VERTICAL_UPLOAD_PRESET,
    };
  
    const uploadPreset = uploadPresets[type as UploadType];

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
      onImageUpload({ imageUrl, lowResUrl, type, position}); // Callback with both URLs
      setImage(null);
    } catch (error) {
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
