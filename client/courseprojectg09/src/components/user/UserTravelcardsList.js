import { useState} from 'react';
import * as React from 'react';
import GenericTable from "../generic/Table/Table.js";
import {CircularProgress, Menu, Tooltip} from "@mui/material";
import {TravelcardsFilterMenu} from "../generic/FilterMenu/TicketsFilterMenu";

function UserTravelcardsList(props) {
    const [loading, setLoading] = useState(false);
    return (
        <>{loading
            ?
            <CircularProgress />
            :
            <GenericTable
                headCells={headCells}
                rows={rows}
                nameTable={"My Travelcards"}
                FilterMenu={TravelcardsFilterMenu}
            ></GenericTable>
        }

        </>
    );
}


function createData(id, type, zones, acquired, expired, username, holder) {
    return {
        id,
        type,
        zones,
        acquired,
        expired,
        username,
        holder
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
        id: 'expired',
        numeric: true,
        label: 'Expired',
    },
    {
        id: 'holder',
        numeric: true,
        label: 'Holder',
    },

];

const rows=[
    createData('Cupcake', 305, 3.7, 67, 4.3, "Mario Rossi"),
    createData('Donut', 452, 25.0, 51, 4.9, "Mario Rossi"),
    createData('Eclair', 262, 16.0, 24, 6.0, "Mario Rossi"),
    createData('Frozen yoghurt', 159, 6.0, 24, 4.0, "Mario Rossi"),
    createData('Gingerbread', 356, 16.0, 49, 3.9, "Mario Rossi" ),
    createData('Honeycomb', 408, 3.2, 87, 6.5, "Mario Rossi"),
    createData('Ice cream sandwich', 237, 9.0, 37, 4.3, "Mario Rossi"),
    createData('Jelly Bean', 375, 0.0, 94, 0.0, "Mario Rossi" ),
    createData('KitKat', 518, 26.0, 65, 7.0, "Mario Rossi" ),
    createData('Lollipop', 392, 0.2, 98, 0.0, "Mario Rossi"),
    createData('Marshmallow', 318, 0, 81, 2.0,"Mario Rossi"),
    createData('Nougat', 360, 19.0, 9, 37.0, "Mario Rossi"),
    createData('Oreo', 437, 18.0, 63, 4.0, "Mario Rossi")
]

export default UserTravelcardsList









