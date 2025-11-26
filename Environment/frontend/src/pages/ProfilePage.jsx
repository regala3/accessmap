import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Camera, Mail, User, Shield, Eye, EyeOff, LineChart} from "lucide-react";
import { Link } from "react-router-dom";

const ProfilePage = () => {
  const { authUser, isUpdatingProfile, updateProfile, password } = useAuthStore();
  const [selectedImg, setSelectedImg] = useState(null);
  {/* used for users changing the password */}  
  const [showPassword] = useState(false);
  const [formData, setFormData] = useState({
      email: "",
      password: "",
    });
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onload = async () => {
      const base64Image = reader.result;
      setSelectedImg(base64Image);
      await updateProfile({ profilePic: base64Image });
    };
  };

  return (
    <div className="min-h-screen pt-20 bg-base-200">
      <div className="max-w-2xl mx-auto p-4 py-8">
        <div className="bg-base-100 rounded-xl p-6 space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-semibold ">Profile</h1>
            <p className="mt-2">Edit your profile information</p>
          </div>

          {/* avatar upload section */}

          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <img
                src={selectedImg || authUser.profilePic || "/avatar.png"}
                alt="Profile"
                className="size-32 rounded-full object-cover border-4 "
              />
              <label
                htmlFor="avatar-upload"
                className={`
                  absolute bottom-0 right-0 
                  bg-base-content hover:scale-105
                  p-2 rounded-full cursor-pointer 
                  transition-all duration-200
                  ${isUpdatingProfile ? "animate-pulse pointer-events-none" : ""}
                `}
              >
                <Camera className="w-5 h-5 text-base-200" />
                <input
                  type="file"
                  id="avatar-upload"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={isUpdatingProfile}
                />
              </label>
            </div>
            <p className="text-sm">
              {isUpdatingProfile ? "Uploading..." : "Click the camera icon to update your photo"}
            </p>
          </div>

          <div className="space-y-6">
            <div className="space-y-1.5">
              <div className="text-sm flex items-center gap-2">
                <User className="w-4 h-4" />
                Full Name
              </div>
              <p className="px-4 py-2.5 bg-base-200 rounded-lg border">{authUser?.fullname}</p>
            </div>

            <div className="space-y-1.5">
              <div className="text-sm flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email Address
              </div>
              <p className="px-4 py-2.5 bg-base-200 rounded-lg border">{authUser?.email}</p>
            </div>

            {/* password section */}
            <div className="space-y-1.5">
              <div className="text-sm flex items-center gap-2">
                <Shield className="w-4 h-4" />
                Password
              </div> 
              <p className="px-4 py-2.5 bg-base-200 rounded-lg border">
                {showPassword ? password : "********"}
              </p>
              <Link to="/forgot-password">
                 <button className="btn">Change Password</button>
              </Link>
             
            </div>


          </div>        
          { /* account info section */}
          <div className="mt-6 bg-base-300 rounded-xl p-6">
            <h2 className="text-lg font-medium  mb-4">Account Information</h2>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between py-2 border-b border-zinc-700">
                <span>Member Since</span>
                <span>{authUser.createdAt?.split("T")[0]}</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span>Account Status</span>
                <div className="badge badge-success text-black">Active</div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
export default ProfilePage;