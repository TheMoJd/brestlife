import { useEffect, useState, useMemo } from 'react';
import { Search, MapPin } from 'lucide-react';
import { Place } from '../gen/openapi';
import { listPlaces } from '../gen/openapi';
import { useSearchFilter } from '../hooks/useSearchFilter';

export function DiscoveryPage() {
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [filters, setFilters] = useState({ price: '' });

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

  // Utilisation du hook de recherche (recherche par nom)
  const { filteredItems: searchedPlaces, searchQuery, setSearchQuery } = useSearchFilter(places, ['name']);

  // Filtrage par prix
  const filteredPlaces = useMemo(() => {
    return searchedPlaces.filter((place) => {
      if (filters.price === '') return true;
      if (filters.price === 'gratuit' && (!place.price || place.price === 0)) return true;
      if (filters.price === 'payant' && place.price && place.price > 0) return true;
      return false;
    });
  }, [searchedPlaces, filters.price]);

  if (loading) {
    return <div className="text-center text-gray-500 py-10">Chargement...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 py-10">{error}</div>;
  }

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

          {/* Filtrage par prix */}
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
                  <span
                    className={`px-2 py-1 rounded text-sm ${
                      place.price && place.price > 0 ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                    }`}
                  >
                    {place.price && place.price > 0 ? `${place.price}€` : 'Gratuit'}
                  </span>
                </div>
                <p className="text-gray-600 mb-4">{place.summary}</p>
                <div className="flex items-center text-gray-500 mb-4">
                  <MapPin className="w-4 h-4 mr-2" />
                  <span className="text-sm">{place.address || 'Lieu inconnu'}</span>
                </div>
                <button
                    className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    onClick={() => setSelectedPlace(place)}
                >
                  En savoir plus
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 col-span-full">Aucun lieu trouvé.</p>
        )}
      </div>
      {selectedPlace && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
              <h2 className="text-2xl font-bold mb-4">{selectedPlace.name}</h2>
              <img
                  src={selectedPlace.imageUrl || 'https://via.placeholder.com/300'}
                  alt={selectedPlace.name}
                  className="w-full h-48 object-cover mb-4"
              />
              <div className="flex justify-between items-start mb-2">
                <h2 className="text-xl font-semibold">{selectedPlace.name}</h2>
                <span
                    className={`px-2 py-1 rounded text-sm ${
                        selectedPlace.price && selectedPlace.price > 0 ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                    }`}
                >
                                        {selectedPlace.price && selectedPlace.price > 0 ? `${selectedPlace.price}€` : 'Gratuit'}
                                    </span>
              </div>
              <p className="text-gray-600 mb-4">{selectedPlace.description}</p>
              <div className="flex items-center text-gray-500 mb-4">
                <MapPin className="w-4 h-4 mr-2" />
                <span className="text-sm">{selectedPlace.address || 'évènement inconnu'}</span>
              </div>
              <div className="flex justify-end">
                <button
                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                    onClick={() => setSelectedPlace(null)}
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
      )}
    </div>
  );
}

export default DiscoveryPage;
