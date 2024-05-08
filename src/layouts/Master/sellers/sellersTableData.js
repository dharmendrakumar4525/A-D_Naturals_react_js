/* eslint-disable react/prop-types */
/* eslint-disable react/function-component-definition */

import React, { useState, useEffect } from "react";
import axios from "axios";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import { environment } from "environments/environment";
import { GET_SELLER_API, GET_WAREHOUSE_API, GET_LOCATION_API } from "environments/apiPaths";
import DeleteIcon from "@mui/icons-material/Delete";
import SellerTableModal from "layouts/Master/sellers/sellersTableModal";

export default function data() {
  const [rowData, setRowData] = useState([]);
  const [isRefetch, setIsRefetch] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const sellerResponse = await axios.get(`${environment.api_path}/${GET_SELLER_API}`);
        const sellerData = sellerResponse.data.data;

        const warehouseResponse = await axios.get(`${environment.api_path}/${GET_WAREHOUSE_API}`);
        const warehouseData = warehouseResponse.data.data;

        const locationResponse = await axios.get(`${environment.api_path}/${GET_LOCATION_API}`);
        const locationData = locationResponse.data.data;

        const mappedData = sellerData.map((seller) => {
          // const sellerLocation = locationData.find((location) => {
          //   return location._id === seller.seller_location;
          // });

          const warehouse = warehouseData.find((warehouse) => {
            return warehouse._id === seller.warehouse;
          });

          // let seller_location;
          // if (sellerLocation && sellerLocation.location_name) {
          //   seller_location = sellerLocation.location_name;
          // } else {
          //   seller_location = "Not Known";
          // }

          return {
            ...seller,
            warehouse_name: warehouse ? warehouse.warehouse_name : "Not Known",
            // seller_location: seller_location,
          };
        });

        setRowData(mappedData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [isRefetch]);

  const handleDelete = async (sellerId) => {
    try {
      await axios.delete(`${environment.api_path}/${GET_SELLER_API}/${sellerId}`);
      setRowData((prevData) => prevData.filter((seller) => seller._id !== sellerId));
    } catch (error) {
      console.error("Error deleting seller:", error);
    }
  };

  const Author = ({ name, loaction }) => (
    <MDBox display="flex" alignItems="center" lineHeight={1}>
      <MDBox ml={2} lineHeight={1}>
        <MDTypography display="block" variant="button" fontWeight="medium">
          {name}
        </MDTypography>
        <MDTypography variant="caption">{loaction}</MDTypography>
      </MDBox>
    </MDBox>
  );

  const Job = ({ warehouseName }) => (
    <MDBox lineHeight={1} textAlign="left">
      <MDTypography display="block" variant="caption" color="text" fontWeight="medium">
        {warehouseName}
      </MDTypography>
    </MDBox>
  );

  return {
    columns: [
      { Header: "Name", accessor: "name", width: "45%", align: "left" },
      { Header: "Warehouse Location", accessor: "warehouse_location", align: "left" },
      { Header: "Action", accessor: "action", align: "center" },
    ],
    rows: rowData.map((seller) => ({
      name: <Author name={seller.seller_name} loaction={seller.seller_location} />,
      warehouse_location: <Job warehouseName={seller.warehouse_name} />,
      action: (
        <>
          <div style={{ display: "flex", alignItems: "center" }}>
            <MDTypography
              component="a"
              href="#"
              variant="caption"
              color="text"
              fontWeight="medium"
              onClick={() => handleDelete(seller._id)}
              style={{ marginRight: "8px" }}
            >
              <DeleteIcon />
            </MDTypography>
            <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
              <SellerTableModal sellerId={seller._id} setIsRefetch={setIsRefetch} />
            </MDTypography>
          </div>
        </>
      ),
    })),
  };
}
