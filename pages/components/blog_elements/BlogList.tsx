import { Blog, BlogElement } from '@/types/blog';

interface SubSubItem {
  id: number;
  text: string;
};

interface SubItem  {
  id: number;
  text: string;
  subSubItems: SubSubItem[];
};

interface ContentItem {
  id: number;
  text: string;
  subItems: SubItem[];
};

export function BlogList({ element }: { element: BlogElement }) {
  const contentString = Array.isArray(element.content) ? element.content.join('') : element.content;
  const parsedContent: ContentItem[] = (() => {
    try {
      return JSON.parse(contentString);
    } catch (e) {
      console.error("Failed to parse content", e);
      return [];
    }
  })();
  return (
    <div>
      {parsedContent.map((item, index) => (
        <div key={item.id} className="blog-body blog-element roaming-black-text">
          {/* First-level list: 1, 2, 3 */}
          <div
            dangerouslySetInnerHTML={{
              __html: item.text.replace(/^<p>/, `<p><strong>${index + 1}.</strong> `),
            }}
          />

          {/* Second-level list: a, b, c */}
          {item.subItems.map((subItem, subIndex) => (
            <div key={subItem.id} className="blog-body blog-element roaming-black-text blog-sub-list">
              <div
                dangerouslySetInnerHTML={{
                  __html: subItem.text.replace(/^<p>/, `<p><strong>${String.fromCharCode(97 + subIndex)}.</strong> `),
                }}
              />

              {/* Third-level list: i, ii, iii */}
              {subItem.subSubItems.map((subSubItem, subSubIndex) => (
                <div key={subSubItem.id} className="blog-body blog-element roaming-black-text blog-sub-sub-list">
                  <div
                    dangerouslySetInnerHTML={{
                      __html: subSubItem.text.replace(/^<p>/, `<p><strong>${toRoman(subSubIndex + 1)}.</strong> `),
                    }}
                  />
                </div>
              ))}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

// Function to convert numbers to Roman numerals (i, ii, iii, iv, ...)
function toRoman(num: number): string {
  const romanNumerals = ["i", "ii", "iii", "iv", "v", "vi", "vii", "viii", "ix", "x"];
  return romanNumerals[num - 1] || num.toString();
}
