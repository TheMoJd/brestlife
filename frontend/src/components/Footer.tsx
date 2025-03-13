import { Link } from 'react-router-dom';
import { Compass, MapPin, Phone, Mail, Facebook, Twitter, Instagram } from 'lucide-react';

interface FooterProps {
    navItems: { path: string; name: string }[];
}


export default function Footer({ navItems } : FooterProps) {
    return (
        <>
            {/* Footer */}
            <footer className="bg-gray-900 text-gray-300">
                <div className="max-w-7xl mx-auto px-4 py-12">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        {/* About Section */}
                        <div className="space-y-4">
                            <div className="flex items-center space-x-2">
                                <Compass className="w-8 h-8 text-blue-400" />
                                <span className="text-xl font-bold text-white">BrestLife</span>
                            </div>
                            <p className="text-sm">
                                Votre guide complet pour vivre et étudier à Brest. Découvrez la ville, trouvez des opportunités et restez connecté à la communauté étudiante.
                            </p>
                        </div>

                        {/* Quick Links */}
                        <div>
                            <h3 className="text-white font-semibold mb-4">Liens rapides</h3>
                            <ul className="space-y-2">
                                {navItems.map((item) => (
                                    <li key={item.path}>
                                        <Link to={item.path} className="text-sm hover:text-blue-400 transition-colors">
                                            {item.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Contact Info */}
                        <div>
                            <h3 className="text-white font-semibold mb-4">Contact</h3>
                            <ul className="space-y-2">
                                <li className="flex items-center space-x-2 text-sm">
                                    <MapPin className="w-4 h-4" />
                                    <span>20 Avenue Le Gorgeu, 29200 Brest</span>
                                </li>
                                <li className="flex items-center space-x-2 text-sm">
                                    <Phone className="w-4 h-4" />
                                    <span>02 98 01 60 00</span>
                                </li>
                                <li className="flex items-center space-x-2 text-sm">
                                    <Mail className="w-4 h-4" />
                                    <span>contact@brestlife.fr</span>
                                </li>
                            </ul>
                        </div>

                        {/* Social Media & Newsletter */}
                        <div>
                            <h3 className="text-white font-semibold mb-4">Suivez-nous</h3>
                            <div className="flex space-x-4 mb-6">
                                <a href="#" className="hover:text-blue-400 transition-colors">
                                    <Facebook className="w-6 h-6" />
                                </a>
                                <a href="#" className="hover:text-blue-400 transition-colors">
                                    <Twitter className="w-6 h-6" />
                                </a>
                                <a href="#" className="hover:text-blue-400 transition-colors">
                                    <Instagram className="w-6 h-6" />
                                </a>
                            </div>
                            <div>
                                <h4 className="text-white text-sm font-semibold mb-2">Newsletter</h4>
                                <div className="flex">
                                    <input
                                        type="email"
                                        placeholder="Votre email"
                                        className="px-3 py-2 bg-gray-800 text-white rounded-l-lg focus:outline-none focus:ring-1 focus:ring-blue-400 text-sm flex-1"
                                    />
                                    <button className="px-4 py-2 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700 transition-colors text-sm">
                                        S'abonner
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Bar */}
                    <div className="border-t border-gray-800 mt-12 pt-8 text-sm text-center">
                        <p>&copy; {new Date().getFullYear()} BrestLife. Tous droits réservés.</p>
                        <div className="mt-2 space-x-4">
                            <a href="#" className="hover:text-blue-400 transition-colors">Mentions légales</a>
                            <a href="#" className="hover:text-blue-400 transition-colors">Politique de confidentialité</a>
                            <a href="#" className="hover:text-blue-400 transition-colors">Conditions d'utilisation</a>
                        </div>
                    </div>
                </div>
            </footer>
        </>
    );
}