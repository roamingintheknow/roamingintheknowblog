'use client';
import { useEffect, useRef, useState } from 'react';
import { BlogElement } from '@/types/blog';

interface HeaderNavProps {
  elements: BlogElement[];
}

export const BlogNavPanel = ({ elements }: HeaderNavProps) => {
  const [open, setOpen] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [showToggle, setShowToggle] = useState(false);
  const firstHeaderId = useRef<string | null>(null);

  const headers = elements
    .map((el, i) => {
      if (el.type === 'header') {
        const id = `header-${i}`;
        if (!firstHeaderId.current) firstHeaderId.current = id;
        return { content: el.content, id };
      }
      return null;
    })
    .filter(Boolean) as { content: string; id: string }[];

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    // Wait to set active ID so it doesnt update while scrolling up past headers
    setTimeout(() => {
      setActiveId(id);
    }, 500);
    // setOpen(false);
  };

  useEffect(() => {
    const el = document.getElementById(firstHeaderId.current || '');
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setShowToggle(entry.isIntersecting || window.scrollY > el.offsetTop);
      },
      { threshold: 0 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((entry) => entry.isIntersecting);
        if (visible) setActiveId(visible.target.id);
      },
      { rootMargin: '-40% 0px -50% 0px', threshold: 0.1 }
    );

    headers.forEach((h) => {
      const el = document.getElementById(h.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [headers]);

  return (
    <>
      {/* Toggle button — becomes visible and fixed after first header */}
      <div
        className={`fixed top-[5vh] left-0 z-0 transition-opacity ${
          showToggle ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        {!open && (
          <button
            onClick={() => setOpen(true)}
            className="bg-roaming-yellow text-black px-3 py-2 rounded-r-md shadow-md hover:bg-roaming-green transition"
          >
            ☰
          </button>
        )}
      </div>

      {/* Nav panel */}
      {open && (
  <div className="fixed top-0 left-0 h-full z-50 roaming-white shadow-lg w-64 border-r-3 border-black flex flex-col">

          <div className="flex items-center justify-between p-3 border-b">
            <h3 className="font-bold text-lg roaming-brown-text">Jump to Section</h3>
            <button
              onClick={() => setOpen(false)}
              className="text-gray-600 hover:text-black text-xl"
            >
              ✖
            </button>
          </div>
          <ul className="flex-1 overflow-y-auto p-4 space-y-2">
            {headers.map((h) => (
              <li
                key={h.id}
                onClick={() => scrollTo(h.id)}
                className={`cursor-pointer px-2 py-1 rounded-md transition ${
                  activeId === h.id
                    ? 'bg-roaming-yellow text-black font-semibold'
                    : 'text-gray-700 hover:text-black hover:bg-gray-100'
                }`}
              >
                {h.content}
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
};
