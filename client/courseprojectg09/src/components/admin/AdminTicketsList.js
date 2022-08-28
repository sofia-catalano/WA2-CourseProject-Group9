import {CircularProgress, Menu} from "@mui/material";
import {useState, useEffect} from "react";
import GenericTable from "../generic/Table/Table";
import {TicketsFilterMenu} from "../generic/FilterMenu/TicketsFilterMenu";
import travelerAPI from "../../api/TravelerAPI";
import moment from "moment";
import typeTicket from "../../utils/TicketType";

function AdminTicketsList(props) {
    const [loading, setLoading] = useState(true);
    const [data, setData]=useState([]);
    const [typeTicketsSelected, setTypeTicketsSelected]=useState('all')
    const [nameTable, setNameTable]=useState('Tickets')

    const handleTypeTicketsSelectedChange=(event)=>{
        console.log("Event "+ event.target.value)
        setTypeTicketsSelected(event.target.value)
        if(event.target.value!= typeTicketsSelected){
            if(event.target.value== 'all'){
                console.log('all')
                getAllTravelersTicketPurchased()
            }
            else if(event.target.value == 'validated'){
                console.log('validated')
                travelerAPI.getTravelersTicketsValidated()
                    .then(r => {
                        setTickets(r)
                        setNameTable('Validated tickets')
                    })
                    .catch(err => console.log(err))
            }
            else if(event.target.value == 'valid'){
                console.log('validated')
                travelerAPI.getTravelersTicketsValid()
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
    const getAllTravelersTicketPurchased = () => {
        travelerAPI.getTravelersTicketsPurchased()
            .then(r => {
                setTickets(r)
                setNameTable('All tickets')
            })
            .catch(err => console.log(err))
    }

    useEffect(()=>{
        getAllTravelersTicketPurchased()
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
        id: 'username',
        numeric: false,
        label: 'Username',
    },
    {
        id: 'type',
        numeric: false,
        label: 'Type',
    },

];

export default AdminTicketsList;
