import React from "react";
import {
  User,
  MapPin,
  FileText,
  Heart,
  CreditCard,
  Shield,
  Bell,
  LogOut,
  ChevronRight,
  Settings,
  Users
} from "lucide-react";

export default function AccountSettingsList({ handleTabClick, onSignOut, userRole = "user" }) {
  const menuItems = [
    {
      id: "account",
      icon: User,
      title: "Thông tin cá nhân",
      subtitle: "Cập nhật thông tin tài khoản",
      color: "text-pink-600",
      bgColor: "bg-pink-50",
      borderColor: "border-pink-200",
      hoverBg: "hover:bg-pink-50"
    },
   
    {
      id: "favorites",
      icon: Heart,
      title: "Font chữ yêu thích",
      subtitle: "Danh sách font đã lưu",
      color: "text-pink-600",
      bgColor: "bg-pink-50",
      borderColor: "border-pink-200",
      hoverBg: "hover:bg-pink-50"
    },
    {
      id: "payment",
      icon: CreditCard,
      title: "Phương thức thanh toán",
      subtitle: "Quản lý thẻ và ví điện tử",
      color: "text-pink-600",
      bgColor: "bg-pink-50",
      borderColor: "border-pink-200",
      hoverBg: "hover:bg-pink-50"
    },
    {
      id: "security",
      icon: Shield,
      title: "Bảo mật tài khoản",
      subtitle: "Đổi mật khẩu và bảo mật",
      color: "text-pink-600",
      bgColor: "bg-pink-50",
      borderColor: "border-pink-200",
      hoverBg: "hover:bg-pink-50"
    },

  ];

  // Add admin-specific menu items
  const adminMenuItems = [
    {
      id: "all-users",
      icon: Users,
      title: "Danh sách người dùng",
      subtitle: "Quản lý tất cả người dùng",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      hoverBg: "hover:bg-blue-50"
    }
  ];

  // Combine menu items based on user role
  const allMenuItems = userRole === 'admin' ? [...menuItems, ...adminMenuItems] : menuItems;

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-400 to-pink-600 flex items-center justify-center mr-3">
              <Settings className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Cài đặt tài khoản</h2>
              <p className="text-sm text-gray-600">Quản lý thông tin và tùy chọn</p>
            </div>
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <div className="space-y-3">
        {allMenuItems.map((item) => {
          const IconComponent = item.icon;
          return (
            <div
              key={item.id}
              onClick={() => handleTabClick(item.id)}
              className={`group relative overflow-hidden rounded-3xl border-2 ${item.borderColor} bg-white hover:border-gray-300 hover:shadow-xl transition-all duration-500 cursor-pointer transform hover:-translate-y-1 hover:scale-[1.02]`}
            >
              <div className="flex items-center p-5">
                <div className={`w-14 h-14 rounded-2xl ${item.bgColor} flex items-center justify-center mr-5 group-hover:scale-110 transition-transform duration-500 shadow-sm`}>
                  <IconComponent className={`w-7 h-7 ${item.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-gray-900 group-hover:text-gray-700 transition-colors duration-300 truncate text-lg">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1 truncate">{item.subtitle}</p>
                </div>
                <ChevronRight className="w-6 h-6 text-gray-400 group-hover:text-gray-600 transition-colors duration-300 flex-shrink-0 group-hover:translate-x-1" />
              </div>
              {/* Hover effect overlay */}
              <div className={`absolute inset-0 bg-gradient-to-r from-transparent to-gray-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`}></div>
              {/* Ripple effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%]"></div>
            </div>
          );
        })}
      </div>

      {/* Logout Section */}
      <div className="mt-6 pt-6 border-t border-gray-100">
        <div className="group relative overflow-hidden rounded-3xl border-2 border-red-200 bg-gradient-to-r from-red-50 to-red-100 hover:from-red-100 hover:to-red-200 transition-all duration-500 cursor-pointer transform hover:-translate-y-1 hover:scale-[1.02]">
          <div className="flex items-center p-5">
            <div className="w-14 h-14 rounded-2xl bg-red-200 flex items-center justify-center mr-5 group-hover:scale-110 transition-transform duration-500 shadow-sm">
              <LogOut className="w-7 h-7 text-red-700" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-red-800 group-hover:text-red-900 transition-colors duration-300 truncate text-lg">
                Đăng xuất
              </h3>
              <p className="text-sm text-red-600 mt-1 truncate">Thoát khỏi tài khoản</p>
            </div>
            <div className="w-6 h-6 text-red-600 group-hover:text-red-700 transition-colors duration-300 flex-shrink-0">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </div>
          </div>
          {/* Hover effect overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-red-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
          {/* Ripple effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%]"></div>
        </div>
      </div>
    </div>
  );
}