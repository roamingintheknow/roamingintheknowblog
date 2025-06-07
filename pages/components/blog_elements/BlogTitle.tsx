import StickyHeader from '../nav/StickyHeader'
import Image from 'next/image'
import { DEFAULT_COVER_IMAGE } from "@/variables/images";

interface TitleProps {
  text: string | string[];
  coverH?: string;
  coverV?: string;
  coverS?: string;
}
export function BlogTitle({ text, coverH,coverV,coverS }: TitleProps) {
  return (
<>
<StickyHeader page="none"/>

      <div className="blog-element relative w-screen h-screen overflow-hidden flex items-center justify-center ">
  {/* Image Block with Overlay */}
  <div className="absolute inset-0">
    <Image
      src={coverH ?? DEFAULT_COVER_IMAGE}
      alt={'cover image'}
      fill 
      style={{ objectFit: 'cover' }}
      className="object-cover"
    />
    <div className="absolute inset-0 bg-black opacity-20"></div> {/* Add a subtle overlay */}
  </div>
  
  <div className="relative z-10 flex flex-col items-center space-y-4">
    <p className="text-4xl md:text-6xl font-bold roaming-yellow-text">{text}</p>
  </div>
</div>
</>
  );
}