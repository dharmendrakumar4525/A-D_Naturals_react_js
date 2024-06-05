// utils.js

/**
 * Gets the vendor name by ID.
 * @param {Array} vendors - The array of vendor objects.
 * @param {string} id - The ID of the vendor to find.
 * @param {string} warehouses - The warehouses of the vendor to find.
 * @param {string} sellers - The warehouses of the vendor to find.
 * @returns {string|null} - The name of the vendor if found, otherwise null.
 */
export const getVendorNameByID = (vendors, id) => {
  const vendor = vendors.find((vendor) => vendor._id === id);
  return vendor ? vendor.vendor_name : null;
};

export const getWarehouseNameByID = (warehouses, id) => {
  const warehouse = warehouses.find((warehouse) => warehouse._id === id);
  return warehouse ? warehouse.warehouse_name : null;
};

export const getSellerNameByID = (sellers, id) => {
  const seller = sellers.find((seller) => seller._id === id);
  return seller ? seller.name : null;
};

export const getExpenseNameByID = (expenses, id) => {
  const expense = expenses.find((expense) => expense._id === id);
  return expense ? expense.expense_name : null;
};

export function formatDate(isoDate) {
  const date = new Date(isoDate);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
  const year = date.getFullYear();

  return `${day}-${month}-${year}`;
}

export function getMonthName(date) {
  console.log(date);
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  let newDate = new Date(date);
  return monthNames[newDate.getMonth()];
}
