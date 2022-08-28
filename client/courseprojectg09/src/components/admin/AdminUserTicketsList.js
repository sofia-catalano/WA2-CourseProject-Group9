import {CircularProgress, Menu} from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import {useEffect, useState} from "react";
import GenericTable from "../generic/Table/Table";
import {useParams} from "react-router-dom";
import {TicketsFilterMenu} from "../generic/FilterMenu/TicketsFilterMenu";
import {useUser} from "../UserProvider";
import travelerAPI from "../../api/TravelerAPI";
import moment from "moment";

function AdminTicketsList(props) {
    const {loggedIn, userRole, setUserRole, setLoggedIn}=useUser()
    const [loading, setLoading] = useState(false);
    const {user} = useParams();
    const [data, setData]=useState([])
    const [typeTicketsSelected, setTypeTicketsSelected]=useState('all')
    const [nameTable, setNameTable]=useState('Tickets')

    const handleTypeTicketsSelectedChange=(event)=>{
        console.log("Event "+ event.target.value)
        setTypeTicketsSelected(event.target.value)
        if(event.target.value!= typeTicketsSelected){
            if(event.target.value== 'all'){
                console.log('all')
                getAllTravelerTicketsPurchased()
            }
            else if(event.target.value == 'validated'){
                console.log('validated')
                setLoading(true)
                travelerAPI.getTravelerTicketsValidated(user)
                    .then(r => {
                        setTickets(r)
                        setNameTable('Validated tickets')
                    })
                    .catch(err => console.log(err))
            }
            else if(event.target.value == 'valid'){
                console.log('valid')
                setLoading(true)
                travelerAPI.getTravelerTicketsValid(user)
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
    const getAllTravelerTicketsPurchased = () => {
        setLoading(true)
        travelerAPI.getTravelerTicketPurchased(user)
            .then(r => {
                setTickets(r)
                setNameTable('All tickets')
            })
            .catch(err => console.log(err))
    }

    useEffect(()=>{
        getAllTravelerTicketsPurchased()
    },[])

    return (

        <>
            {loading
            ?
            <CircularProgress />
            :
            <GenericTable
                headCells={headCells}
                rows={data}
                nameTable={`${user} 's ${nameTable}`}
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

export default AdminTicketsList;
