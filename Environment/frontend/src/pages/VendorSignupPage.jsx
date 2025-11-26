import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { axiosInstance } from "../lib/axios"; 
import { useAuthStore } from "../store/useAuthStore";
import { Eye, EyeOff, Loader, Loader2, Lock, Mail, MessageSquare, User, } from "lucide-react";
import { Link } from "react-router-dom";
import AuthImagePattern from "../components/AuthImagePattern";
import toast from "react-hot-toast";

/** 
 * @brief Vendor version of SignUpPage
 * @route /vendor/:stallId/signup
 * @note VendorSignupPage is only accessible via an invite link from the coordinator
 * @navigation Sign in button to /vendor/register-stall/:stallId
 * */
const VendorSignupPage = () => {
  const { stallId } = useParams(); 
  const [stall, setStall] = useState(null);
  const [loading, setLoading] = useState(true);
  const { signupVendor, isSigningUp } = useAuthStore();
  const navigate = useNavigate();

  //fetches stall by :stallId given in route
  useEffect(() => {
    const fetchStall = async () => {
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


  const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
      fullName: "",
      email: "",
      password: "",
    });
  
  // jsx doesn't like setting the variables in the useState declaration,
  // work around below
  useEffect(() => {
    if (stall?.email) {
      setFormData((prev) => ({ ...prev, email: stall.email }));
    }
  }, [stall]);

  
  const validateForm = () => {
    if (!formData.fullName.trim()) return toast.error("Full name is required");
    if (!formData.password) return toast.error("Password is required");
    if (formData.password.length < 6)
      return toast.error("Password must be at least 6 characters");

    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const success = validateForm();

    if (success === true){ 
      signupVendor(formData, stallId);
      navigate(`/vendor/register-stall/${stallId}`);
    }
  };


  if (loading) {
    return (
      <div className="min-h-screen grid place-items-center">
        <span className="loading loading-spinner loading-lg" />
      </div>
    );
  }

  // later should create a getter for using Stall.EventId to get Event.
  // then Event.eventCoordinatorId -> User, 
  // then save User as coordinator
  // then in the second <h1 className="text-2xl font-bold">Contact Event {coordinator.email}</h1>
  if (!stall) {
    return (
      <div className="min-h-screen grid place-items-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Unable to load stall</h1>
          <h1 className="text-2xl font-bold">Contact Event Coordinator</h1>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* left side of form*/}
      <div className="flex flex-col justify-center items-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-8">
          {/* logo */}
          <div className="text-center mb-8">
            <div className="flex flex-col items-center gap-2 group">
              <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <MessageSquare className="size-6 text-primary"></MessageSquare>
              </div>
              <h1 className="text-2xl font-bold mt-2">Welcome {stall.name}!</h1>
              <p className="text-base-content/60">
                Enter your full name and create a password to get started.
              </p>
            </div>
          </div>
          {/* form  */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* full name */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Full Name</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="size-5 text-base-content/40" />
                </div>
                <input
                  type="text"
                  className={`input input-bordered w-full pl-10`}
                  placeholder="John Doe"
                  value={formData.fullName}
                  onChange={(e) =>
                    setFormData({ ...formData, fullName: e.target.value })
                  }
                />
              </div>
            </div>
            {/* email */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Email</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="size-5 text-base-content/40" />
                </div>
                <input
                  type="email"
                  className={`input input-bordered w-full pl-10`}
                  value={stall.email}
                  readOnly
                />
              </div>
            </div>

            {/* passowrd */}
            <div className="form-control">
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
            {/* signing up button or create account */}
            <button
              type="submit"
              className="btn btn-primary w-full"
              disabled={isSigningUp}
            >
              {isSigningUp ? (
                <>
                  <Loader2 className="size-5 animate-spin" />
                  Loading...
                </>
              ) : (
                "Create Vendor Account"
              )}
            </button>
          </form>

          <div className="text-center">
            <p className="text-base-content/60">
              Already have an account?{" "}
              <Link to="/login" className="link link-primary">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
      {/* right handside */}
      <AuthImagePattern />
    </div>
  );
};

export default VendorSignupPage;


