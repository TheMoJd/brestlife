import { MapPin, Search } from 'lucide-react';
import { useState, useEffect, useMemo, useRef } from 'react';
import { Event } from '../gen/openapi';
import { listEvents } from '../gen/openapi';
import { useSearchFilter } from "../hooks/useSearchFilter.ts";

export function EventsPage() {
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [filters, setFilters] = useState({ category: '', price: [0, 100] });
    const [showPriceFilter, setShowPriceFilter] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        async function fetchEvents() {
            try {
                setLoading(true);
                const response = await listEvents();
                if (response.data) {
                    setEvents(response.data);
                } else {
                    setError('Response data is undefined');
                }
            } catch (error) {
                setError('Échec du chargement des événements');
            } finally {
                setLoading(false);
            }
        }
        fetchEvents();
    }, []);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowPriceFilter(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [dropdownRef]);

    const { filteredItems: searchedEvents, searchQuery, setSearchQuery } = useSearchFilter(events, ['title', 'description', 'location']);

    const filteredEvents = useMemo(() => {
        return searchedEvents.filter((event) => {
            if (filters.category && event.category !== filters.category) return false;
            if (event.price === undefined || event.price < filters.price[0] || event.price > filters.price[1]) return false;
            return true;
        });
    }, [searchedEvents, filters]);

    if (loading) {
        return <div className="text-center text-gray-500 py-10">Chargement...</div>;
    }

    if (error) {
        return <div className="text-center text-red-500 py-10">{error}</div>;
    }

    return (
        <div className="py-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
                <h1 className="text-3xl font-bold">Événements</h1>

                <div className="mt-4 md:mt-0 flex flex-wrap gap-4">
                    <div className="relative w-full md:w-auto">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Rechercher un évenement..."
                            className="pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full"
                        />
                        <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                    </div>

                    <div className="relative" ref={dropdownRef}>
                        <div
                            onClick={() => setShowPriceFilter(!showPriceFilter)}
                            className="px-4 py-2 border rounded-lg cursor-pointer"
                        >
                            Filtrer le prix
                        </div>
                        {showPriceFilter && (
                            <div className="absolute mt-2 right-0 p-4 bg-white border rounded-lg shadow-lg z-50 w-64">
                                <label className="block mb-2">Prix: {filters.price[0]}€ - {filters.price[1]}€</label>
                                <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    value={filters.price[1]}
                                    onChange={(e) => setFilters(f => ({ ...f, price: [0, parseInt(e.target.value)] }))}
                                    className="w-full mb-2"
                                />
                                <div className="flex gap-2">
                                    <input
                                        type="number"
                                        min="0"
                                        max="100"
                                        value={filters.price[0]}
                                        onChange={(e) => setFilters(f => ({ ...f, price: [parseInt(e.target.value), f.price[1]] }))}
                                        className="w-full px-2 py-1 border rounded-lg"
                                    />
                                    <input
                                        type="number"
                                        min="0"
                                        max="100"
                                        value={filters.price[1]}
                                        onChange={(e) => setFilters(f => ({ ...f, price: [f.price[0], parseInt(e.target.value)] }))}
                                        className="w-full px-2 py-1 border rounded-lg"
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredEvents.length > 0 ? (
                    filteredEvents.map((event) => (
                        <div key={event.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                            <img
                                src={event.imageUrl || 'https://via.placeholder.com/300'}
                                alt={event.title}
                                className="w-full h-48 object-cover"
                            />
                            <div className="p-6">
                                <div className="flex justify-between items-start mb-2">
                                    <h2 className="text-xl font-semibold">{event.title}</h2>
                                    <span
                                        className={`px-2 py-1 rounded text-sm ${
                                            event.price && event.price > 0 ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                                        }`}
                                    >
                                        {event.price && event.price > 0 ? `${event.price}€` : 'Gratuit'}
                                    </span>
                                </div>
                                <p className="text-gray-600 mb-4">{event.description}</p>
                                <div className="flex items-center text-gray-500 mb-4">
                                    <MapPin className="w-4 h-4 mr-2" />
                                    <span className="text-sm">{event.location || 'évènement inconnu'}</span>
                                </div>
                                <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors">
                                    En savoir plus
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-center text-gray-500 col-span-full">Aucun évènement trouvé.</p>
                )}
            </div>
        </div>
    );
}

export default EventsPage;