import Image from 'next/image';

interface ImageUrl {
  imageUrl: string;
  lowResUrl?: string;
}

interface BlogImageProps {
  element: {
    subType?: string;
    imageUrls?: ImageUrl[];
  };
}

export function BlogImage({ element }: BlogImageProps) {
  const subType = element?.subType || '';
  const urls = element?.imageUrls ?? [];

  // Define a uniform width and spacing
  const uniformWidth = 900;
  const gapSize = 8; // Gap size in pixels

  // Define height ratios for each subtype
  const heightRatios: Record<string, number> = {
    lh: 2 / 3, // Landscape horizontal
    lv: 3 / 2, // Landscape vertical
    vd: 2 / 3, // Vertical diptych
    vt: 2 / 3, // Vertical triptych
    hd: 1 / 3, // Horizontal diptych
    hs: 1 / 3, // Horizontal stack
  };

  // Get height dynamically based on subtype
  const getHeight = (subType: string): number => 
    Math.round(uniformWidth * (heightRatios[subType] || 1));

  // Adjust width dynamically for diptychs and triptychs, subtracting space for gaps
  const getWidth = (subType: string): number => {
    if (['vd', 'vt', 'hd', 'hs'].includes(subType)) {
      const totalGap = gapSize * (urls.length - 1); // Total space taken by gaps
      return Math.floor((uniformWidth - totalGap) / urls.length); // Width per image
    }
    return uniformWidth; // Full width for single layouts
  };

  console.log('urls...', urls);

  return (
    <div className="w-full">
      {['lh', 'lv', 'vd', 'vt', 'hd', 'hs'].includes(subType) && (
        <div
          className={`w-full ${
            ['hd', 'hs', 'vd', 'vt'].includes(subType)
              ? 'flex flex-wrap justify-center'
              : 'flex flex-col items-center'
          }`}
          style={{ gap: `${gapSize}px` }} // Set gap size
        >
          {urls.map((url, index) => (
            <Image
              key={index}
              src={url.imageUrl}
              alt={`Uploaded image ${index}`}
              className="mt-2"
              width={getWidth(subType)}
              height={getHeight(subType)}
              placeholder="blur" // Blurred preview
              blurDataURL={url.lowResUrl} // Low-quality placeholder
              style={{ objectFit: 'cover' }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
