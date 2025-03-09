import { useAuth } from "../../contexts/AuthProvider";

export default function AdminPage() {
    const {logout} = useAuth();
    
    return (
        <div className="bg-white p-6 rounded shadow">
          <h1 className="text-2xl font-bold mb-4">Bienvenue sur l'Admin</h1>
          <p className="text-gray-700">
            Sélectionnez un onglet dans la barre latérale pour gérer vos .
          </p>

          {/* Botton déconnexion */}
          <button
           className="bg-red-500 text-white px-4 py-2 rounded mt-6"
           onClick={logout}
           >
            Déconnexion
          </button>

        </div>
      );
};

