import { useState, useRef, useEffect } from "react";
import Head from "next/head";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { getSession } from "next-auth/react";
import { useRouter } from "next/router";
import { FaLock, FaEye, FaEyeSlash, FaEnvelope, FaKey } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DefaultLayout3 from "../../../../components/layout/DefaultLayout3";
import Link from "next/link";
import axios from "axios";

// Component OTP Input với 6 ô vuông
const OTPInput = ({ value, onChange, error, touched }) => {
  const inputRefs = useRef([]);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);

  useEffect(() => {
    // Đồng bộ với value từ Formik (chỉ khi value thay đổi từ bên ngoài)
    if (value) {
      const digits = value.split("").slice(0, 6);
      const newOtp = ["", "", "", "", "", ""];
      digits.forEach((digit, index) => {
        if (index < 6) newOtp[index] = digit;
      });
      // Chỉ update nếu khác với state hiện tại
      const currentValue = otp.join("");
      if (currentValue !== value) {
        setOtp(newOtp);
      }
    } else if (otp.some(digit => digit !== "")) {
      // Chỉ reset nếu có giá trị
      setOtp(["", "", "", "", "", ""]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const handleChange = (index, digit) => {
    // Chỉ cho phép số
    if (digit && !/^\d$/.test(digit)) return;

    const newOtp = [...otp];
    newOtp[index] = digit;
    setOtp(newOtp);

    // Cập nhật Formik value
    const codeValue = newOtp.join("");
    onChange(codeValue);

    // Tự động chuyển focus sang ô tiếp theo
    if (digit && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    // Xử lý backspace
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    // Xử lý arrow keys
    if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === "ArrowRight" && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text");
    const digits = pastedData.replace(/\D/g, "").slice(0, 6).split("");
    
    const newOtp = [...otp];
    digits.forEach((digit, index) => {
      if (index < 6) newOtp[index] = digit;
    });
    setOtp(newOtp);

    const codeValue = newOtp.join("");
    onChange(codeValue);

    // Focus vào ô cuối cùng được điền hoặc ô đầu tiên nếu đủ 6 số
    const focusIndex = Math.min(digits.length - 1, 5);
    inputRefs.current[focusIndex]?.focus();
  };

  return (
    <div>
      <div className="flex gap-2 justify-center mb-2">
        {otp.map((digit, index) => (
          <input
            key={index}
            ref={(el) => (inputRefs.current[index] = el)}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={index === 0 ? handlePaste : undefined}
            className={`
              w-14 h-14 text-center text-2xl font-bold rounded-lg
              border-2 transition-all duration-200
              bg-gray-800 text-white
              focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500
              ${error && touched 
                ? "border-red-500 focus:border-red-500 focus:ring-red-500" 
                : "border-gray-600 hover:border-gray-500"
              }
            `}
            style={{
              fontFamily: "monospace",
              letterSpacing: "0.1em",
            }}
          />
        ))}
      </div>
      {error && touched && (
        <p className="text-red-500 text-sm mt-1 text-center">{error}</p>
      )}
    </div>
  );
};

// Schema xác thực với Yup
const resetPasswordValidation = Yup.object({
  email: Yup.string()
    .required("Vui lòng nhập email.")
    .email("Vui lòng nhập địa chỉ email hợp lệ."),
  code: Yup.string()
    .required("Vui lòng nhập mã số xác nhận.")
    .matches(/^\d{6}$/, "Mã số phải có đúng 6 chữ số."),
  password: Yup.string()
    .required("Vui lòng nhập mật khẩu mới.")
    .min(6, "Mật khẩu phải có ít nhất 6 ký tự."),
  confirmPassword: Yup.string()
    .required("Vui lòng xác nhận mật khẩu.")
    .oneOf([Yup.ref("password"), null], "Mật khẩu xác nhận không khớp."),
});

export default function ResetPassword() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [status, setStatus] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword((prev) => !prev);
  };

  const handleSubmit = async (values) => {
    setIsSubmitting(true);
    setStatus("Đang đặt lại mật khẩu...");

    try {
      // Normalize mã số: loại bỏ khoảng trắng và chỉ lấy số
      const normalizedCode = values.code.toString().trim().replace(/\s+/g, "").replace(/\D/g, "");
      
      const { data } = await axios.post(`${baseUrl}/api/auth/reset`, {
        email: values.email.trim(),
        code: normalizedCode,
        password: values.password,
      });

      setStatus("Thành công!");
      toast.success(data.message || "Đặt lại mật khẩu thành công!");
      
      setTimeout(() => {
        router.push("/dang-nhap");
      }, 2000);
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Đã xảy ra lỗi. Vui lòng thử lại sau.";
      setStatus(`Lỗi: ${errorMessage}`);
      toast.error(errorMessage);
      
      // Nếu mã số hết hạn hoặc không hợp lệ, chuyển về trang quên mật khẩu
      if (errorMessage.includes("hết hạn") || errorMessage.includes("không đúng")) {
        setTimeout(() => {
          router.push("/auth/quen-mat-khau");
        }, 3000);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DefaultLayout3>
      <Head>
        <title>Đặt lại mật khẩu - Font Chữ Wedding</title>
        <meta
          name="description"
          content="Đặt lại mật khẩu mới cho tài khoản Font Chữ Wedding của bạn."
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
          <h2 className="text-3xl font-bold text-white text-center mb-4">Đặt Lại Mật Khẩu</h2>
          <p className="text-gray-300 text-center mb-8 text-sm">
            Nhập email, mã số xác nhận và mật khẩu mới
          </p>

          <Formik
            initialValues={{ email: "", code: "", password: "", confirmPassword: "" }}
            validationSchema={resetPasswordValidation}
            onSubmit={handleSubmit}
          >
            {({ setFieldValue }) => (
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

                {/* Mã số xác nhận */}
                <div className="relative">
                  <label className="block text-white text-sm mb-3 text-center">
                    Mã số xác nhận <span className="text-orange-500">*</span>
                  </label>
                  <Field name="code">
                    {({ field, meta }) => (
                      <OTPInput
                        value={field.value}
                        onChange={(value) => setFieldValue("code", value)}
                        error={meta.error}
                        touched={meta.touched}
                      />
                    )}
                  </Field>
                  <p className="text-gray-400 text-xs mt-2 text-center">
                    Nhập mã số 6 chữ số đã được gửi đến email của bạn
                  </p>
                </div>

                {/* Mật khẩu mới */}
                <div className="relative">
                  <label htmlFor="password" className="block text-white text-sm mb-2">
                    Mật khẩu mới <span className="text-orange-500">*</span>
                  </label>
                  <div className="flex items-center border border-gray-600 rounded-lg bg-gray-800 gap-4">
                    <span className="pl-3 text-orange-500">
                      <FaLock />
                    </span>
                    <Field
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      className="w-full p-3 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="Nhập mật khẩu mới"
                      required
                    />
                    <button
                      type="button"
                      onClick={togglePasswordVisibility}
                      className="pr-3 text-gray-400 hover:text-white"
                      aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                  <ErrorMessage
                    name="password"
                    component="p"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>

                {/* Xác nhận mật khẩu */}
                <div className="relative">
                  <label htmlFor="confirmPassword" className="block text-white text-sm mb-2">
                    Xác nhận mật khẩu <span className="text-orange-500">*</span>
                  </label>
                  <div className="flex items-center border border-gray-600 rounded-lg bg-gray-800 gap-4">
                    <span className="pl-3 text-orange-500">
                      <FaLock />
                    </span>
                    <Field
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      className="w-full p-3 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="Xác nhận mật khẩu mới"
                      required
                    />
                    <button
                      type="button"
                      onClick={toggleConfirmPasswordVisibility}
                      className="pr-3 text-gray-400 hover:text-white"
                      aria-label={showConfirmPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                    >
                      {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                  <ErrorMessage
                    name="confirmPassword"
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

                {/* Nút đặt lại */}
                <button
                  type="submit"
                  disabled={isSubmitting || status === "Đang đặt lại mật khẩu..."}
                  className="w-full py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Đang xử lý..." : "Đặt Lại Mật Khẩu"}
                </button>

                {/* Quay lại đăng nhập */}
                <div className="text-center mt-4">
                  <Link
                    href="/dang-nhap"
                    className="text-blue-600 hover:text-orange-500 transition-colors"
                  >
                    Quay lại đăng nhập
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

