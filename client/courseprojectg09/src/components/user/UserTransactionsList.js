import {useEffect, useState, Spinner} from 'react';
import * as React from 'react';
import GenericTable from "../Table/Table.js";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import {CircularProgress, Menu, Tooltip} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import FilterListIcon from '@mui/icons-material/FilterList';
import MenuItem from "@mui/material/MenuItem";

function UserTransactionsList(props) {
    const [loading, setLoading] = useState(false);
    return (
        <>{loading
            ?
            <CircularProgress />
            :
            <GenericTable
                headCells={headCells}
                rows={rows}
                nameTable={"My Transactions"}
                FilterMenu={FilterMenu}
            />
        }

        </>
    );
}

function FilterMenu (props){
    const {open, anchorEl, handleClose}=props

    return (
        <Menu
            id="basic-menu"
            open={open}
            onClose={handleClose}
            MenuListProps={{
                'aria-labelledby': 'basic-button',
            }}
            anchorEl={anchorEl}
        >
            <MenuItem onClick={handleClose}>Accepted Transactions </MenuItem>
            <MenuItem onClick={handleClose}>Rejected Transactions </MenuItem>
        </Menu>
    );
}
function createData(id, amount, date, status, orderId) {
    return {
        id,
        amount,
        date,
        status,
        orderId,
    };
}

const headCells = [
    {
        id: 'id',
        numeric: false,
        label: 'ID',
    },
    {
        id: 'amount',
        numeric: true,
        label: 'Amount',
    },
    {
        id: 'date',
        numeric: true,
        label: 'Date',
    },
    {
        id: 'status',
        numeric: false,
        label: 'Status',
    },
    {
        id: 'orderId',
        numeric: true,
        label: 'Order Id',
    },

];
const rows=[
    createData('Cupcake', 305, "22-08-2022", "ACCEPTED", 123456789),
    createData('Donut', 452, "22-08-2022", "ACCEPTED", 223456789),
    createData('Eclair', 262, "22-08-2022", "ACCEPTED", 323456789),
    createData('Frozen yoghurt', 159, "22-08-2022", "REJECTED", 423456789),
    createData('Gingerbread', 356, "22-08-2022", "ACCEPTED", 523456789),
    createData('Honeycomb', 408, "22-08-2022", "ACCEPTED", 623456789),
    createData('Ice cream sandwich', 200,"22-08-2022", "REJECTED",723456789),
    createData('Jelly Bean', 375, "22-08-2022", "ACCEPTED", 823456789),
    createData('KitKat', 518, "22-08-2022", "REJECTED", 923456789),
    createData('Lollipop', 392, "22-08-2022", "ACCEPTED", 1023456789),
    createData('Marshmallow', 318, "22-08-2022", "REJECTED", 1123456789),
    createData('Nougat', 360, "22-08-2022", "ACCEPTED",1223456789),
    createData('Oreo', 437, "22-08-2022", "REJECTED", 1323456789)
]

export default UserTransactionsList









