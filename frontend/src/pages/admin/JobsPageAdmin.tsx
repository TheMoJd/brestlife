// src/pages/admin/JobsPageAdmin.tsx
import { useEffect, useState } from "react";
import {
  listJobs,
  createJob,
  updateJobById,
  deleteJobById,
  Job,
  Category,
} from "../../gen/openapi";
import { useForm } from "react-hook-form";
import { Edit, Trash2, X } from "lucide-react";
import { useAuth } from "../../contexts/AuthProvider";

export default function JobsPageAdmin() {
  const { token } = useAuth();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { register, handleSubmit, reset } = useForm<Job>();
  //const categories = await categories(); 
  const fetchJobs = async () => {
    try {
      const response = await listJobs();
      if (response.data) {
        setJobs(response.data);
      }
      console.log("Jobs:", jobs);
    } catch (err) {
      console.error("Erreur chargement jobs:", err);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const openCreateModal = () => {
    setEditingJob(null);
    reset({});
    setIsModalOpen(true);
  };

  const openEditModal = (job: Job) => {
    setEditingJob(job);
    reset(job);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  // pas besoin de Category fans la taablke jobs donc 2 choix effacer la clé
  // étrangère category_id de la table jobs ou mettre une valeur par défaut
  const defaultCategory : Category = {
    id: 4,
    createdAt: "2025-02-12 14:50:00.000000",
    name: "Technologie",
    type: "JOB",
    createdBy: { id: 3 }
  };


  const onSubmit = async (data: Job) => {
    try {
      const jobData = {
        ...data,
        category: defaultCategory
      };
  
      if (editingJob?.id) {
        await updateJobById({
          path: { id: editingJob.id },
          body: jobData,
        });
      } else {
        await createJob({ 
          body: jobData,
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
      }
      closeModal();
      fetchJobs();
    } catch (err) {
      console.error("Erreur sauvegarde job:", err);
    }
  };

  const handleDelete = async (job: Job) => {
    if (!job.id) return;
    if (!window.confirm(`Supprimer l'offre d'emploi "${job.title}" ?`)) return;
    try {
      await deleteJobById({ path: { id: job.id } });
      fetchJobs();
    } catch (err) {
      console.error("Erreur suppression:", err);
    }
  };

  return (
    <div>
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold">Gestion des Offres d'Emploi</h1>
        <button
          onClick={openCreateModal}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
        >
          + Nouvelle Offre
        </button>
      </div>

      <div className="overflow-x-auto bg-white shadow rounded">
        <table className="min-w-full text-left border-collapse">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-4 py-3 text-sm font-semibold text-gray-700">ID</th>
              <th className="px-4 py-3 text-sm font-semibold text-gray-700">Titre</th>
              <th className="px-4 py-3 text-sm font-semibold text-gray-700">
                Société
              </th>
              <th className="px-4 py-3 text-sm font-semibold text-gray-700">
                Localisation
              </th>
              <th className="px-4 py-3 text-sm font-semibold text-gray-700">
                Type de contrat
              </th>
              <th className="px-4 py-3 text-sm font-semibold text-gray-700 text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {jobs.map((job) => (
              <tr
                key={job.id}
                className="border-b hover:bg-gray-50 transition-colors"
              >
                <td className="px-4 py-2">{job.id}</td>
                <td className="px-4 py-2">{job.title}</td>
                <td className="px-4 py-2">{job.companyName}</td>
                <td className="px-4 py-2">{job.location}</td>
                <td className="px-4 py-2">{job.duration}</td>


                <td className="px-4 py-2 text-right">
                  <button
                    className="inline-flex items-center px-2 py-1 bg-green-500 hover:bg-green-600 text-white rounded mr-2"
                    onClick={() => openEditModal(job)}
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    className="inline-flex items-center px-2 py-1 bg-red-500 hover:bg-red-600 text-white rounded"
                    onClick={() => handleDelete(job)}
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
            {jobs.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-2 text-center text-gray-500">
                  Aucune offre trouvée.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={closeModal}
          />
          <div className="relative bg-white p-6 rounded shadow-lg w-full max-w-xl z-10">
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
              onClick={closeModal}
            >
              <X size={20} />
            </button>
            <h2 className="text-xl font-bold mb-4">
              {editingJob ? "Modifier l'offre" : "Créer une Offre"}
            </h2>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="mb-4">
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Titre
                </label>
                <input
                  type="text"
                  {...register("title")}
                  className="block w-full border border-gray-300 rounded px-3 py-2"
                />
              </div>
              <div className="mb-4">
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Société
                </label>
                <input
                  type="text"
                  {...register("companyName")}
                  className="block w-full border border-gray-300 rounded px-3 py-2"
                />
              </div>
              <div className="mb-4">
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Localisation
                </label>
                <input
                  type="text"
                  {...register("location")}
                  className="block w-full border border-gray-300 rounded px-3 py-2"
                />
              </div>
              <div className="mb-4">
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Type de contrat
                </label>
                <div className="relative">
                  <select
                    {...register("duration")}
                    className="block w-full border border-gray-300 rounded px-3 py-2 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="CDD">CDD</option>
                    <option value="CDI">CDI</option>
                    <option value="Stage">Stage</option>
                    <option value="Alternance">Alternance</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                      <path d="M7 10l5 5 5-5H7z" />
                    </svg>
                  </div>
                </div>
              </div>
              <div className="mb-4">
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  {...register("description")}
                  className="block w-full border border-gray-300 rounded px-3 py-2"
                />
              </div>
              <div className="mb-4">
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Date de début
                </label>
                <input
                  type="date"
                  {...register("startDate")}
                  className="block w-full border border-gray-300 rounded px-3 py-2"
                />
              </div>
              <div className="mb-4">
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Date de fin
                </label>
                <input
                  type="date"
                  {...register("endDate")}
                  className="block w-full border border-gray-300 rounded px-3 py-2"
                />
              </div>
              <div className="mb-4">
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Email de contact
                </label>
                <input
                  type="email"
                  {...register("contactEmail")}
                  className="block w-full border border-gray-300 rounded px-3 py-2"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 border rounded"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                >
                  Sauvegarder
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
