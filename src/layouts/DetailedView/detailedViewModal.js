/* eslint-disable react/prop-types */
/* eslint-disable react/function-component-definition */

import React, { useState, useEffect } from "react";
import axios from "axios";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import {
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { DateField } from "@mui/x-date-pickers/DateField";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
  display: "flex",
  gap: "1rem",
  flexDirection: "column",
};

export function SelectItem({
  availableItems,
  handleChange,
  selectedItem,
  fieldName,
  helperText,
  labelKey,
}) {
  return (
    <div>
      <FormControl sx={{ m: 0, minWidth: 80 }}>
        <InputLabel id="demo-simple-select-autowidth-label">{fieldName}</InputLabel>
        <Select
          label={fieldName}
          labelId="demo-simple-select-autowidth-label"
          id="demo-simple-select-autowidth"
          value={selectedItem}
          onChange={handleChange}
          autoWidth
          sx={{ height: "2.75rem", width: "330px" }}
        >
          {availableItems.map((item) => (
            <MenuItem key={item._id} value={item._id}>
              {item[labelKey]}
            </MenuItem>
          ))}
        </Select>
        <FormHelperText>{helperText}</FormHelperText>
      </FormControl>
    </div>
  );
}

export default function DetailedViewModal({ detailedId = null, setIsRefetch = () => {} }) {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [availableUsers, setAvailableUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [availableEntities, setAvailableEntities] = useState([]);
  const [selectedEntity, setSelectedEntity] = useState("");
  const [availableParticulars, setAvailableParitulars] = useState([]);
  const [selectedParticular, setSelectedParticular] = useState("");
  const [formData, setFormData] = useState({
    user_id: "",
    company_id: "",
    compliance_id: "",
    doc: "",
  });
  const [selectedDate, setSelectedDate] = useState(null);
  const Login_User_OrgId = localStorage.getItem("Login_User_OrgId");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const usersResponse = await axios.get(`http://localhost:3000/api/web/users`);
        const userData = usersResponse.data.filter((user) => user.role === "user");

        const normalUserData = userData.filter((user) => user.org_id === Login_User_OrgId);

        setAvailableUsers(normalUserData);

        const allCompaniesResponse = await axios.get(`http://localhost:3000/api/web/company`);
        const allCompanyData = allCompaniesResponse.data.data;
        const entityData = allCompanyData.filter((entity) => entity.parent_id === Login_User_OrgId);
        setAvailableEntities(entityData);

        const complianceResponse = await axios.get(`http://localhost:3000/api/web/compliance`);
        const complianceData = complianceResponse.data.data;
        setAvailableParitulars(complianceData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async () => {
    try {
      let formData;
      if (detailedId) {
        console.log("HEOLDJSSCDJVDJ");
        formData = {
          doc: document.getElementById("date")?.value || "",
          // doc: "7777-7-7",
        };

        await axios.put(`http://localhost:3000/api/web/complianceDetails/${detailedId}`, formData);
      } else {
        formData = {
          user_id: selectedUser,
          company_id: selectedEntity,
          compliance_id: selectedParticular,
          doc: null,
        };

        await axios.post(`http://localhost:3000/api/web/complianceDetails`, formData);
        window.location.reload();
      }
      setIsRefetch(true);
      handleClose();
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  // const handleInputChange = (event) => {
  //   setFormData({ ...formData, [event.target.id]: event.target.value });
  // };

  const handleChangeUser = (event) => {
    setSelectedUser(event.target.value);
  };

  const handleChangeEntity = (event) => {
    setSelectedEntity(event.target.value);
  };

  const handleChangeParticular = (event) => {
    setSelectedParticular(event.target.value);
  };

  const handleDateChange = (date) => {
    console.log("date111", date);
    setSelectedDate(date);
  };

  const handleInputChange = (event) => {
    setFormData({ ...formData, [event.target.id]: event.target.value });
  };

  return (
    <div>
      {detailedId ? (
        <div>
          <EditIcon onClick={handleOpen} />
          <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={{ ...style, width: "30%" }}>
              {/* <FormControl>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DemoContainer components={["DateField"]}>
                    <DatePicker
                      id="doc"
                      label="Enter Date of Completion"
                      onChange={handleDateChange}
                    />
                  </DemoContainer>
                </LocalizationProvider>
                {/* <ChildComponent selectedDate={selectedDate} /> */}
              {/* </FormControl> */}
              <FormControl>
                <TextField
                  id="date"
                  label="Date"
                  variant="outlined"
                  value={formData.date}
                  onChange={handleInputChange}
                  InputProps={{
                    style: {
                      height: "50px",
                    },
                  }}
                />
                <FormHelperText>Enter Date</FormHelperText>
              </FormControl>
              <FormControl>
                <Button
                  variant="contained"
                  color="primary"
                  style={{ color: "white" }}
                  onClick={handleSubmit}
                >
                  Submit
                </Button>
              </FormControl>
            </Box>
          </Modal>
        </div>
      ) : (
        <div>
          <Button variant="text" style={{ color: "white" }} onClick={handleOpen}>
            +Add Record
          </Button>
          <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={style}>
              <FormControl>
                <SelectItem
                  availableItems={availableUsers}
                  handleChange={handleChangeUser}
                  selectedItem={selectedUser}
                  fieldName={"User"}
                  helperText={"Select User"}
                  labelKey={"name"}
                />
              </FormControl>
              <FormControl>
                <SelectItem
                  availableItems={availableEntities}
                  handleChange={handleChangeEntity}
                  selectedItem={selectedEntity}
                  fieldName={"Entity"}
                  helperText={"Assign Entity"}
                  labelKey={"name"}
                />
              </FormControl>
              <FormControl>
                <SelectItem
                  availableItems={availableParticulars}
                  handleChange={handleChangeParticular}
                  selectedItem={selectedParticular}
                  fieldName={"Compliance"}
                  helperText={"Assign Compliance"}
                  labelKey={"particular"}
                />
              </FormControl>
              <FormControl>
                <Button
                  variant="contained"
                  color="primary"
                  style={{ color: "white" }}
                  onClick={handleSubmit}
                >
                  Submit
                </Button>
              </FormControl>
            </Box>
          </Modal>
        </div>
      )}
    </div>
  );
}
