import { useRef, useEffect, useState } from "react";
import Link from "next/link";
const cardsCol1 = [
  { label: "Giao diện thân thiện", value: "Dễ dùng", color: "bg-gradient-to-br from-pink-50 to-pink-100 border-pink-200" },
  { label: "Preview font nhanh", value: "5000+ Font nghệ thuật", color: "bg-gradient-to-br from-violet-50 to-violet-100 border-violet-200" },
  { label: "Tải ảnh preview", value: "JPG/PNG", color: "bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200" },
];
const cardsCol2 = [
  { label: "Hỗ trợ đa nền tảng", value: "iPhone, Android, Laptop", color: "bg-gradient-to-br from-green-50 to-green-100 border-green-200" },
  { label: "Tùy chỉnh màu sắc", value: "Tuỳ ý", color: "bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200" },
  { label: "Liên hệ", value: "0355.889.286", color: "bg-gradient-to-br from-red-50 to-red-100 border-red-200" },
];

export default function WeddingFontHero() {

  return (
    <div className="w-full min-h-screen flex flex-col md:flex-row items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 px-2 sm:px-4 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-200/20 to-purple-200/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-pink-200/20 to-orange-200/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-indigo-200/10 to-blue-200/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* LEFT: TEXT (luôn hiển thị) */}
      <section
        className="flex-1 flex flex-col justify-center max-w-full md:max-w-[800px] w-full md:pt-0 gap-6 md:pr-8 px-5 relative z-10"
      >
        <div className="text-base flex items-center gap-3 bg-white/70 backdrop-blur-sm rounded-full px-4 py-2 w-fit shadow-lg">
          <span className="text-2xl">🚀</span>
          <span className="font-semibold text-gray-800">Kick start với phần mềm thiết kế</span>
        </div>
        
        <h1 className="font-bold text-3xl md:text-4xl leading-tight">
          <span className="text-gray-900 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">Font chữ </span>
          <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-gradient">Wedding Việt hóa</span>
        </h1>
        
        <p className="text-gray-700 text-base sm:text-lg mb-4 leading-relaxed">
          <span className="font-medium">Phần mềm hiển thị Font chữ thiết kế</span> là công cụ dành cho designer giúp xem trước nhanh chóng các kiểu chữ với nội dung tuỳ chọn. Bạn chỉ cần nhập tên cô dâu – chú rể, phần mềm sẽ hiển thị ngay hàng trăm font chữ nghệ thuật phù hợp để thiết kế phông cưới, thiệp mời, backdrop…
        </p>
        
        <div className="space-y-2 text-sm sm:text-base">
          <div className="flex items-start gap-3 p-3 bg-white/60 backdrop-blur-sm rounded-lg shadow-sm">
            <span className="text-xl">📸</span>
            <span>Giao diện thân thiện, dễ dùng, cho phép điều chỉnh màu sắc, cỡ chữ, độ đậm và tải ảnh preview.</span>
          </div>
          <div className="flex items-start gap-3 p-3 bg-red-50/80 backdrop-blur-sm rounded-lg shadow-sm border-l-4 border-red-400">
            <span className="text-xl">🚩</span>
            <span className="text-red-700 font-medium">Đây là công cụ không thể thiếu với bất kỳ ai làm trong ngành cưới, giúp tiết kiệm thời gian chọn font và tạo ra thiết kế đẹp mắt, ấn tượng hơn.</span>
          </div>
          <div className="flex items-start gap-3 p-3 bg-green-50/80 backdrop-blur-sm rounded-lg shadow-sm">
            <span className="text-xl">📲</span>
            <span>Sử dụng trên Iphone, Android, Ipad, Laptop</span>
          </div>
          <div className="flex items-start gap-3 p-3 bg-blue-50/80 backdrop-blur-sm rounded-lg shadow-sm">
            <span className="text-xl">📪</span>
            <span className="font-semibold">Liên hệ: phone/zalo: <span className="text-blue-600">0355.889.286</span></span>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 mt-4 w-full">
          <Link
            href="/dang-nhap" 
            className="group px-8 py-4 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 hover:shadow-xl text-center relative overflow-hidden"
          >
            <span className="relative z-10">Đăng nhập</span>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </Link>
        </div>
      </section>

      {/* RIGHT: CARD DỌC – DESKTOP */}
      <section
        className="hidden md:flex flex-row gap-6 min-w-[280px] max-w-[480px] w-full md:w-auto relative z-10"
        style={{
          height: "400px",
          alignItems: "center",
        }}
      >
        <div className="relative w-40 sm:w-48 h-full overflow-hidden flex flex-col">
          <div className="absolute inset-0 flex flex-col animate-marquee-up" style={{ height: "300%" }}>
            {[...cardsCol1, ...cardsCol1, ...cardsCol1].map((card, idx) => (
              <div key={idx} className={`rounded-2xl p-5 sm:p-6 shadow-lg border ${card.color} hover:shadow-xl hover:scale-105 transition-all duration-300 backdrop-blur-sm mb-8`}>
                <div className="text-gray-600 text-xs mb-2 font-medium">{card.label}</div>
                <div className="font-bold text-lg sm:text-xl text-gray-800">{card.value}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="relative w-40 sm:w-48 h-full overflow-hidden flex flex-col">
          <div className="absolute inset-0 flex flex-col animate-marquee-down" style={{ height: "300%" }}>
            {[...cardsCol2, ...cardsCol2, ...cardsCol2].map((card, idx) => (
              <div key={idx} className={`rounded-2xl p-5 sm:p-6 shadow-lg border ${card.color} hover:shadow-xl hover:scale-105 transition-all duration-300 backdrop-blur-sm mb-8`}>
                <div className="text-gray-600 text-xs mb-2 font-medium">{card.label}</div>
                <div className="font-bold text-lg sm:text-xl text-gray-800">{card.value}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MOBILE: 2 HÀNG CHẠY NGANG TỰ ĐỘNG */}
      <section className="block md:hidden w-full mt-6 space-y-6 mb-12 relative z-10">
        {/* Hàng 1: cardsCol1 */}
        <div className="relative overflow-hidden w-full">
          <div className="flex gap-4 animate-marquee-x" style={{ width: "max-content" }}>
            {[...cardsCol1, ...cardsCol1].map((card, idx) => (
              <div key={idx} className={`rounded-2xl p-5 shadow-lg border min-w-[180px] mx-1 ${card.color} hover:shadow-xl hover:scale-105 transition-all duration-300 backdrop-blur-sm`}>
                <div className="text-gray-600 text-xs mb-2 font-medium">{card.label}</div>
                <div className="font-bold text-base text-gray-800">{card.value}</div>
              </div>
            ))}
          </div>
        </div>
        {/* Hàng 2: cardsCol2 */}
        <div className="relative overflow-hidden w-full">
          <div className="flex gap-4 animate-marquee-x-reverse" style={{ width: "max-content" }}>
            {[...cardsCol2, ...cardsCol2].map((card, idx) => (
              <div key={idx} className={`rounded-2xl p-5 shadow-lg border min-w-[180px] mx-1 ${card.color} hover:shadow-xl hover:scale-105 transition-all duration-300 backdrop-blur-sm`}>
                <div className="text-gray-600 text-xs mb-2 font-medium">{card.label}</div>
                <div className="font-bold text-base text-gray-800">{card.value}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ANIMATION + SCROLLBAR HIDE */}
      <style jsx global>{`
        @keyframes marquee-up {
          0% { transform: translateY(0); }
          100% { transform: translateY(-66.67%); }
        }
        .animate-marquee-up {
          animation: marquee-up 15s linear infinite;
        }
        @keyframes marquee-down {
          0% { transform: translateY(-66.67%); }
          100% { transform: translateY(0); }
        }
        .animate-marquee-down {
          animation: marquee-down 15s linear infinite;
        }
        @keyframes marquee-x {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee-x {
          animation: marquee-x 18s linear infinite;
        }
        @keyframes marquee-x-reverse {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
        .animate-marquee-x-reverse {
          animation: marquee-x-reverse 18s linear infinite;
        }
        
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }

        /* Ẩn scrollbar */
        div::-webkit-scrollbar {
          display: none;
        }
        
        /* Smooth scrolling */
        html {
          scroll-behavior: smooth;
        }
      `}</style>
    </div>
  );
}
