import ImageInput from './ImageInput';
import ImagePreview from '../../ImagePreview';
import { useState } from 'react';
import { ImageProps, UploadArgs } from '@/types/images';

export const LargeHorizontal: React.FC<ImageProps> = ({ index, onUpload, urls }) => {
  const [imageUrl, setImageUrl] = useState<string | null>(urls?.[0] || null);

  const handleImageUpload = ({ imageUrl }: UploadArgs) => {
    setImageUrl(imageUrl);
    onUpload({ index, url: imageUrl, subType: 'lh', position: 0 });
  };

  return (
    <div className="p-4 bg-gray-100 flex space-x-4 justify-center items-center">
      {!imageUrl ? (
        <ImageInput onUpload={handleImageUpload} type="coverH" />
      ) : (
        <ImagePreview imageUrl={imageUrl} classes="w-full" width="360" height="220" />
      )}
    </div>
  );
};

export const LargeVertical: React.FC<ImageProps> = ({ index, onUpload, urls }) => {
  const [imageUrl, setImageUrl] = useState<string | null>(urls?.[0] || null);

  const handleImageUpload = ({ imageUrl }: UploadArgs) => {
    setImageUrl(imageUrl);
    onUpload({ index, url: imageUrl, subType: 'lv', position: 0 });
  };

  return (
    <div className="p-4 bg-gray-100 flex space-x-4 justify-center items-center">
      {!imageUrl ? (
        <ImageInput onUpload={handleImageUpload} type="coverV" />
      ) : (
        <ImagePreview imageUrl={imageUrl} classes="w-full" width="220" height="360" />
      )}
    </div>
  );
};

export const VerticalDiptych: React.FC<ImageProps> = ({ index, onUpload, urls }) => {
  const [imageUrl1, setImageUrl1] = useState<string | null>(urls?.[0] || null);
  const [imageUrl2, setImageUrl2] = useState<string | null>(urls?.[1] || null);

  const handleImageUpload1 = ({ imageUrl }: UploadArgs) => {
    setImageUrl1(imageUrl);
    onUpload({ index, url: imageUrl, subType: 'vd', position: 0 });
  };

  const handleImageUpload2 = ({ imageUrl }: UploadArgs) => {
    setImageUrl2(imageUrl);
    onUpload({ index, url: imageUrl, subType: 'vd', position: 1 });
  };

  return (
    <div className="p-4 bg-gray-100 flex space-x-4 justify-center items-center">
      {!imageUrl1 ? (
        <ImageInput onUpload={handleImageUpload1} type="smallV" />
      ) : (
        <ImagePreview imageUrl={imageUrl1} classes="w-1/2 w-48 object-cover" width="600" height="600" />
      )}
      {!imageUrl2 ? (
        <ImageInput onUpload={handleImageUpload2} type="smallV" />
      ) : (
        <ImagePreview imageUrl={imageUrl2} classes="w-1/2 w-48 object-cover" width="600" height="600" />
      )}
    </div>
  );
};

export const VerticalTriptych: React.FC<ImageProps> = ({ index, onUpload, urls }) => {
  const [imageUrl1, setImageUrl1] = useState<string | null>(urls?.[0] || null);
  const [imageUrl2, setImageUrl2] = useState<string | null>(urls?.[1] || null);
  const [imageUrl3, setImageUrl3] = useState<string | null>(urls?.[2] || null);

  const handleUpload = (position: number, setUrl: React.Dispatch<React.SetStateAction<string | null>>) =>
    ({ imageUrl }: UploadArgs) => {
      setUrl(imageUrl);
      onUpload({ index, url: imageUrl, subType: 'vt', position });
    };

  return (
    <div className="p-4 bg-gray-100 flex space-x-4 justify-center items-center">
      {!imageUrl1 ? <ImageInput onUpload={handleUpload(0, setImageUrl1)} type="smallV" /> : <ImagePreview imageUrl={imageUrl1} classes="w-1/3 w-48 object-cover" width={600} height={600} />}
      {!imageUrl2 ? <ImageInput onUpload={handleUpload(1, setImageUrl2)} type="smallV" /> : <ImagePreview imageUrl={imageUrl2} classes="w-1/3 w-48 object-cover" width={600} height={600} />}
      {!imageUrl3 ? <ImageInput onUpload={handleUpload(2, setImageUrl3)} type="smallV" /> : <ImagePreview imageUrl={imageUrl3} classes="w-1/3 w-48 object-cover" width={600} height={600} />}
    </div>
  );
};

export const HorizontalDiptych: React.FC<ImageProps> = ({ index, onUpload, urls }) => {
  const [imageUrl1, setImageUrl1] = useState<string | null>(urls?.[0] || null);
  const [imageUrl2, setImageUrl2] = useState<string | null>(urls?.[1] || null);

  const handleUpload = (position: number, setUrl: React.Dispatch<React.SetStateAction<string | null>>) =>
    ({ imageUrl }: UploadArgs) => {
      setUrl(imageUrl);
      onUpload({ index, url: imageUrl, subType: 'hd', position });
    };

  return (
    <div className="p-4 bg-gray-100 flex space-x-4 justify-center items-center">
      {!imageUrl1 ? <ImageInput onUpload={handleUpload(0, setImageUrl1)} type="smallH" /> : <ImagePreview imageUrl={imageUrl1} classes="w-1/2 h-48 object-cover" width="600" height="600" />}
      {!imageUrl2 ? <ImageInput onUpload={handleUpload(1, setImageUrl2)} type="smallH" /> : <ImagePreview imageUrl={imageUrl2} classes="w-1/2 h-48 object-cover" width="600" height="600" />}
    </div>
  );
};

export const HorizontalStack: React.FC<ImageProps> = ({ index, onUpload, urls }) => {
  const [imageUrl1, setImageUrl1] = useState<string | null>(urls?.[0] || null);
  const [imageUrl2, setImageUrl2] = useState<string | null>(urls?.[1] || null);

  const handleUpload = (position: number, setUrl: React.Dispatch<React.SetStateAction<string | null>>) =>
    ({ imageUrl }: UploadArgs) => {
      setUrl(imageUrl);
      onUpload({ index, url: imageUrl, subType: 'hs', position });
    };

  return (
    <div className="p-4 bg-gray-100 flex flex-col justify-center items-center">
      {!imageUrl1 ? <ImageInput onUpload={handleUpload(0, setImageUrl1)} type="smallH" /> : <ImagePreview imageUrl={imageUrl1} classes="w-2/3 h-48 object-cover mb-4" width="600" height="600"/>}
      {!imageUrl2 ? <ImageInput onUpload={handleUpload(1, setImageUrl2)} type="smallH" /> : <ImagePreview imageUrl={imageUrl2} classes="w-2/3 h-48 object-cover" width="600" height="600" />}
    </div>
  );
};
