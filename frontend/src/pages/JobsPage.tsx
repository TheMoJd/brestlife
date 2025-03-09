import { useEffect, useMemo, useState } from 'react';
import { Search, Building2, Calendar, MapPin } from 'lucide-react';
import { listJobs } from '../gen/openapi';
import { Job } from '../gen/openapi';
import { useSearchFilter } from '../hooks/useSearchFilter';
import { useAuth } from '../contexts/AuthProvider';


export function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const [filters, setFilters] = useState({ duration: ''});

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
      if (filters.duration === '') return true;
      if (filters.duration === 'CDI') return job.duration === 'CDI';
      if (filters.duration === 'CDD') return job.duration === 'CDD';
      if (filters.duration === 'Stage') return job.duration === 'Stage';
      return false;
    });
  }, [searchedJobs, filters.duration]);
  console.log(filteredJobs);
  if (loading) {
    return <div className="text-center text-gray-500 py-10">Chargement...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 py-10">{error}</div>;
  }

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
            value={filters.duration}
            onChange={(e) => setFilters(f => ({ ...f, duration: e.target.value }))}
            className="px-4 py-2 border rounded-lg"
          >
            <option value="">Tous les types</option>
            <option value="CDI">CDI</option>
            <option value="CDD">CDD</option>
            <option value="Stage">Stage</option>
          </select>}
          
        </div>
          
      </div>

      {/* Jobs List */}
      <div className="space-y-6">
        {filteredJobs.map((job) => (
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
                  {job.duration}
                </span>
              </div>
            </div>
            
            <p className="text-gray-600 mb-4">{job.summary || 'Résumé non disponible'}</p>
            
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
              <button className="flex-1 border border-blue-600 text-blue-600 py-2 px-4 rounded-lg hover:bg-blue-50 transition-colors"
              onClick={() => setSelectedJob(job)}>
                En savoir plus
              </button>
            </div>
          </div>
        ))}
      </div>
      {selectedJob && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
              <h2 className="text-2xl font-bold mb-4">{selectedJob.title}</h2>
              <div className="flex justify-between items-start mb-2">
                <h2 className="text-xl font-semibold">{selectedJob.companyName}</h2>
                <span
                    className={`px-2 py-1 rounded text-sm bg-blue-100 text-blue-800`}
                >
                    {selectedJob.duration}
                </span>
              </div>
              <p className="text-gray-600 mb-4">{selectedJob.description}</p>
              <div className="flex items-center text-gray-500 mb-4">
                <MapPin className="w-4 h-4 mr-2" />
                <span className="text-sm">{selectedJob.location || 'évènement inconnu'}</span>
              </div>
              <div className="flex items-center text-gray-500 mb-4">
                <Calendar className="w-4 h-4 mr-2" />
                <span className="text-sm">{selectedJob.startDate} - {selectedJob.endDate}</span>
              </div>
              <div className="flex justify-end">
                <button className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors mr-4">
                  Postuler
                </button>
                <button
                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                    onClick={() => setSelectedJob(null)}
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

export default JobsPage;