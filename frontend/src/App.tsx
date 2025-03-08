import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Home, Compass, Briefcase, Calendar, Tag, Menu, X, Facebook, Twitter, Instagram, Mail, Phone, MapPin, User } from 'lucide-react';
import { useState } from 'react';

// Pages
import HomePage from './pages/HomePage';
import DiscoveryPage from './pages/DiscoveryPage';
import JobsPage from './pages/JobsPage';
import EventsPage from './pages/EventsPage';
import DealsPage from './pages/DealsPage';
import { Footer } from './sections/Footer';
import { NavBar } from './sections/NavBar';
import LoginPage from './pages/LoginPage';
import { AuthProvider } from './contexts/AuthProvider';
import AdminPage from './pages/AdminPage';
import PrivateRoute from './pages/PrivateRoute';

function App() {

    const navItems = [
        {path: '/decouverte', name: 'Découverte', icon: <Compass className="w-5 h-5"/>},
        {path: '/emplois', name: 'Offres emplois', icon: <Briefcase className="w-5 h-5"/>},
        {path: '/evenements', name: 'Événements', icon: <Calendar className="w-5 h-5"/>},
        {path: '/bons-plans', name: 'Bon plans', icon: <Tag className="w-5 h-5"/>},
        {path: '/login', name: 'Connexion', icon: <User className="w-5 h-5"/>},
    ];

  return (
    <AuthProvider>
    <Router>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <NavBar navItems={navItems} />
        {/* Main Content */}
        <main className="flex-grow pt-20 px-4 md:pt-8 pb-8">
          <div className="max-w-7xl mx-auto">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/decouverte" element={<DiscoveryPage />} />
              <Route path="/emplois" element={<JobsPage />} />
              <Route path="/evenements" element={<EventsPage />} />
              <Route path="/bons-plans" element={<DealsPage />} />
              <Route path="/login" element={<LoginPage />} />
              {/* Route protégée, accessible uniquement si on est connecté */}
              <Route element={<PrivateRoute />}>
                <Route path="/admin" element={<AdminPage />} />
              </Route>
            </Routes>
          </div>
        </main>
        <Footer navItems={navItems}/>
      </div>
    </Router>
    </AuthProvider>

  );
}

export default App;