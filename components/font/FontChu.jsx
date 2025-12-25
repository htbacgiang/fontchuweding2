import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import Link from "next/link";
import html2canvas from "html2canvas";
import { Heart, ChevronLeft, ChevronRight, Download, Copy, Eye, Search, Palette, Type, Filter } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchFavorites,
  addFavoriteFont,
  removeFavoriteFont,
  updateBrideGroomName,
} from "../../store/favoritesSlice";
import { toast } from "react-toastify";
import { fonts, fontStyles } from "../../lib/fonts";
import debounce from "lodash/debounce";
import { useSession } from "next-auth/react";

// Danh sách độ đậm của font
const fontWeights = [
  { value: "400", label: "Bình thường (400)" },
  { value: "500", label: "Trung bình (500)" },
  { value: "600", label: "Hơi đậm (600)" },
];

// Danh sách phong cách font
const fontStyleOptions = [
  { value: "", label: "Tất cả phong cách" },
  { value: "Classic", label: "Cổ điển (Classic)" },
  { value: "Handwritten", label: "Viết tay (Handwritten)" },
  { value: "Script", label: "Kịch bản (Script)" },
  { value: "Modern", label: "Hiện đại (Modern)" },
  { value: "Elegant", label: "Tinh tế (Elegant)" },
];

const ITEMS_PER_PAGE = 200;

// Component chọn và xem trước font chữ
export default function FontChu() {
  const [text, setText] = useState("");
  const [selectedFont, setSelectedFont] = useState(null);
  const [selectedColor, setSelectedColor] = useState("#000000");
  const [selectedFontWeight, setSelectedFontWeight] = useState("400");
  const [selectedStyle, setSelectedStyle] = useState(""); // State cho phong cách font
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalFont, setModalFont] = useState("");
  const [isToggling, setIsToggling] = useState(null);
  const previewRef = useRef(null);
  const modalPreviewRef = useRef(null);
  const dispatch = useDispatch();
  const favoriteFonts = useSelector((state) => state.favorites?.favoriteFonts ?? []);
  const brideGroomName = useSelector((state) => state.favorites?.brideGroomName ?? "");
  const favoritesStatus = useSelector((state) => state.favorites?.status ?? "idle");
  const { data: session } = useSession();

  const userId = session?.user?.id;
  const userRole = session?.user?.role; // Assuming role is stored in session.user.role

  // Khởi tạo font mặc định
  useEffect(() => {
    if (favoriteFonts.length > 0) {
      setSelectedFont(favoriteFonts[0]);
    } else if (fonts.length > 0) {
      setSelectedFont(fonts[0]);
    } else {
      setSelectedFont(null);
    }
  }, [favoriteFonts]);

  // Đồng bộ tên cô dâu chú rể từ Redux
  useEffect(() => {
    if (brideGroomName) {
      setText(brideGroomName);
    }
  }, [brideGroomName]);

  // Tìm kiếm font với debounce
  const debouncedSearch = useCallback(
    debounce((value) => {
      setSearchTerm(value);
      setPage(1);
    }, 300),
    []
  );

  // Lấy danh sách yêu thích khi đăng nhập
  useEffect(() => {
    if (userId && favoritesStatus === "idle") {
      dispatch(fetchFavorites(userId));
    }
  }, [dispatch, userId, favoritesStatus]);

  // Cập nhật tên cô dâu chú rể với debounce
  const debouncedUpdateBrideGroomName = useCallback(
    debounce((value) => {
      if (userId && value !== brideGroomName) {
        dispatch(updateBrideGroomName({ userId, brideGroomName: value }));
      }
    }, 600),
    [dispatch, userId, brideGroomName]
  );

  const handleTextChange = (e) => {
    const value = e.target.value;
    setText(value);
    debouncedUpdateBrideGroomName(value);
  };

  // Lọc font theo tìm kiếm và phong cách
  const filteredFonts = useMemo(() => {
    return fonts.filter((font) => {
      const matchesSearch = font.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStyle = selectedStyle ? fontStyles[font] === selectedStyle : true;
      return matchesSearch && matchesStyle;
    });
  }, [searchTerm, selectedStyle]);

  // Phân trang
  const totalPages = Math.max(1, Math.ceil(filteredFonts.length / ITEMS_PER_PAGE));
  const currentFonts = useMemo(() => {
    return filteredFonts.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);
  }, [filteredFonts, page]);

  const pageNumbers = useMemo(() => {
    const pages = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (page <= 4) pages.push(1, 2, 3, 4, 5, "...", totalPages);
      else if (page >= totalPages - 3)
        pages.push(1, "...", totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      else pages.push(1, "...", page - 1, page, page + 1, "...", totalPages);
    }
    return pages;
  }, [page, totalPages]);

  // Cuộn lên đầu khi đổi trang
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [page]);

  // Đóng modal bằng phím Escape
  useEffect(() => {
    if (isModalOpen) {
      const handleKeyDown = (e) => {
        if (e.key === "Escape") setIsModalOpen(false);
      };
      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }
  }, [isModalOpen]);

  // Tắt loading sau 600ms
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  // Tải ảnh preview
  const downloadImage = async (ref, filename) => {
    if (!ref.current) return;
    try {
      const canvas = await html2canvas(ref.current, {
        backgroundColor: null,
        scale: 2,
      });
      const link = document.createElement("a");
      link.download = `${filename}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch (error) {
      console.error("Lỗi khi tạo hình ảnh:", error);
      toast.error("Không thể tạo ảnh. Vui lòng thử lại.");
    }
  };

  // Sao chép tên font
  const copyToClipboard = async (font) => {
    try {
      await navigator.clipboard.writeText(font);
      toast.success(`Đã sao chép: ${font}`);
    } catch (error) {
      console.error("Lỗi khi sao chép:", error);
      toast.error("Không thể sao chép");
    }
  };

  // Thêm/xóa font yêu thích
  const toggleFavorite = async (font) => {
    if (!userId) {
      toast.error("Vui lòng đăng nhập để thêm font vào danh sách yêu thích");
      return;
    }
    setIsToggling(font);
    try {
      if (favoriteFonts.includes(font)) {
        await dispatch(removeFavoriteFont({ userId, font })).unwrap();
      } else {
        await dispatch(addFavoriteFont({ userId, font })).unwrap();
      }
    } catch (error) {
      toast.error(`Lỗi: ${error.message || "Không thể cập nhật danh sách yêu thích"}`);
    } finally {
      setIsToggling(null);
    }
  };

  const canViewFontDetails = userId && (userRole === "admin" || userRole === "premium");

  if (!selectedFont && favoriteFonts.length === 0 && fonts.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center text-red-500 bg-white p-8 rounded-2xl shadow-lg">
          <div className="text-6xl mb-4">😔</div>
          <h3 className="text-xl font-semibold mb-2">Không có font nào</h3>
          <p className="text-gray-600">Vui lòng thử lại sau</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50">
      <div className="md:h-[80px] h-[50px]"></div>

      {/* Header Section */}
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-pink-600 bg-clip-text text-transparent mb-4">
            NHẬP TÊN CÔ DÂU CHÚ RỂ
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Tạo thiết kế đẹp mắt cho ngày cưới của bạn với bộ sưu tập font chữ độc đáo
          </p>
        </div>

        {/* Input Section */}
        <div className="bg-white rounded-3xl shadow-xl p-8 mb-8 border border-gray-100">
          <div className="relative mb-6">
            <input
              type="text"
              value={text}
              onChange={handleTextChange}
              placeholder="Nhập tên cô dâu chú rể..."
              className="w-full p-4 md:p-6 text-lg md:text-xl border-2 border-gray-200 rounded-2xl focus:border-pink-400 focus:ring-4 focus:ring-pink-100 transition-all duration-300 outline-none"
              aria-label="Nhập tên cô dâu và chú rể"
              maxLength={100}
            />
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
              <span className="text-sm text-gray-400 bg-gray-100 px-3 py-1 rounded-full">
                {text.length}/100
              </span>
            </div>
          </div>

          {/* Controls Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <Type className="w-4 h-4" />
                Font yêu thích:
              </label>
              <select
                value={selectedFont || "placeholder"}
                onChange={(e) => setSelectedFont(e.target.value === "placeholder" ? null : e.target.value)}
                className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-pink-400 focus:ring-2 focus:ring-pink-100 transition-all duration-300 bg-white"
                aria-label="Chọn font thường dùng"
              >
                {favoriteFonts.length === 0 && (
                  <option value="placeholder" disabled>
                    Chưa có font trong danh sách
                  </option>
                )}
                {favoriteFonts.map((font, index) => (
                  <option key={index} value={font}>
                    {font}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <Type className="w-4 h-4" />
                Độ đậm:
              </label>
              <select
                value={selectedFontWeight}
                onChange={(e) => setSelectedFontWeight(e.target.value)}
                className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-pink-400 focus:ring-2 focus:ring-pink-100 transition-all duration-300 bg-white"
                aria-label="Chọn độ đậm của chữ"
              >
                {fontWeights.map((weight, index) => (
                  <option key={index} value={weight.value}>
                    {weight.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <Palette className="w-4 h-4" />
                Chọn màu:
              </label>
              <div className="relative">
                <input
                  type="color"
                  value={selectedColor}
                  onChange={(e) => setSelectedColor(e.target.value)}
                  className="w-full h-12 p-1 border-2 border-gray-200 rounded-xl cursor-pointer focus:border-pink-400 focus:ring-2 focus:ring-pink-100 transition-all duration-300"
                  aria-label="Chọn màu chữ"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <Filter className="w-4 h-4" />
                Phong cách:
              </label>
              <select
                value={selectedStyle}
                onChange={(e) => {
                  setSelectedStyle(e.target.value);
                  setPage(1);
                }}
                className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-pink-400 focus:ring-2 focus:ring-pink-100 transition-all duration-300 bg-white"
                aria-label="Chọn phong cách font"
              >
                {fontStyleOptions.map((style, index) => (
                  <option key={index} value={style.value}>
                    {style.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <Search className="w-4 h-4" />
                Tìm font:
              </label>
              <input
                type="text"
                onChange={(e) => debouncedSearch(e.target.value)}
                placeholder="Nhập tên font..."
                className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-pink-400 focus:ring-2 focus:ring-pink-100 transition-all duration-300"
                aria-label="Tìm kiếm font chữ"
              />
            </div>
          </div>
        </div>

        {/* Preview Section */}
        {!isLoading && selectedFont && (
          <div className="bg-white rounded-3xl shadow-xl p-6 mb-6 border border-gray-100">
            <div className="text-center">
              <h3 className="text-xl md:text-2xl font-semibold text-gray-700 mb-1">Xem trước</h3>
              <div className="flex justify-center">
                <div
                  ref={previewRef}
                  className="inline-block bg-gradient-to-r from-pink-50 to-purple-50 rounded-2xl p-8 border-2 border-gray-100"
                  style={{
                    marginTop: "10px",
                    padding: "40px 60px",
                    lineHeight: "1.25",
                    whiteSpace: "pre",
                    boxSizing: "content-box",
                  }}
                >
                  <span
                    style={{
                      fontFamily: `${selectedFont}, Arial, sans-serif`,
                      fontFeatureSettings: '"salt" 1, "liga" 1, "dlig" 1',
                      color: selectedColor,
                      fontWeight: selectedFontWeight,
                      fontSize: "clamp(2rem, 5vw, 3rem)",
                      margin: 0,
                      padding: 0,
                      lineHeight: "1.25",
                      whiteSpace: "pre",
                      boxSizing: "border-box",
                    }}
                  >
                    {text || "Tên Cô Dâu & Chú Rể"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {favoritesStatus === "loading" && (
          <div className="flex justify-center items-center mt-8">
            <div className="w-12 h-12 border-4 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}

        {/* Font Grid */}
        {isLoading ? (
          <div className="flex justify-center items-center gap-4 mt-8 text-gray-500">
            <div className="w-12 h-12 border-4 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-lg">Đang tải fonts...</span>
          </div>
        ) : (
          <>
            {currentFonts.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">Không tìm thấy font phù hợp</h3>
                <p className="text-gray-500">Thử thay đổi từ khóa tìm kiếm hoặc phong cách</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
                {currentFonts.map((font, index) => (
                  <div
                    key={index}
                    className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer border border-gray-100 overflow-hidden hover:scale-105"
                    onClick={() => setSelectedFont(font)}
                  >
                    <div className="p-6">
                      <div className="mb-4">
                        <p
                          style={{
                            fontFamily: `${font}, Arial, sans-serif`,
                            fontFeatureSettings: '"salt" 1, "liga" 1, "dlig" 1',
                          }}
                          className="text-2xl text-gray-800 leading-tight"
                        >
                          {text || "Tên Cô Dâu Chú Rể"}
                        </p>
                      </div>
                      
                      <div className="space-y-3">
                        <p className="text-sm text-gray-500 font-medium">
                          {canViewFontDetails ? `${(page - 1) * ITEMS_PER_PAGE + index + 1}. ${font}` : `${(page - 1) * ITEMS_PER_PAGE + index + 1}. Font ẩn`}
                        </p>
                        
                        <div className="flex items-center">
                          <div className="flex gap-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                if (canViewFontDetails) {
                                  setModalFont(font);
                                  setIsModalOpen(true);
                                } else {
                                  toast.error("Bạn cần vai trò admin hoặc premium để xem trước font.");
                                }
                              }}
                              className="flex items-center gap-1 px-3 py-1.5 text-base bg-blue-50 text-pink-600 rounded-lg hover:bg-blue-100 transition-colors duration-200"
                              aria-label={`Xem trước font ${canViewFontDetails ? font : "ẩn"}`}
                              disabled={!canViewFontDetails}
                            >
                              <Eye className="w-5 h-5" />
                              Xem thử
                            </button>
                            
                         
                          </div>
                          
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleFavorite(font);
                            }}
                            className="p-2 rounded-lg hover:bg-red-50 transition-colors duration-200"
                            disabled={isToggling === font || !userId}
                            aria-label={
                              favoriteFonts.includes(font)
                                ? `Xóa ${canViewFontDetails ? font : "font"} khỏi danh sách yêu thích`
                                : `Thêm ${canViewFontDetails ? font : "font"} vào yêu thích`
                            }
                          >
                            <Heart
                              className={`h-5 w-5 transition-all duration-200 ${
                                favoriteFonts.includes(font)
                                  ? "text-red-500 fill-red-500"
                                  : "text-gray-400 hover:text-red-500"
                              } ${isToggling === font ? "opacity-50" : ""}`}
                            />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-12 flex justify-center items-center space-x-2 pb-8">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="flex items-center justify-center w-10 h-10 bg-white border-2 border-gray-200 text-gray-600 rounded-xl hover:border-pink-400 hover:text-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                  aria-label="Trang trước"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                
                {pageNumbers.map((item, idx) =>
                  item === "..." ? (
                    <span key={idx} className="px-3 py-2 text-gray-400">
                      …
                    </span>
                  ) : (
                    <button
                      key={idx}
                      onClick={() => setPage(item)}
                      className={`w-10 h-10 text-sm font-medium rounded-xl transition-all duration-200 ${
                        item === page
                          ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-lg"
                          : "bg-white border-2 border-gray-200 text-gray-600 hover:border-pink-400 hover:text-pink-600"
                      }`}
                      aria-label={`Trang ${item}`}
                    >
                      {item}
                    </button>
                  )
                )}
                
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="flex items-center justify-center w-10 h-10 bg-white border-2 border-gray-200 text-gray-600 rounded-xl hover:border-pink-400 hover:text-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                  aria-label="Trang sau"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          role="dialog"
          aria-labelledby="modal-title"
          aria-modal="true"
        >
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-8">
              <h2 id="modal-title" className="text-2xl font-bold mb-6 text-gray-800">
                Xem trước: {canViewFontDetails ? modalFont : "Font ẩn"}
              </h2>
              
              <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-2xl p-8 mb-6">
                <div
                  ref={modalPreviewRef}
                  style={{
                    fontFamily: `${canViewFontDetails ? modalFont : "Arial, sans-serif"}`,
                    fontFeatureSettings: '"salt" 1, "liga" 1, "dlig" 1',
                    color: selectedColor,
                    fontWeight: selectedFontWeight,
                    fontSize: "clamp(2rem, 5vw, 3rem)",
                    textAlign: "center",
                    lineHeight: "1.25",
                  }}
                  className="text-center"
                >
                  {text || "Tên Cô Dâu & Chú Rể"}
                </div>
              </div>
              
              <div className="flex justify-end gap-3">
                
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all duration-200"
                  aria-label="Đóng popup xem trước"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}