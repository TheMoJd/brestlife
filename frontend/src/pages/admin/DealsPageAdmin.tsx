// src/pages/admin/DealsPageAdmin.tsx
import { useEffect, useState } from "react";
import {
  listDeals,
  createDeal,
  updateDealById,
  deleteDealById,
  Deal,
} from "../../gen/openapi";
import { useForm } from "react-hook-form";
import { Edit, Trash2, X } from "lucide-react";
import {useAuth} from "../../contexts/AuthProvider.tsx";

export default function DealsPageAdmin() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [editingDeal, setEditingDeal] = useState<Deal | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { register, handleSubmit, reset } = useForm<Deal>();

  const currentUser = useAuth().user;

  const fetchDeals = async () => {
    try {
      const response = await listDeals();
      if (response.data) {
        setDeals(response.data);
      }
    } catch (err) {
      console.error("Erreur chargement deals:", err);
    }
  };

  useEffect(() => {
    fetchDeals();
  }, []);

  const openCreateModal = () => {
    setEditingDeal(null);
    reset({});
    setIsModalOpen(true);
  };

  const openEditModal = (deal: Deal) => {
    setEditingDeal(deal);
    reset(deal);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const onSubmit = async (data: Deal) => {
    try {
      if (editingDeal?.id) {
        await updateDealById({
          path: { id: editingDeal.id },
          body: data,
        });
      } else {
        data.createdBy = currentUser;
        await createDeal({ body: data });
      }
      closeModal();
      fetchDeals();
    } catch (err) {
      console.error("Erreur sauvegarde deal:", err);
    }
  };

  const handleDelete = async (deal: Deal) => {
    if (!deal.id) return;
    if (!window.confirm(`Supprimer le bon plan "${deal.title}" ?`)) return;
    try {
      await deleteDealById({ path: { id: deal.id } });
      fetchDeals();
    } catch (err) {
      console.error("Erreur suppression deal:", err);
    }
  };

  return (
    <div>
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold">Gestion des Bons Plans</h1>
        <button
          onClick={openCreateModal}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
        >
          + Nouveau Deal
        </button>
      </div>

      <div className="overflow-x-auto bg-white shadow rounded">
        <table className="min-w-full text-left border-collapse">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-4 py-3 text-sm font-semibold text-gray-700">ID</th>
              <th className="px-4 py-3 text-sm font-semibold text-gray-700">
                Titre
              </th>
              <th className="px-4 py-3 text-sm font-semibold text-gray-700">
                Prix Ancien
              </th>
              <th className="px-4 py-3 text-sm font-semibold text-gray-700">
                Nouveau Prix
              </th>
              <th className="px-4 py-3 text-sm font-semibold text-gray-700 text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {deals.map((deal) => (
              <tr
                key={deal.id}
                className="border-b hover:bg-gray-50 transition-colors"
              >
                <td className="px-4 py-2">{deal.id}</td>
                <td className="px-4 py-2">{deal.title}</td>
                <td className="px-4 py-2">
                  {deal.old_price ? deal.old_price + "€" : ""}
                </td>
                <td className="px-4 py-2">
                  {deal.new_price ? deal.new_price + "€" : ""}
                </td>
                <td className="px-4 py-2 text-right">
                  <button
                    className="inline-flex items-center px-2 py-1 bg-green-500 hover:bg-green-600 text-white rounded mr-2"
                    onClick={() => openEditModal(deal)}
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    className="inline-flex items-center px-2 py-1 bg-red-500 hover:bg-red-600 text-white rounded"
                    onClick={() => handleDelete(deal)}
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
            {deals.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-2 text-center text-gray-500">
                  Aucun deal trouvé.
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
              {editingDeal ? "Modifier un Deal" : "Créer un Deal"}
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
                  Ancien Prix
                </label>
                <input
                  type="number"
                  step="0.01"
                  {...register("old_price")}
                  className="block w-full border border-gray-300 rounded px-3 py-2"
                />
              </div>
              <div className="mb-4">
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Nouveau Prix
                </label>
                <input
                  type="number"
                  step="0.01"
                  {...register("new_price")}
                  className="block w-full border border-gray-300 rounded px-3 py-2"
                />
              </div>
              <div className="mb-4">
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Date fin
                </label>
                <input
                  type="datetime-local"
                  {...register("date_end")}
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
                  Lien
                </label>
                <input
                  type="text"
                  {...register("link")}
                  className="block w-full border border-gray-300 rounded px-3 py-2"
                />
              </div>

              <div className="mb-4">
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Société
                </label>
                <input
                  type="text"
                  {...register("company")}
                  className="block w-full border border-gray-300 rounded px-3 py-2"
                />
              </div>

              <div className="mb-4">
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Réserve
                </label>
                <input
                  type="text"
                  {...register("reserve")}
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
