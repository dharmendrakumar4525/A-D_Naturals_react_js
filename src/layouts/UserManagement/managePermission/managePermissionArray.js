const initialData = {
  _id: "",
  role: "",
  dashboard_permissions: [
    {
      isAllSelected: false,
      isAllCollapsed: false,
      ParentChildchecklist: [
        {
          id: 1,
          moduleName: "users",
          isSelected: false,
          isClosed: false,
          childList: [
            {
              id: 1,
              parent_id: 1,
              value: "add",
              isSelected: false,
            },
            {
              id: 2,
              parent_id: 1,
              value: "view",
              isSelected: false,
            },
            {
              id: 3,
              parent_id: 1,
              value: "Edit",
              isSelected: false,
            },
            {
              id: 4,
              parent_id: 1,
              value: "Delete",
              isSelected: false,
            },
          ],
        },
        {
          id: 2,
          moduleName: "roles",
          isSelected: false,
          isClosed: false,
          childList: [
            {
              id: 1,
              parent_id: 2,
              value: "add",
              isSelected: false,
            },
            {
              id: 2,
              parent_id: 2,
              value: "view",
              isSelected: false,
            },
            {
              id: 3,
              parent_id: 2,
              value: "Edit",
              isSelected: false,
            },
            {
              id: 4,
              parent_id: 2,
              value: "Delete",
              isSelected: false,
            },
          ],
        },
        {
          id: 3,
          moduleName: "Location",
          isSelected: false,
          isClosed: false,
          childList: [
            {
              id: 1,
              parent_id: 3,
              value: "add",
              isSelected: false,
            },
            {
              id: 2,
              parent_id: 3,
              value: "view",
              isSelected: false,
            },
            {
              id: 3,
              parent_id: 3,
              value: "Edit",
              isSelected: false,
            },
            {
              id: 4,
              parent_id: 3,
              value: "Delete",
              isSelected: false,
            },
          ],
        },
        {
          id: 4,
          moduleName: "Warehouse",
          isSelected: false,
          isClosed: false,
          childList: [
            {
              id: 1,
              parent_id: 4,
              value: "add",
              isSelected: false,
            },
            {
              id: 2,
              parent_id: 4,
              value: "view",
              isSelected: false,
            },
            {
              id: 3,
              parent_id: 4,
              value: "Edit",
              isSelected: false,
            },
            {
              id: 4,
              parent_id: 4,
              value: "Delete",
              isSelected: false,
            },
          ],
        },
        {
          id: 5,
          moduleName: "Vendor",
          isSelected: false,
          isClosed: false,
          childList: [
            {
              id: 1,
              parent_id: 5,
              value: "add",
              isSelected: false,
            },
            {
              id: 2,
              parent_id: 5,
              value: "view",
              isSelected: false,
            },
            {
              id: 3,
              parent_id: 5,
              value: "Edit",
              isSelected: false,
            },
            {
              id: 4,
              parent_id: 5,
              value: "Delete",
              isSelected: false,
            },
          ],
        },
        {
          id: 6,
          moduleName: "Seller",
          isSelected: false,
          isClosed: false,
          childList: [
            {
              id: 1,
              parent_id: 6,
              value: "add",
              isSelected: false,
            },
            {
              id: 2,
              parent_id: 6,
              value: "view",
              isSelected: false,
            },
            {
              id: 3,
              parent_id: 6,
              value: "Edit",
              isSelected: false,
            },
            {
              id: 4,
              parent_id: 6,
              value: "Delete",
              isSelected: false,
            },
          ],
        },
        {
          id: 7,
          moduleName: "Expense",
          isSelected: false,
          isClosed: false,
          childList: [
            {
              id: 1,
              parent_id: 7,
              value: "add",
              isSelected: false,
            },
            {
              id: 2,
              parent_id: 7,
              value: "view",
              isSelected: false,
            },
            {
              id: 3,
              parent_id: 7,
              value: "Edit",
              isSelected: false,
            },
            {
              id: 4,
              parent_id: 7,
              value: "Delete",
              isSelected: false,
            },
          ],
        },
        {
          id: 8,
          moduleName: "PurchaseOrder",
          isSelected: false,
          isClosed: false,
          childList: [
            {
              id: 1,
              parent_id: 8,
              value: "add",
              isSelected: false,
            },
            {
              id: 2,
              parent_id: 8,
              value: "view",
              isSelected: false,
            },
            {
              id: 3,
              parent_id: 8,
              value: "Edit",
              isSelected: false,
            },
            {
              id: 4,
              parent_id: 8,
              value: "Delete",
              isSelected: false,
            },
          ],
        },
        {
          id: 9,
          moduleName: "WarehouseOrder",
          isSelected: false,
          isClosed: false,
          childList: [
            {
              id: 1,
              parent_id: 9,
              value: "add",
              isSelected: false,
            },
            {
              id: 2,
              parent_id: 9,
              value: "view",
              isSelected: false,
            },
            {
              id: 3,
              parent_id: 9,
              value: "Edit",
              isSelected: false,
            },
            {
              id: 4,
              parent_id: 9,
              value: "Delete",
              isSelected: false,
            },
          ],
        },
        {
          id: 10,
          moduleName: "SellerOrder",
          isSelected: false,
          isClosed: false,
          childList: [
            {
              id: 1,
              parent_id: 10,
              value: "add",
              isSelected: false,
            },
            {
              id: 2,
              parent_id: 10,
              value: "view",
              isSelected: false,
            },
            {
              id: 3,
              parent_id: 10,
              value: "Edit",
              isSelected: false,
            },
            {
              id: 4,
              parent_id: 10,
              value: "Delete",
              isSelected: false,
            },
          ],
        },
        {
          id: 11,
          moduleName: "WarehouseExpense",
          isSelected: false,
          isClosed: false,
          childList: [
            {
              id: 1,
              parent_id: 11,
              value: "add",
              isSelected: false,
            },
            {
              id: 2,
              parent_id: 11,
              value: "view",
              isSelected: false,
            },
            {
              id: 3,
              parent_id: 11,
              value: "Edit",
              isSelected: false,
            },
            {
              id: 4,
              parent_id: 11,
              value: "Delete",
              isSelected: false,
            },
          ],
        },
      ],
    },
  ],
  date: "2024-06-07T13:28:24.795Z",
  __v: 0,
};

export default initialData;
