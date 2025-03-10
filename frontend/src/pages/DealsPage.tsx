import { Search, Tag, MapPin, ExternalLink } from 'lucide-react';
import { Deal, listDeals } from "../gen/openapi";
import { useEffect, useState, useMemo, useRef } from "react";

export function DealsPage() {
    const [deals, setDeals] = useState<Deal[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [showCategoryFilter, setShowCategoryFilter] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchDeals = async () => {
            try {
                setLoading(true);
                const { data } = await listDeals();
                setDeals(data ?? []);
            } catch (error) {
                setError('Erreur lors de la vérification de la santé du serveur');
                setDeals([]);
            } finally {
                setLoading(false);
            }
        };

        fetchDeals();
    }, []);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowCategoryFilter(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [dropdownRef]);

    const uniqueCategories = useMemo(() => {
        const categories = new Set<string>();
        deals.forEach(deal => {
            if (deal.category?.subCategory) {
                categories.add(deal.category.subCategory);
            }
        });
        return Array.from(categories);
    }, [deals]);

    const handleCategoryChange = (category: string) => {
        if (category === 'Tous') {
            setSelectedCategories(prev =>
                prev.length === uniqueCategories.length ? [] : uniqueCategories
            );
        } else {
            setSelectedCategories(prev =>
                prev.includes(category)
                    ? prev.filter(c => c !== category)
                    : [...prev, category]
            );
        }
    };

    const filteredDeals = useMemo(() => {
        return deals.filter(deal => {
            if (selectedCategories.length > 0 && deal.category?.subCategory) {
                return selectedCategories.includes(deal.category.subCategory);
            }
            return true;
        });
    }, [deals, selectedCategories]);

    if (loading) {
        return <div className="text-center text-gray-500 py-10">Chargement...</div>;
    }

    if (error) {
        return <div className="text-center text-red-500 py-10">{error}</div>;
    }

    return (
        <div className="py-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
                <h1 className="text-3xl font-bold">Bon plans</h1>

                <div className="mt-4 md:mt-0 flex flex-wrap gap-4">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Rechercher un bon plan..."
                            className="pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                        <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                    </div>

                    <div className="relative" ref={dropdownRef}>
                        <div
                            onClick={() => setShowCategoryFilter(!showCategoryFilter)}
                            className="px-4 py-2 border rounded-lg cursor-pointer"
                        >
                            Filtrer
                        </div>
                        {showCategoryFilter && (
                            <div className="absolute mt-2 right-0 p-4 bg-white border rounded-lg shadow-lg z-50 w-64">
                                <label className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={selectedCategories.length === uniqueCategories.length}
                                        onChange={() => handleCategoryChange('Tous')}
                                        className="mr-2"
                                    />
                                    Tous
                                </label>
                                {uniqueCategories.map((category, index) => (
                                    <label key={index} className="flex items-center">
                                        <input
                                            type="checkbox"
                                            checked={selectedCategories.includes(category)}
                                            onChange={() => handleCategoryChange(category)}
                                            className="mr-2"
                                        />
                                        {category}
                                    </label>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredDeals.map((deal) => (
                    <div key={deal.id} className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm mb-2">
                                    {deal.category?.subCategory}
                                </span>
                                <h2 className="text-xl font-semibold">{deal.title}</h2>
                                <p className="text-gray-600">{deal.company}</p>
                            </div>
                            <div className="flex items-center space-x-2">
                                {deal.old_price && (
                                    <span className="text-gray-500 text-sm line-through">
                                        {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(deal.old_price)}
                                    </span>
                                )}
                                <span className="text-2xl font-bold text-green-600">
                                    {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(deal.new_price)}
                                </span>
                            </div>
                        </div>

                        <p className="text-gray-600 mb-4">{deal.description}</p>

                        <div className="space-y-2 text-sm text-gray-500 mb-4">
                            <div className="flex items-center">
                                <Tag className="w-4 h-4 mr-2" />
                                {deal.date_end
                                    ? `Valable jusqu'au ${new Intl.DateTimeFormat('fr-FR', {
                                        day: '2-digit',
                                        month: '2-digit',
                                        year: 'numeric'
                                    }).format(new Date(deal.date_end))}`
                                    : "À durée indéterminée"}
                            </div>
                        </div>

                        <div className="border-t pt-4 mt-4">
                            <p className="text-sm text-gray-500">{deal.reserve}</p>
                        </div>

                        <button
                            onClick={() => window.open(deal.link, '_blank')}
                            className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center">
                            <span>Voir l'offre</span>
                            <ExternalLink className="w-4 h-4 ml-2" />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default DealsPage;