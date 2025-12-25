import {
  User as UserIcon,
  Lock,
  CreditCard,
  MapPin,
  FileText,
  Heart,
  Shield,
  Bell,
  LogOut,
  ChevronRight,
  Users
} from 'lucide-react';
import Image from 'next/image';

export default function UserSidebar({ selectedTab, onTabClick, userName, userImage, userRole }) {
  const menuItems = [
    {
      id: "account",
      icon: UserIcon,
      title: "Thông tin cá nhân",
      subtitle: "Cập nhật thông tin tài khoản",
      color: "text-pink-600",
      bgColor: "bg-pink-50",
      borderColor: "border-pink-200",
      activeBg: "bg-pink-100",
      activeBorder: "border-pink-300"
    },
    
    
    {
      id: "favorites",
      icon: Heart,
      title: "Font chữ yêu thích",
      subtitle: "Danh sách font chữ đã lưu",
      color: "text-pink-600",
      bgColor: "bg-pink-50",
      borderColor: "border-pink-200",
      activeBg: "bg-pink-100",
      activeBorder: "border-pink-300"
    },
    {
      id: "payment",
      icon: CreditCard,
      title: "Phương thức thanh toán",
      subtitle: "Quản lý thẻ và ví điện tử",
      color: "text-pink-600",
      bgColor: "bg-pink-50",
      borderColor: "border-pink-200",
      activeBg: "bg-pink-100",
      activeBorder: "border-pink-300"
    },
    {
      id: "security",
      icon: Shield,
      title: "Bảo mật tài khoản",
      subtitle: "Đổi mật khẩu và bảo mật",
      color: "text-pink-600",
      bgColor: "bg-pink-50",
      borderColor: "border-pink-200",
      activeBg: "bg-pink-100",
      activeBorder: "border-pink-300"
    }
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
      activeBg: "bg-blue-100",
      activeBorder: "border-blue-300"
    }
  ];

  // Combine menu items based on user role
  const allMenuItems = userRole === 'admin' ? [...menuItems, ...adminMenuItems] : menuItems;

  return (
    <div className="w-80 bg-gradient-to-b from-gray-50 to-white h-full">

      {/* Menu Items */}
      <div className="p-6">
        <div className="space-y-3">
          {allMenuItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = selectedTab === item.id;
            return (
              <div
                key={item.id}
                onClick={() => onTabClick(item.id)}
                className={`group relative overflow-hidden rounded-2xl border-2 cursor-pointer transition-all duration-300 transform hover:-translate-y-1 hover:scale-[1.02] ${
                  isActive
                    ? `${item.activeBg} ${item.activeBorder} shadow-lg`
                    : `${item.borderColor} bg-white hover:border-gray-300 hover:shadow-md`
                }`}
              >
                <div className="flex items-center p-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mr-4 transition-all duration-300 ${
                    isActive ? item.bgColor : item.bgColor
                  } group-hover:scale-110 shadow-sm`}>
                    <IconComponent className={`w-6 h-6 ${item.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className={`font-semibold truncate transition-colors duration-300 ${
                      isActive ? 'text-gray-900' : 'text-gray-800 group-hover:text-gray-900'
                    }`}>
                      {item.title}
                    </h3>
                    <p className="text-xs text-gray-500 mt-0.5 truncate">{item.subtitle}</p>
                  </div>
                  <ChevronRight className={`w-5 h-5 transition-all duration-300 flex-shrink-0 ${
                    isActive ? 'text-gray-600' : 'text-gray-400 group-hover:text-gray-600'
                  } group-hover:translate-x-1`} />
                </div>
                {/* Active indicator */}
                {isActive && (
                  <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-pink-400 to-pink-600 rounded-r-full"></div>
                )}
                {/* Hover effect overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-gray-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              </div>
            );
          })}
        </div>

        {/* Logout Section */}
        <div className="mt-6 pt-6 border-t border-gray-100">
          <div className="group relative overflow-hidden rounded-2xl border-2 border-red-200 bg-gradient-to-r from-red-50 to-red-100 hover:from-red-100 hover:to-red-200 transition-all duration-300 cursor-pointer transform hover:-translate-y-1 hover:scale-[1.02]">
            <div className="flex items-center p-4">
              <div className="w-12 h-12 rounded-xl bg-red-200 flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300 shadow-sm">
                <LogOut className="w-6 h-6 text-red-700" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-black group-hover:text-red-900 transition-colors duration-300">
                  Đăng xuất
                </h3>
                <p className="text-sm text-black mt-0.5">Thoát khỏi tài khoản</p>
              </div>
            </div>
            {/* Hover effect overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-red-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
          </div>
        </div>
      </div>
    </div>
  );
}