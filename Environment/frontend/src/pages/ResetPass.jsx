import { useState } from "react";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { Eye, EyeOff } from "lucide-react";

export const ResetPass = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [newPassword, setNewPassword] = useState({
    newPassword: "",
    setNewPassword: "",
  });
  const [confirmPassword, setConfirmPassword] = useState({
    confirmPassword: "",
    setConfirmPassword: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = window.location.pathname.split("/").pop();
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    try {
      await axiosInstance.post(`auth/reset-password/${token}`, { newPassword });
      toast.success("Password reset successfully");
      setTimeout(() => {
        window.location.href = "/login";
      }, 2000);
    } catch (error) {
      toast.error("Error resetting password");
    }
  };

  return (
    <div className="h-screen grid justify-center items-center">
      <div className="flex flex-col justify-center items-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-8">
          <h1 className="text-2xl font-bold mt-2">Reset Password</h1>
          <p className="text-base-content/60">Enter your new password</p>
          {/* Form */}
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* New Password */}
            <label className="label">
              <span className="label-text font-medium">New Password</span>
            </label>
            <input
              type={showPassword ? "text" : "password"}
              className={`input input-bordered w-full`}
              value={newPassword}
              required
              placeholder="*********"
              onChange={(e) => setNewPassword(e.target.value)}
            />
            {/*Confirm password*/}
            <label className="label">
              <span className="label-text font-medium">Confirm Password</span>
            </label>
            <input
              type={showPassword ? "text" : "password"}
              className={`input input-bordered w-full`}
              value={confirmPassword}
              required
              placeholder="*********"
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <button type="submit" className="btn btn-primary w-full">
                Reset Password
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPass;
