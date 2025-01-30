import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './AuthContext.js'; // Importar el contexto

const ProtectedRoute = ({ allowedRoles }) => {
  const { user } = useAuth();

  // Si el usuario no está logueado o no tiene el rol necesario, redirige
  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to="/login" />;
  }

  // Si el usuario tiene acceso, renderiza el componente correspondiente
  return <Outlet />;
};

export default ProtectedRoute;