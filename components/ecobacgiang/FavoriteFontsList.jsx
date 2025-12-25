import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import { Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import { fetchFavorites, removeFavoriteFont } from "../../store/favoritesSlice";
import { getDeviceId } from "../../lib/deviceId";

const FavoriteFontsList = () => {
  const { data: session } = useSession();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [deviceId, setDeviceId] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [hasInitialized, setHasInitialized] = useState(false);

  const favoriteFonts = useSelector((state) => state.favorites?.favoriteFonts ?? []);
  const pagination = useSelector((state) => state.favorites?.pagination ?? {});
  const favoritesStatus = useSelector((state) => state.favorites?.status ?? 'idle');

  // Phân trang ở frontend
  const itemsPerPage = 10;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentFonts = favoriteFonts.slice(startIndex, endIndex);
  const totalPages = Math.ceil(favoriteFonts.length / itemsPerPage);

  useEffect(() => {
    const initDeviceId = async () => {
      const id = await getDeviceId();
      setDeviceId(id);
    };
    initDeviceId();
  }, []);

  useEffect(() => {
    if (deviceId && !hasInitialized && favoritesStatus === 'idle') {
      setHasInitialized(true);
      dispatch(fetchFavorites(deviceId)).catch(() => {
        console.error("Failed to fetch favorites");
      });
    }
  }, [deviceId, hasInitialized, favoritesStatus, dispatch]);

  const handleRemoveFavorite = async (font) => {
    try {
      setIsLoading(true);
      await dispatch(removeFavoriteFont({ font, deviceId })).unwrap();
      toast.success("Đã xóa font khỏi danh sách yêu thích");
      
      // Reset về trang 1 nếu trang hiện tại không còn fonts
      if (currentFonts.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
    } catch (error) {
      toast.error("Có lỗi xảy ra khi xóa font");
      console.error("Remove favorite error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    return (
      <div className="flex items-center justify-center space-x-2 mt-6">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className="flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeft size={16} />
          <span className="hidden sm:inline">Trước</span>
        </button>
        
        <div className="flex items-center space-x-1">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`px-2 sm:px-3 py-2 text-sm font-medium rounded-lg ${
                page === currentPage
                  ? "bg-blue-600 text-white"
                  : "text-gray-500 bg-white border border-gray-300 hover:bg-gray-50"
              }`}
            >
              {page}
            </button>
          ))}
        </div>

        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span className="hidden sm:inline">Sau</span>
          <ChevronRight size={16} />
        </button>
      </div>
    );
  };

  if (favoritesStatus === 'loading' || isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (favoriteFonts.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="mx-auto h-16 w-16 text-gray-300 mb-4 flex items-center justify-center text-2xl font-bold">
          ♥
        </div>
        <h3 className="text-lg font-semibold text-gray-600 mb-2">
          Chưa có font chữ yêu thích
        </h3>
        <p className="text-gray-500 mb-6">
          Bạn chưa lưu font chữ nào vào danh sách yêu thích
        </p>
        <button
          onClick={() => window.location.href = '/font-chu'}
          className="bg-gradient-to-r from-pink-500 to-orange-500 text-white px-6 py-3 rounded-lg hover:from-pink-600 hover:to-orange-600 transition-all duration-300 shadow-lg hover:shadow-xl"
        >
          Khám phá font chữ
        </button>
      </div>
    );
  }

  // Loại bỏ duplicate fonts
  const uniqueFonts = [...new Set(currentFonts)];

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Font chữ yêu thích ({favoriteFonts.length})
        </h2>
        <p className="text-gray-600">
          Danh sách font chữ bạn đã lưu
        </p>
      </div>

      <div className="space-y-2">
        {uniqueFonts.map((font, index) => (
          <div key={`${font}-${startIndex + index}`} className="animate-slideInUp" style={{ animationDelay: `${index * 0.1}s` }}>
            <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-all duration-200">
              <div className="flex items-center space-x-3 min-w-0 flex-1">
                <div className="flex-shrink-0 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-sm font-semibold text-gray-600">
                  {startIndex + index + 1}
                </div>
                <div className="flex-1 min-w-0 overflow-hidden">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 truncate" title={font}>
                    {font}
                  </h3>
                </div>
              </div>

              <button 
                onClick={() => handleRemoveFavorite(font)} 
                disabled={isLoading} 
                className="flex-shrink-0 ml-2 p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200 disabled:opacity-50 hover:scale-110" 
                title="Xóa khỏi yêu thích"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {renderPagination()}

      <div className="mt-8 text-center">
        <button
          onClick={() => window.location.href = '/font-chu'}
          className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-300 shadow-lg hover:shadow-xl"
        >
          Khám phá thêm font chữ
        </button>
      </div>
    </div>
  );
};

export default FavoriteFontsList; 