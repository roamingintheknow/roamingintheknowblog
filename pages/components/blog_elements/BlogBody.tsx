interface BlogBodyProps {
  text: string;
}

export function BlogBody({ text }: BlogBodyProps) {
  return (
    <div>
      <p className="blog-body roaming-black-text">{text}</p>
    </div>
  );
}
