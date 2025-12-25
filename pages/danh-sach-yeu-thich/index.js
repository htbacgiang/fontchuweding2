import { useState, useEffect, useRef, useMemo } from 'react';
import { useSession } from 'next-auth/react';
import { useSelector, useDispatch } from 'react-redux';
import Head from 'next/head';
import Link from 'next/link';
import { fetchFavorites, removeFavoriteFont, updateBrideGroomName } from '../../store/favoritesSlice';
import { toast } from 'react-toastify';
import { getDeviceId } from '../../lib/deviceId';
import { fonts } from '../../lib/fonts';
import { fontFileMap } from '../../lib/fontFileMap';
import debounce from 'lodash/debounce';
import { ArrowLeft, Download, Heart, Trash2, Image, Plus, Search, X, AlertTriangle, CheckCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import html2canvas from 'html2canvas';
import FontListPreview from '../../components/common/FontListPreview';
import DefaultLayout from '../../components/layout/DefaultLayout';

// Function to remove Vietnamese diacritics
function removeDiacritics(str) {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D');
}

export default function Favorites() {
  const { data: session } = useSession();
  const dispatch = useDispatch();
  const favoriteFonts = useSelector((state) => state.favorites?.favoriteFonts ?? []);
  const favoritesStatus = useSelector((state) => state.favorites?.status ?? 'idle');
  const brideGroomName = useSelector((state) => state.favorites?.brideGroomName ?? '');
  const userRole = session?.user?.role || 'user';

  const [text, setText] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [fontToRemove, setFontToRemove] = useState(null);
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [fontToDownload, setFontToDownload] = useState(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const deviceId = getDeviceId();
  const previewRef = useRef();

  // Phân trang - 50 font mỗi trang
  const fontsPerPage = 50;
  const totalPages = Math.ceil(favoriteFonts.length / fontsPerPage);
  const startIndex = (currentPage - 1) * fontsPerPage;
  const endIndex = startIndex + fontsPerPage;
  const currentFonts = favoriteFonts.slice(startIndex, endIndex);

  // Reset về trang 1 khi danh sách font thay đổi
  useEffect(() => {
    setCurrentPage(1);
  }, [favoriteFonts.length]);

  // Fetch favorites & brideGroomName on mount
  useEffect(() => {
    if (!deviceId) {
      toast.error('Không tìm thấy deviceId. Vui lòng thử lại.');
      setIsLoading(false);
      return;
    }
    dispatch(fetchFavorites(deviceId))
      .unwrap()
      .catch((error) => {
        toast.error(`Không thể tải danh sách yêu thích: ${error.message || 'Lỗi không xác định'}`);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [dispatch, deviceId]);

  // Auto-fill input from redux
  useEffect(() => {
    setText(brideGroomName || '');
  }, [brideGroomName]);

  // Debounce update name to db
  const debouncedUpdateBrideGroomName = useRef(
    debounce((value) => {
      dispatch(updateBrideGroomName({ deviceId, brideGroomName: value }))
        .unwrap()
        .catch((error) => {
          toast.error(`Không thể lưu tên: ${error.message || 'Lỗi không xác định'}`);
        });
    }, 600)
  ).current;

  useEffect(() => {
    return () => {
      debouncedUpdateBrideGroomName.cancel();
    };
  }, [debouncedUpdateBrideGroomName]);

  const handleInputChange = (e) => {
    setText(e.target.value);
    debouncedUpdateBrideGroomName(e.target.value);
  };

  // Mở modal xác nhận bỏ thích
  const handleRemoveFavoriteClick = (font) => {
    setFontToRemove(font);
    setShowRemoveModal(true);
  };

  // Xác nhận bỏ thích
  const confirmRemoveFavorite = async () => {
    if (!fontToRemove) return;
    
    try {
      await dispatch(removeFavoriteFont({ deviceId, font: fontToRemove })).unwrap();
      toast.success(`Đã xóa ${userRole === 'admin' || userRole === 'premium' ? fontToRemove : 'font'} khỏi danh sách yêu thích`);
      setShowRemoveModal(false);
      setFontToRemove(null);
    } catch (error) {
      toast.error(`Không thể xóa font: ${error.message || 'Lỗi không xác định'}`);
    }
  };

  // Mở modal xác nhận tải font
  const handleDownloadFontClick = (font) => {
    if (userRole !== 'premium' && userRole !== 'admin') {
      toast.error('Cần tài khoản Premium hoặc Admin để tải font');
      return;
    }

    const fontFile = fontFileMap[font];
    if (!fontFile) {
      toast.error(`Font ${font} không có sẵn để tải`);
      return;
    }

    setFontToDownload({ font, fontFile });
    setShowDownloadModal(true);
  };

  // Xác nhận tải font
  const confirmDownloadFont = async () => {
    if (!fontToDownload) return;
    
    setIsDownloading(true);
    try {
      console.log('Downloading font:', fontToDownload.font);
      
      const response = await fetch('/api/fonts/download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ deviceId, font: fontToDownload.font }),
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('API Error:', errorData);
        throw new Error(`Lỗi tải font: ${response.statusText} - ${errorData.error || ''}`);
      }

      const blob = await response.blob();
      console.log('Download successful, blob size:', blob.size);
      
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fontToDownload.fontFile;
      a.click();
      window.URL.revokeObjectURL(url);
      
      toast.success(`Đã tải font ${fontToDownload.font} thành công!`);
      setShowDownloadModal(false);
      setFontToDownload(null);
    } catch (error) {
      console.error('Download error:', error);
      toast.error(`Lỗi tải font: ${error.message || 'Lỗi không xác định'}`);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleExportImage = async () => {
    // Đảm bảo tất cả font được load trước khi export
    await Promise.all(
      favoriteFonts.map(font => document.fonts.load(`32px "${font}"`))
    );
    await document.fonts.ready;
    
    const canvas = await html2canvas(previewRef.current, {
      backgroundColor: null,
      scale: 2,
      useCORS: true,
      logging: false, // Tắt logging để tăng hiệu suất
      allowTaint: true,
      onclone: (clonedDoc) => {
        // Copy tất cả styles và fonts
        document.querySelectorAll('style, link[rel="stylesheet"]').forEach(node => {
          clonedDoc.head.appendChild(node.cloneNode(true));
        });
        
        // Thêm font vào head của cloned document
        favoriteFonts.forEach(font => {
          const style = document.createElement('style');
          style.textContent = `@font-face { font-family: "${font}"; src: url("/fonts/${fontFileMap[font] || `${font.replace(/ /g, '_')}.woff2`}") format("woff2"); }`;
          clonedDoc.head.appendChild(style);
        });
        
        // Đảm bảo component được render với kích thước chữ cân đối
        const previewElement = clonedDoc.querySelector('[data-preview="font-list"]');
        if (previewElement) {
          // Thêm style để đảm bảo layout ổn định
          const style = document.createElement('style');
          style.textContent = `
            [data-preview="font-list"] {
              font-synthesis: none;
              text-rendering: optimizeLegibility;
            }
          `;
          clonedDoc.head.appendChild(style);
        }
      },
    });
    
    const link = document.createElement('a');
    link.download = 'font-preview.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  const renderedFonts = useMemo(() => {
    return currentFonts.map((font, index) => {
      const fontFile = fontFileMap[font];
      const displayFontName = userRole === 'admin' || userRole === 'premium' ? font : 'Font ẩn';
      return (
        <div key={font} className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer border border-gray-100 overflow-hidden hover:scale-105" role="listitem">
          <div className="p-6">
            <div className="mb-4">
              <p
                style={{
                  fontFamily: fonts.includes(font) ? `"${font}", Arial, sans-serif` : 'Arial, sans-serif',
                  fontFeatureSettings: '"salt" 1, "liga" 1, "dlig" 1',
                }}
                className="text-2xl text-gray-800 leading-tight"
                aria-label={`Mẫu chữ ${displayFontName} với nội dung ${text || 'Tên Cô Dâu Chú Rể'}`}
              >
                {text || 'Tên Cô Dâu Chú Rể'}
              </p>
            </div>
            
            <div className="space-y-3">
              <p className="text-sm text-gray-500 font-medium">
                {startIndex + index + 1}. {displayFontName}
              </p>
              
              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveFavoriteClick(font);
                    }}
                    className="flex items-center gap-1 px-3 py-1.5 text-xs bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors duration-200"
                    aria-label={`Xóa font ${displayFontName} khỏi danh sách yêu thích`}
                  >
                    <Trash2 className="w-3 h-3" />
                    Bỏ thích
                  </button>
                  
                  {fontFile ? (
                    userRole === 'premium' || userRole === 'admin' ? (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDownloadFontClick(font);
                        }}
                        className="flex items-center gap-1 px-3 py-1.5 text-xs bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors duration-200"
                        aria-label={`Tải font ${displayFontName}`}
                      >
                        <Download className="w-3 h-3" />
                        Tải font
                      </button>
                    ) : (
                      <span
                        className="flex items-center gap-1 px-3 py-1.5 text-xs bg-gray-50 text-gray-400 rounded-lg cursor-not-allowed"
                        aria-label={`Tải font ${displayFontName} yêu cầu tài khoản Premium hoặc Admin`}
                      >
                        <Plus className="w-3 h-3" />
                        Cần Premium
                      </span>
                    )
                  ) : (
                    <span
                      className="flex items-center gap-1 px-3 py-1.5 text-xs bg-gray-50 text-gray-400 rounded-lg"
                      aria-label={`Font ${displayFontName} không có sẵn để tải`}
                    >
                      <Search className="w-3 h-3" />
                      Không có file
                    </span>
                  )}
                </div>
                
                
              </div>
            </div>
          </div>
        </div>
      );
    });
  }, [currentFonts, text, userRole, startIndex]);

  return (
    <DefaultLayout>
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50">
      <Head>
        {favoriteFonts.map((font) => {
          const fontFile = fontFileMap[font] || `${font.replace(/ /g, '_')}.woff2`;
          return (
            <link
              key={font}
              rel="preload"
              href={`/fonts/${fontFile}`}
              as="font"
              type="font/woff2"
              crossOrigin="anonymous"
            />
          );
        })}
        <title>Font Wedding Yêu Thích</title>
        <meta
          name="description"
          content="Xem và quản lý danh sách font chữ yêu thích của bạn để sử dụng trong thiết kế thiệp cưới."
        />
        <meta name="keywords" content="font yêu thích, font chữ đám cưới, font Việt hóa" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="stylesheet" href="/fonts.css" />
      </Head>

      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-pink-600 bg-clip-text text-transparent mb-4">
            FONT YÊU THÍCH
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Quản lý và sử dụng bộ sưu tập font chữ yêu thích của bạn
          </p>
        </div>

        {/* Navigation */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-pink-600 rounded-xl font-semibold hover:bg-pink-50 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <ArrowLeft className="w-5 h-5" />
            Quay lại chọn font chữ
          </Link>
        </div>

        {/* Input Section */}
        <div className="bg-white rounded-3xl shadow-xl p-8 mb-8 border border-gray-100">
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Nhập tên cô dâu chú rể để xem trước:
            </label>
            <input
              type="text"
              value={text}
              onChange={handleInputChange}
              placeholder="Nhập tên cô dâu chú rể..."
              className="w-full p-4 text-lg border-2 border-gray-200 rounded-xl focus:border-pink-400 focus:ring-4 focus:ring-pink-100 transition-all duration-300 outline-none"
              aria-label="Nhập tên cô dâu chú rể"
              maxLength={100}
            />
            <div className="flex justify-between items-center mt-2">
              <span className="text-sm text-gray-500">
                {text.length}/100 ký tự
              </span>
              <span className="text-sm text-gray-500">
                {favoriteFonts.length} font yêu thích (hiển thị {currentFonts.length} font)
              </span>
            </div>
          </div>

          {/* Export Button */}
          <div className="flex justify-center">
            <button
              className={`flex items-center gap-2 px-8 py-4 rounded-xl font-semibold transition-all duration-200 ${
                userRole === 'premium' || userRole === 'admin'
                  ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white hover:from-pink-600 hover:to-purple-600 shadow-lg hover:shadow-xl'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
              onClick={handleExportImage}
              disabled={userRole !== 'premium' && userRole !== 'admin'}
              aria-label={
                userRole === 'premium' || userRole === 'admin'
                  ? 'Tạo hình ảnh danh sách font yêu thích'
                  : 'Tạo hình ảnh yêu cầu tài khoản Premium hoặc Admin'
              }
            >
              <Image className="w-5 h-5" />
              Tạo hình ảnh danh sách font
            </button>
          </div>
        </div>

        {/* Hidden Preview for Export */}
        <div 
          style={{ position: 'absolute', left: -9999, top: 0 }} 
          aria-hidden="true" 
          tabIndex={-1} 
          ref={previewRef}
          data-preview="font-list"
        >
          <FontListPreview fonts={favoriteFonts} brideGroomName={text || brideGroomName} dark />
        </div>

        {/* Loading State */}
        {isLoading || favoritesStatus === 'loading' ? (
          <div className="flex justify-center items-center py-12">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600 font-medium">Đang tải danh sách yêu thích...</p>
            </div>
          </div>
        ) : favoriteFonts.length === 0 ? (
          <div className="text-center py-16">
            <div className="bg-white rounded-3xl shadow-xl p-12 max-w-md mx-auto">
              <div className="text-6xl mb-6">💝</div>
              <h3 className="text-2xl font-bold text-gray-700 mb-4">Chưa có font yêu thích</h3>
              <p className="text-gray-500 mb-6">
                Bạn chưa có font nào trong danh sách yêu thích. Hãy quay lại trang chính để thêm font vào danh sách.
              </p>
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-xl font-semibold hover:from-pink-600 hover:to-purple-600 transition-all duration-200"
              >
                <Plus className="w-5 h-5" />
                Khám phá fonts
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {renderedFonts}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mt-8">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="text-sm text-gray-600">
                Hiển thị {startIndex + 1}-{Math.min(endIndex, favoriteFonts.length)} trong tổng số {favoriteFonts.length} font
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(1)}
                  disabled={currentPage === 1}
                  className="px-3 py-2 text-sm rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  aria-label="Về trang đầu"
                >
                  Đầu
                </button>
                
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  aria-label="Trang trước"
                >
                  <ChevronLeft className="w-5 h-5 text-gray-600" />
                </button>
                
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`px-3 py-2 text-sm rounded-lg transition-colors ${
                          currentPage === pageNum
                            ? 'bg-pink-500 text-white'
                            : 'hover:bg-gray-100 text-gray-600'
                        }`}
                        aria-label={`Trang ${pageNum}`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>
                
                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  aria-label="Trang sau"
                >
                  <ChevronRight className="w-5 h-5 text-gray-600" />
                </button>
                
                <button
                  onClick={() => setCurrentPage(totalPages)}
                  disabled={currentPage === totalPages}
                  className="px-3 py-2 text-sm rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  aria-label="Đến trang cuối"
                >
                  Cuối
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal Xác nhận bỏ thích */}
      {showRemoveModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full">
            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-800">Xác nhận bỏ thích</h3>
                <button
                  onClick={() => setShowRemoveModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              
              <div className="flex items-center gap-3 mb-6">
                <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-full">
                  <AlertTriangle className="w-6 h-6 text-red-500" />
                </div>
                <div>
                  <p className="text-gray-700 font-medium">
                    Bạn có chắc muốn xóa font này khỏi danh sách yêu thích?
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    {userRole === 'admin' || userRole === 'premium' ? fontToRemove : 'Font ẩn'}
                  </p>
                </div>
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={() => setShowRemoveModal(false)}
                  className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
                >
                  Hủy
                </button>
                <button
                  onClick={confirmRemoveFavorite}
                  className="flex-1 px-6 py-3 bg-red-500 text-white rounded-xl font-semibold hover:bg-red-600 transition-colors"
                >
                  Xác nhận
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Xác nhận tải font */}
      {showDownloadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full">
            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-800">Xác nhận tải font</h3>
                <button
                  onClick={() => setShowDownloadModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              
              <div className="flex items-center gap-3 mb-6">
                <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full">
                  <Download className="w-6 h-6 text-blue-500" />
                </div>
                <div>
                  <p className="text-gray-700 font-medium">
                    Bạn có muốn tải font này về máy?
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    {fontToDownload?.font} ({fontToDownload?.fontFile})
                  </p>
                </div>
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDownloadModal(false)}
                  className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
                  disabled={isDownloading}
                >
                  Hủy
                </button>
                <button
                  onClick={confirmDownloadFont}
                  disabled={isDownloading}
                  className="flex-1 px-6 py-3 bg-blue-500 text-white rounded-xl font-semibold hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isDownloading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Đang tải...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      Tải font
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      </div>
    </DefaultLayout>
  );
}