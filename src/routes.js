// Material Dashboard 2 React layouts
import Dashboard from "layouts/dashboard";
import Tables from "layouts/UserManagement";
import SignIn from "layouts/authentication/sign-in";

// @mui icons
import Icon from "@mui/material/Icon";
import { PrivateRoute } from "privateRoute";
import UserTable from "layouts/UserManagement/users";
import RolesTable from "layouts/UserManagement/roles";
import MasterTables from "layouts/Master";
import SellersTable from "layouts/Master/sellers";
import VendorsTable from "layouts/Master/vendors";
import WarehouseTable from "layouts/Master/warehouse";
import LocationsTable from "layouts/Master/locations";

import { LoginRoute } from "loginRedirect";
import DetailedTables from "layouts/DetailedView";

// const routes = [
//   {
//     type: "collapse",
//     name: "Dashboard",
//     key: "dashboard",
//     icon: <Icon fontSize="small">dashboard</Icon>,
//     route: "/dashboard",
//     component: (
//       <PrivateRoute>
//         <Dashboard />
//       </PrivateRoute>
//     ),
//   },
//   {
//     type: "collapse",
//     name: "User Management",
//     key: "user-management",
//     icon: <Icon fontSize="small">table_view</Icon>,
//     route: "/user-management",
//     component: (
//       <PrivateRoute>
//         <Tables />
//       </PrivateRoute>
//     ),
//   },

//   {
//     type: "collapse",
//     name: "Master",
//     key: "master",
//     icon: <Icon fontSize="small">receipt_long</Icon>,
//     route: "/master",
//     component: (
//       <PrivateRoute>
//         <MasterTables />
//       </PrivateRoute>
//     ),
//   },

//   {
//     type: "collapse",
//     name: "Detailed View",
//     key: "detailed-view",
//     icon: <Icon fontSize="small">format_textdirection_r_to_l</Icon>,
//     route: "/detailed-view",
//     component: (
//       <PrivateRoute>
//         <DetailedTables />
//       </PrivateRoute>
//     ),
//   },

//   {
//     type: "noCollapse",
//     name: "Location",
//     key: "location",
//     icon: <Icon fontSize="small">receipt_long</Icon>,
//     route: "/master/location",
//     component: (
//       <PrivateRoute>
//         <LocationsTable />
//       </PrivateRoute>
//     ),
//   },

//   {
//     type: "noCollapse",
//     name: "Warehouse",
//     key: "warehouse",
//     icon: <Icon fontSize="small">receipt_long</Icon>,
//     route: "/master/warehouse",
//     component: (
//       <PrivateRoute>
//         <WarehouseTable />
//       </PrivateRoute>
//     ),
//   },

//   {
//     type: "noCollapse",
//     name: "Sellers",
//     key: "sellers",
//     icon: <Icon fontSize="small">table_view</Icon>,
//     route: "/master/sellers",
//     component: (
//       <PrivateRoute>
//         <SellersTable />
//       </PrivateRoute>
//     ),
//   },

//   {
//     type: "noCollapse",
//     name: "Vendors ",
//     key: "vendors",
//     icon: <Icon fontSize="small">table_view</Icon>,
//     route: "/master/vendors",
//     component: (
//       <PrivateRoute>
//         <VendorsTable />
//       </PrivateRoute>
//     ),
//   },

//   {
//     type: "noCollapse",
//     name: "User Tables",
//     key: "user-table",
//     icon: <Icon fontSize="small">table_view</Icon>,
//     route: "/tables/user-table",
//     component: (
//       <PrivateRoute>
//         <UserTable />
//       </PrivateRoute>
//     ),
//   },

//   {
//     type: "noCollapse",
//     name: "Role Tables",
//     key: "role-table",
//     icon: <Icon fontSize="small">table_view</Icon>,
//     route: "/tables/role-table",
//     component: (
//       <PrivateRoute>
//         <RolesTable />
//       </PrivateRoute>
//     ),
//   },

//   {
//     type: "noCollapse",
//     name: "Sign In",
//     key: "sign-in",
//     icon: <Icon fontSize="small">login</Icon>,
//     route: "/authentication/sign-in",
//     component: (
//       <LoginRoute>
//         <SignIn />
//       </LoginRoute>
//     ),
//   },
// ];

const Login_User_Role = localStorage.getItem("Login_User_Role");
console.log("======Login_User_Role=======", Login_User_Role);

let xyz = [];

if (Login_User_Role === "avidus") {
  xyz = [
    {
      type: "noCollapse",
      name: "Dashboard",
      key: "dashboard",
      icon: <Icon fontSize="small">dashboard</Icon>,
      route: "/dashboard",
      component: (
        <PrivateRoute>
          <Dashboard />
        </PrivateRoute>
      ),
    },
    {
      type: "collapse",
      name: "User Management",
      key: "user-management",
      icon: <Icon fontSize="small">table_view</Icon>,
      route: "/user-management",
      component: (
        <PrivateRoute>
          <Tables />
        </PrivateRoute>
      ),
    },

    {
      type: "collapse",
      name: "Master",
      key: "master",
      icon: <Icon fontSize="small">receipt_long</Icon>,
      route: "/master",
      component: (
        <PrivateRoute>
          <MasterTables />
        </PrivateRoute>
      ),
    },

    {
      type: "noCollapse",
      name: "Detailed View",
      key: "detailed-view",
      icon: <Icon fontSize="small">format_textdirection_r_to_l</Icon>,
      route: "/detailed-view",
      component: (
        <PrivateRoute>
          <DetailedTables />
        </PrivateRoute>
      ),
    },

    {
      type: "noCollapse",
      name: "Location",
      key: "location",
      icon: <Icon fontSize="small">receipt_long</Icon>,
      route: "/master/location",
      component: (
        <PrivateRoute>
          <LocationsTable />
        </PrivateRoute>
      ),
    },

    {
      type: "noCollapse",
      name: "Companies",
      key: "companies",
      icon: <Icon fontSize="small">receipt_long</Icon>,
      route: "/master/companies",
      component: (
        <PrivateRoute>
          <WarehouseTable />
        </PrivateRoute>
      ),
    },

    {
      type: "noCollapse",
      name: "Sellers",
      key: "sellers",
      icon: <Icon fontSize="small">table_view</Icon>,
      route: "/master/sellers",
      component: (
        <PrivateRoute>
          <SellersTable />
        </PrivateRoute>
      ),
    },

    {
      type: "noCollapse",
      name: "Vendors ",
      key: "vendors",
      icon: <Icon fontSize="small">table_view</Icon>,
      route: "/master/vendors",
      component: (
        <PrivateRoute>
          <VendorsTable />
        </PrivateRoute>
      ),
    },

    {
      type: "noCollapse",
      name: "User Tables",
      key: "user-table",
      icon: <Icon fontSize="small">table_view</Icon>,
      route: "/tables/user-table",
      component: (
        <PrivateRoute>
          <UserTable />
        </PrivateRoute>
      ),
    },

    {
      type: "noCollapse",
      name: "Admin Tables",
      key: "admin-table",
      icon: <Icon fontSize="small">table_view</Icon>,
      route: "/tables/admin-table",
      component: (
        <PrivateRoute>
          <RolesTable />
        </PrivateRoute>
      ),
    },

    {
      type: "noCollapse",
      name: "Sign In",
      key: "sign-in",
      icon: <Icon fontSize="small">login</Icon>,
      route: "/authentication/sign-in",
      component: (
        <LoginRoute>
          <SignIn />
        </LoginRoute>
      ),
    },
  ];
} else if (Login_User_Role === "superadmin") {
  xyz = [
    {
      type: "collapse",
      name: "Dashboard",
      key: "dashboard",
      icon: <Icon fontSize="small">dashboard</Icon>,
      route: "/dashboard",
      component: (
        <PrivateRoute>
          <Dashboard />
        </PrivateRoute>
      ),
    },
    {
      type: "collapse",
      name: "User Management",
      key: "user-management",
      icon: <Icon fontSize="small">table_view</Icon>,
      route: "/user-management",
      component: (
        <PrivateRoute>
          <Tables />
        </PrivateRoute>
      ),
    },

    {
      type: "collapse",
      name: "Master",
      key: "master",
      icon: <Icon fontSize="small">receipt_long</Icon>,
      route: "/master",
      component: (
        <PrivateRoute>
          <MasterTables />
        </PrivateRoute>
      ),
    },

    {
      type: "collapse",
      name: "Detailed View",
      key: "detailed-view",
      icon: <Icon fontSize="small">format_textdirection_r_to_l</Icon>,
      route: "/detailed-view",
      component: (
        <PrivateRoute>
          <DetailedTables />
        </PrivateRoute>
      ),
    },

    {
      type: "noCollapse",
      name: "Compliance",
      key: "compliance",
      icon: <Icon fontSize="small">receipt_long</Icon>,
      route: "/master/compliance",
      component: (
        <PrivateRoute>
          <LocationsTable />
        </PrivateRoute>
      ),
    },

    {
      type: "noCollapse",
      name: "Companies",
      key: "companies",
      icon: <Icon fontSize="small">receipt_long</Icon>,
      route: "/master/companies",
      component: (
        <PrivateRoute>
          <WarehouseTable />
        </PrivateRoute>
      ),
    },

    {
      type: "noCollapse",
      name: "Sellers",
      key: "sellers",
      icon: <Icon fontSize="small">table_view</Icon>,
      route: "/master/sellers",
      component: (
        <PrivateRoute>
          <SellersTable />
        </PrivateRoute>
      ),
    },

    {
      type: "noCollapse",
      name: "Entity ",
      key: "entity",
      icon: <Icon fontSize="small">table_view</Icon>,
      route: "/master/entity",
      component: (
        <PrivateRoute>
          <VendorsTable />
        </PrivateRoute>
      ),
    },

    {
      type: "noCollapse",
      name: "User Tables",
      key: "user-table",
      icon: <Icon fontSize="small">table_view</Icon>,
      route: "/tables/user-table",
      component: (
        <PrivateRoute>
          <UserTable />
        </PrivateRoute>
      ),
    },

    {
      type: "noCollapse",
      name: "Role Tables",
      key: "role-table",
      icon: <Icon fontSize="small">table_view</Icon>,
      route: "/tables/role-table",
      component: (
        <PrivateRoute>
          <RolesTable />
        </PrivateRoute>
      ),
    },

    {
      type: "noCollapse",
      name: "Sign In",
      key: "sign-in",
      icon: <Icon fontSize="small">login</Icon>,
      route: "/authentication/sign-in",
      component: (
        <LoginRoute>
          <SignIn />
        </LoginRoute>
      ),
    },
  ];
} else if (Login_User_Role === "user") {
  xyz = [
    {
      type: "noCollapse",
      name: "Dashboard",
      key: "dashboard",
      icon: <Icon fontSize="small">dashboard</Icon>,
      route: "/dashboard",
      component: (
        <PrivateRoute>
          <Dashboard />
        </PrivateRoute>
      ),
    },
    {
      type: "noCollapse",
      name: "User Management",
      key: "user-management",
      icon: <Icon fontSize="small">table_view</Icon>,
      route: "/user-management",
      component: (
        <PrivateRoute>
          <Tables />
        </PrivateRoute>
      ),
    },

    {
      type: "noCollapse",
      name: "Master",
      key: "master",
      icon: <Icon fontSize="small">receipt_long</Icon>,
      route: "/master",
      component: (
        <PrivateRoute>
          <MasterTables />
        </PrivateRoute>
      ),
    },

    {
      type: "collapse",
      name: "Detailed View",
      key: "detailed-view",
      icon: <Icon fontSize="small">format_textdirection_r_to_l</Icon>,
      route: "/detailed-view",
      component: (
        <PrivateRoute>
          <DetailedTables />
        </PrivateRoute>
      ),
    },

    {
      type: "noCollapse",
      name: "Location",
      key: "location",
      icon: <Icon fontSize="small">receipt_long</Icon>,
      route: "/master/location",
      component: (
        <PrivateRoute>
          <LocationsTable />
        </PrivateRoute>
      ),
    },

    {
      type: "noCollapse",
      name: "Warehouse",
      key: "warehouse",
      icon: <Icon fontSize="small">receipt_long</Icon>,
      route: "/master/warehouse",
      component: (
        <PrivateRoute>
          <WarehouseTable />
        </PrivateRoute>
      ),
    },

    {
      type: "noCollapse",
      name: "Sellers",
      key: "sellers",
      icon: <Icon fontSize="small">table_view</Icon>,
      route: "/master/sellers",
      component: (
        <PrivateRoute>
          <SellersTable />
        </PrivateRoute>
      ),
    },

    {
      type: "noCollapse",
      name: "Vendors ",
      key: "vendors",
      icon: <Icon fontSize="small">table_view</Icon>,
      route: "/master/vendors",
      component: (
        <PrivateRoute>
          <VendorsTable />
        </PrivateRoute>
      ),
    },

    {
      type: "noCollapse",
      name: "User Tables",
      key: "user-table",
      icon: <Icon fontSize="small">table_view</Icon>,
      route: "/tables/user-table",
      component: (
        <PrivateRoute>
          <UserTable />
        </PrivateRoute>
      ),
    },

    {
      type: "noCollapse",
      name: "Role Tables",
      key: "role-table",
      icon: <Icon fontSize="small">table_view</Icon>,
      route: "/tables/role-table",
      component: (
        <PrivateRoute>
          <RolesTable />
        </PrivateRoute>
      ),
    },

    {
      type: "noCollapse",
      name: "Sign In",
      key: "sign-in",
      icon: <Icon fontSize="small">login</Icon>,
      route: "/authentication/sign-in",
      component: (
        <LoginRoute>
          <SignIn />
        </LoginRoute>
      ),
    },
  ];
} else {
  xyz = [
    {
      type: "collapse",
      name: "Dashboard",
      key: "dashboard",
      icon: <Icon fontSize="small">dashboard</Icon>,
      route: "/dashboard",
      component: (
        <PrivateRoute>
          <Dashboard />
        </PrivateRoute>
      ),
    },
    {
      type: "collapse",
      name: "User Management",
      key: "user-management",
      icon: <Icon fontSize="small">table_view</Icon>,
      route: "/user-management",
      component: (
        <PrivateRoute>
          <Tables />
        </PrivateRoute>
      ),
    },

    {
      type: "collapse",
      name: "Master",
      key: "master",
      icon: <Icon fontSize="small">receipt_long</Icon>,
      route: "/master",
      component: (
        <PrivateRoute>
          <MasterTables />
        </PrivateRoute>
      ),
    },

    {
      type: "collapse",
      name: "Detailed View",
      key: "detailed-view",
      icon: <Icon fontSize="small">format_textdirection_r_to_l</Icon>,
      route: "/detailed-view",
      component: (
        <PrivateRoute>
          <DetailedTables />
        </PrivateRoute>
      ),
    },

    {
      type: "noCollapse",
      name: "Location",
      key: "location",
      icon: <Icon fontSize="small">receipt_long</Icon>,
      route: "/master/location",
      component: (
        <PrivateRoute>
          <LocationsTable />
        </PrivateRoute>
      ),
    },

    {
      type: "noCollapse",
      name: "Warehouse",
      key: "warehouse",
      icon: <Icon fontSize="small">receipt_long</Icon>,
      route: "/master/warehouse",
      component: (
        <PrivateRoute>
          <WarehouseTable />
        </PrivateRoute>
      ),
    },

    {
      type: "noCollapse",
      name: "Sellers",
      key: "sellers",
      icon: <Icon fontSize="small">table_view</Icon>,
      route: "/master/sellers",
      component: (
        <PrivateRoute>
          <SellersTable />
        </PrivateRoute>
      ),
    },

    {
      type: "noCollapse",
      name: "Vendors ",
      key: "vendors",
      icon: <Icon fontSize="small">table_view</Icon>,
      route: "/master/vendors",
      component: (
        <PrivateRoute>
          <VendorsTable />
        </PrivateRoute>
      ),
    },

    {
      type: "noCollapse",
      name: "User Tables",
      key: "user-table",
      icon: <Icon fontSize="small">table_view</Icon>,
      route: "/tables/user-table",
      component: (
        <PrivateRoute>
          <UserTable />
        </PrivateRoute>
      ),
    },

    {
      type: "noCollapse",
      name: "Role Tables",
      key: "role-table",
      icon: <Icon fontSize="small">table_view</Icon>,
      route: "/tables/role-table",
      component: (
        <PrivateRoute>
          <RolesTable />
        </PrivateRoute>
      ),
    },

    {
      type: "noCollapse",
      name: "Sign In",
      key: "sign-in",
      icon: <Icon fontSize="small">login</Icon>,
      route: "/authentication/sign-in",
      component: (
        <LoginRoute>
          <SignIn />
        </LoginRoute>
      ),
    },
  ];
}

const routes = xyz;

export default routes;
