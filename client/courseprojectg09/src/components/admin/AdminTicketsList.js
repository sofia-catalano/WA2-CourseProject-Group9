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

    const filterRows=()=>{
        console.log(" ")
    }

    useEffect(()=>{
        travelerAPI.getTravelersTicketsPurchased()
        .then(r => {
            const tmp= r.map((element)=> {
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
                nameTable={"Tickets"}
                FilterMenu={TicketsFilterMenu}
                filterRows={filterRows}
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
