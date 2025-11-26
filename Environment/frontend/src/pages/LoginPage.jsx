import React, { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Eye, EyeOff, Loader2, Mail, MapPin, Lock } from "lucide-react";
import { Link } from "react-router-dom";
import AuthImagePattern from "../components/AuthImagePattern";

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { login, isLoggingIn } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    login(formData);
  };

  return (
    <div className="h-screen grid lg:grid-cols-2 bg-base-200">
      {/* left side */}
      <div className="flex flex-col justify-center items-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-8">
          {/* logo */}
          <div className="text-center mb-8">
            <div className="flex flex-col items-center gap-2 group">
              <div className="w-12 h-12 rounded-xl bg/primary/10 flex items-center justify-center group-hover:bg-primary/30">
                <img
                  src="/logo3t.png" alt="a tent with a map in inside"
                ></img>
              </div>
              <h1 className="text-2xl font-bold mt-2">Glad to see you again!</h1>
              <p className="text-base-content/60">Sign in to your AccessMap account</p>
              <span className="badge badge-soft my-2">Event Coordinator Login</span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div className="form-control flex flex-col gap-1">
              <label className="label">
                <span className="label-text font-medium">Email</span>
              </label>
              <div className="relative">
                <div className="absolute insert-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-base-content/40" />
                </div>
                <input
                  type="email"
                  className={`input input-bordered w-full pl-10`}
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </div>
            </div>

            {/* passowrd */}
            <div className="form-control flex flex-col gap-1">
              <label className="label">
                <span className="label-text font-medium">Password</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="size-5 text-base-content/40" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  className={`input input-bordered w-full pl-10`}
                  placeholder="********"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="size-5 text-base-content/40" />
                  ) : (
                    <Eye className="size-5 text-base-content/40" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary w-full py-4"
              disabled={isLoggingIn}
            >
              {isLoggingIn ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Loading...
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          <div className="text-center">
            <p className="text-base-content/60">
              <Link to="/forgot-password" className="link link-primary">
                Forgot Password?
              </Link>
            </p>
          </div>

          <div className="flex flex-col gap-4">
            <div className="text-center">
                <p className="text-base-content/60">
                Don't have an account?{" "}
                <Link to="/signup" className="link link-primary">
                  Sign up here!
                </Link>
              </p>
            </div>
            <div className="text-center">
                <p className="text-base-content/60">
                Invited as a vendor?{" "}
                <Link to="/vendor/login" className="link link-primary">
                  Log in as a vendor here!
                </Link>
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* Right hand side */}
      <AuthImagePattern 
        title={"Know Before You Go"}
        subtitle={
          "Accessibility-Focused Event Mapping"
        }
      />
    </div>
  );
};

export default LoginPage;
