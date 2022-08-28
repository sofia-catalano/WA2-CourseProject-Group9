import {useEffect, useState, Spinner} from 'react';
import * as React from 'react';
import GenericTable from "../generic/Table/Table.js";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import {CircularProgress, Menu, Tooltip} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import FilterListIcon from '@mui/icons-material/FilterList';
import MenuItem from "@mui/material/MenuItem";
import {TicketsFilterMenu} from "../generic/FilterMenu/TicketsFilterMenu";
import moment from "moment";
import travelerAPI from "../../api/TravelerAPI";

function UserTicketsList(props) {
    const [loading, setLoading] = useState(false);
    const [data, setData]=useState([])
    const typeTicket = (date1, date2) =>{
        let diff= moment(date1).diff(moment(date2), 'minutes')
        if(diff<60) {
            return diff+ ' minutes'
        }
        diff= moment(date1).diff(moment(date2), 'hours')
        if(diff<24){
            return diff + ' hours'
        }
        diff= moment(date1).diff(moment(date2), 'days')
        if(diff<7){
            return diff + ' days'
        }
    }
    useEffect(()=>{
        travelerAPI.getMyTickets()
            .then(r => {
                console.log(r)
                const tmp= r.map((element)=> {
                    return {
                        id:element.sub,
                        zones:element.zid,
                        acquired:  moment(element.iat).format('YYYY-MM-DD HH:mm:ss'),
                        validated: element.validated?  moment(element.validated).format('YYYY-MM-DD HH:mm:ss') : '',
                        expired: element.validated ?  moment(element.expired).format('YYYY-MM-DD HH:mm:ss') : '',
                        type: element.duration
                    }
                })
                setData(tmp)
                setLoading(false)
            })
            .catch(err => console.log(err))
    },[])
    return (
        <>{loading
            ?
            <CircularProgress />
            :
            <GenericTable
                headCells={headCells}
                rows={data}
                nameTable={"My Tickets"}
                FilterMenu={TicketsFilterMenu}
            ></GenericTable>
        }

        </>
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
    {
        id: 'type',
        numeric: false,
        label: 'Type',
    },
];

export default UserTicketsList









