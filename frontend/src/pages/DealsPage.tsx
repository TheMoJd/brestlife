import React, { useState } from 'react';
import { Search, Tag, MapPin, ExternalLink } from 'lucide-react';

type Deal = {
  id: number;
  title: string;
  merchant: string;
  category: string;
  discount: string;
  location: string;
  validUntil: string;
  description: string;
  conditions: string;
};

const deals: Deal[] = [
  {
    id: 1,
    title: 'Réduction Cinéma',
    merchant: 'Multiplexe Liberté',
    category: 'Loisirs',
    discount: '-50%',
    location: 'Centre-ville',
    validUntil: '31/12/2024',
    description: 'Tarif étudiant à -50% sur présentation de la carte étudiante',
    conditions: 'Valable tous les jours sauf jours fériés'
  },
  {
    id: 2,
    title: 'Transport Gratuit',
    merchant: 'Bibus',
    category: 'Transport',
    discount: 'Gratuit',
    location: 'Brest Métropole',
    validUntil: '31/08/2024',
    description: 'Transport gratuit le weekend pour les étudiants',
    conditions: 'Sur présentation de la carte étudiante'
  },
  {
    id: 3,
    title: 'Menu Étudiant',
    merchant: 'Restaurant Universitaire',
    category: 'Restauration',
    discount: '3,30€',
    location: 'Campus',
    validUntil: '31/07/2024',
    description: 'Menu complet à tarif étudiant',
    conditions: 'Avec carte étudiante uniquement'
  }
];

export function DealsPage() {
  const [filters, setFilters] = useState({
    category: '',
    location: ''
  });

  const filteredDeals = deals.filter(deal => {
    if (filters.category && deal.category !== filters.category) return false;
    if (filters.location && deal.location !== filters.location) return false;
    return true;
  });

  return (
    <div className="py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <h1 className="text-3xl font-bold">Bon plans</h1>
        
        {/* Search and Filters */}
        <div className="mt-4 md:mt-0 flex flex-wrap gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Rechercher un bon plan..."
              className="pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
          </div>
          
          <select
            value={filters.category}
            onChange={(e) => setFilters(f => ({ ...f, category: e.target.value }))}
            className="px-4 py-2 border rounded-lg"
          >
            <option value="">Toutes les catégories</option>
            <option value="Loisirs">Loisirs</option>
            <option value="Transport">Transport</option>
            <option value="Restauration">Restauration</option>
          </select>
          
          <select
            value={filters.location}
            onChange={(e) => setFilters(f => ({ ...f, location: e.target.value }))}
            className="px-4 py-2 border rounded-lg"
          >
            <option value="">Toutes les zones</option>
            <option value="Centre-ville">Centre-ville</option>
            <option value="Campus">Campus</option>
            <option value="Brest Métropole">Brest Métropole</option>
          </select>
        </div>
      </div>

      {/* Deals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDeals.map((deal) => (
          <div key={deal.id} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm mb-2">
                  {deal.category}
                </span>
                <h2 className="text-xl font-semibold">{deal.title}</h2>
                <p className="text-gray-600">{deal.merchant}</p>
              </div>
              <span className="text-2xl font-bold text-green-600">{deal.discount}</span>
            </div>
            
            <p className="text-gray-600 mb-4">{deal.description}</p>
            
            <div className="space-y-2 text-sm text-gray-500 mb-4">
              <div className="flex items-center">
                <MapPin className="w-4 h-4 mr-2" />
                {deal.location}
              </div>
              <div className="flex items-center">
                <Tag className="w-4 h-4 mr-2" />
                Valable jusqu'au {deal.validUntil}
              </div>
            </div>
            
            <div className="border-t pt-4 mt-4">
              <p className="text-sm text-gray-500">{deal.conditions}</p>
            </div>
            
            <button className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center">
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