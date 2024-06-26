/* eslint-disable react/prop-types */
/* eslint-disable react/function-component-definition */

import React from "react";
import { Navigate } from "react-router-dom"; // Assuming you are using React Router

export const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("Login_Token");

  if (!token) {
    // Redirect to login page or any other appropriate page
    return <Navigate to="/authentication/sign-in" />;
  }

  // Render children if token exists
  return <>{children}</>;
};
