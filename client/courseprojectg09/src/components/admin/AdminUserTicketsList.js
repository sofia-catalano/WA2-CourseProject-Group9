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
                        type: typeTicket(element.exp, element.iat)
                    }
                })
                setData(tmp)
                setLoading(false)
            })
            .catch(err => console.log(err))
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
                nameTable={user+"'s tickets"}
                FilterMenu={TicketsFilterMenu}
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
