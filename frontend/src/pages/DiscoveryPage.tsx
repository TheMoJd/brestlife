import { useEffect, useState, useMemo } from 'react';
import { Search, MapPin } from 'lucide-react';
import { Place } from '../gen/openapi';
import { listPlaces } from '../gen/openapi';

export function DiscoveryPage() {
  const [filters, setFilters] = useState({
    price: ''
  });

  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Récupération des lieux
  useEffect(() => {
    async function loadPlaces() {
      try {
        setLoading(true);
        const response = await listPlaces();
        if (response.data) {
          setPlaces(response.data);
        } else {
          setError('Échec du chargement des lieux.');
        }
      } catch (err) {
        setError('Échec du chargement des lieux.');
      } finally {
        setLoading(false);
      }
    }

    loadPlaces();
  }, []);

  // Filtrage des lieux en fonction de la recherche
  const filteredPlaces = useMemo(() => {
    if (!searchQuery) return places;
    return places.filter((place) =>
      place.name?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [places, searchQuery]);

  if (loading) {
    return <div className="text-center text-gray-500 py-10">Chargement...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 py-10">{error}</div>;
  }

  // const filteredPlaces = places.filter(place => {
  //   if (filters.type && place.type !== filters.type) return false;
  //   if (filters.price && place.price !== filters.price) return false;
  //   return true;
  // });

  return (
    <div className="py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <h1 className="text-3xl font-bold">Découverte</h1>

        <div className="mt-4 md:mt-0 flex flex-wrap gap-4">
          {/* Barre de recherche */}
          <div className="relative w-full md:w-auto">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher un lieu..."
              className="pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full"
            />
            <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
          </div>
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

      {/* Affichage des lieux */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPlaces.length > 0 ? (
          filteredPlaces.map((place) => (
            <div key={place.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <img
                src={place.imageUrl || 'https://via.placeholder.com/300'}
                alt={place.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h2 className="text-xl font-semibold">{place.name}</h2>
                </div>
                <p className="text-gray-600 mb-4">{place.description}</p>
                <div className="flex items-center text-gray-500 mb-4">
                  <MapPin className="w-4 h-4 mr-2" />
                  <span className="text-sm">{place.address || 'Lieu inconnu'}</span>
                </div>
                <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  En savoir plus
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 col-span-full">Aucun lieu trouvé.</p>
        )}
      </div>
    </div>
  );
}

export default DiscoveryPage;
