import {useEffect, useState, Spinner} from 'react';
import * as React from 'react';
import GenericTable from "../generic/Table/Table.js";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import {CircularProgress, Menu, Tooltip} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import FilterListIcon from '@mui/icons-material/FilterList';
import MenuItem from "@mui/material/MenuItem";

function UserTicketsList(props) {
    const [loading, setLoading] = useState(false);
    return (
        <>{loading
            ?
            <CircularProgress />
            :
            <GenericTable
                headCells={headCells}
                rows={rows}
                nameTable={"My Tickets"}
                FilterMenu={FilterMenu}
            ></GenericTable>
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
        <MenuItem onClick={handleClose}>Purchased tickets(All) </MenuItem>
        <MenuItem onClick={handleClose}>Valid tickets </MenuItem>
        <MenuItem onClick={handleClose}>Validated tickets</MenuItem>
        <MenuItem onClick={handleClose}>Expired Tickets</MenuItem>
    </Menu>
    );
}
function createData(id, type, zones, acquired, validated, expired) {
    return {
        id,
        type,
        zones,
        acquired,
        validated,
        expired,
    };
}

const headCells = [
    {
        id: 'id',
        numeric: false,
        label: 'ID',
    },
    {
        id: 'type',
        numeric: false,
        label: 'Type',
    },
    {
        id: 'zones',
        numeric: false,
        label: 'Zones allowed',
    },
    {
        id: 'acquired',
        numeric: true,
        label: 'Acquired',
    },
    {
        id: 'validated',
        numeric: true,
        label: 'Validated',
    },
    {
        id: 'expired',
        numeric: true,
        label: 'Expired',
    },

];
const rows=[
    createData('Cupcake', 305, 3.7, 67, 4.3, 1.0),
    createData('Donut', 452, 25.0, 51, 4.9, 1.0),
    createData('Eclair', 262, 16.0, 24, 6.0,1.0),
    createData('Frozen yoghurt', 159, 6.0, 24, 4.0, 1.0),
    createData('Gingerbread', 356, 16.0, 49, 3.9, 1.0),
    createData('Honeycomb', 408, 3.2, 87, 6.5, 1.0),
    createData('Ice cream sandwich', 237, 9.0, 37, 4.3, 1.0),
    createData('Jelly Bean', 375, 0.0, 94, 0.0, 1.0),
    createData('KitKat', 518, 26.0, 65, 7.0, 1.0),
    createData('Lollipop', 392, 0.2, 98, 0.0, 1.0),
    createData('Marshmallow', 318, 0, 81, 2.0,1.0),
    createData('Nougat', 360, 19.0, 9, 37.0, 1.0),
    createData('Oreo', 437, 18.0, 63, 4.0, 1.0)
]

export default UserTicketsList









