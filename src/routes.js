/**
=========================================================
* Material Dashboard 2 React - v2.2.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

/** 
  All of the routes for the Material Dashboard 2 React are added here,
  You can add a new route, customize the routes and delete the routes here.

  Once you add a new route on this file it will be visible automatically on
  the Sidenav.

  For adding a new route you can follow the existing routes in the routes array.
  1. The `type` key with the `collapse` value is used for a route.
  2. The `type` key with the `title` value is used for a title inside the Sidenav. 
  3. The `type` key with the `divider` value is used for a divider between Sidenav items.
  4. The `name` key is used for the name of the route on the Sidenav.
  5. The `key` key is used for the key of the route (It will help you with the key prop inside a loop).
  6. The `icon` key is used for the icon of the route on the Sidenav, you have to add a node.
  7. The `collapse` key is used for making a collapsible item on the Sidenav that has other routes
  inside (nested routes), you need to pass the nested routes inside an array as a value for the `collapse` key.
  8. The `route` key is used to store the route location which is used for the react router.
  9. The `href` key is used to store the external links location.
  10. The `title` key is only for the item with the type of `title` and its used for the title text on the Sidenav.
  10. The `component` key is used to store the component of its route.
*/

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

const routes = [
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
    type: "collapse",
    name: "Sign In",
    key: "sign-in",
    icon: <Icon fontSize="small">login</Icon>,
    route: "/authentication/sign-in",
    component: <SignIn />,
  },
];

export default routes;
