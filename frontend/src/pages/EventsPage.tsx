import {Calendar as CalendarIcon, MapPin, Clock, Tag} from 'lucide-react';
import {useState} from "react";

type Event = {
    id: number;
    title: string;
    date: string;
    time: string;
    location: string;
    price: string;
    category: string;
    description: string;
    image: string;
};

const events: Event[] = [
    {
        id: 1,
        title: 'Festival de la Mer',
        date: '2024-07-15',
        time: '10:00 - 23:00',
        location: 'Port de Brest',
        price: 'Gratuit',
        category: 'Festival',
        description: 'Grand festival maritime avec concerts, expositions et animations.',
        image: 'https://images.unsplash.com/photo-1533230387656-9748ba6c4984?auto=format&fit=crop&q=80'
    },
    {
        id: 2,
        title: 'Conférence Tech',
        date: '2024-06-20',
        time: '14:00 - 18:00',
        location: 'UBO',
        price: '5€',
        category: 'Conférence',
        description: 'Conférence sur les dernières innovations technologiques.',
        image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80'
    },
    {
        id: 3,
        title: 'Concert Étudiant',
        date: '2024-05-30',
        time: '20:00 - 00:00',
        location: 'La Carène',
        price: '10€',
        category: 'Concert',
        description: 'Soirée musicale avec des groupes locaux.',
        image: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&q=80'
    }
];

export function EventsPage() {
    const [filters, setFilters] = useState({
        category: '',
        price: ''
    });

    const filteredEvents = events.filter(event => {
        if (filters.category && event.category !== filters.category) return false;
        if (filters.price === 'gratuit' && event.price !== 'Gratuit') return false;
        if (filters.price === 'payant' && event.price === 'Gratuit') return false;
        return true;
    });

    return (
        <div className="py-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
                <h1 className="text-3xl font-bold">Événements</h1>

                {/* Filters */}
                <div className="mt-4 md:mt-0 flex flex-wrap gap-4">
                    <select
                        value={filters.category}
                        onChange={(e) => setFilters(f => ({...f, category: e.target.value}))}
                        className="px-4 py-2 border rounded-lg"
                    >
                        <option value="">Toutes les catégories</option>
                        <option value="Festival">Festival</option>
                        <option value="Conférence">Conférence</option>
                        <option value="Concert">Concert</option>
                    </select>

                    <select
                        value={filters.price}
                        onChange={(e) => setFilters(f => ({...f, price: e.target.value}))}
                        className="px-4 py-2 border rounded-lg"
                    >
                        <option value="">Tous les prix</option>
                        <option value="gratuit">Gratuit</option>
                        <option value="payant">Payant</option>
                    </select>
                </div>
            </div>

            {/* Events Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredEvents.map((event) => (
                    <div key={event.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                        <div className="relative h-48">
                            <img
                                src={event.image}
                                alt={event.title}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute top-4 right-4">
                <span className="px-3 py-1 bg-white rounded-full text-sm font-medium">
                  {event.price}
                </span>
                            </div>
                        </div>

                        <div className="p-6">
                            <div className="flex items-center text-sm text-gray-500 mb-2">
                                <Tag className="w-4 h-4 mr-1"/>
                                {event.category}
                            </div>

                            <h2 className="text-xl font-semibold mb-4">{event.title}</h2>

                            <div className="space-y-2 mb-4">
                                <div className="flex items-center text-gray-600">
                                    <CalendarIcon className="w-4 h-4 mr-2"/>
                                    <span>{new Date(event.date).toLocaleDateString('fr-FR', {
                                        day: 'numeric',
                                        month: 'long',
                                        year: 'numeric'
                                    })}</span>
                                </div>

                                <div className="flex items-center text-gray-600">
                                    <Clock className="w-4 h-4 mr-2"/>
                                    <span>{event.time}</span>
                                </div>

                                <div className="flex items-center text-gray-600">
                                    <MapPin className="w-4 h-4 mr-2"/>
                                    <span>{event.location}</span>
                                </div>
                            </div>

                            <p className="text-gray-600 mb-4">{event.description}</p>

                            <button
                                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors">
                                S'inscrire
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default EventsPage;