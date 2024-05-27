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
