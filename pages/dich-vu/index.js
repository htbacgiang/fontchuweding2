// pages/pricing.js
import Head from 'next/head';
import { FaCheck, FaTimes, FaTimes as FaClose } from 'react-icons/fa';
import { useRouter } from 'next/router';
import DefaultLayout from '../../components/layout/DefaultLayout';

const PricingPage = () => {
  const router = useRouter();
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://yourdomain.com';
  const currentTime = new Date().toISOString();

  const plans = [
    {
      name: 'Miễn Phí',
      price: 0,
      duration: '',
      features: [
        { text: 'Nhập tên cô dâu chú rể', available: true },
        { text: 'Thêm font vào danh sách yêu thích', available: true },
        { text: 'Tên font bị ẩn (hiển thị "Font ẩn")', available: true },
        { text: 'Không tải được font', available: false },
        { text: 'Không tải được hình ảnh', available: false },
        { text: 'Không tạo được ảnh danh sách font yêu thích', available: false },
        { text: 'Hỗ trợ 24/7', available: true },
      ],
      buttonText: 'Thử Ngay',
      buttonAction: () => router.push('/'),
      buttonDisabled: false,
    },
    
    {
      name: 'Premium Vĩnh Viễn',
      price: 500000,
      duration: '',
      features: [
        { text: 'Nhập và chỉnh sửa tên cô dâu chú rể', available: true },
        { text: 'Thêm và quản lý danh sách yêu thích', available: true },
        { text: 'Hiển thị tên font đầy đủ', available: true },
        { text: 'Tải font về máy (không giới hạn)', available: true },
        { text: 'Tải hình ảnh (không giới hạn)', available: true },
        { text: 'Tạo ảnh danh sách font yêu thích', available: true },
        { text: 'Hỗ trợ 24/7', available: true },
      ],
      buttonText: 'Đăng Ký Ngay',
      buttonAction: () => router.push('/'),
      buttonDisabled: false,
    },
  ];

  const getPrice = (price) => price.toLocaleString('vi-VN', {
    style: 'currency',
    currency: 'VND',
  });

  return (
    <DefaultLayout>
      <Head>
        <title>Bảng Giá Dịch Vụ - Wedding Font Việt Hóa | Miễn Phí & Premium Vĩnh Viễn</title>
        <meta
          name="description"
          content="Khám phá bảng giá dịch vụ Wedding Font Việt Hóa với Gói Miễn Phí và Premium Vĩnh Viễn (500.000 VND). Tải font và hình ảnh không giới hạn với gói Premium!"
        />
        <meta
          name="keywords"
          content="bảng giá font chữ, wedding font việt hóa, gói miễn phí, gói premium vĩnh viễn, tải font không giới hạn, tải hình ảnh không giới hạn, giá thiết kế font đám cưới, dịch vụ font"
        />
        <meta name="robots" content="index, follow" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href={`${baseUrl}/dich-vu`} />
        <meta property="og:title" content="Bảng Giá Dịch Vụ - Wedding Font Việt Hóa" />
        <meta property="og:description" content="Xem chi tiết Gói Miễn Phí và Premium Vĩnh Viễn của Wedding Font Việt Hóa với tải font và hình ảnh không giới hạn." />
        <meta property="og:url" content={`${baseUrl}/dich-vu`} />
        <meta property="og:type" content="website" />
        <meta property="og:updated_time" content={`${currentTime}`} />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-pink-400 via-rose-500 to-pink-600 py-8 px-4 relative overflow-y-auto md:overflow-y-hidden overflow-x-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-pink-400/20 via-rose-500/20 to-pink-600/20"></div>
        <div className="absolute top-0 left-0 w-72 h-72 bg-pink-300/30 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-rose-400/30 rounded-full translate-x-1/2 translate-y-1/2 blur-3xl"></div>

        <div className="relative z-10 max-w-7xl mx-auto h-full flex flex-col">
          <div className="text-center mb-8 mt-12">
            <h1 className="text-2xl md:text-4xl font-bold text-white mb-2 tracking-tight">
              Bảng Giá Dịch Vụ
            </h1>
            <p className="text-sm md:text-base text-white/90 max-w-3xl mx-auto leading-relaxed">
              Chọn Gói Miễn Phí hoặc Premium Vĩnh Viễn để thiết kế font chữ đám cưới!
            </p>
          </div>

          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 max-w-4xl mx-auto">
            {plans.length > 0 ? ( 
              plans.map((plan, index) => (
                <div
                  key={index}
                  className="relative group"
                >
                  <div className={`relative bg-white/95 backdrop-blur-xl rounded-2xl lg:rounded-3xl p-6 lg:p-8 shadow-xl lg:shadow-2xl transition-all duration-300 hover:shadow-2xl lg:hover:shadow-3xl hover:-translate-y-2 h-full ${index === 1
                      ? 'border-2 border-pink-400 shadow-pink-500/25'
                      : 'border border-white/20'
                    }`}>

                    <h3 className="text-xl lg:text-2xl font-bold text-gray-800 mb-4 lg:mb-6 text-center">{plan.name}</h3>

                    {/* Price section */}
                    <div className="text-center mb-6 lg:mb-8">
                      <div className="flex items-baseline justify-center gap-1 lg:gap-2">
                        <span className="text-4xl md:text-5xl font-black bg-gradient-to-r from-pink-500 to-rose-600 bg-clip-text text-transparent">
                          {plan.price === 0 ? '0' : plan.price.toLocaleString('vi-VN')}
                        </span>
                        <span className="text-xl lg:text-2xl xl:text-3xl font-semibold text-gray-600">₫</span>

                        {plan.duration && (
                          <span className="text-sm lg:text-base xl:text-lg font-medium text-gray-500">/{plan.duration}</span>
                        )}
                      </div>
                    </div>

                    {/* CTA Button */}
                    <button
                      className={`w-full py-3 lg:py-4 px-6 lg:px-8 rounded-xl lg:rounded-2xl font-bold text-base lg:text-lg xl:text-xl transition-all duration-300 transform hover:scale-105 ${plan.buttonDisabled
                          ? 'bg-gray-400 cursor-not-allowed'
                          : 'bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-white shadow-lg hover:shadow-xl hover:-translate-y-1'
                        }`}
                      disabled={plan.buttonDisabled}
                      onClick={plan.buttonAction}
                      aria-label={`Mua gói ${plan.name} ngay bây giờ`}
                    >
                      {plan.buttonText}
                    </button>

                    {/* Features list */}
                    <ul className="mt-6 lg:mt-8 space-y-3 lg:space-y-4">
                      {plan.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start space-x-3 lg:space-x-4" role="listitem">
                          <span className={`flex-shrink-0 w-6 h-6 lg:w-7 lg:h-7 rounded-full flex items-center justify-center shadow-sm ${feature.available
                              ? 'bg-gradient-to-r from-green-400 to-emerald-500 text-white'
                              : 'bg-gradient-to-r from-red-400 to-pink-500 text-white'
                            }`}>
                            {feature.available ? (
                              <FaCheck size={12} className="lg:w-4 lg:h-4" />
                            ) : (
                              <FaTimes size={12} className="lg:w-4 lg:h-4" />
                            )}
                          </span>
                          <span className={`text-base lg:text-lg text-gray-700 leading-relaxed ${!feature.available ? 'line-through text-gray-400' : ''}`}>
                            {feature.text}
                          </span>
                        </li>
                      ))}
                    </ul>

                    {/* Decorative elements */}
                    <div className="absolute top-4 right-4 lg:top-6 lg:right-6 w-12 h-12 lg:w-16 lg:h-16 bg-gradient-to-br from-pink-100 to-rose-100 rounded-full opacity-20"></div>
                    <div className="absolute bottom-4 left-4 lg:bottom-6 lg:left-6 w-8 h-8 lg:w-12 lg:h-12 bg-gradient-to-br from-rose-100 to-pink-100 rounded-full opacity-20"></div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 lg:p-8">
                  <p className="text-white text-base lg:text-xl font-semibold">No pricing plans available at the moment.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default PricingPage;