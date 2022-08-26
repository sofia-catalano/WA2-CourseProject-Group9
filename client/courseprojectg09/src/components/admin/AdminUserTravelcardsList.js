import {CircularProgress, Menu} from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import {useState} from "react";
import GenericTable from "../generic/Table/Table";
import {useParams} from "react-router-dom";
import {TravelcardsFilterMenu} from "../generic/FilterMenu/TicketsFilterMenu";
import {useUser} from "../UserProvider";

function AdminUserTravelcardsList(props) {
    const {loggedIn, userRole, setUserRole, setLoggedIn}=useUser()
    const [loading, setLoading] = useState(false);
    const {user} = useParams();

    return (

        <>
            {loading
            ?
            <CircularProgress />
            :
            <GenericTable
                headCells={headCells}
                rows={rows}
                nameTable={user+"'s travelcards"}
                FilterMenu={TravelcardsFilterMenu}
            ></GenericTable>
        }

        </>
    );
}


function createData(id, type, purchase_date, expiration_date, status, allowed_zone, holder) {
    return {
        id,
        type,
        purchase_date,
        expiration_date,
        status, //if now < expiration date then valid otherwise status = EXPIRED
        allowed_zone,
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
        id: 'holder',
        numeric: true,
        label: 'Holder',
    },

];
const rows=[
    createData('1',"1 year", "20-01-2022","20-01-2023","VALID","AB","Giuseppe Neri"),
    createData('2',"1 year", "20-01-2022","20-01-2023","VALID","AB","Giuseppe Neri"),
    createData('3',"1 month", "20-01-2022","20-02-2022","EXPIRED","A","Giuseppe Neri"),
]
export default AdminUserTravelcardsList;
