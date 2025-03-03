import Image from 'next/image'

const ImagePreview = ({imageUrl,classes, width, height})=>{
  console.log('ImageURL...',imageUrl)
  return(
   <>
    {imageUrl && (
        <Image src={imageUrl} alt="Uploaded" className={`mt-2 ${classes}`} width={width} height={height}/>
    )}
   </>
  )
}

export default ImagePreview;