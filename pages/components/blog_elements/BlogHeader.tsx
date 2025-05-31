interface BlogHeaderProps {
  text: string | string[];
}

export function BlogHeader({text}: BlogHeaderProps) {

  return (
    <div>
      <p className ='blog-h2 blog-element roaming-brown-text'>{text}</p>
    </div>
  );
}
