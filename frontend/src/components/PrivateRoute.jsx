// src/components/PrivateRoute.jsx
import { Navigate } from 'react-router-dom';
import authService from '~/services/authService';

const PrivateRoute = ({ children }) => {
  const isLogined = authService.isAuthenticated()
  return isLogined ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute;
