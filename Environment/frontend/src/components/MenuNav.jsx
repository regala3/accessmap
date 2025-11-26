import { LogOut, MapPin, MessageCircle, Settings, UserRound } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
const MenuNav = () => {
  const {logout, authUser} = useAuthStore();

  return (
    <div >
      <ul className="menu menu-horizontal rounded-box mt-13">
        <li>
          <a className="tooltip z-50" data-tip="Chat" href="/chat">
            <MessageCircle/>
          </a>
        </li>
        <li>
          <a className="tooltip z-50" data-tip="My Events" href="/">
            <MapPin/>
          </a>
        </li>
        <li>
          <a className="tooltip z-50" data-tip="Profile" href="/profile">
            <UserRound/>
          </a>
        </li>
        <li>
          <a className="tooltip z-50" data-tip="Settings" href="/settings">
            <Settings/>
          </a>
        </li>
         <li>
          <a className="tooltip z-50" data-tip="Logout">
          {authUser && (
                <button className="flex gap-2 items-center" onClick={logout}>
                  <LogOut/>
                </button>
              )}
          </a>
        </li>
      </ul>
    </div>
  );
};

export default MenuNav;
