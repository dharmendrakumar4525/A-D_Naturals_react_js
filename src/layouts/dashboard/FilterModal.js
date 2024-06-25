import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
} from "@mui/material";
import PropTypes from "prop-types";

const FilterModal = ({ open, onClose, onFilter }) => {
  const [filterType, setFilterType] = useState("");
  const [year, setYear] = useState("");
  const [month, setMonth] = useState("");
  const [quarter, setQuarter] = useState("");
  const [halfYear, setHalfYear] = useState("");
  const [warehouseId, setWarehouseId] = useState("");

  const months = [
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

  const handleFilter = () => {
    if (!filterType || !year || (filterType === "quarterly" && !quarter)) {
      return;
    }

    onFilter({ filterType, year, month, quarter, halfYear, warehouseId });
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Apply Filter</DialogTitle>
      <DialogContent>
        <FormControl sx={{ m: 1, minWidth: 250 }}>
          <InputLabel id="filter-type-label">Filter Type</InputLabel>
          <Select
            value={filterType}
            labelId="filter-type-label"
            id="filter-type-select"
            onChange={(e) => setFilterType(e.target.value)}
            label="Filter Type"
            sx={{ height: "2.75rem" }}
          >
            <MenuItem value="monthly">Monthly</MenuItem>
            <MenuItem value="quarterly">Quarterly</MenuItem>
            <MenuItem value="halfyearly">Half Yearly</MenuItem>
            <MenuItem value="yearly">Yearly</MenuItem>
          </Select>
        </FormControl>

        <FormControl sx={{ m: 1, minWidth: 250 }}>
          <InputLabel id="year-select-label">Year</InputLabel>
          <Select
            labelId="year-select-label"
            id="year-select"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            label="Year"
            sx={{ height: "2.75rem" }}
          >
            {Array.from({ length: 10 }, (_, i) => (
              <MenuItem key={i} value={2022 + i}>
                {2022 + i}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {filterType === "monthly" && (
          <FormControl sx={{ m: 1, minWidth: 250 }}>
            <InputLabel id="month-select-label">Month</InputLabel>
            <Select
              labelId="month-select-label"
              id="month-select"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              label="Month"
              sx={{ height: "2.75rem" }}
            >
              {months.map((monthName, index) => (
                <MenuItem key={index} value={index + 1}>
                  {monthName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}

        {filterType === "quarterly" && (
          <FormControl sx={{ m: 1, minWidth: 250 }}>
            <InputLabel id="quarter-select-label">Quarter</InputLabel>
            <Select
              labelId="quarter-select-label"
              id="quarter-select"
              value={quarter}
              onChange={(e) => setQuarter(e.target.value)}
              label="Quarter"
              sx={{ height: "2.75rem" }}
            >
              <MenuItem value={1}>Q1</MenuItem>
              <MenuItem value={2}>Q2</MenuItem>
              <MenuItem value={3}>Q3</MenuItem>
              <MenuItem value={4}>Q4</MenuItem>
            </Select>
          </FormControl>
        )}

        {filterType === "halfyearly" && (
          <FormControl sx={{ m: 1, minWidth: 250 }}>
            <InputLabel id="half-year-select-label">Half Year</InputLabel>
            <Select
              labelId="half-year-select-label"
              id="half-year-select"
              value={halfYear}
              onChange={(e) => setHalfYear(e.target.value)}
              label="Half Year"
              sx={{ height: "2.75rem" }}
            >
              <MenuItem value={1}>First Half</MenuItem>
              <MenuItem value={2}>Second Half</MenuItem>
            </Select>
          </FormControl>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleFilter} color="primary">
          Filter
        </Button>
      </DialogActions>
    </Dialog>
  );
};

FilterModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onFilter: PropTypes.func.isRequired,
};

export default FilterModal;
