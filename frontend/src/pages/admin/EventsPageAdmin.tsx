// src/pages/admin/EventsPageAdmin.tsx
import { useEffect, useState } from "react";
import {
  listEvents,
  createEvent,
  updateEventById,
  deleteEventById,
  Event,
} from "../../gen/openapi";
import { useForm } from "react-hook-form";
import { Edit, Trash2, X } from "lucide-react";

export default function EventsPageAdmin() {
  const [events, setEvents] = useState<Event[]>([]);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { register, handleSubmit, reset } = useForm<Event>();

  const fetchEvents = async () => {
    try {
      const response = await listEvents();
      if (response.data) {
        setEvents(response.data);
      }
    } catch (err) {
      console.error("Erreur chargement events:", err);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const openCreateModal = () => {
    setEditingEvent(null);
    reset({});
    setIsModalOpen(true);
  };

  const openEditModal = (eventItem: Event) => {
    setEditingEvent(eventItem);
    reset(eventItem);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const onSubmit = async (data: Event) => {
    try {
      if (editingEvent?.id) {
        await updateEventById({
          path: { id: editingEvent.id },
          body: data,
        });
      } else {
        await createEvent({ body: data });
      }
      closeModal();
      fetchEvents();
    } catch (err) {
      console.error("Erreur sauvegarde event:", err);
    }
  };

  const handleDelete = async (eventItem: Event) => {
    if (!eventItem.id) return;
    if (!window.confirm(`Supprimer l'événement "${eventItem.title}" ?`)) return;
    try {
      await deleteEventById({ path: { id: eventItem.id } });
      fetchEvents();
    } catch (err) {
      console.error("Erreur suppression event:", err);
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
              <th className="px-4 py-3 text-sm font-semibold text-gray-700">
                Date
              </th>
              <th className="px-4 py-3 text-sm font-semibold text-gray-700">
                Lieu
              </th>
              <th className="px-4 py-3 text-sm font-semibold text-gray-700 text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {events.map((ev) => (
              <tr
                key={ev.id}
                className="border-b hover:bg-gray-50 transition-colors"
              >
                <td className="px-4 py-2">{ev.id}</td>
                <td className="px-4 py-2">{ev.title}</td>
                <td className="px-4 py-2">{ev.date}</td>
                <td className="px-4 py-2">{ev.location}</td>
                <td className="px-4 py-2 text-right">
                  <button
                    className="inline-flex items-center px-2 py-1 bg-green-500 hover:bg-green-600 text-white rounded mr-2"
                    onClick={() => openEditModal(ev)}
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    className="inline-flex items-center px-2 py-1 bg-red-500 hover:bg-red-600 text-white rounded"
                    onClick={() => handleDelete(ev)}
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
              {editingEvent ? "Modifier un Événement" : "Créer un Événement"}
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
                  Date
                </label>
                <input
                  type="date"
                  {...register("date")}
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
                  Prix
                </label>
                <input
                  type="number"
                  step="any"
                  {...register("price")}
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
