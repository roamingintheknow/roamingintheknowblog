interface BlogBodyProps {
  text: string | string[];
}

export function BlogBody({ text }: BlogBodyProps) {
  return (
    <div>
      <p
        className="blog-body blog-element roaming-black-text"
        dangerouslySetInnerHTML={{ __html: text }}
      />
    </div>
  );
}

