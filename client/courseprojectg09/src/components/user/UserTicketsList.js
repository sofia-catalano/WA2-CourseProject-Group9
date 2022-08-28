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
    const [typeTicketsSelected, setTypeTicketsSelected]=useState('all')
    const [nameTable, setNameTable]=useState('Tickets')

    const handleTypeTicketsSelectedChange=(event)=>{
        console.log("Event "+ event.target.value)
        setTypeTicketsSelected(event.target.value)
        if(event.target.value!= typeTicketsSelected){
            if(event.target.value== 'all'){
                console.log('all')
                getAllTicketsPurchased()
            }
            else if(event.target.value == 'validated'){
                console.log('validated')
                travelerAPI.getMyTicketsValidated()
                    .then(r => {
                        setTickets(r)
                        setNameTable('Validated tickets')
                    })
                    .catch(err => console.log(err))
            }
            else if(event.target.value == 'valid'){
                console.log('valid')
                travelerAPI.getMyTicketsValid()
                    .then(r => {
                        setTickets(r)
                        setNameTable('Valid tickets')
                    })
                    .catch(err => console.log(err))
            }
        }
    }
    const setTickets= (result) => {
        const tmp= result.map((element)=> {
            return {
                id:element.sub,
                zones:element.zid,
                acquired:  moment(element.iat).format('YYYY-MM-DD HH:mm:ss'),
                validated: element.validated?  moment(element.validated).format('YYYY-MM-DD HH:mm:ss') : '',
                expired: element.validated ?  moment(element.expired).format('YYYY-MM-DD HH:mm:ss') : '',
                username:element.userID,
                type: element.duration
            }
        })
        setData(tmp)
        setLoading(false)
    }

    const getAllTicketsPurchased = () => {
        travelerAPI.getMyTickets()
            .then(r => {
                setTickets(r)
                setNameTable('All tickets')
            })
            .catch(err => console.log(err))
    }
    useEffect(()=>{
        getAllTicketsPurchased()
    },[])


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
                nameTable={nameTable}
                FilterMenu={TicketsFilterMenu}
                typeSelected={typeTicketsSelected}
                handleTypeSelectedChange={handleTypeTicketsSelectedChange}
            ></GenericTable>
        }

        </>
    );
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









