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
import axios from "axios";
import {
  GET_WAREHOUSE_EXPENSE_API,
  GET_PURCHASEORDER_API,
  GET_WAREHOUSEORDER_API,
  GET_SELLERORDER_API,
} from "environments/apiPaths";
import { environment } from "environments/environment";

const formatDate = (date) => {
  const d = new Date(date);
  return d.toISOString().split("T")[0];
};

function getStartOfWeek(date) {
  const start = new Date(date);
  const day = start.getDay();
  const diff = start.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
  start.setDate(diff);
  start.setHours(0, 0, 0, 0);
  return start;
}

export const PurchaseChartData = async () => {
  try {
    const PurchaseOrderResponse = await axios.get(
      `${environment.api_path}${GET_PURCHASEORDER_API}`
    );
    const PurchaseOrdersList = PurchaseOrderResponse.data.data;

    const today = new Date();
    const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(endOfWeek.getDate() + 6);

    const currentWeekOrderQty = [];

    for (let i = 0; i < 7; i++) {
      const currentDate = new Date(startOfWeek);
      currentDate.setDate(startOfWeek.getDate() + i);

      const ordersForCurrentDate = PurchaseOrdersList.filter((order) => {
        const orderDate = new Date(order.created_at);
        return formatDate(orderDate) === formatDate(currentDate);
      });

      const totalOrderQty = ordersForCurrentDate.reduce((sum, order) => sum + order.order_qty, 0);
      currentWeekOrderQty.push(totalOrderQty);
    }

    return {
      labels: ["M", "T", "W", "T", "F", "S", "S"],
      datasets: { label: "Purchase", data: currentWeekOrderQty },
    };
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

export const WareHouseChartData = async () => {
  try {
    const PurchaseOrderResponse = await axios.get(
      `${environment.api_path}${GET_WAREHOUSEORDER_API}`
    );
    const PurchaseOrdersList = PurchaseOrderResponse.data.data;
    const now = new Date();
    const startOfWeek = getStartOfWeek(now);

    // Initialize an array to store the net quantities for each day of the week
    const netQtyArray = Array(7).fill(0);

    // Process each entry
    PurchaseOrdersList.forEach((entry) => {
      const createdAt = new Date(entry.created_at);
      if (
        createdAt >= startOfWeek &&
        createdAt < new Date(startOfWeek.getTime() + 7 * 24 * 60 * 60 * 1000)
      ) {
        const dayIndex = Math.floor((createdAt - startOfWeek) / (24 * 60 * 60 * 1000));
        netQtyArray[dayIndex] += entry.received_qty - entry.rejected_qty;
      }
    });
    return {
      labels: ["M", "T", "W", "T", "F", "S", "S"],
      datasets: { label: "Inventory", data: netQtyArray },
    };
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

export const SellerChartData = async () => {
  try {
    const PurchaseOrderResponse = await axios.get(`${environment.api_path}${GET_SELLERORDER_API}`);
    const PurchaseOrdersList = PurchaseOrderResponse.data.data;

    const now = new Date();
    const startOfWeek = getStartOfWeek(now);

    // Initialize an array to store the consumed quantities for each day of the week
    const consumedQtyArray = Array(7).fill(0);

    // Process each entry
    PurchaseOrdersList.forEach((entry) => {
      const createdAt = new Date(entry.created_at);
      if (
        createdAt >= startOfWeek &&
        createdAt < new Date(startOfWeek.getTime() + 7 * 24 * 60 * 60 * 1000)
      ) {
        const dayIndex = Math.floor((createdAt - startOfWeek) / (24 * 60 * 60 * 1000));
        consumedQtyArray[dayIndex] += entry.consumed_qty;
      }
    });
    return {
      labels: ["M", "T", "W", "T", "F", "S", "S"],
      datasets: { label: "Sales", data: consumedQtyArray },
    };
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

//--------------------------------------------------------------

export const WareHouseChartDataBYID = async (warehouseId) => {
  try {
    const PurchaseOrderResponse = await axios.get(
      `${environment.api_path}${GET_WAREHOUSEORDER_API}`
    );
    const PurchaseOrdersList = PurchaseOrderResponse.data.data;
    const now = new Date();
    const startOfWeek = getStartOfWeek(now);

    // Initialize an array to store the net quantities for each day of the week
    const netQtyArray = Array(7).fill(0);

    // Filter the list based on warehouseId
    const filteredOrders = PurchaseOrdersList.filter((entry) => entry.warehouse === warehouseId);

    // Process each entry
    filteredOrders.forEach((entry) => {
      const createdAt = new Date(entry.created_at);
      if (
        createdAt >= startOfWeek &&
        createdAt < new Date(startOfWeek.getTime() + 7 * 24 * 60 * 60 * 1000)
      ) {
        const dayIndex = Math.floor((createdAt - startOfWeek) / (24 * 60 * 60 * 1000));
        netQtyArray[dayIndex] += entry.received_qty - entry.rejected_qty;
      }
    });
    return {
      labels: ["M", "T", "W", "T", "F", "S", "S"],
      datasets: { label: "Inventory", data: netQtyArray },
    };
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

export const SellerChartDataBYID = async (warehouseId) => {
  try {
    const PurchaseOrderResponse = await axios.get(`${environment.api_path}${GET_SELLERORDER_API}`);
    const PurchaseOrdersList = PurchaseOrderResponse.data.data;

    const now = new Date();
    const startOfWeek = getStartOfWeek(now);

    // Initialize an array to store the consumed quantities for each day of the week
    const consumedQtyArray = Array(7).fill(0);

    // Filter the list based on warehouseId
    const filteredOrders = PurchaseOrdersList.filter(
      (entry) => entry.seller_id.warehouse === warehouseId
    );

    // Process each entry
    filteredOrders.forEach((entry) => {
      const createdAt = new Date(entry.created_at);
      if (
        createdAt >= startOfWeek &&
        createdAt < new Date(startOfWeek.getTime() + 7 * 24 * 60 * 60 * 1000)
      ) {
        const dayIndex = Math.floor((createdAt - startOfWeek) / (24 * 60 * 60 * 1000));
        consumedQtyArray[dayIndex] += entry.consumed_qty;
      }
    });
    return {
      labels: ["M", "T", "W", "T", "F", "S", "S"],
      datasets: { label: "Sales", data: consumedQtyArray },
    };
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

export const WeeklySalesRevenueNyWareHouse = async (warehouseId) => {
  try {
    const PurchaseOrderResponse = await axios.get(`${environment.api_path}${GET_SELLERORDER_API}`);
    const PurchaseOrdersList = PurchaseOrderResponse.data.data;

    const now = new Date();
    const startOfWeek = getStartOfWeek(now);

    // Initialize an array to store the revenue for each day of the week
    const revenueArray = Array(7).fill(0);

    // Filter the list based on warehouseId
    const filteredOrders = PurchaseOrdersList.filter(
      (entry) => entry.seller_id.warehouse === warehouseId
    );

    // Process each entry
    filteredOrders.forEach((entry) => {
      const createdAt = new Date(entry.created_at);
      if (
        createdAt >= startOfWeek &&
        createdAt < new Date(startOfWeek.getTime() + 7 * 24 * 60 * 60 * 1000)
      ) {
        const dayIndex = Math.floor((createdAt - startOfWeek) / (24 * 60 * 60 * 1000));
        revenueArray[dayIndex] += entry.consumed_qty * 100;
      }
    });
    return {
      labels: ["M", "T", "W", "T", "F", "S", "S"],
      datasets: { label: "Revenue", data: revenueArray },
    };
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};
