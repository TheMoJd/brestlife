import {Navigate, Outlet} from "react-router-dom";
import {useAuth} from "../contexts/AuthProvider";

type PrivateRouteProps = {
    requiredRole?: string; // Role requis pour accéder à la route
};

const PrivateRoute = ({requiredRole}: PrivateRouteProps) => {
    const {user} = useAuth();

    // 1. Utilisateur non connecté => redirection /login
    if (!user) {
        return <Navigate to="/login" replace/>;
    }

    // 2. Rôle requis => on vérifie
    if (requiredRole && user.role !== requiredRole) {
        return <Navigate to="/unauthorized" replace/>;
    }

    return <Outlet/>;
};

export default PrivateRoute;
