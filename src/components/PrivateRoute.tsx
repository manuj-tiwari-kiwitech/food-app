import React from 'react';
import { Route, Navigate } from 'react-router-dom';

interface PrivateRouteProps {
  isAuthenticated: boolean;
  element: React.ReactNode;
  path: string;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ isAuthenticated, element, ...rest }) => {
//   if (!isAuthenticated) {
//     return <Navigate to="/login" />;
//   }

  return <Route {...rest} element={element} />;
};

export default PrivateRoute;
