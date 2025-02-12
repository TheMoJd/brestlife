import React, { useState } from 'react';
import { Search, MapPin, Euro, Filter } from 'lucide-react';

type Place = {
  id: number;
  name: string;
  type: string;
  description: string;
  image: string;
  price: 'gratuit' | 'payant';
  location: string;
};

const places: Place[] = [
  {
    id: 1,
    name: 'Océanopolis',
    type: 'Culture',
    description: 'Centre de culture scientifique dédié aux océans avec aquariums et expositions.',
    image: 'https://images.unsplash.com/photo-1679678691006-0ad24fecb769?auto=format&fit=crop&q=80',
    price: 'payant',
    location: 'Port de Plaisance du Moulin Blanc'
  },
  {
    id: 2,
    name: 'Jardin des Explorateurs',
    type: 'Nature',
    description: 'Jardin botanique avec vue panoramique sur la rade de Brest.',
    image: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&q=80',
    price: 'gratuit',
    location: 'Recouvrance'
  },
  {
    id: 3,
    name: 'Musée de la Marine',
    type: 'Culture',
    description: 'Musée naval situé dans le château de Brest.',
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&q=80',
    price: 'payant',
    location: 'Château de Brest'
  }
];

export function DiscoveryPage() {
  const [filters, setFilters] = useState({
    type: '',
    price: ''
  });

  const filteredPlaces = places.filter(place => {
    if (filters.type && place.type !== filters.type) return false;
    if (filters.price && place.price !== filters.price) return false;
    return true;
  });

  return (
    <div className="py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <h1 className="text-3xl font-bold">Découverte</h1>
        
        <div className="mt-4 md:mt-0 flex flex-wrap gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Rechercher un lieu..."
              className="pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
          </div>
          
          <select
            value={filters.type}
            onChange={(e) => setFilters(f => ({ ...f, type: e.target.value }))}
            className="px-4 py-2 border rounded-lg"
          >
            <option value="">Tous les types</option>
            <option value="Culture">Culture</option>
            <option value="Nature">Nature</option>
          </select>
          
          <select
            value={filters.price}
            onChange={(e) => setFilters(f => ({ ...f, price: e.target.value }))}
            className="px-4 py-2 border rounded-lg"
          >
            <option value="">Tous les prix</option>
            <option value="gratuit">Gratuit</option>
            <option value="payant">Payant</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPlaces.map((place) => (
          <div key={place.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <img
              src={place.image}
              alt={place.name}
              className="w-full h-48 object-cover"
            />
            <div className="p-6">
              <div className="flex justify-between items-start mb-2">
                <h2 className="text-xl font-semibold">{place.name}</h2>
                <span className={`px-2 py-1 rounded text-sm ${
                  place.price === 'gratuit' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                }`}>
                  {place.price}
                </span>
              </div>
              <p className="text-gray-600 mb-4">{place.description}</p>
              <div className="flex items-center text-gray-500 mb-4">
                <MapPin className="w-4 h-4 mr-2" />
                <span className="text-sm">{place.location}</span>
              </div>
              <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors">
                En savoir plus
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default DiscoveryPage;