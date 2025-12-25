import Head from "next/head";
import DefaultLayout from "../components/layout/DefaultLayout";
import FontChu from "../components/font/FontChu";
import WeddingFontHero from "../components/font/WeddingFontHero";
import { useSession } from "next-auth/react";

export default function Home({ meta }) {
  const { data: session, status } = useSession();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Font chữ Wedding Việt hóa",
    url: "https://ecobacgiang.vn/font-chu",
    description: "Kho font chữ wedding Việt hóa đẹp nhất, miễn phí tải về, xem trước cho thiết kế thiệp cưới, backdrop.",
    publisher: {
      "@type": "Organization",
      name: "Eco Bắc Giang",
      url: "https://ecobacgiang.vn",
      logo: {
        "@type": "ImageObject",
        url: "https://ecobacgiang.vn/logo.png",
      },
    },
  };

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (!session) {
    return <WeddingFontHero />;
  }

  return (
    <>
      
      <DefaultLayout meta={meta}>
        <h1 className="hidden">
          Font chữ Wedding Việt hóa đẹp cho thiệp cưới, Backdrop, Decor
        </h1>
        <FontChu />
      </DefaultLayout>
    </>
  );
}

export async function getServerSideProps() {
  const meta = {
    title: "Font chữ Wedding Việt hóa đẹp cho thiệp cưới, Backdrop, Decor",
    description: "Tham khảo kho font chữ Wedding Việt hóa độc đáo, sáng tạo, miễn phí cho thiệp cưới, backdrop, decor. Chọn font đám cưới phù hợp để thiết kế thiệp cưới online chuyên nghiệp.",
    keywords: "font wedding, font chữ đám cưới, font việt hóa, font thiệp cưới, font cưới đẹp, font backdrop đám cưới, font chữ trang trí đám cưới, font cưới, font đẹp thiệp cưới, font chữ wedding miễn phí",
    robots: "index, follow",
    author: "Eco Bắc Giang",
    canonical: "https://font.cuoihoibacninh.com/",
    og: {
      title: "Font chữ Wedding Việt hóa đẹp cho thiệp cưới, Backdrop, Decor",
      description: "Kho font chữ Wedding Việt hóa dành cho thiết kế thiệp cưới, backdrop, bảng tên cô dâu chú rể. Chọn nhanh, xem trước, tải font miễn phí.",
      type: "article",
      image: "https://font.cuoihoibacninh.com/og-font-wedding.png",
      imageWidth: "1200",
      imageHeight: "630",
      url: "https:/font.cuoihoibacninh.com/font-chu",
    },
    twitter: {
      card: "summary_large_image",
      title: "Font chữ Wedding Việt hóa đẹp cho thiệp cưới, Backdrop, Decor",
      description: "Tham khảo kho font chữ Wedding Việt hóa độc đáo, miễn phí cho thiết kế thiệp cưới chuyên nghiệp.",
      image: "https://font.cuoihoibacninh.com/og-font-wedding.png",
    },
  };

  return {
    props: { meta },
  };
}