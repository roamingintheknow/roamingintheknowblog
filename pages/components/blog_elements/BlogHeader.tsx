interface BlogHeaderProps {
  text: string | string[];
}

export function BlogHeader({text}: BlogHeaderProps) {

  return (
    <div>
      <h1 className ='blog-h1 blog-element roaming-black-text'>{text}</h1>
    </div>
  );
}
