// src/pages/admin/EventsPageAdmin.tsx
import { useEffect, useRef, useState } from "react";
import {
  listEvents,
  createEvent,
  updateEventById,
  deleteEventById,
  uploadEventImage,
  listCategoriesByType,
  Event,
  Category,
} from "../../gen/openapi";
import { useForm } from "react-hook-form";
import { Edit, Trash2, Upload, X } from "lucide-react";
import { useAuth } from "../../contexts/AuthProvider";

export default function EventsPageAdmin() {
  const { token, user } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { register, handleSubmit, reset, setValue } = useForm<Event>();

  // Chargement des événements
  const fetchEvents = async () => {
    try {
      const response = await listEvents();
      if (response.data) {
        setEvents(response.data);
      }
    } catch (error) {
      console.error("Erreur chargement events :", error);
    }
  };

  // Chargement des catégories de type EVENT
  const fetchEventCategories = async () => {
    try {
      const response = await listCategoriesByType({
        path: { type: "EVENT" },
      });
      if (response.data) {
        setCategories(response.data);
      }
    } catch (error) {
      console.error("Erreur chargement catégories :", error);
    }
  };

  useEffect(() => {
    fetchEvents();
    fetchEventCategories();
  }, []);

  // Ouvrir la modal en mode création
  const openCreateModal = () => {
    setEditingEvent(null);
    reset({});
    setSelectedFile(null);
    setPreviewUrl(null);
    setIsModalOpen(true);
  };

  // Ouvrir la modal en mode édition
  const openEditModal = (eventItem: Event) => {
    setEditingEvent(eventItem);
    reset(eventItem);
    setPreviewUrl(eventItem.imageUrl || null);
    setSelectedFile(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Gestion du changement de fichier pour l’upload d’image
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      // On vide le champ imageUrl car le fichier sera envoyé séparément
      setValue("imageUrl", "");
    }
  };

  // Soumission du formulaire : création ou mise à jour d'un événement
  const onSubmit = async (data: Event) => {
    try {
      let eventId: number | undefined;
      if (editingEvent?.id) {
        // Mise à jour de l'événement existant
        await updateEventById({
          path: { id: editingEvent.id },
          body: data,
        });
        eventId = editingEvent.id;
      } else {
        // On associe le créateur avec l'utilisateur connecté
        data.createdBy = user ?? undefined;
        const response = await createEvent({
          body: data,
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.data?.id) {
          eventId = response.data.id;
        } else {
          throw new Error("Erreur lors de la création de l'événement");
        }
      }

      // Upload de l'image si un fichier a été sélectionné
      if (selectedFile && eventId) {
        await uploadEventImage({
          path: { eventId },
          body: { file: selectedFile },
        });
      }
      closeModal();
      fetchEvents();
    } catch (error) {
      console.error("Erreur lors de la sauvegarde de l'événement :", error);
    }
  };

  // Suppression d'un événement
  const handleDelete = async (eventItem: Event) => {
    if (!eventItem.id) return;
    if (!window.confirm(`Confirmez la suppression de l'événement "${eventItem.title}" ?`))
      return;
    try {
      await deleteEventById({ path: { id: eventItem.id } });
      fetchEvents();
    } catch (error) {
      console.error("Erreur lors de la suppression de l'événement :", error);
    }
  };

  return (
    <div>
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold">Gestion des Événements</h1>
        <button
          onClick={openCreateModal}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
        >
          + Nouvel Événement
        </button>
      </div>

      <div className="overflow-x-auto bg-white shadow rounded">
        <table className="min-w-full text-left border-collapse">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-4 py-3 text-sm font-semibold text-gray-700">ID</th>
              <th className="px-4 py-3 text-sm font-semibold text-gray-700">Titre</th>
              <th className="px-4 py-3 text-sm font-semibold text-gray-700">Date</th>
              <th className="px-4 py-3 text-sm font-semibold text-gray-700">Lieu</th>
              <th className="px-4 py-3 text-sm font-semibold text-gray-700 text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {events.map((eventItem) => (
              <tr
                key={eventItem.id}
                className="border-b hover:bg-gray-50 transition-colors"
              >
                <td className="px-4 py-2">{eventItem.id}</td>
                <td className="px-4 py-2">{eventItem.title}</td>
                <td className="px-4 py-2">{eventItem.date}</td>
                <td className="px-4 py-2">{eventItem.location}</td>
                <td className="px-4 py-2 text-right">
                  <button
                    onClick={() => openEditModal(eventItem)}
                    className="inline-flex items-center px-2 py-1 bg-green-500 hover:bg-green-600 text-white rounded mr-2"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(eventItem)}
                    className="inline-flex items-center px-2 py-1 bg-red-500 hover:bg-red-600 text-white rounded"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
            {events.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-2 text-center text-gray-500">
                  Aucun événement trouvé.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal de création/édition */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={closeModal}
          />
            <div className="relative bg-white p-6 rounded shadow-lg w-full max-w-xl z-10 max-h-[90vh] overflow-y-auto">
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
              onClick={closeModal}
            >
              <X size={20} />
            </button>
            <h2 className="text-xl font-bold mb-4">
              {editingEvent ? "Modifier un Événement" : "Créer un Événement"}
            </h2>
            <form onSubmit={handleSubmit(onSubmit)}>
              {/* Titre */}
              <div className="mb-4">
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Titre
                </label>
                <input
                  type="text"
                  {...register("title", { required: true })}
                  className="block w-full border border-gray-300 rounded px-3 py-2"
                />
              </div>
              {/* Date */}
              <div className="mb-4">
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Date
                </label>
                <input
                  type="datetime-local"
                  {...register("date", { required: true })}
                  className="block w-full border border-gray-300 rounded px-3 py-2"
                />
              </div>
              {/* Lieu */}
              <div className="mb-4">
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Lieu
                </label>
                <input
                  type="text"
                  {...register("location", { required: true })}
                  className="block w-full border border-gray-300 rounded px-3 py-2"
                />
              </div>
              {/* Sélection de la catégorie */}
              <div className="mb-4">
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Catégorie
                </label>
                <select
                  {...register("category.id", { required: true })}
                  className="block w-full border border-gray-300 rounded px-3 py-2"
                >
                  <option value="">Sélectionnez une catégorie</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.subCategory}
                    </option>
                  ))}
                </select>
              </div>
              {/* Description */}
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
                  Summary
                </label>
                <textarea
                  {...register("summary")}
                  className="block w-full border border-gray-300 rounded px-3 py-2"
                  rows={3}
                />
              </div>
              {/* Prix */}
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
              {/* Gestion de l'image */}
              <div className="mb-4">
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Image
                </label>
                {previewUrl && (
                  <div className="mb-2">
                    <img
                      src={previewUrl}
                      alt="Prévisualisation"
                      className="h-32 object-cover mb-2 rounded border border-gray-300"
                    />
                  </div>
                )}
                <div className="flex items-center space-x-4">
                  <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                    id="file-upload"
                  />
                  <label
                    htmlFor="file-upload"
                    className="cursor-pointer px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded flex items-center"
                  >
                    <Upload size={16} className="mr-2" />
                    {selectedFile ? "Changer l'image" : "Sélectionner une image"}
                  </label>
                  {selectedFile && (
                    <span className="text-sm text-gray-500">
                      {selectedFile.name}
                    </span>
                  )}
                </div>
                {/* Champ caché pour imageUrl */}
                <input type="hidden" {...register("imageUrl")} />
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
