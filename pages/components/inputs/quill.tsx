import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css";
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

interface TextEditorProps {
  element: { content: string, type: string }; 
  index: number;
  onChange: (index: number, value: string) => void;
}

export default function QuillTextEditor({ element, index, onChange }: TextEditorProps) {
  return (
    <ReactQuill
      value={element.content}
      onChange={(value) => onChange(index, value)} 
      modules={{
        toolbar: [
          ["bold", "italic", "underline"],
          [{ list: "ordered" }, { list: "bullet" }],
          ["link"], // Enables hyperlink support
        ],
      }}
      className="  roaming-black-text"
    />
  );
}
