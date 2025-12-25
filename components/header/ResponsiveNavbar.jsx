import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { AiOutlineClose, AiOutlineDown, AiOutlineUp } from "react-icons/ai";
import { FaRegUser, FaHeart, FaFacebook, FaTwitter, FaLinkedin, FaInstagram,FaChevronUp,FaAngleDown  } from "react-icons/fa";
import logo from "../../public/logo-font.png";

const ResponsiveMenu = ({ isOpen, toggleMenu }) => {
  const [activeDropdown, setActiveDropdown] = useState(null);

  const toggleDropdown = (index) => {
    setActiveDropdown(activeDropdown === index ? null : index);
  };

  const menuItems = [
    { name: "Trang chủ", link: "/" },
    { name: "Dịch vụ", link: "/dich-vu" },
    { name: "Font yêu thích", link: "/danh-sach-yeu-thich" },
    { name: "Thông tin tài khoản", link: "/tai-khoan" },
    { name: "Bài viết", link: "/bai-viet" },
  ];

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 z-40 transition-opacity duration-300 responsive-menu-overlay ${
          isOpen ? "opacity-100 pointer-events-auto overlay-fade-in" : "opacity-0 pointer-events-none"
        }`}
        onClick={toggleMenu}
      ></div>

      {/* Sidebar Menu */}
      <div
        className={`fixed top-0 left-0 w-[70%] h-full max-h-full overflow-y-auto z-50 transform responsive-menu-sidebar ${
          isOpen ? "translate-x-0 menu-slide-in" : "-translate-x-full"
        } transition-transform duration-300`}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-4 responsive-menu-header">
          <Image src={logo} alt="Logo" width={150} height={70} />
          <AiOutlineClose
            size={25}
            className="cursor-pointer close-button"
            onClick={toggleMenu}
          />
        </div>


        {/* Menu Items */}
        <div className="menu-items-container">
          <ul className="space-y-2">
            {menuItems.map((item, index) => (
              <li key={index}>
                {!item.dropdown ? (
                  <div className="menu-item">
                    <Link href={item.link} className="menu-item-link">
                      {item.name}
                    </Link>
                  </div>
                ) : (
                  <>
                    <button
                      className="dropdown-toggle"
                      onClick={() => toggleDropdown(index)}
                      role="button"
                      aria-expanded={activeDropdown === index}
                    >
                      <span>{item.name}</span>
                      <span className="dropdown-icon">
                        {activeDropdown === index ? (
                          <FaChevronUp size={20} />
                        ) : (
                          <FaAngleDown size={20} />
                        )}
                      </span>
                    </button>
                    <div
                      className={`dropdown-content ${
                        activeDropdown === index ? "max-h-96" : "max-h-0"
                      } overflow-hidden transition-all duration-300`}
                    >
                      {item.dropdown.map((subItem, subIndex) => (
                        <div key={subIndex} className="dropdown-item">
                          <Link
                            href={subItem.link}
                            className="dropdown-item-link"
                          >
                            {subItem.name}
                          </Link>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </li>
            ))}
          </ul>
        </div>


        {/* Social Media Links */}
        <div className="social-links-container">
          <div className="flex space-x-4 justify-center">
            <Link href="#" className="social-link facebook">
              <FaFacebook />
            </Link>
            <Link href="#" className="social-link twitter">
              <FaTwitter />
            </Link>
            <Link href="#" className="social-link linkedin">
              <FaLinkedin />
            </Link>
            <Link href="#" className="social-link instagram">
              <FaInstagram />
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default ResponsiveMenu;
