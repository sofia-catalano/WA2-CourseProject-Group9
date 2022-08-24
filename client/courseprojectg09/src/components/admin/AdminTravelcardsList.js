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

function createData(id, type, purchase_date, expiration_date, status, allowed_zone, username, holder) {
    return {
        id,
        type,
        purchase_date,
        expiration_date,
        status, //if now < expiration date then valid otherwise status = EXPIRED
        allowed_zone,
        username,
        holder,
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
        id: 'purchase_date',
        numeric: false,
        label: 'Purchase Date',
    },
    {
        id: 'expiration_date',
        numeric: false,
        label: 'Expiration Date',
    },
    {
        id: 'status',
        numeric: false,
        label: 'Status',
    },
    {
        id: 'allowed_zones',
        numeric: false,
        label: 'Zones allowed',
    },
    {
        id: 'username',
        numeric: false,
        label: 'Username',
    },
    {
        id: 'holder',
        numeric: false,
        label: 'Holder',
    },

];
const rows=[
    createData('1',"1 year", "20-01-2022","20-01-2023","VALID","AB","Giuseppe Neri","Giuseppe Neri"),
    createData('2',"1 year", "20-01-2022","20-01-2023","VALID","AB","Giuseppe Neri","Giuseppe Neri"),
    createData('3',"1 month", "20-01-2022","20-02-2022","EXPIRED","A","Giuseppe Neri","Giuseppe Neri"),
]
export default AdminTravelcardsList;
