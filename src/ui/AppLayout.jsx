import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { IconMenu } from "./icons";

export default function AppLayout() {
  const [isOpen, setIsOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const check = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) setIsOpen(false);
    };
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {isMobile && !isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed top-3 left-3 z-30 rounded-lg bg-white p-2 shadow-md border border-gray-200 text-gray-600 hover:bg-gray-100 transition-colors"
        >
          <IconMenu size={22} />
        </button>
      )}
      <Sidebar isOpen={isOpen} onToggle={() => setIsOpen(!isOpen)} isMobile={isMobile} />
      <main className={`flex-1 min-w-0 transition-all duration-300 ${isMobile ? "px-4" : "px-8"} py-6 ${isMobile && !isOpen ? "pt-16" : ""}`}>
        <Header />
        <div className="mt-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
