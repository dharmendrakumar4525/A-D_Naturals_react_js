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
import WarehouseOrder from "layouts/Inventory/WarehouseOrder";
import PendingSellerOrder from "layouts/Inventory/SellerOrder";
import PurchaseOrder from "layouts/Inventory/PurchaseOrder";
import { LoginRoute } from "loginRedirect";
import InventoryTable from "layouts/Inventory";
import OrderTable from "layouts/Orders";
import PurchaseOrderTable from "layouts/Orders/PurchaseOrders";
import SellerOrderTable from "layouts/Orders/SellerOrders";
import WarehouseOrderTable from "layouts/Orders/WarehouseOrders";
import EditPurchaseOrder from "layouts/Orders/PurchaseOrders/EditPurchaseOrder";
import WarehouseOrderForm from "layouts/Inventory/WarehouseOrder/WarehouseOrderForm";
import EditWareHouseOrder from "layouts/Orders/WarehouseOrders/EditWareHouseOrder";
import SellerOrderForm from "layouts/Inventory/SellerOrder/CreateSellerOrderForm";
import ExpenseTable from "layouts/Master/expenses";
import WareHouseExpenseTable from "layouts/WarehouseExpenses";
import EditExpense from "layouts/WarehouseExpenses/EditExpenses";
import AddExpense from "layouts/WarehouseExpenses/AddExpenses";

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
    name: "Expense",
    key: "expenses",
    icon: <Icon fontSize="small">table_view</Icon>,
    route: "/master/expenses",
    component: (
      <PrivateRoute>
        <ExpenseTable />
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

  {
    type: "collapse",
    name: "Inventory",
    key: "Inventory",
    icon: <Icon fontSize="small">receipt_long</Icon>,
    route: "/inventory",
    component: (
      <PrivateRoute>
        <InventoryTable />
      </PrivateRoute>
    ),
  },

  {
    type: "noCollapse",
    name: "PurchaseOrder",
    key: "PurchaseOrder",
    icon: <Icon fontSize="small">receipt_long</Icon>,
    route: "/inventory/purchase-order",
    component: (
      <PrivateRoute>
        <PurchaseOrder />
      </PrivateRoute>
    ),
  },

  {
    type: "noCollapse",
    name: "WarehouseOrder",
    key: "warehouseOrder",
    icon: <Icon fontSize="small">receipt_long</Icon>,
    route: "/inventory/warehouse-order",
    component: (
      <PrivateRoute>
        <WarehouseOrder />
      </PrivateRoute>
    ),
  },

  {
    type: "noCollapse",
    name: "Pending SellerOrder",
    key: "PendingsellerOrder",
    icon: <Icon fontSize="small">receipt_long</Icon>,
    route: "/inventory/pending-seller-order",
    component: (
      <PrivateRoute>
        <PendingSellerOrder />
      </PrivateRoute>
    ),
  },
  {
    type: "collapse",
    name: "Orders",
    key: "Orders",
    icon: <Icon fontSize="small">receipt_long</Icon>,
    route: "/view-orders",
    component: (
      <PrivateRoute>
        <OrderTable />
      </PrivateRoute>
    ),
  },

  {
    type: "noCollapse",
    name: "PurchaseOrderTable",
    key: "PurchaseOrderTable",
    icon: <Icon fontSize="small">receipt_long</Icon>,
    route: "/view-orders/purchase-orders",
    component: (
      <PrivateRoute>
        <PurchaseOrderTable />
      </PrivateRoute>
    ),
  },

  {
    type: "noCollapse",
    name: "WarehouseOrderTable",
    key: "warehouseOrderTable",
    icon: <Icon fontSize="small">receipt_long</Icon>,
    route: "/view-orders/warehouse-orders",
    component: (
      <PrivateRoute>
        <WarehouseOrderTable />
      </PrivateRoute>
    ),
  },

  {
    type: "noCollapse",
    name: "SellerOrderTab;e",
    key: "sellerOrderTable",
    icon: <Icon fontSize="small">receipt_long</Icon>,
    route: "/view-orders/seller-orders",
    component: (
      <PrivateRoute>
        <SellerOrderTable />
      </PrivateRoute>
    ),
  },

  {
    type: "noCollapse",
    name: "Edit Purchase Order",
    key: "edit-purchase-order",
    route: "/view-orders/purchase-orders/edit-purchase-order",
    component: (
      <PrivateRoute>
        <EditPurchaseOrder />
      </PrivateRoute>
    ),
  },

  {
    type: "noCollapse",
    name: "Create Warehouse Order",
    key: "create-warehouse-order",
    route: "/inventory/warehouse-order/create-warehouse-order",
    component: (
      <PrivateRoute>
        <WarehouseOrderForm />
      </PrivateRoute>
    ),
  },
  {
    type: "noCollapse",
    name: "Edit Warehouse Order",
    key: "edit-warehouse-order",
    route: "/view-orders/warehouse-orders/edit-warehouse-order",
    component: (
      <PrivateRoute>
        <EditWareHouseOrder />
      </PrivateRoute>
    ),
  },

  {
    type: "noCollapse",
    name: "Create Seller Order",
    key: "create-Seller-order",
    route: "/inventory/pending-seller-order/create-seller-order",
    component: (
      <PrivateRoute>
        <SellerOrderForm />
      </PrivateRoute>
    ),
  },

  {
    type: "collapse",
    name: "Warehouse Expenses",
    key: "Warehouse_Expenses",
    icon: <Icon fontSize="small">table_view</Icon>,
    route: "/Warehouse-Expenses",
    component: (
      <PrivateRoute>
        <WareHouseExpenseTable />
      </PrivateRoute>
    ),
  },

  {
    type: "noCollapse",
    name: "Edit WareHouse Expense",
    key: "edit-wareHouse-expense",
    route: "/Warehouse-Expenses/edit-wareHouse-expense",
    component: (
      <PrivateRoute>
        <EditExpense />
      </PrivateRoute>
    ),
  },

  {
    type: "noCollapse",
    name: "Add WareHouse Expense",
    key: "add-wareHouse-expense",
    route: "/Warehouse-Expenses/add-wareHouse-expense",
    component: (
      <PrivateRoute>
        <AddExpense />
      </PrivateRoute>
    ),
  },
];

export default routes;
