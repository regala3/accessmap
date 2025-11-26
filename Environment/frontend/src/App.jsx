import { Routes, Route, Navigate} from "react-router-dom";
import { useAuthStore } from "./store/useAuthStore";
import { useThemeStore } from "./store/useThemeStore";

// page and navbar imports
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import SettingsPage from "./pages/SettingsPage";
import VendorLoginPage from "./pages/VendorLoginPage";
import VendorSignupPage from "./pages/VendorSignupPage";
import VendorRegisterStallPage from "./pages/VendorRegisterStallPage";
import VendorStallPage from "./pages/VendorStallPage";
import VendorHomePage from "./pages/VendorHomePage";
import ProfilePage from "./pages/ProfilePage";
import SitePlanPage from "./pages/SitePlanPage";
import ChatPage from "./pages/ChatPage";
import CreateEventPage from "./pages/CreateEventPage";
import PreviewPage from "./pages/PreviewPage";
import PublishedPage from "./pages/PublishedPage";
import { useEffect } from "react";
import { Loader } from "lucide-react";
import { Toaster } from "react-hot-toast";
import ForgotPassPage from "./pages/ForgotPassPage";
import { ResetPassPage } from "./pages/ResetPassPage";
import ChangePassPage from "./pages/ChangePassPage";
import EventDashboardPage from "./pages/EventDashboardPage";
import StallsPage from "./pages/StallsPage";
import CheckPaths from "./components/CheckPaths";
import { GlobalProvider } from "./components/GlobalContext";

const App = () => {
  const { authUser, checkAuth, isCheckingAuth, onlineUsers} = useAuthStore();
  const { theme } = useThemeStore();

  console.log({ onlineUsers });

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  console.log({ authUser });
  if (isCheckingAuth && !authUser)
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );

  return (
    <GlobalProvider>
      <div data-theme={theme} className="bg-transparent">
        <CheckPaths className="bg-transparent"/>
        <Routes>
          <Route
            path="/"
            element={authUser ? <HomePage /> : <Navigate to="/login" />}
          />
          <Route
            path="/signup"
            element={!authUser ? <SignUpPage /> : <Navigate to="/" />}
          />
          <Route
            path="/login"
            element={!authUser ? <LoginPage /> : <Navigate to="/" />}
          />
          <Route path="/settings" element={<SettingsPage />} />
          <Route
            path="/profile"
            element={authUser ? <ProfilePage /> : <Navigate to="/login" />}
          />

          <Route
            path="/event/:id/dashboard/site-plan"
            element={authUser ? <SitePlanPage /> : <Navigate to="/login" />}
          />

          <Route
            path="/event/:id/dashboard"
            element={authUser ? <EventDashboardPage /> : <Navigate to="/login" />}
          />

          <Route
            path="/event/:id/dashboard/preview"
            element={authUser ? <PreviewPage /> : <Navigate to="/login" />}
          />

          {/* add a non auth route for published version of the map? This didn't work lol*/}
          <Route
            path="/event/:id/public/map"
            element={<PreviewPage />}
          /> 

          <Route
            path="/event/:id/viewmap"
            element={authUser ? <PublishedPage /> : <Navigate to="/login" />}
          />

          <Route
            path="/event/create-event"
            element={authUser ? <CreateEventPage /> : <Navigate to="/login" />}
          />

          <Route
            path="/event/:id/dashboard/stalls"
            element={authUser ? <StallsPage /> : <Navigate to="/login" />}
          />

        <Route path="/forgot-password" element={<ForgotPassPage />}></Route>
        <Route path="/change-password" element={<ChangePassPage />}></Route>
        <Route path="/reset-password/:token" element={<ResetPassPage />}></Route>
        
        {/* Vendors only  */}
        <Route 
          path="/vendor/:stallId/signup" 
          element={<VendorSignupPage />}
        />{/* ^^^ Email link signup ^^^ */}
        <Route 
          path="/vendor/:stallId/login" 
          element={<VendorLoginPage/>}
        />{/* ^^^ Email link login ^^^ */}
        <Route
          path="/vendor/login"
          element={<VendorLoginPage/>}
        /> {/* ^^^ General Vendor login ^^^ */}
        <Route
          path="/vendor/register-stall/:stallId"
          element= {authUser ? <VendorRegisterStallPage/> : <Navigate to= "/vendor/login" />}
        />
        <Route
          path="/vendor/:stallId"
          element= {authUser ? <VendorStallPage/> : <Navigate to= "/vendor/login" />}
        />
        <Route
          path="/vendor"
          element= {authUser ? <VendorHomePage/> : <Navigate to= "/vendor/login" />}
        />
        <Route
          path="/chat"
          element={authUser ? <ChatPage /> : <Navigate to="/login" />}
        />
      </Routes>

        <Toaster />
      </div>
    </GlobalProvider>
  );
};

export default App;
