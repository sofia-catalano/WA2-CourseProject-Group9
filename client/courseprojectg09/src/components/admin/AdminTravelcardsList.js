import {CircularProgress, Menu} from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import {useState} from "react";
import GenericTable from "../generic/Table/Table";
import {TravelcardsFilterMenu} from "../generic/FilterMenu/TicketsFilterMenu";


function AdminTravelcardsList(props) {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState([]);

    const typeTicket = (date1, date2) =>{
        let diff = moment(date1).diff(moment(date2), 'years')
        if(diff >= 1) {
            return '1 year'
        }else
            return '1 month'
    }

    useEffect(()=>{
        travelerAPI.getTravelersTravelcardsPurchased()
        .then(r => {
            console.log(r)
            const tmp = r.map((element)=> {
                return {
                    id:element.sub,
                    zones:element.zid,
                    acquired:  moment(element.iat).format('YYYY-MM-DD HH:mm:ss'),
                    expired: moment(element.expired).format('YYYY-MM-DD HH:mm:ss'),
                    username:element.userId,
                    type: typeTicket(element.exp, element.iat)
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
        id: 'username',
        numeric: false,
        label: 'Username',
    }
];

export default AdminTravelcardsList;
