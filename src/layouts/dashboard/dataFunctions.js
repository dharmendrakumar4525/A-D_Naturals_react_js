import axios from "axios";
import {
  GET_WAREHOUSE_EXPENSE_API,
  GET_PURCHASEORDER_API,
  GET_WAREHOUSEORDER_API,
  GET_SELLERORDER_API,
} from "environments/apiPaths";
import { environment } from "environments/environment";

// Your fetchTotalPurchase function
export const fetchTotalPurchase = async () => {
  try {
    const PurchaseOrderResponse = await axios.get(
      `${environment.api_path}${GET_PURCHASEORDER_API}`
    );
    const PurchaseOrdersList = PurchaseOrderResponse.data.data;
    const currentDate = new Date();
    const filteredByCurrentYear = PurchaseOrdersList.filter((order) => {
      const orderDate = new Date(order.created_at);
      return orderDate.getFullYear() === currentDate.getFullYear();
    });

    let totalOrderQuantity = 0;
    let totalPrice = 0;
    let totalResale = 0;
    let TotalResaleValue = 0;

    filteredByCurrentYear.forEach((order) => {
      totalOrderQuantity += order.order_qty;
      totalPrice += order.price * order.order_qty;
      totalResale += parseInt(order.resale.qty);
      TotalResaleValue += order.resale.qty * order.resale.price;
    });

    console.log(totalOrderQuantity, "total purchase");
    console.log(totalResale, "total resale");

    totalOrderQuantity -= totalResale;
    totalPrice -= TotalResaleValue;

    return { totalOrderQuantity: totalOrderQuantity, totalPrice: totalPrice };
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};
export const fetchTotalWareHouseInventory = async () => {
  try {
    const WareHouseOrderResponse = await axios.get(
      `${environment.api_path}${GET_WAREHOUSEORDER_API}`
    );
    const WareHouseOrdersList = WareHouseOrderResponse.data.data;

    const SellerOrderResponse = await axios.get(`${environment.api_path}${GET_SELLERORDER_API}`);
    const SellerOrdersList = SellerOrderResponse.data.data;

    const currentDate = new Date();
    const filteredByCurrentYear = WareHouseOrdersList.filter((order) => {
      const orderDate = new Date(order.created_at);
      return orderDate.getFullYear() === currentDate.getFullYear();
    });

    const filteredSellerByCurrentYear = SellerOrdersList.filter((order) => {
      const orderDate = new Date(order.created_at);
      return orderDate.getFullYear() === currentDate.getFullYear();
    });

    let totalReceived = 0;
    let TotalDamaged = 0;
    let TotalConsumed = 0;
    let TotalSellerReceived = 0;

    filteredByCurrentYear.forEach((order) => {
      totalReceived += order.received_qty;
      TotalDamaged += order.rejected_qty;
    });

    filteredSellerByCurrentYear.forEach((order) => {
      TotalSellerReceived = order.received_qty;
      TotalConsumed += order.consumed_qty;
    });

    let totalInventory = totalReceived - TotalDamaged - TotalSellerReceived;

    console.log(TotalSellerReceived);

    return { totalInventory: totalInventory, TotalConsumed: TotalConsumed };
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

export const fetchTotalExpense = async () => {
  try {
    const WareHouseExpenseResponse = await axios.get(
      `${environment.api_path}${GET_WAREHOUSE_EXPENSE_API}`
    );
    const WareHouseExpenseList = WareHouseExpenseResponse.data.data;
    const currentDate = new Date();
    const filteredByCurrentYear = WareHouseExpenseList.filter((order) => {
      const orderDate = new Date(order.created_at);
      return orderDate.getFullYear() === currentDate.getFullYear();
    });

    let totalExpense = 0;

    filteredByCurrentYear.forEach((item) => {
      item.expense.forEach((expenseItem) => {
        totalExpense += expenseItem.amount;
      });
    });

    return { totalExpense: totalExpense };
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};
