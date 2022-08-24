import { useState} from 'react';
import * as React from 'react';
import GenericTable from "../generic/Table/Table.js";
import {CircularProgress, Menu, Tooltip} from "@mui/material";
import {TravelcardsFilterMenu} from "../generic/FilterMenu/TicketsFilterMenu";

function UserTravelCardsList(props) {
    const [loading, setLoading] = useState(false);
    return (
        <>{loading
            ?
            <CircularProgress />
            :
            <GenericTable
                headCells={headCells}
                rows={rows}
                nameTable={"My TravelCards"}
                FilterMenu={TravelcardsFilterMenu}
            ></GenericTable>
        }

        </>
    );
}

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

export default UserTravelCardsList









