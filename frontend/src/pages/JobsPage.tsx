import React, { useEffect, useMemo, useState } from 'react';
import { Search, Building2, Calendar, MapPin } from 'lucide-react';
import { listJobs } from '../gen/openapi';
import { Job } from '../gen/openapi';
import { useSearchFilter } from '../hooks/useSearchFilter';


export function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [filters, setFilters] = useState({ typeOfContract: ''});

  useEffect(() => {
    async function loadJobs() {
      try {
        setLoading(true);
        const response = await listJobs();
        if (response.data) {
          setJobs(response.data);
        } else {
          setError('Échec du chargement des offres d\'emploi.');
        }
      } catch (err) {
        setError('Échec du chargement des offres d\'emploi.');
      } finally {
        setLoading(false);
      }
    }

    loadJobs();
  }, []);

  // Utilisation du hook de recherche (recherche par nom)
  const { filteredItems: searchedJobs, searchQuery, setSearchQuery } = useSearchFilter(jobs, ['title']);
  
    // Filtrage par prix
  const filteredJobs = useMemo(() => {
    return searchedJobs.filter((job) => {
      if (filters.typeOfContract === '') return true;
      if (filters.typeOfContract === 'CDI') return job.category?.name === 'CDI';
      if (filters.typeOfContract === 'CDD') return job.category?.name === 'CDD';
      if (filters.typeOfContract === 'Stage') return job.category?.name === 'Stage';
      return false;
    });
  }, [searchedJobs, filters.typeOfContract]);

  if (loading) {
    return <div className="text-center text-gray-500 py-10">Chargement...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 py-10">{error}</div>;
  }
  // const [filters, setFilters] = useState({
  //   type: '',
  //   location: ''
  // });

  // const filteredJobs = jobs.filter(job => {
  //   if (filters.type && job.type !== filters.type) return false;
  //   if (filters.location && !job.location.includes(filters.location)) return false;
  //   return true;
  // });

  return (
    <div className="py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <h1 className="text-3xl font-bold">Offres emplois</h1>
        
        {/* Search and Filters */}
        <div className="mt-4 md:mt-0 flex flex-wrap gap-4">
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
          
          { <select
            value={filters.typeOfContract}
            onChange={(e) => setFilters(f => ({ ...f, type: e.target.value }))}
            className="px-4 py-2 border rounded-lg"
          >
            <option value="">Tous les types</option>
            <option value="CDI">CDI</option>
            <option value="CDD">CDD</option>
            <option value="Stage">Stage</option>
          </select>}
          
          {/* <select
            value={filters.location}
            onChange={(e) => setFilters(f => ({ ...f, location: e.target.value }))}
            className="px-4 py-2 border rounded-lg"
          >
            <option value="">Toutes les zones</option>
            <option value="Centre">Centre</option>
            <option value="Port">Port</option>
            <option value="Technopôle">Technopôle</option>
          </select> */}
        </div>
          
      </div>

      {/* Jobs List */}
      <div className="space-y-6">
        {searchedJobs.map((job) => (
          <div key={job.id} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex flex-col md:flex-row justify-between md:items-center mb-4">
              <div>
                <h2 className="text-xl font-semibold mb-2">{job.title}</h2>
                <div className="flex items-center text-gray-600 mb-2">
                  <Building2 className="w-4 h-4 mr-2" />
                  <span>{job.companyName}</span>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mt-2 md:mt-0">
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                  {job.category?.name}
                </span>
              </div>
            </div>
            
            <p className="text-gray-600 mb-4">{job.description}</p>
            
            <div className="flex flex-wrap gap-4 text-sm text-gray-500">
              <div className="flex items-center">
                <MapPin className="w-4 h-4 mr-1" />
                {job.location}
              </div>
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-1" />
                {job.startDate}
              </div>
            </div>
            
            <div className="mt-4 flex gap-4">
              <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                Postuler
              </button>
              <button className="flex-1 border border-blue-600 text-blue-600 py-2 px-4 rounded-lg hover:bg-blue-50 transition-colors">
                En savoir plus
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default JobsPage;