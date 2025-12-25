"use client";
import React, { useState, useEffect, useRef } from "react";
import logo from "../../public/logo-font.png";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";
import { AiOutlineMenu, AiOutlineClose, FaSearch } from "react-icons/ai";
import { FaRegUser, FaShoppingCart } from "react-icons/fa";
import ResponsiveNavbar from "./ResponsiveNavbar";
import UserDropdown from "./UserDropdown";
import PricingPage from "../font/PricingTable";
import { useSession } from "next-auth/react";
import { useSelector, useDispatch } from "react-redux";
import { Heart } from "lucide-react";

const LOGO_WIDTH = 150;
const LOGO_HEIGHT = 45;
const STICKY_THRESHOLD = 50;

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isSticky, setIsSticky] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [isPricingOpen, setIsPricingOpen] = useState(false);
  const { data: session } = useSession();

  const dropdownRef = useRef(null);
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.cartItems) || [];
  const totalQuantity = cartItems.reduce((total, item) => total + item.quantity, 0);
  const favoriteFonts = useSelector((state) => state.favorites?.favoriteFonts ?? []);
  const totalFavorites = favoriteFonts.length;


  // Close user dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Sticky navbar on scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > STICKY_THRESHOLD);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Toggle functions
  const toggleMenu = () => setMenuOpen(!menuOpen);
  const toggleSearch = () => setSearchOpen(!searchOpen);
  const toggleUserDropdown = () => setUserDropdownOpen(!userDropdownOpen);
  const togglePricing = () => setIsPricingOpen(!isPricingOpen);

  return (
    <nav
      className={`fixed w-full h-16 z-50 transition-all duration-500 ${
        isSticky ? "shadow-sm bg-white" : "bg-transparent"
      }`}
    >
      <div className="flex justify-between items-center h-full w-full px-4 md:px-16">
        {/* Logo */}
        <Link href="/">
          <Image
            src={logo}
            alt="Eco Bắc Giang logo"
            width={LOGO_WIDTH}
            height={LOGO_HEIGHT}
            className="cursor-pointer"
            priority
            objectFit="contain"
          />
        </Link>


        {/* Right Icons */}
        <div className="hidden lg:flex items-center space-x-4">
          <button
            onClick={togglePricing}
            className="bg-green-600 animate-blink py-3 font-heading text-white px-4 rounded font-semibold uppercase"
            aria-label="Mở trang định giá"
          >
            Nâng cấp gói
          </button>

          {/* Favorites Icon */}
          <div className="relative">
            <Link href="/danh-sach-yeu-thich" aria-label={`Có ${totalFavorites} font yêu thích`}>
              <div className="bg-white p-3 rounded shadow hover:bg-slate-100 cursor-pointer">
                <Heart className="w-5 h-5" />
                {totalFavorites > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                    {totalFavorites}
                  </span>
                )}
              </div>
            </Link>
          </div>


          {/* User Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <div
              className="cursor-pointer bg-white p-3 rounded shadow hover:bg-slate-100"
              onClick={toggleUserDropdown}
              onKeyDown={(e) => e.key === "Enter" && toggleUserDropdown()}
              role="button"
              aria-expanded={userDropdownOpen}
              aria-controls="user-dropdown"
              tabIndex={0}
            >
              <FaRegUser className="w-5 h-5"/>
            </div>
            <UserDropdown userDropdownOpen={userDropdownOpen} toggleUserDropdown={toggleUserDropdown} />
          </div>
        </div>

        {/* Hamburger Menu */}
        <div
          className="md:hidden cursor-pointer pl-24"
          onClick={toggleMenu}
          onKeyDown={(e) => e.key === "Enter" && toggleMenu()}
          tabIndex={0}
          role="button"
          aria-label={menuOpen ? "Đóng menu" : "Mở menu"}
        >
          {menuOpen ? <AiOutlineClose size={25} /> : <AiOutlineMenu size={25} />}
        </div>
      </div>

      {/* Mobile Menu */}
      <ResponsiveNavbar isOpen={menuOpen} toggleMenu={toggleMenu} />

      {/* Search Overlay */}
      {searchOpen && (
        <div
          className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 z-50 flex items-start justify-center"
          onClick={() => setSearchOpen(false)}
        >
          <form
            className="w-full max-w-[800px] bg-white h-[50px] flex items-center px-4 mt-20 rounded-full shadow-lg animate-fall"
            onClick={(e) => e.stopPropagation()}
            onSubmit={(e) => {
              e.preventDefault();
              const query = e.target.query.value;
              window.location.href = `/search?q=${encodeURIComponent(query)}`;
            }}
          >
            <input
              type="text"
              name="query"
              placeholder="Tìm kiếm sản phẩm, danh mục, bài viết..."
              className="w-full border-none outline-none text-gray-700"
              aria-label="Tìm kiếm sản phẩm, danh mục, bài viết"
            />
            <button type="submit" className="ml-2 text-gray-700" aria-label="Tìm kiếm">
              <FaSearch />
            </button>
          </form>
        </div>
      )}

      {/* Pricing Popup */}
      {isPricingOpen && (
        <div
          className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 z-50 flex items-center justify-center"
          onClick={() => setIsPricingOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Trang định giá"
        >
          <div
            className="bg-white rounded-2xl shadow-lg max-w-7xl w-full mx-4 animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
          
            <PricingPage onClose={() => setIsPricingOpen(false)} />
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;