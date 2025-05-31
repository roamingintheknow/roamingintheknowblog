interface BlogSubHeaderProps {
  text: string;
}

export function BlogSubHeader({text}: BlogSubHeaderProps) {

  return (
    <div>
      <p className ='blog-h-sub blog-element roaming-brown-text'>{text}</p>
    </div>
  );
}
