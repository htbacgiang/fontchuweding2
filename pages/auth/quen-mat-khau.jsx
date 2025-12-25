import { useState } from "react";
import Head from "next/head";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { getSession } from "next-auth/react";
import { useRouter } from "next/router";
import { FaEnvelope } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DefaultLayout3 from "../../components/layout/DefaultLayout3";
import Link from "next/link";
import axios from "axios";

// Schema xác thực với Yup
const forgotPasswordValidation = Yup.object({
  email: Yup.string()
    .required("Vui lòng nhập email.")
    .email("Vui lòng nhập địa chỉ email hợp lệ."),
});

export default function ForgotPassword() {
  const router = useRouter();
  const [status, setStatus] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  const handleSubmit = async (values) => {
    setIsSubmitting(true);
    setStatus("Đang gửi email...");

    try {
      const { data } = await axios.post(`${baseUrl}/api/auth/forgot`, {
        email: values.email,
      });

      setStatus("Thành công!");
      toast.success(data.message || "Mã số đặt lại mật khẩu đã được gửi!");
      
      setTimeout(() => {
        router.push("/auth/quen-mat-khau/reset");
      }, 2000);
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Đã xảy ra lỗi. Vui lòng thử lại sau.";
      setStatus(`Lỗi: ${errorMessage}`);
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DefaultLayout3>
      <Head>
        <title>Quên mật khẩu - Font Chữ Wedding</title>
        <meta
          name="description"
          content="Quên mật khẩu? Nhập email của bạn để nhận mã số đặt lại mật khẩu từ Font Chữ Wedding."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <section
        className="min-h-screen flex items-center justify-center relative"
        style={{
          backgroundImage: `url('/dang-ky.jpg')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <ToastContainer
          position="top-center"
          autoClose={3000}
          hideProgressBar={false}
          closeOnClick
          pauseOnHover
        />
        <div className="absolute inset-0 bg-black opacity-70"></div>
        <div className="bg-gray-900 rounded-2xl p-8 w-full max-w-md relative z-10 opacity-90">
          <h2 className="text-3xl font-bold text-white text-center mb-4">Quên Mật Khẩu</h2>
          <p className="text-gray-300 text-center mb-8 text-sm">
            Nhập email của bạn để nhận mã số đặt lại mật khẩu
          </p>

          <Formik
            initialValues={{ email: "" }}
            validationSchema={forgotPasswordValidation}
            onSubmit={handleSubmit}
          >
            {() => (
              <Form className="space-y-6">
                {/* Email */}
                <div className="relative">
                  <label htmlFor="email" className="block text-white text-sm mb-2">
                    Email <span className="text-orange-500">*</span>
                  </label>
                  <div className="flex items-center border border-gray-600 rounded-lg bg-gray-800 gap-4">
                    <span className="pl-3 text-orange-500">
                      <FaEnvelope />
                    </span>
                    <Field
                      id="email"
                      name="email"
                      type="email"
                      className="w-full p-3 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="Nhập email của bạn"
                      required
                    />
                  </div>
                  <ErrorMessage
                    name="email"
                    component="p"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>

                {/* Thông báo trạng thái */}
                {status && (
                  <p
                    className={`text-center ${
                      status.includes("Thành công") ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    {status}
                  </p>
                )}

                {/* Nút gửi */}
                <button
                  type="submit"
                  disabled={isSubmitting || status === "Đang gửi email..."}
                  className="w-full py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Đang gửi..." : "Gửi Email Đặt Lại Mật Khẩu"}
                </button>

                {/* Quay lại đăng nhập */}
                <div className="text-center mt-4">
                  <Link
                    href="/dang-nhap"
                    className="text-blue-600 hover:text-orange-500 transition-colors"
                  >
                    Quay lại đăng nhập
                  </Link>
                  <span className="px-2 text-white">|</span>
                  <Link
                    href="/dang-ky"
                    className="text-blue-600 hover:text-orange-500 transition-colors"
                  >
                    Đăng ký
                  </Link>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </section>
    </DefaultLayout3>
  );
}

export async function getServerSideProps(context) {
  const { req } = context;
  const session = await getSession({ req });

  // Nếu đã đăng nhập, chuyển về trang chủ
  if (session) {
    return {
      redirect: {
        destination: "/",
      },
    };
  }

  return {
    props: {},
  };
}

