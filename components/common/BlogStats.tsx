import React from 'react';

interface BlogStatsProps {
  totalPosts: number;
  selectedCategory: string | null;
  currentPage: number;
  totalPages: number;
}

const BlogStats: React.FC<BlogStatsProps> = ({
  totalPosts,
  selectedCategory,
  currentPage,
  totalPages
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
        <div className="p-4">
          <div className="text-3xl font-bold text-pink-600 mb-2">
            {totalPosts}
          </div>
          <div className="text-sm text-gray-600">
            {selectedCategory ? `Bài viết trong "${selectedCategory}"` : 'Tổng bài viết'}
          </div>
        </div>
        
        <div className="p-4">
          <div className="text-3xl font-bold text-pink-500 mb-2">
            {totalPages}
          </div>
          <div className="text-sm text-gray-600">
            Trang
          </div>
        </div>
        
        <div className="p-4">
          <div className="text-3xl font-bold text-pink-700 mb-2">
            {currentPage}
          </div>
          <div className="text-sm text-gray-600">
            Trang hiện tại
          </div>
        </div>
      </div>
      
      {selectedCategory && (
        <div className="mt-4 p-3 bg-pink-50 rounded-lg">
          <div className="flex items-center justify-center space-x-2">
            <span className="text-pink-600">📂</span>
            <span className="text-sm font-medium text-pink-800">
              Đang lọc theo: {selectedCategory}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogStats; 