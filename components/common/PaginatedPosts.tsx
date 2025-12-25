import React, { FC, useState } from "react";
import { PostDetail } from "../../utils/types";
import PostCard from "./PostCard";

interface Props {
  posts: PostDetail[]; // Danh sách bài viết
  postsPerPage: number; // Số bài viết mỗi trang
}

const PaginatedPosts: FC<Props> = ({ posts, postsPerPage }) => {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(posts.length / postsPerPage);
  const currentPosts = posts.slice(
    (currentPage - 1) * postsPerPage,
    currentPage * postsPerPage
  );

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      // Scroll to top when page changes
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const renderPaginationControls = () => {
    if (totalPages <= 1) return null;

    const delta = 2;
    const range: (number | string)[] = [];

    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      range.push(i);
    }

    if (currentPage - delta > 2) range.unshift("...");
    if (currentPage + delta < totalPages - 1) range.push("...");
    range.unshift(1);
    if (totalPages > 1) range.push(totalPages);

    return (
      <div className="flex items-center justify-center mt-12">
        <nav className="flex items-center space-x-1" aria-label="Pagination">
          {/* Previous Button */}
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
              currentPage === 1
                ? "text-gray-400 bg-gray-100 cursor-not-allowed"
                : "text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 hover:text-pink-600"
            }`}
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
            </svg>
            Trước
          </button>

          {/* Page Numbers */}
          <div className="flex items-center space-x-1">
            {range.map((page, index) =>
              typeof page === "number" ? (
                <button
                  key={index}
                  onClick={() => handlePageChange(page)}
                  className={`relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                    currentPage === page
                      ? "bg-pink-600 text-white shadow-lg"
                      : "text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 hover:text-pink-600"
                  }`}
                >
                  {page}
                </button>
              ) : (
                <span key={index} className="px-4 py-2 text-gray-500">
                  {page}
                </span>
              )
            )}
          </div>

          {/* Next Button */}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
              currentPage === totalPages
                ? "text-gray-400 bg-gray-100 cursor-not-allowed"
                : "text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 hover:text-pink-600"
            }`}
          >
            Sau
            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
            </svg>
          </button>
        </nav>
      </div>
    );
  };

  // Show empty state if no posts
  if (posts.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="max-w-md mx-auto">
          <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Không có bài viết nào</h3>
          <p className="text-gray-500">Hiện tại chưa có bài viết nào trong danh mục này.</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Posts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {currentPosts.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>

      {/* Pagination Controls */}
      {renderPaginationControls()}

      {/* Page Info */}
      {totalPages > 1 && (
        <div className="text-center mt-6 text-sm text-gray-600">
          Trang {currentPage} của {totalPages} ({posts.length} bài viết)
        </div>
      )}
    </div>
  );
};

export default PaginatedPosts;
