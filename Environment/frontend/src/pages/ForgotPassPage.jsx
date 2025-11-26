import { useState } from "react";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";

function ForgotPassPage() {
    const [email, setEmail] = useState("");
    const handleSubmit = async (e) => {
        e.preventDefault();
        axiosInstance.post("/auth/forgot-password", { email })
        try {
            toast.success("Password reset link sent to your email");
        }
        catch (error) {
            toast.error("Error sending password reset link");
        }
    };


  return (
    <div className="h-screen grid justify-center items-center">
      <div className="flex flex-col justify-center items-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-8">
          <h1 className="text-2xl font-bold mt-2">Forgot Password</h1>
          <p className="text-base-content/60">Enter your email to reset your password</p>
          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
           <input
              type="email"
              className={`input input-bordered w-full`}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            >
           </input>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassPage;
