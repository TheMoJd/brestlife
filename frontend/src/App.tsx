import {BrowserRouter as Router, Routes, Route, Link} from 'react-router-dom';
import {Home, Compass, Briefcase, Calendar, Tag, Menu, X} from 'lucide-react';
import {useState} from 'react';

// Pages
import HomePage from './pages/HomePage';
import DiscoveryPage from './pages/DiscoveryPage';
import JobsPage from './pages/JobsPage';
import EventsPage from './pages/EventsPage';
import DealsPage from './pages/DealsPage';
import HealthPage from "./pages/HealthPage.tsx";

function App() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const navItems = [
        {path: '/', name: 'Accueil', icon: <Home className="w-5 h-5"/>},
        {path: '/decouverte', name: 'Découverte', icon: <Compass className="w-5 h-5"/>},
        {path: '/emplois', name: 'Offres emplois', icon: <Briefcase className="w-5 h-5"/>},
        {path: '/evenements', name: 'Événements', icon: <Calendar className="w-5 h-5"/>},
        {path: '/bons-plans', name: 'Bon plans', icon: <Tag className="w-5 h-5"/>},
    ];

    return (
        <Router>
            <div className="min-h-screen bg-gray-50">
                {/* Mobile Menu Button */}
                <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="fixed top-4 right-4 z-50 p-2 rounded-lg bg-white shadow-lg md:hidden"
                >
                    {isMenuOpen ? <X className="w-6 h-6"/> : <Menu className="w-6 h-6"/>}
                </button>

                {/* Navigation */}
                <nav className={`
          fixed left-0 top-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-200 ease-in-out z-40
          ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0 md:static md:h-auto md:w-full
        `}>
                    <div className="p-6 md:max-w-7xl md:mx-auto md:flex md:justify-between md:items-center">
                        <div className="flex items-center space-x-2 mb-8 md:mb-0">
                            <Compass className="w-8 h-8 text-blue-600"/>
                            <span className="text-xl font-bold">BrestLife</span>
                        </div>
                        <ul className="space-y-4 md:space-y-0 md:flex md:space-x-8">
                            {navItems.map((item) => (
                                <li key={item.path}>
                                    <Link
                                        to={item.path}
                                        className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        {item.icon}
                                        <span>{item.name}</span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </nav>

                {/* Main Content */}
                <main className="pt-20 px-4 md:pt-8 pb-8">
                    <div className="max-w-7xl mx-auto">
                        <Routes>
                            <Route path="/" element={<HomePage/>}/>
                            <Route path="/decouverte" element={<DiscoveryPage/>}/>
                            <Route path="/emplois" element={<JobsPage/>}/>
                            <Route path="/evenements" element={<EventsPage/>}/>
                            <Route path="/bons-plans" element={<DealsPage/>}/>
                            <Route path="/health" element={<HealthPage/>}/>
                        </Routes>
                    </div>
                </main>
            </div>
        </Router>
    );
}

export default App;