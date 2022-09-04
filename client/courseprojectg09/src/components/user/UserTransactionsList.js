import {useEffect, useState, Spinner} from 'react';
import * as React from 'react';
import GenericTable from "../generic/Table/Table.js";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import {CircularProgress, Menu, Tooltip} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import FilterListIcon from '@mui/icons-material/FilterList';
import MenuItem from "@mui/material/MenuItem";
import paymentAPI from "../../api/PaymentAPI";
import Loading from '../generic/Loading/Loading.js';
function UserTransactionsList(props) {
    const [loading, setLoading] = useState(false);
    const [transactions, setTransactions] = useState([])

    useEffect(() => {
        paymentAPI.getUserTransactions()
            .then((fetchedTransactions) => {
                fetchedTransactions.forEach(function (obj) {
                    obj['customerUsername'] && delete obj['customerUsername'];
                })
                setTransactions(fetchedTransactions);
            });
    }, []);


    return (
        <>{loading
            ?
            <Loading loading={loading}/>
            :
            <GenericTable
                headCells={headCells}
                rows={transactions}
                nameTable={"My Transactions"}
                FilterMenu={FilterMenu}
            />
        }

        </>
    );
}

function FilterMenu(props) {
    const {open, anchorEl, handleClose} = props

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
        numeric: false,
        label: 'Order Id',
    },

];

export default UserTransactionsList









