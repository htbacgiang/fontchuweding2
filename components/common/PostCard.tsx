import Image from "next/image";
import { FC, useState } from "react";
import { PostDetail as BasePostDetail } from "../../utils/types";
import Link from "next/link";
import { trimText } from "../../utils/helper";

// Mở rộng kiểu dữ liệu PostDetail gốc để thêm các thuộc tính mới
interface ExtendedPostDetail extends BasePostDetail {
  category: string; // Thêm danh mục
  createdAt: string; // Thêm ngày tạo
}

interface Props {
  post: ExtendedPostDetail;
  busy?: boolean;
  controls?: boolean;
  onDeleteClick?(): void;
}

const PostCard: FC<Props> = ({
  controls = false,
  post,
  busy,
  onDeleteClick,
}): JSX.Element => {
  const { title, slug, meta, thumbnail, category, createdAt } = post;
  const [showModal, setShowModal] = useState(false);

  const handleDelete = () => {
    if (onDeleteClick) {
      onDeleteClick();
    }
    setShowModal(false);
  };

  const formatDate = (date: string): string => {
    return new Date(date).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <>
      <article className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
        {/* Thumbnail */}
        <div className="relative h-48 overflow-hidden">
          {!thumbnail ? (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-pink-400 to-pink-500">
              <div className="text-center text-white">
                <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
                <span className="text-sm font-medium">Không có hình ảnh</span>
              </div>
            </div>
          ) : (
            <Image
              src={thumbnail}
              layout="fill"
              alt={title}
              objectFit="cover"
              className="group-hover:scale-110 transition-transform duration-500"
            />
          )}
          
          {/* Category Badge */}
          <div className="absolute top-3 left-3">
            <span className="bg-pink-600 text-white px-3 py-1 rounded-full text-xs font-medium shadow-lg">
              {category || "Tin tức"}
            </span>
          </div>
          
          {/* Date Badge */}
          <div className="absolute top-3 right-3">
            <span className="bg-black bg-opacity-60 text-white px-2 py-1 rounded-full text-xs backdrop-blur-sm">
              {formatDate(createdAt)}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Title */}
          <Link href={`/bai-viet/${slug}`}>
            <h3 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-pink-600 transition-colors line-clamp-2 leading-tight">
              {title}
            </h3>
          </Link>

          {/* Description */}
          <p className="text-gray-600 text-sm leading-relaxed line-clamp-3 mb-4">
            {trimText(meta, 100)}
          </p>

          {/* Read More Link */}
          <div className="flex items-center justify-between">
            <Link 
              href={`/bai-viet/${slug}`}
              className="inline-flex items-center text-pink-600 font-medium hover:text-pink-700 transition-colors text-sm"
            >
              Đọc thêm
              <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </Link>

            {/* Controls (Edit/Delete) */}
            {controls && (
              <div className="flex space-x-2">
                <Link
                  className="px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-xs transition-colors"
                  href={`/dashboard/bai-viet/update/${slug}`}
                >
                  Sửa
                </Link>
                <button
                  disabled={busy}
                  onClick={() => setShowModal(true)}
                  className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 text-xs transition-colors"
                >
                  Xóa
                </button>
              </div>
            )}
          </div>
        </div>
      </article>

      {/* Delete Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Xác nhận xóa</h3>
                <p className="text-sm text-gray-500">Hành động này không thể hoàn tác</p>
              </div>
            </div>
            
            <p className="text-gray-600 mb-6">
              Bạn có chắc chắn muốn xóa bài viết &quot;<strong>{title}</strong>&quot;?
            </p>
            
            <div className="flex space-x-3">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
              >
                Hủy
              </button>
              <button
                disabled={busy}
                onClick={handleDelete}
                className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium disabled:opacity-50"
              >
                {busy ? "Đang xóa..." : "Xóa"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PostCard;
