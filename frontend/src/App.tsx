import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import {
  Home, Compass, Briefcase, Calendar, Tag, User,
} from "lucide-react";

// Pages principales (Front)
import HomePage from "./pages/HomePage";
import DiscoveryPage from "./pages/DiscoveryPage";
import JobsPage from "./pages/JobsPage";
import EventsPage from "./pages/EventsPage";
import DealsPage from "./pages/DealsPage";
import LoginPage from "./pages/LoginPage";

// Layouts / sections
import  Footer from "./components/Footer";
import  NavBar  from "./components/NavBar";

// Auth + Admin
import { AuthProvider, useAuth } from "./contexts/AuthProvider";
import PrivateRoute from "./pages/PrivateRoute";
import AdminLayout from "./components/AdminLayout";
import AdminPage from "./pages/admin/AdminPage"; // page d'accueil admin, par ex

function App() {
  const {isAdmin} = useAuth();
  
  // Items de la navigation principale (header)
  const navItemsUser = [
    { path: "/", name: "Accueil", icon: <Home className="w-5 h-5" /> },
    { path: "/decouverte", name: "Découverte", icon: <Compass className="w-5 h-5" /> },
    { path: "/emplois", name: "Offres emplois", icon: <Briefcase className="w-5 h-5" /> },
    { path: "/evenements", name: "Événements", icon: <Calendar className="w-5 h-5" /> },
    { path: "/bons-plans", name: "Bons plans", icon: <Tag className="w-5 h-5" /> },
    ...(!isAdmin() ? [{ path: "/login", name: "Connexion", icon: <User className="w-5 h-5" /> }] : [{path: "/admin", name: "Mon espace Admin", icon: <User className="w-5 h-5" />}]), 
    
  ];
  console.log(isAdmin());
  const footerLinks = [
    { path: "/", name: "Accueil" },
    { path: "/decouverte", name: "Découverte" },
    { path: "/emplois", name: "Offres emplois" },
    { path: "/evenements", name: "Événements" },
    { path: "/bons-plans", name: "Bons plans" },
  ];

  return (
      <Router>
        <div className="min-h-screen bg-gray-50 flex flex-col">
          {/* Barre de navigation haute */}
          {<NavBar navItems={navItemsUser} />}

          {/* Contenu principal */}
          <main className="flex-grow pt-16 md:pt-8 pb-8">
            <div className="max-w-7xl mx-auto px-4">
              <Routes>
                {/* Routes publiques */}
                <Route path="/" element={<HomePage />} />
                <Route path="/decouverte" element={<DiscoveryPage />} />
                <Route path="/emplois" element={<JobsPage />} />
                <Route path="/evenements" element={<EventsPage />} />
                <Route path="/bons-plans" element={<DealsPage />} />
                <Route path="/login" element={<LoginPage />} />

                {/* Section Admin (protégée) */}
                <Route element={<PrivateRoute requiredRole="ADMIN" />}>
                  {/* Layout Admin : sidebar, header admin, etc. */}
                  <Route element={<AdminLayout />}>
                    {/* Page d'accueil de l'admin */}
                    <Route path="/admin" element={<AdminPage />} />

                    {/* Autres pages Admin */}
                    <Route path="/admin/places" element={<DiscoveryPage />} />
                    <Route path="/admin/jobs" element={<JobsPage />} />
                    <Route path="/admin/events" element={<EventsPage />} />
                    <Route path="/admin/deals" element={<DealsPage />} />
                  </Route>
                </Route>

                {/* 404 */}
                <Route path="*" element={<h1>404 - Not Found</h1>} />
              </Routes>
            </div>
          </main>

          {/* Footer */}
          <Footer navItems={footerLinks} />
        </div>
      </Router>
  );
}

export default App;
