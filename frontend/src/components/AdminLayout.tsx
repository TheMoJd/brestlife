// src/components/AdminLayout.tsx
import { PropsWithChildren, useState } from "react";
import { Link, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/AuthProvider";
import {
  Menu,
  LogOut,
  User as UserIcon,
  MapPin,
  Briefcase,
  CalendarDays,
  ShoppingBag,
} from "lucide-react"; // icônes plus modernes

export default function AdminLayout() {
  const { logout, user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigationLinks = [
    { to: "/admin/decouverte", label: "Lieux", icon: <MapPin size={18} /> },
    { to: "/admin/emplois", label: "Jobs", icon: <Briefcase size={18} /> },
    { to: "/admin/evenements", label: "Événements", icon: <CalendarDays size={18} /> },
    { to: "/admin/bons-plans", label: "Deals", icon: <ShoppingBag size={18} /> },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* SIDEBAR (desktop) */}
      <aside
        className={`hidden md:flex md:flex-col md:w-64 bg-white border-r border-gray-200`}
      >
        <div className="p-4 flex items-center justify-center border-b">
          <h1 className="text-xl font-bold">BrestLife Admin</h1>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {navigationLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-200 transition-colors"
            >
              {link.icon}
              <span>{link.label}</span>
            </Link>
          ))}
        </nav>
      </aside>

      {/* SIDEBAR (mobile) */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-white border-r border-gray-200 z-50 transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform md:hidden`}
      >
        <div className="p-4 flex items-center justify-between border-b">
          <h1 className="text-xl font-bold">BrestLife Admin</h1>
          <button
            onClick={() => setSidebarOpen(false)}
            className="text-gray-600 hover:text-gray-900"
          >
            X
          </button>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {navigationLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setSidebarOpen(false)}
              className="flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-200 transition-colors"
            >
              {link.icon}
              <span>{link.label}</span>
            </Link>
          ))}
        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col">
        {/* HEADER */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4">
          <div className="flex items-center space-x-2 md:hidden">
            <button
              onClick={() => setSidebarOpen(true)}
              className="text-gray-600 hover:text-gray-900"
            >
              <Menu size={24} />
            </button>
          </div>
          <div />
          <div className="flex items-center space-x-2">
            <p className="text-gray-600 hidden sm:block">
              Connecté en tant que <strong>{user?.name}</strong>
            </p>
            <button
              onClick={logout}
              className="flex items-center bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition-colors"
            >
              <LogOut size={16} className="mr-2" />
              Déconnexion
            </button>
          </div>
        </header>

        {/* PAGE CONTENT */}
        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
