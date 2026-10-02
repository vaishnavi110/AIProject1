import React from 'react';
import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Loader from '../common/Loader';
import toast from 'react-hot-toast';

const AdminRoute = ({ children }) => {
  const { isAuthenticated, isAdmin, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader size="lg" message="Verifying permissions..." />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!isAdmin) {
    toast.error('Access restricted to administrators only.');
    return <Navigate to="/" replace />;
  }

  return children ? children : <Outlet />;
};

export default AdminRoute;
