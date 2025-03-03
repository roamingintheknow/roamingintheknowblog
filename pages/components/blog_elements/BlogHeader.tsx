interface BlogHeaderProps {
  text: string;
}

export function BlogHeader({text}: BlogHeaderProps) {

  return (
    <div>
      <p className ='blog-h2 roaming-brown-text'>{text}</p>
    </div>
  );
}
