import { Link } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { LogOut, MapPin, Settings, User, MessageSquareMore, Sun, Moon } from "lucide-react";
import { useThemeStore } from "../store/useThemeStore";
import { THEMES } from "../constants";
import { useEffect } from "react";

const Navbar = () => {
  const { logout, authUser } = useAuthStore();
  const {theme, setTheme} = useThemeStore();

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);
  
  return (
    <header
      className="bg-base-100 borderb border-base-300 fixed w-full top-0 z-40 
      backdrop-blur-lg"
    >
      <div className="container mx-auto px-4 h-16">
        <div className="flex items-center justify-between h-full">
          <div className="flex items-center gap-8">
            {/* left side*/}
            <Link
              to={authUser?.role === "Vendor" ? "/vendor" : "/"}
              className="flex items-center gap-2.5 hover:opacity-80 transition-all"
            >
              <div className="size-9 rounded-lg bg-primary/10 flex items-center justify-center">
                <img
                  src="/logo3t.png" alt="a tent with a map in inside"
                ></img>
              </div>
              <div>
                <h1 className="text-lg font-bold">AccessMap</h1>
                <p className="text-md text-base-content/70"> {authUser?.role}</p>
              </div>
            </Link>
          </div>

          {/* right side */}
          <div className="flex items-center gap-2">

            <>
              {authUser ? (
                <>
                  <Link to={"/profile"} className="btn btn-sm gap-2">
                    <User className="size-5" />
                    <span className="hidden md:inline">Profile</span>
                  </Link>

                  <Link 
                    to={authUser?.role === "Coordinator" ? "/" : "/vendor"}
                    className={`btn btn-sm gap-2 transition-colors`} >
                    <MapPin className="w-4 h-4" />
                    <span className="hidden md:inline">My Events</span>
                  </Link>

                  <Link to={'/chat'} className={`btn btn-sm gap-2 transition-colors`}>
                    <MessageSquareMore className="w-4 h-4" />
                    <span className="hidden md:inline">Chat</span>
                  </Link>
                
                  {/* <Link to={"/settings"} className="btn btn-sm gap-2 transition-colors">
                    <Settings className="w-4 h-4" />
                    <span className="hidden sm:inline">Settings</span>
                  </Link> */}
                  
                  <div className="flex gap-2">
                    <button className="btn btn-sm transition-colors" 
                      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>

                      <div className="swap swap-rotate relative w-5 h-5 flex items-center justify-center">
                        <input
                          type="checkbox"
                          checked={theme === "dark"}
                          readOnly
                          className="hidden"
                        />

                        <Sun className="swap-on size-5 absolute" />
                        <Moon className="swap-off size-5 absolute" />
                      </div>

                      <span className="hidden md:inline">
                        {theme === "dark" ? "Light Mode" : "Dark Mode"}
                      </span>
                    </button>

                    <button className="btn btn-sm transition-colors" onClick={logout}>
                      <LogOut className="size-5" />
                      <span className="hidden md:inline">Logout</span>
                    </button>

                  </div>
                </>
              ) : (
                <button className="btn btn-sm transition-colors" 
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>

                  <div className="swap swap-rotate relative w-5 h-5 flex items-center justify-center">
                    <input
                      type="checkbox"
                      checked={theme === "dark"}
                      readOnly
                      className="hidden"
                    />

                    <Sun className="swap-on size-5 absolute" />
                    <Moon className="swap-off size-5 absolute" />
                  </div>

                  <span className="hidden md:inline">
                    {theme === "dark" ? "Light Mode" : "Dark Mode"}
                  </span>
                </button>
              )}
            </>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
