// src/pages/admin/DiscoveryPageAdmin.tsx
import { useEffect, useState } from "react";
import {
  listPlaces,
  createPlace,
  updatePlaceById,
  deletePlaceById,
  Place,
} from "../../gen/openapi";
import { useForm } from "react-hook-form";
import { Edit, Trash2, X } from "lucide-react";

export default function DiscoveryPageAdmin() {
  const [places, setPlaces] = useState<Place[]>([]);
  const [editingPlace, setEditingPlace] = useState<Place | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { register, handleSubmit, reset } = useForm<Place>();

  // Charger la liste des "places"
  const fetchPlaces = async () => {
    try {
      const response = await listPlaces();
      console.log(response);
      if (response.data) {
        setPlaces(response.data);
      }
      console.log("Places chargées:", response.data);
    } catch (err) {
      console.error("Erreur lors du chargement des places:", err);
    }
  };

  useEffect(() => {
    fetchPlaces();
  }, []);

  // Ouvrir modale pour créer un lieu
  const openCreateModal = () => {
    setEditingPlace(null);
    reset({});
    setIsModalOpen(true);
  };

  // Ouvrir modale pour éditer un lieu
  const openEditModal = (place: Place) => {
    setEditingPlace(place);
    reset(place); // pré-remplit le formulaire
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Soumission du formulaire
  const onSubmit = async (data: Place) => {
    try {
      if (editingPlace?.id) {
        // Mise à jour
        await updatePlaceById({
          path: { id: editingPlace.id },
          body: data,
        });
      } else {
        // Création
        await createPlace({ body: data });
      }
      closeModal();
      fetchPlaces();
    } catch (error) {
      console.error("Erreur lors de la sauvegarde du lieu:", error);
    }
  };

  // Suppression
  const handleDelete = async (place: Place) => {
    if (!place.id) return;
    if (!window.confirm(`Supprimer le lieu "${place.name}" ?`)) return;

    try {
      await deletePlaceById({ path: { id: place.id } });
      fetchPlaces();
    } catch (error) {
      console.error("Erreur lors de la suppression du lieu:", error);
    }
  };

  return (
    <div>
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold">Gestion des Lieux</h1>
        <button
          onClick={openCreateModal}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
        >
          + Nouveau Lieu
        </button>
      </div>

      <div className="overflow-x-auto bg-white shadow rounded">
        <table className="min-w-full text-left border-collapse">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-4 py-3 text-sm font-semibold text-gray-700">ID</th>
              <th className="px-4 py-3 text-sm font-semibold text-gray-700">Nom</th>
              <th className="px-4 py-3 text-sm font-semibold text-gray-700">
                Description
              </th>
              <th className="px-4 py-3 text-sm font-semibold text-gray-700">
                Adresse
              </th>
              <th className="px-4 py-3 text-sm font-semibold text-gray-700 text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {places.map((place) => (
              <tr
                key={place.id}
                className="border-b hover:bg-gray-50 transition-colors"
              >
                <td className="px-4 py-2">{place.id}</td>
                <td className="px-4 py-2">{place.name}</td>
                <td className="px-4 py-2">{place.description}</td>
                <td className="px-4 py-2">{place.address}</td>
                <td className="px-4 py-2 text-right">
                  <button
                    className="inline-flex items-center px-2 py-1 bg-green-500 hover:bg-green-600 text-white rounded mr-2"
                    onClick={() => openEditModal(place)}
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    className="inline-flex items-center px-2 py-1 bg-red-500 hover:bg-red-600 text-white rounded"
                    onClick={() => handleDelete(place)}
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
            {places.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-2 text-center text-gray-500">
                  Aucun lieu trouvé.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* MODALE */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={closeModal}
          />
          {/* Modal Content */}
          <div className="relative bg-white p-6 rounded shadow-lg w-full max-w-xl z-10">
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
              onClick={closeModal}
            >
              <X size={20} />
            </button>
            <h2 className="text-xl font-bold mb-4">
              {editingPlace ? "Modifier un Lieu" : "Créer un Lieu"}
            </h2>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="mb-4">
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Nom
                </label>
                <input
                  type="text"
                  {...register("name")}
                  className="block w-full border border-gray-300 rounded px-3 py-2"
                />
              </div>

              <div className="mb-4">
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  {...register("description")}
                  className="block w-full border border-gray-300 rounded px-3 py-2"
                  rows={3}
                />
              </div>

              <div className="mb-4">
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Adresse
                </label>
                <input
                  type="text"
                  {...register("address")}
                  className="block w-full border border-gray-300 rounded px-3 py-2"
                />
              </div>


<div className="mb-4">
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Latitude
                </label>
                <input
                  type="number"
                  step="any"
                  {...register("latitude")}
                  className="block w-full border border-gray-300 rounded px-3 py-2"
                />
              </div>

              <div className="mb-4">
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Longitude
                </label>
                <input
                  type="number"
                  step="any"
                  {...register("longitude")}
                  className="block w-full border border-gray-300 rounded px-3 py-2"
                />
              </div>

              <div className="mb-4">
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  URL de l'image
                </label>
                <input
                  type="text"
                  {...register("imageUrl")}
                  className="block w-full border border-gray-300 rounded px-3 py-2"
                />
              </div>

              <div className="mb-4">
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Prix
                </label>
                <input
                  type="number"
                  step="any"
                  {...register("price")}
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
