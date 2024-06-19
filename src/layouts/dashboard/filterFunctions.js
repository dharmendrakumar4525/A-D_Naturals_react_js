import axios from "axios";
import {
  GET_WAREHOUSE_EXPENSE_API,
  GET_PURCHASEORDER_API,
  GET_WAREHOUSEORDER_API,
  GET_SELLERORDER_API,
} from "environments/apiPaths";
import { environment, axiosInstance } from "environments/environment";

const filterDataByDate = (data, filterType, year, month, quarter, halfYear) => {
  const startDate = new Date(year, 0, 1);
  let endDate;

  switch (filterType) {
    case "monthly":
      startDate.setMonth(month - 1);
      endDate = new Date(year, month, 0);
      break;
    case "quarterly":
      const quarterStartMonth = (quarter - 1) * 3;
      startDate.setMonth(quarterStartMonth);
      endDate = new Date(year, quarterStartMonth + 3, 0);
      break;
    case "halfyearly":
      const halfYearStartMonth = (halfYear - 1) * 6;
      startDate.setMonth(halfYearStartMonth);
      endDate = new Date(year, halfYearStartMonth + 6, 0);
      break;
    case "yearly":
      endDate = new Date(year, 11, 31);
      break;
    default:
      throw new Error("Invalid filter type");
  }

  return data.filter((item) => {
    const itemDate = new Date(item.created_at);
    return itemDate >= startDate && itemDate <= endDate;
  });
};

export const fetchFilterTotalPurchase = async (filterType, year, month, quarter, halfYear) => {
  try {
    const PurchaseOrderResponse = await axiosInstance.get(GET_PURCHASEORDER_API);
    const PurchaseOrdersList = PurchaseOrderResponse.data.data;
    const filteredData = filterDataByDate(
      PurchaseOrdersList,
      filterType,
      year,
      month,
      quarter,
      halfYear
    );

    let totalOrderQuantity = 0;
    let totalPrice = 0;
    let totalResale = 0;
    let TotalResaleValue = 0;

    filteredData.forEach((order) => {
      totalOrderQuantity += order.order_qty;
      totalPrice += order.price * order.order_qty;
      totalResale += parseInt(order.resale.qty);
      TotalResaleValue += order.resale.qty * order.resale.price;
    });

    totalOrderQuantity -= totalResale;
    totalPrice -= TotalResaleValue;

    return { totalOrderQuantity, totalPrice };
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

export const fetchFilterTotalWareHouseInventory = async (
  filterType,
  year,
  month,
  quarter,
  halfYear
) => {
  try {
    const WareHouseOrderResponse = await axiosInstance.get(GET_WAREHOUSEORDER_API);
    const WareHouseOrdersList = WareHouseOrderResponse.data.data;
    const SellerOrderResponse = await axiosInstance.get(GET_SELLERORDER_API);
    const SellerOrdersList = SellerOrderResponse.data.data;

    const filteredWareHouseData = filterDataByDate(
      WareHouseOrdersList,
      filterType,
      year,
      month,
      quarter,
      halfYear
    );
    const filteredSellerData = filterDataByDate(
      SellerOrdersList,
      filterType,
      year,
      month,
      quarter,
      halfYear
    );

    let totalReceived = 0;
    let TotalDamaged = 0;
    let TotalConsumed = 0;
    let TotalSellerReceived = 0;

    filteredWareHouseData.forEach((order) => {
      totalReceived += order.received_qty;
      TotalDamaged += order.rejected_qty;
    });

    filteredSellerData.forEach((order) => {
      TotalSellerReceived += order.received_qty;
      TotalConsumed += order.consumed_qty;
    });

    let totalInventory = totalReceived - TotalDamaged - TotalSellerReceived;

    return { totalInventory, TotalConsumed };
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

export const fetchFilterTotalExpense = async (filterType, year, month, quarter, halfYear) => {
  try {
    const WareHouseExpenseResponse = await axiosInstance.get(GET_WAREHOUSE_EXPENSE_API);
    const WareHouseExpenseList = WareHouseExpenseResponse.data.data;
    const filteredData = filterDataByDate(
      WareHouseExpenseList,
      filterType,
      year,
      month,
      quarter,
      halfYear
    );

    let totalExpense = 0;

    filteredData.forEach((item) => {
      item.expense.forEach((expenseItem) => {
        totalExpense += expenseItem.amount;
      });
    });

    return { totalExpense };
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

export const fetchFilterTotalWareHouseInventoryByWarehouseId = async (
  warehouseId,
  filterType,
  year,
  month,
  quarter,
  halfYear
) => {
  try {
    const WareHouseOrderResponse = await axiosInstance.get(GET_WAREHOUSEORDER_API);
    const WareHouseOrdersList = WareHouseOrderResponse.data.data;
    const SellerOrderResponse = await axiosInstance.get(GET_SELLERORDER_API);
    const SellerOrdersList = SellerOrderResponse.data.data;

    const filteredWareHouseData = filterDataByDate(
      WareHouseOrdersList,
      filterType,
      year,
      month,
      quarter,
      halfYear
    ).filter((order) => order.warehouse === warehouseId);
    const filteredSellerData = filterDataByDate(
      SellerOrdersList,
      filterType,
      year,
      month,
      quarter,
      halfYear
    ).filter((order) => order.seller_id.warehouse === warehouseId);

    let totalReceived = 0;
    let TotalDamaged = 0;
    let TotalConsumed = 0;
    let TotalSellerReceived = 0;

    filteredWareHouseData.forEach((order) => {
      totalReceived += order.received_qty;
      TotalDamaged += order.rejected_qty;
    });

    filteredSellerData.forEach((order) => {
      TotalSellerReceived += order.received_qty;
      TotalConsumed += order.consumed_qty;
    });

    let totalInventory = totalReceived - TotalDamaged - TotalSellerReceived;

    return { totalInventory, TotalConsumed };
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

export const fetchFilterTotalExpenseByWareHouseId = async (
  warehouseId,
  filterType,
  year,
  month,
  quarter,
  halfYear
) => {
  try {
    const WareHouseExpenseResponse = await axiosInstance.get(GET_WAREHOUSE_EXPENSE_API);
    const WareHouseExpenseList = WareHouseExpenseResponse.data.data;
    const filteredData = filterDataByDate(
      WareHouseExpenseList,
      filterType,
      year,
      month,
      quarter,
      halfYear
    ).filter((order) => order.warehouse === warehouseId);

    let totalExpense = 0;

    filteredData.forEach((item) => {
      item.expense.forEach((expenseItem) => {
        totalExpense += expenseItem.amount;
      });
    });

    return { totalExpense };
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};
