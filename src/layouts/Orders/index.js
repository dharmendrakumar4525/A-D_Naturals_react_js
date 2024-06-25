import Grid from "@mui/material/Grid";
import MDBox from "components/MDBox";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import ComplexStatisticsCard from "examples/Cards/StatisticsCards/ComplexStatisticsCard";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import {
  GET_PURCHASEORDER_API,
  GET_WAREHOUSEORDER_API,
  GET_SELLERORDER_API,
} from "environments/apiPaths";
import { environment } from "environments/environment";
import { axiosInstance } from "environments/environment";
import LoadingOverlay from "validatorsFunctions/LoadingOverlay";

function OrderTable() {
  const [purchaseOrderCount, setPurchaseOrderCount] = useState([]);
  const [sellerOrderCount, setSellerOrderCount] = useState([]);
  const [warehouseOrderCount, setWarehouseOrderCount] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCount = async () => {
      try {
        //const sellerOrderResponse = await axios.get(`${environment.api_path}/${GET_SELLER_API}`);
        const purchaseOrderResponse = await axiosInstance.get(`${GET_PURCHASEORDER_API}`);
        const warehouseOrderResponse = await axiosInstance.get(`${GET_WAREHOUSEORDER_API}`);

        const sellerOrderResponse = await axiosInstance.get(`${GET_SELLERORDER_API}`);

        //const sellerData = sellerOrderResponse.data.length;
        const purchaseData = purchaseOrderResponse.data.data.length;
        const warehouseData = warehouseOrderResponse.data.data.length;
        const SellerData = sellerOrderResponse.data.data.length;
        setSellerOrderCount(SellerData);
        setPurchaseOrderCount(purchaseData);
        setWarehouseOrderCount(warehouseData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchCount();
  }, []);

  return (
    <DashboardLayout>
      {loading && <LoadingOverlay />}
      {!loading && (
        <>
          <DashboardNavbar />
          <MDBox py={3}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6} lg={3}>
                <MDBox mb={1.5}>
                  <Link to="/view-orders/purchase-orders">
                    <ComplexStatisticsCard
                      color="primary"
                      icon="person_add"
                      title="Purchase Orders"
                      count={purchaseOrderCount}
                      percentage={{
                        color: "success",
                        amount: "",
                        label: " Purchase Orders Table",
                      }}
                      z
                    />
                  </Link>
                </MDBox>
              </Grid>
              <Grid item xs={12} md={6} lg={3}>
                <MDBox mb={1.5}>
                  <Link to="/view-orders/warehouse-orders">
                    <ComplexStatisticsCard
                      color="primary"
                      icon="person_add"
                      title="Warehouse Orders"
                      count={warehouseOrderCount}
                      percentage={{
                        color: "success",
                        amount: "",
                        label: "Warehouse Orders Table",
                      }}
                      z
                    />
                  </Link>
                </MDBox>
              </Grid>
              <Grid item xs={12} md={6} lg={3}>
                <MDBox mb={31.5}>
                  <Link to="/view-orders/seller-orders">
                    <ComplexStatisticsCard
                      color="primary"
                      icon="person_add"
                      title="Seller Orders"
                      count={sellerOrderCount}
                      percentage={{
                        color: "success",
                        amount: "",
                        label: " Sellers Orders Table",
                      }}
                      z
                    />
                  </Link>
                </MDBox>
              </Grid>
            </Grid>
          </MDBox>
          <Footer />
        </>
      )}
    </DashboardLayout>
  );
}

export default OrderTable;
