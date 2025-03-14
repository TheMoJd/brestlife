// src/pages/admin/EventsPageAdmin.tsx
import {useEffect, useRef, useState} from "react";
import {
    listEvents,
    createEvent,
    updateEventById,
    deleteEventById,
    Event, uploadEventImage,
} from "../../gen/openapi";
import {useForm} from "react-hook-form";
import {Edit, Trash2, Upload, X} from "lucide-react";

export default function EventsPageAdmin() {
    const [events, setEvents] = useState<Event[]>([]);
    const [editingEvent, setEditingEvent] = useState<Event | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const {register, handleSubmit, reset, setValue} = useForm<Event>();

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

    // Gestion du fichier sélectionné
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            setSelectedFile(file);

            // Créer une URL de prévisualisation
            const fileUrl = URL.createObjectURL(file);
            setPreviewUrl(fileUrl);

            // Vider le champ imageUrl puisqu'on utilisera le fichier à la place
            setValue("imageUrl", "");
        }
    };

    // Soumission du formulaire
    const onSubmit = async (data: Event) => {
        try {
            let eventId: number;

            if (editingEvent?.id) {
                // Mise à jour
                const response = await updateEventById({
                    path: {id: editingEvent.id},
                    body: data,
                });
                eventId = editingEvent.id;
            } else {
                // Création
                const response = await createEvent({body: data});

                if (response && response.data) {
                    eventId = response.data?.id;
                } else {
                    throw new Error("Erreur lors de la création du lieu");
                }
            }

            // Si un fichier a été sélectionné, on l'upload
            if (selectedFile && eventId) {
                const formData = new FormData();
                formData.append('file', selectedFile);

                await uploadEventImage({
                    path: {eventId},
                    body: {
                        file: selectedFile
                    }
                });
            }

            closeModal();
            fetchEvents();
        } catch (error) {
            console.error("Erreur lors de la sauvegarde du lieu:", error);
        }
    };

    const handleDelete = async (eventItem: Event) => {
        if (!eventItem.id) return;
        if (!window.confirm(`Supprimer l'événement "${eventItem.title}" ?`)) return;
        try {
            await deleteEventById({path: {id: eventItem.id}});
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
                                    <Edit size={16}/>
                                </button>
                                <button
                                    className="inline-flex items-center px-2 py-1 bg-red-500 hover:bg-red-600 text-white rounded"
                                    onClick={() => handleDelete(ev)}
                                >
                                    <Trash2 size={16}/>
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
                            <X size={20}/>
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
                                    type="datetime-local"
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

                            {/* Remplacer le champ d'URL par un sélecteur de fichier */}
                            <div className="mb-4">
                                <label className="block mb-1 text-sm font-medium text-gray-700">
                                    Image
                                </label>

                                {/* Afficher la prévisualisation si disponible */}
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
                                        <Upload size={16} className="mr-2"/>
                                        {selectedFile ? 'Changer l\'image' : 'Sélectionner une image'}
                                    </label>
                                    {selectedFile && (
                                        <span className="text-sm text-gray-500">
                      {selectedFile.name}
                    </span>
                                    )}
                                </div>

                                {/* Garder le champ imageUrl caché pour le cas où on ne change pas l'image */}
                                <input
                                    type="hidden"
                                    {...register("imageUrl")}
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
