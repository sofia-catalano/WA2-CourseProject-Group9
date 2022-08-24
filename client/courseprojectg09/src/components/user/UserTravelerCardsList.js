import {useEffect, useState, Spinner} from 'react';
import * as React from 'react';
import GenericTable from "../generic/Table/Table.js";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import {CircularProgress, Menu, Tooltip} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import FilterListIcon from '@mui/icons-material/FilterList';
import MenuItem from "@mui/material/MenuItem";
import TicketsFilterMenu from "../generic/FilterMenu/TicketsFilterMenu";

function UserTravelerCardsList(props) {
    const [loading, setLoading] = useState(false);
    return (
        <>{loading
            ?
            <CircularProgress />
            :
            <GenericTable
                headCells={headCells}
                rows={rows}
                nameTable={"My TravelerCards"}
                FilterMenu={TicketsFilterMenu}
            ></GenericTable>
        }

        </>
    );
}
/*ù@Document(collection = "travelcardPurchased")
data class TravelcardPurchased(
    @Id
    @Indexed
    var sub : ObjectId = ObjectId.get(),
    var iat: Timestamp, //creation time
    var exp: Timestamp, //expiration time
    var zid: String,
    var jws: String,
    var typeId : ObjectId,
    var userId: String, //travelcard buyer
    var ownerId: String //travelcard holder
)*/

function createData(id, purchase_date, expiration_date, status, allowed_zone, owner) {
    return {
        id,
        purchase_date,
        expiration_date,
        status, //if now < expiration date then valid otherwise status = EXPIRED
        allowed_zone,
        owner,
    };
}

const headCells = [
    {
        id: 'id',
        numeric: false,
        label: 'ID',
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
        label: 'Status', //if now < expiration date then valid otherwise status = EXPIRED
    },
    {
        id: 'allowed_zones',
        numeric: false,
        label: 'Zones allowed',
    },
    {
        id: 'owner',
        numeric: true,
        label: 'Owner',
    }

];
const rows=[
    createData('1',"20-01-2022","20-01-2023","VALID","AB","Giuseppe Neri"),
    createData('2',"20-01-2022","20-01-2023","VALID","AB","Giuseppe Neri"),
    createData('3',"20-01-2022","20-02-2022","EXPIRED","A","Giuseppe Neri"),

]

export default UserTravelerCardsList









