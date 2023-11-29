import * as React from "react";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

function createData(date, type, currency, status, history) {
  return {
    date,
    type,
    currency,
    status,
    history // ? Array (look MUI documentation for collapsible table for more info)
  };
}

function Row(props) {
  const { row } = props;
  const [open, setOpen] = React.useState(false);

  return (
    <React.Fragment>
      <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
        <TableCell
          sx={{
            fontSize: "2rem !important",
            backgroundColor: "#eee",
            "& .MuiSvgIcon-root": { fontSize: "2rem !important" },
          }}
        >
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell align="center" component="th" scope="row" sx={{ fontSize: "2rem !important", backgroundColor: "#eee" }}>
          {row.date}
        </TableCell>
        <TableCell align="center" component="th" scope="row" sx={{ fontSize: "2rem !important", backgroundColor: "#eee" }}>
          {row.type}
        </TableCell>
        <TableCell align="center" component="th" scope="row" sx={{ fontSize: "2rem !important", backgroundColor: "#eee" }}>
          {row.status}
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h4" gutterBottom component="div" sx={{ fontWeight: "bold", fontStyle: "italic", color: "#ACACAC" }}>
                Order content
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell
                      align="center" sx={{ fontSize: "2rem !important", fontWeight: "bold" }}
                    >
                      Product name
                    </TableCell>
                    <TableCell
                      align="center" sx={{ fontSize: "2rem !important", fontWeight: "bold" }}
                    >
                      Currency
                    </TableCell>
                    <TableCell
                      align="center" sx={{ fontSize: "2rem !important", fontWeight: "bold" }}
                    >
                      Price
                    </TableCell>
                    <TableCell
                      align="center" sx={{ fontSize: "2rem !important", fontWeight: "bold" }}
                    >
                      Units
                    </TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {row.history.map((historyRow, i) => (
                    <TableRow key={i}>
                      {/* {console.log("historyRow", historyRow)} */}
                      <TableCell
                        align="center"
                        sx={{ fontSize: "1.7rem !important" }}
                        component="th"
                        scope="row"
                      >
                        {historyRow.productName}
                      </TableCell>
                      <TableCell align="center" sx={{ fontSize: "1.7rem !important" }}>
                        {historyRow.orderCurrency}
                      </TableCell>
                      <TableCell align="center" sx={{ fontSize: "1.7rem !important" }}>
                        {Number(historyRow.orderPrice).toFixed(2)}
                      </TableCell>
                      <TableCell align="center" sx={{ fontSize: "1.7rem !important" }}>
                        {Number(historyRow.orderQuantity).toFixed()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

export default function TableCollapsibleMUI({ orders }) {
  const rows = [];

  Object.keys(orders).map(order => rows.push(createData(order.orderDate, order.orderType, order.orderCurrency, order.orderStatus,
    order.orderProducts.map(orderProduct => {
      return {
        productName: orderProduct.product.productName,
        orderPrice: orderProduct.orderProduct.orderPrice,
        orderCurrency: order.orderCurrency,
        orderQuantity: orderProduct.orderProduct.orderQuantity,
      };
    })
  )));

  return (
    <TableContainer component={Paper}>
      <Table aria-label="collapsible table">
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell align="center" sx={{ fontSize: "2rem !important", fontWeight: "bold", lineHeight: "2rem !important" }}>
              Product date
            </TableCell>
            <TableCell align="center" sx={{ fontSize: "2rem !important", fontWeight: "bold", lineHeight: "2rem !important" }}>
              Order type
            </TableCell>
            <TableCell align="center" sx={{ fontSize: "2rem !important", fontWeight: "bold", lineHeight: "2rem !important" }}>
              Status
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, i) => (
            <Row key={`${row.date}${i}`} row={row} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
