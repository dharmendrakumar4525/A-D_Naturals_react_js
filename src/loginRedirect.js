// /* eslint-disable react/prop-types */
// /* eslint-disable react/function-component-definition */

// import React from "react";
// import { Navigate } from "react-router-dom"; // Assuming you are using React Router

// export const LoginRoute = ({ children }) => {
//   const token = localStorage.getItem("Login_Token");

//   if (token) {
//     // Redirect to login page or any other appropriate page
//     return <Navigate to="/dashboard" />;
//   }

//   // Render children if token exists
//   return <>{children}</>;
// };

/* eslint-disable react/prop-types */
/* eslint-disable react/function-component-definition */

import React from "react";
import { Navigate } from "react-router-dom"; // Assuming you are using React Router

export const LoginRoute = ({ children }) => {
  const token = localStorage.getItem("Login_Token");
  const Login_User_Role = localStorage.getItem("Login_User_Role");

  if (token) {
    if (Login_User_Role === "superadmin") {
      return <Navigate to="/dashboard" />;
    } else if (Login_User_Role === "user") {
      return <Navigate to="/detailed-view" />;
    } else {
      return <Navigate to="/master" />;
    }
  }

  // Render children if token exists
  return <>{children}</>;
};
