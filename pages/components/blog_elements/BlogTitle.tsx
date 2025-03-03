interface BlogTitleProps {
  text: string;
}

export function BlogTitle({ text }: BlogTitleProps) {
  return (
    <div className="flex justify-center items-center h-full">
      <p className="blog-title roaming-black-text text-center">{text}</p>
    </div>
  );
}
