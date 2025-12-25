import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useState } from "react";
import { getSession } from "next-auth/react";
import Router from "next/router";
import { FaLock, FaEye, FaEyeSlash, FaShieldAlt, FaCheckCircle } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

// Schema validation với Yup
const changePasswordValidation = Yup.object({
  currentPassword: Yup.string()
    .required("Vui lòng nhập mật khẩu hiện tại.")
    .min(6, "Mật khẩu hiện tại phải có ít nhất 6 ký tự."),
  newPassword: Yup.string()
    .required("Vui lòng nhập mật khẩu mới.")
    .min(6, "Mật khẩu mới phải có ít nhất 6 ký tự.")
    .notOneOf([Yup.ref("currentPassword")], "Mật khẩu mới không được trùng với mật khẩu hiện tại."),
  confirmNewPassword: Yup.string()
    .required("Vui lòng xác nhận mật khẩu mới.")
    .oneOf([Yup.ref("newPassword"), null], "Mật khẩu xác nhận không khớp."),
});

export default function ChangePassword() {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);
  const [status, setStatus] = useState("");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  const toggleCurrentPasswordVisibility = () => {
    setShowCurrentPassword((prev) => !prev);
  };

  const toggleNewPasswordVisibility = () => {
    setShowNewPassword((prev) => !prev);
  };

  const toggleConfirmNewPasswordVisibility = () => {
    setShowConfirmNewPassword((prev) => !prev);
  };

  const changePasswordHandler = async (values, setSubmitting) => {
    try {
      setStatus("Đang đổi mật khẩu...");
      console.log("Submitting change password:", values); // Debug
      const { data } = await axios.post(
        `${baseUrl}/api/auth/change-password`,
        {
          currentPassword: values.currentPassword,
          newPassword: values.newPassword,
          confirmNewPassword: values.confirmNewPassword,
        },
        { withCredentials: true } // Gửi cookie xác thực
      );
      console.log("Change password response:", data); // Debug
      setSuccess(data.message);
      setError("");
      setStatus("Đổi mật khẩu thành công!");
      toast.success("Đổi mật khẩu thành công!");
      setSubmitting(false);
      setTimeout(() => {
        Router.push("/dashboard");
      }, 2000);
    } catch (error) {
      console.error("Change password error:", error.response?.data || error.message);
      setStatus("");
      setSuccess("");
      setError(error.response?.data?.message || "Đã xảy ra lỗi.");
      toast.error(error.response?.data?.message || "Đã xảy ra lỗi.");
      setSubmitting(false);
      setTimeout(() => {
        setError("");
      }, 3000);
    }
  };

  return (
    <>
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
      />

      <div className="p-6 md:p-8">
        {/* Form Container */}
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100">
            <Formik
              initialValues={{
                currentPassword: "",
                newPassword: "",
                confirmNewPassword: "",
              }}
              validationSchema={changePasswordValidation}
              validateOnChange={true}
              validateOnBlur={true}
              onSubmit={(values, { setSubmitting }) => {
                console.log("Form values:", values); // Debug
                changePasswordHandler(values, setSubmitting);
              }}
            >
              {({ values, handleChange, errors, touched, isSubmitting }) => (
                <Form className="space-y-6">
                  {/* Current Password */}
                  <div className="relative">
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Mật khẩu hiện tại <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-pink-500">
                        <FaLock className="w-5 h-5" />
                      </div>
                      <input
                        type={showCurrentPassword ? "text" : "password"}
                        name="currentPassword"
                        value={values.currentPassword}
                        onChange={handleChange}
                        className={`w-full pl-12 pr-12 py-4 border-2 rounded-xl text-base transition-all duration-300 focus:outline-none ${
                          errors.currentPassword && touched.currentPassword
                            ? "border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-500/20"
                            : "border-gray-200 focus:border-pink-500 focus:ring-4 focus:ring-pink-500/20"
                        }`}
                        placeholder="Nhập mật khẩu hiện tại"
                        required
                      />
                      <button
                        type="button"
                        onClick={toggleCurrentPasswordVisibility}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-pink-500 transition-colors duration-200"
                      >
                        {showCurrentPassword ? <FaEyeSlash className="w-5 h-5" /> : <FaEye className="w-5 h-5" />}
                      </button>
                    </div>
                    {errors.currentPassword && touched.currentPassword && (
                      <p className="text-red-500 text-sm mt-2 flex items-center">
                        <span className="w-1 h-1 bg-red-500 rounded-full mr-2"></span>
                        {errors.currentPassword}
                      </p>
                    )}
                  </div>

                  {/* New Password */}
                  <div className="relative">
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Mật khẩu mới <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-pink-500">
                        <FaLock className="w-5 h-5" />
                      </div>
                      <input
                        type={showNewPassword ? "text" : "password"}
                        name="newPassword"
                        value={values.newPassword}
                        onChange={handleChange}
                        className={`w-full pl-12 pr-12 py-4 border-2 rounded-xl text-base transition-all duration-300 focus:outline-none ${
                          errors.newPassword && touched.newPassword
                            ? "border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-500/20"
                            : "border-gray-200 focus:border-pink-500 focus:ring-4 focus:ring-pink-500/20"
                        }`}
                        placeholder="Nhập mật khẩu mới"
                        required
                      />
                      <button
                        type="button"
                        onClick={toggleNewPasswordVisibility}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-pink-500 transition-colors duration-200"
                      >
                        {showNewPassword ? <FaEyeSlash className="w-5 h-5" /> : <FaEye className="w-5 h-5" />}
                      </button>
                    </div>
                    {errors.newPassword && touched.newPassword && (
                      <p className="text-red-500 text-sm mt-2 flex items-center">
                        <span className="w-1 h-1 bg-red-500 rounded-full mr-2"></span>
                        {errors.newPassword}
                      </p>
                    )}
                  </div>

                  {/* Confirm New Password */}
                  <div className="relative">
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Xác nhận mật khẩu mới <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-pink-500">
                        <FaLock className="w-5 h-5" />
                      </div>
                      <input
                        type={showConfirmNewPassword ? "text" : "password"}
                        name="confirmNewPassword"
                        value={values.confirmNewPassword}
                        onChange={handleChange}
                        className={`w-full pl-12 pr-12 py-4 border-2 rounded-xl text-base transition-all duration-300 focus:outline-none ${
                          errors.confirmNewPassword && touched.confirmNewPassword
                            ? "border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-500/20"
                            : "border-gray-200 focus:border-pink-500 focus:ring-4 focus:ring-pink-500/20"
                        }`}
                        placeholder="Xác nhận mật khẩu mới"
                        required
                      />
                      <button
                        type="button"
                        onClick={toggleConfirmNewPasswordVisibility}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-pink-500 transition-colors duration-200"
                      >
                        {showConfirmNewPassword ? <FaEyeSlash className="w-5 h-5" /> : <FaEye className="w-5 h-5" />}
                      </button>
                    </div>
                    {errors.confirmNewPassword && touched.confirmNewPassword && (
                      <p className="text-red-500 text-sm mt-2 flex items-center">
                        <span className="w-1 h-1 bg-red-500 rounded-full mr-2"></span>
                        {errors.confirmNewPassword}
                      </p>
                    )}
                  </div>

                  {/* Password Requirements */}
                  <div className="bg-gradient-to-r from-pink-50 to-pink-100 rounded-2xl p-4 border border-pink-200">
                    <h4 className="text-sm font-semibold text-pink-800 mb-3 flex items-center">
                      <FaShieldAlt className="w-4 h-4 mr-2" />
                      Yêu cầu mật khẩu
                    </h4>
                    <div className="space-y-2 text-sm text-pink-700">
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-pink-400 rounded-full mr-2"></div>
                        Tối thiểu 6 ký tự
                      </div>
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-pink-400 rounded-full mr-2"></div>
                        Không được trùng với mật khẩu cũ
                      </div>
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-pink-400 rounded-full mr-2"></div>
                        Xác nhận mật khẩu phải khớp
                      </div>
                    </div>
                  </div>

                  {/* Status Messages */}
                  {status && (
                    <div className={`rounded-2xl p-4 ${
                      status.includes("thành công") 
                        ? "bg-green-50 border border-green-200" 
                        : "bg-blue-50 border border-blue-200"
                    }`}>
                      <p className={`text-center font-medium ${
                        status.includes("thành công") ? "text-green-700" : "text-blue-700"
                      }`}>
                        {status}
                      </p>
                    </div>
                  )}
                  
                  {success && (
                    <div className="bg-green-50 border border-green-200 rounded-2xl p-4">
                      <p className="text-center text-green-700 font-medium flex items-center justify-center">
                        <FaCheckCircle className="w-5 h-5 mr-2" />
                        {success}
                      </p>
                    </div>
                  )}
                  
                  {error && (
                    <div className="bg-red-50 border border-red-200 rounded-2xl p-4">
                      <p className="text-center text-red-700 font-medium">{error}</p>
                    </div>
                  )}

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full py-4 rounded-2xl font-bold text-lg transition-all duration-300 transform hover:scale-105 ${
                      isSubmitting
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-gradient-to-r from-pink-600 to-pink-700 hover:from-pink-700 hover:to-pink-800 text-white shadow-xl hover:shadow-2xl"
                    }`}
                  >
                    {isSubmitting ? (
                      <div className="flex items-center justify-center gap-3">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Đang đổi mật khẩu...
                      </div>
                    ) : (
                      "Đổi mật khẩu"
                    )}
                  </button>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </>
  );
}

export async function getServerSideProps(context) {
  const { req } = context;
  const session = await getSession({ req });
  console.log("Change password session:", session); // Debug

  if (!session) {
    console.log("Redirecting to login");
    return {
      redirect: {
        destination: "/dang-nhap",
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
}