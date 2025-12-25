import { FC, useState } from "react";

interface Props {
  onCategorySelect: (category: string | null) => void; // Hàm xử lý khi danh mục được chọn
}

const MainCategories: FC<Props> = ({ onCategorySelect }) => {
  const [activeCategory, setActiveCategory] = useState<string | null>(null); // Lưu danh mục đang được chọn

  const handleCategoryClick = (category: string | null) => {
    setActiveCategory(category); // Cập nhật trạng thái active
    onCategorySelect(category); // Gọi hàm callback
  };

  const categories = [
    { id: null, name: "Tất cả bài viết", icon: "📰" },
    { id: "Tin tức & Xu hướng", name: "Tin tức & Xu hướng", icon: "📈" },
    { id: "Chuyện của Farm", name: "Chuyện của Farm", icon: "🌾" },
    { id: "Công thức nấu ăn", name: "Công thức nấu ăn", icon: "👨‍🍳" },
    { id: "Sống xanh", name: "Sống xanh", icon: "🌱" },
  ];

  return (
    <div className="w-full">
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
          Lọc theo danh mục
        </h3>
        
        <div className="flex flex-wrap gap-3 justify-center">
          {categories.map((category) => (
            <button
              key={category.id || "all"}
              onClick={() => handleCategoryClick(category.id)}
              className={`flex items-center space-x-2 px-4 py-3 rounded-xl font-medium transition-all duration-200 transform hover:scale-105 ${
                activeCategory === category.id
                  ? "bg-green-600 text-white shadow-lg"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:text-gray-900"
              }`}
            >
              <span className="text-lg">{category.icon}</span>
              <span className="text-sm sm:text-base">{category.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MainCategories;
