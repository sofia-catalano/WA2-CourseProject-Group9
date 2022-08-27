import {CircularProgress, Menu} from "@mui/material";
import {useState, useEffect} from "react";
import GenericTable from "../generic/Table/Table";
import {TravelcardsFilterMenu} from "../generic/FilterMenu/TicketsFilterMenu";
import travelerAPI from "../../api/TravelerAPI";
import moment from "moment";
import typeTicket from "../../utils/TicketType";

function AdminTravelcardsList(props) {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState([]);

    useEffect(()=>{
        travelerAPI.getTravelersTravelcardsPurchased()
        .then(r => {
            console.log(r)
            const tmp = r.map((element)=> {
                return {
                    id:element.sub,
                    type: typeTicket(element.exp, element.iat),
                    acquired:  moment(element.iat).format('YYYY-MM-DD HH:mm:ss'),
                    expired: moment(element.expired).format('YYYY-MM-DD HH:mm:ss'),
                    status:  (moment(element.expired)).diff(moment(), 'days') > 0 ? 'VALID' : 'EXPIRED',
                    zones:element.zid,
                    username:element.userId,
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
                nameTable={"Travelcards"}
                FilterMenu={TravelcardsFilterMenu}
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
        id: 'type',
        numeric: false,
        label: 'Type',
    },
    {
        id: 'acquired',
        numeric: false,
        label: 'Purchase Date',
    },
    {
        id: 'expired',
        numeric: false,
        label: 'Expiration Date',
    },
    {
        id: 'status',
        numeric: false,
        label: 'Status',
    },
    {
        id: 'zones',
        numeric: false,
        label: 'Zones allowed',
    },
    {
        id: 'username',
        numeric: false,
        label: 'Username',
    }
];

export default AdminTravelcardsList;
