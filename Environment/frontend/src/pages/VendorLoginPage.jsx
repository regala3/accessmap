import React, { useState, useEffect } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Eye, EyeOff, Loader2, Mail, MapPin, Lock } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import AuthImagePattern from "../components/AuthImagePattern";
import { axiosInstance } from "../lib/axios";


/**
 * @IGNORE this comment needs to be updated
 * @brief Handles two cases: 
 *      [1.]: When a Coordinator sends an invite email to the email of an existing
 *         user. This appends the stallid that was sent via the invite to the
 *         user's(vendor's) stalls array.
 *         
 *         route: /vendor/:stallId/login
 *        
 *      [2.]: The regular publiclly available Login for vendors. 
 *         
 *         route: /vendor/login
 * @note From the UI perspective, VendorLoginPage and LoginPage are nearly identical
 *       experiences. With the only difference being in case [1.] where the email input 
 *       is readOnly and the invitation destination email will be set as the value.
 * @navigation [1.] on success:   VendorViewStallPage at "/vendor/register-stall/:stallId"
 *                  on failure:   nothing
 *             [2.] on success:   VendorHomePage at "/vendor"
 *                  on failure:   nothing
 *             Still need to implement failure branches. Implementation depends on 
 *             desired behaviour, do we want potential vendors to be able to sign up
 *             without invite? If yes, redirect to VendorSignupPage and add that
 *             capability to VendorSignupPage. If no, create a rejection message/page
 */
const VendorLoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [stall, setStall] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const { stallId } = useParams();
  const { login, loginVendor ,isLoggingIn } = useAuthStore();

  // grabs the stallId if case [1.] from the url
  // if not, then case [2.]
  useEffect(() => {
    const fetchStall = async () => {
      if (!stallId) return;
      setLoading(true);
      try {
        const res = await axiosInstance.get(`/events/stalls/${stallId}`); 
        setStall(res.data);
      } catch (err) {
        console.error("Failed to fetch stall:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStall();
  }, [stallId]);

  // if case [1.] we set the formData's email field, to the invitation email
  useEffect(() => {
      if (!stallId) return;
      if (stall?.email) {
        setFormData((prev) => ({ ...prev, email: stall.email }));
      }
    }, [stall]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if(stallId){
        // case [1.]
        await loginVendor(formData, stallId)
        navigate(`/vendor`)
        //navigate(`/vendor/register-stall/${stallId}`)
      }else{
        // case [2.]
        await login(formData);
        navigate(`/vendor`)
      }
    }catch(err){
       console.error("Failed to login", err);
    }
  };

  let emailInputComponent;
  // depending on which case, sets and renders the email field as readOnly
  // or allows user to enter email
  if (stallId){
    // case [1.]
    emailInputComponent = (
      <input
        type="email"
        className={`input input-bordered w-full pl-10`}
        value={formData.email}
        readOnly
      />
    )
  }else{
    // case [2.]
    emailInputComponent = (
      <input
        type="email"
        className={`input input-bordered w-full pl-10`}
        placeholder="you@example.com"
        value={formData.email}
        onChange={(e) =>
          setFormData({ ...formData, email: e.target.value })
        }
      />
    )
  }

  
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
              <span className="badge badge-soft my-2">Event Vendor Login</span>
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
                  {emailInputComponent}
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
                Organizing the event?{" "}
                <Link to="/login" className="link link-primary">
                  Log in as a coordinator here!
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

export default VendorLoginPage