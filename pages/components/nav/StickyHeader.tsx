import React, { useState, useEffect, useRef } from 'react';
import { BsInstagram, BsYoutube } from "react-icons/bs";
import { SiTiktok } from "react-icons/si";
import PropTypes from 'prop-types';
import Image from 'next/image'
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useIsAdmin } from "@/lib/auth";

interface SubmenuItem {
  label: string;
  href?: string;
}

interface MenuItem {
  label: string;
  submenu?: SubmenuItem[];
}

interface NestedDropdownProps {
  menuItems: MenuItem[];
}

interface StickyHeaderProps {
  page: string;
}

export default function StickyHeader({ page }: StickyHeaderProps) {
  const { isAdmin} = useIsAdmin();
  // const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();

  // const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();
  //   if (searchTerm.trim()) {
  //     window.open(`/search?query=${encodeURIComponent(searchTerm)}`, '_blank');
  //     setSearchTerm('');
  //   }
  // };
  const [menuItems, setMenuItems] = useState([
    {
      label: 'North America',
      submenu: [
        { label: 'Canada' },
        { label: 'Mexico' },
      ],
    },
    {
      label: 'South America',
      submenu: [
        { label: 'Equador' },
        { label: 'Colombia' },
        { label: 'Peru' },
      ],
    },
    {
      label: 'Asia',
      submenu: [
        { label: 'Japan' },
        { label: 'South Korea' },
        { label: 'The Phillippines' },
      ],
    },
  ]);
  
  const [menuOpen, setMenuOpen]= useState(false);
  // useEffect(() => {
  //   async function fetchMenuData() {
  //     // Fetch the menu data from your API
  //     const response = await fetch('/api/getMenuData');
  //     const data = await response.json();
  //     setMenuItems(data.menuItems);
  //   }

  //   fetchMenuData();
  // }, []);
  const linkClass = (linkPath: string) =>
    linkPath === page ? 'roaming-yellow-text font-bold' : 'roaming-black-text hover:font-bold';
  const [clickedLink, setClickedLink] = useState<string | null>(null);

  const handleLinkClick = (path: string) => {
    setClickedLink(path);

    router.push(path);
  };
  return(
<header className="sticky top-0 w-full roaming-white shadow-md z-20 font-customTrebuchet px-6">

  <div className="max-w-full mx-auto flex items-center justify-between py-4">
    {/* Left Section: Navigation Links */}
    
    <nav className="hidden lg:flex md:flex items-center items-start space-x-6">
    <Image
        src="https://res.cloudinary.com/busy-bee/image/upload/v1707404025/favicon_vs8yfk.png"
        alt="Logo"
        width={48}
        height={48}
        className="w-12 h-12 mx-auto"
        priority
      />
      <Link href="/" className={linkClass('home')} onClick={() => handleLinkClick('/home')}>
        Home
      </Link>
      <NestedDropdown menuItems={menuItems} />
      <Link href="/about" className={linkClass('about')} onClick={() => handleLinkClick('/about')}>
        About
      </Link>
      <Link href="/collaborate" className={linkClass('collaborate')} onClick={() => handleLinkClick('/collaborate')}>
        Collaborate
      </Link>
      {isAdmin && (
        <Link href="/admin" className={linkClass('admin')} onClick={() => handleLinkClick('/admin')}>
          Admin
        </Link>
      )}
    </nav>



    {/* Right Section: Social Icons and Mobile Menu Button */}
    <div className="flex items-center space-x-4">
      {/* Social Icons */}
      <div className="hidden lg:flex md:flex items-center space-x-4">
        <Link href="https://www.instagram.com/roamingintheknow/" target="_blank" rel="noopener noreferrer">
          <BsInstagram size="1.5em" className="roaming-black-text cursor-pointer" />
        </Link>
        <Link href="https://www.tiktok.com/@roamingintheknow" target="_blank" rel="noopener noreferrer">
          <SiTiktok size="1.5em" className="roaming-black-text cursor-pointer" />
        </Link>
        <Link href="https://www.youtube.com/@roamingintheknow" target="_blank" rel="noopener noreferrer">
          <BsYoutube size="1.5em" className="roaming-black-text cursor-pointer" />
        </Link>
      </div>

      {/* Mobile Menu Button */}
      <div className="block lg:hidden md:hidden">
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="text-black focus:outline-none"
          aria-label="Toggle Menu"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16m-7 6h7"
            />
          </svg>
        </button>
      </div>
    </div>
  </div>

{/* Mobile Side Menu */}
{menuOpen && (
  <div className="lg:hidden md:hidden fixed inset-0 bg-black bg-opacity-50 z-30">
    <div className="absolute top-0 left-0 w-1/3 max-w-sm bg-white h-full shadow-lg">
      <div className="flex justify-between items-end p-4">
        <h2 className="text-xl font-bold">Menu</h2>
        <button
          onClick={() => setMenuOpen(false)}
          className="text-black focus:outline-none"
          aria-label="Close Menu"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
      <nav className="flex flex-col space-y-4 px-6 py-4">
        <Link href="/" className="text-black" onClick={() => setMenuOpen(false)}>
          Home
        </Link>
        <NestedDropdown menuItems={menuItems} />
        <Link href="/about" className="text-black" onClick={() => setMenuOpen(false)}>
          About
        </Link>
        <Link href="/collaborate" className="text-black" onClick={() => setMenuOpen(false)}>
          Collaborate
        </Link>
        {isAdmin && (
          <Link href="/admin" className="text-black" onClick={() => setMenuOpen(false)}>
            Admin
          </Link>
        )}
      </nav>
    </div>
  </div>
)}

</header>


  
  )

}


const NestedDropdown = ({ menuItems }: NestedDropdownProps) => {
  const [open, setOpen] = useState(false);
  const [submenuOpen, setSubmenuOpen] = useState(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleMenuToggle = () => setOpen(!open);
  const handleSubmenuToggle = (index) => setSubmenuOpen(submenuOpen === index ? null : index);
  
  const handleClickOutside = (event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
        setSubmenuOpen(null);
      }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <p
        onClick={handleMenuToggle}
        className="roaming-black-text hover:font-bold"
        style={{cursor:'pointer'}}
        // className="inline-flex w-full justify-center rounded-md border border-gray-300 bg-gray-50 px-4 py-2 text-sm font-medium text-gray-700 shadow-sm ring-1 ring-gray-900/10 hover:ring-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      >
        Destinations
      </p>
      {open && (
        <div className="absolute left-full mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-gray-900/10">
          <div className="py-1">
            {menuItems.map((item, index) => (
              <React.Fragment key={index}>
                <button
                  onClick={() => handleSubmenuToggle(index)}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  {item.label}
                </button>
                {submenuOpen === index && item.submenu && (
                  <div className="absolute left-full top-0 mt-2 w-56 origin-top-left rounded-md bg-white shadow-lg ring-1 ring-gray-900/10">
                    <div className="py-1">
                      {item.submenu.map((subitem, subindex) => (
                        <a
                          key={subindex}
                          href={`/search?country=${encodeURIComponent(subitem.label)}`}
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          {subitem.label}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

NestedDropdown.propTypes = {
  menuItems: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      submenu: PropTypes.arrayOf(
        PropTypes.shape({
          label: PropTypes.string.isRequired,
          href: PropTypes.string
        })
      )
    })
  ).isRequired
};
