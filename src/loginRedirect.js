/* eslint-disable react/prop-types */
/* eslint-disable react/function-component-definition */

import React from "react";
import { Navigate } from "react-router-dom"; // Assuming you are using React Router

export const LoginRoute = ({ children }) => {
  const token = localStorage.getItem("A&D_Login_Token");

  if (token) {
    // Redirect to login page or any other appropriate page
    return <Navigate to="/dashboard" />;
  }

  // Render children if token exists
  return <>{children}</>;
};
