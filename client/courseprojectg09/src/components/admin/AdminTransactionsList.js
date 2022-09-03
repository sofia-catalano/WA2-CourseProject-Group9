import {useEffect, useState} from 'react';
import * as React from 'react';
import GenericTable from "../generic/Table/Table.js";
import {CircularProgress, Menu, Tooltip} from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import paymentAPI from "../../api/PaymentAPI";
import Loading from '../generic/Loading/Loading.js';

function AdminTransactionsList(props) {
    const [loading, setLoading] = useState(false);
    const [transactions, setTransactions] = useState([])

    useEffect(() => {
        paymentAPI.getAllTransactions()
            .then((fetchedTransactions) => {
                setTransactions(fetchedTransactions);
            });
    }, [])

    return (
        <>{loading
            ?
            <Loading loading={loading}/>
            :
            <GenericTable
                headCells={headCells}
                rows={transactions}
                nameTable={"All Transactions"}
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
    {
        id: 'username',
        numeric: false,
        label: 'Username',
    },
];

export default AdminTransactionsList









