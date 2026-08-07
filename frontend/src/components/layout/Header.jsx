import React, { useState } from "react";
import { Menu, Bell, User } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import Sidebar from "../layout/Sidebar";

const Header = () => {
  const { user } = useAuth();

  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Sidebar
        isSidebarOpen={isOpen}
        toggleSidebar={() => setIsOpen(!isOpen)}
      />

      <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-white px-4">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden"
        >
          <Menu size={24} />
        </button>

        <div className="ml-auto flex items-center gap-6">
          <Bell size={22} />

          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500 text-white">
              <User size={20} />
            </div>

            <div>
              <p>{user?.username}</p>
              <p className="text-xs">{user?.email}</p>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;