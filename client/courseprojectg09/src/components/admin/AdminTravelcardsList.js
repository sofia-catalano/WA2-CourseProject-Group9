import {CircularProgress, Menu} from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import {useState} from "react";
import GenericTable from "../generic/Table/Table";
import {TravelcardsFilterMenu} from "../generic/FilterMenu/TicketsFilterMenu";


function AdminTravelcardsList(props) {
    const [loading, setLoading] = useState(false);
    return (
        <>{loading
            ?
            <CircularProgress />
            :
            <GenericTable
                headCells={headCells}
                rows={rows}
                nameTable={"Travelcards"}
                FilterMenu={TravelcardsFilterMenu}
            ></GenericTable>
        }

        </>
    );
}

function createData(id, type, zones, acquired, validated, expired, username) {
    return {
        id,
        type,
        zones,
        acquired,
        validated,
        expired,
        username
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
        id: 'username',
        numeric: false,
        label: 'Username',
    },

];
const rows=[
    createData('Cupcake', 305, 3.7, 67, 4.3, 'Mario'),
    createData('Donut', 452, 25.0, 51, 4.9, 'Mario'),
    createData('Eclair', 262, 16.0, 24, 6.0, 'Mario'),
    createData('Frozen yoghurt', 159, 6.0, 24, 4.0, 'Mario'),
    createData('Gingerbread', 356, 16.0, 49, 3.9, 'Mario'),
    createData('Honeycomb', 408, 3.2, 87, 6.5, 'Mario'),
    createData('Ice cream sandwich', 237, 9.0, 37, 4.3, 'Mario'),
    createData('Jelly Bean', 375, 0.0, 94, 0.0, 'Mario'),
    createData('KitKat', 518, 26.0, 65, 7.0, 'Mario'),
    createData('Lollipop', 392, 0.2, 98, 0.0, 'Mario'),
    createData('Marshmallow', 318, 0, 81, 2.0,'Mario'),
    createData('Nougat', 360, 19.0, 9, 37.0, 'Mario'),
    createData('Oreo', 437, 18.0, 63, 4.0, 'Mario')
]
export default AdminTravelcardsList;
