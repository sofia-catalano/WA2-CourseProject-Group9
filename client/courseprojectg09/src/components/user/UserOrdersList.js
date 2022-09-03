import {useState} from "react";
import {CircularProgress, Modal} from "@mui/material";
import GenericTable from "../generic/Table/Table";
import * as React from "react";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import catalogueAPI from "../../api/TicketCatalogueAPIs";
import Loading from '../generic/Loading/Loading.js';
const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

function UserOrdersList() {
    const [loading, setLoading] = useState(true);
    const [ticketOrders, setTicketOrders] = useState([])
    const [travelcardOrders, setTravelcardOrders] = useState([])

    React.useEffect(() => {
        catalogueAPI.getTravelerOrders().then(r => {
            let tmp1 = []
            let tmp2 = []
            r.forEach(element => {
                if(element.owner === null ){
                    tmp1.push({
                        id: element.orderId,
                        status: element.status,
                        type_of_purchase: element.duration,
                        quantity: element.quantity,
                    })
                }else{
                    tmp2.push({
                        id: element.orderId,
                        status: element.status,
                        type_of_purchase: element.duration,
                        owner: `${element.owner.name} ${element.owner.surname}`
                    })
                }
            })
            setTicketOrders(tmp1);
            setTravelcardOrders(tmp2);
            setLoading(false)
        });
    }, [])

    return (
        <>{loading
            ?
            <Loading loading={loading}/>
            :
            <Grid container>
                <Grid item xs={12}>
                    <GenericTable
                        headCells={headCellsTickets}
                        rows={ticketOrders}
                        nameTable={"My Orders (Tickets)"}
                    />
                </Grid>
                <Grid item xs={12}>
                    <GenericTable
                        headCells={headCellsTravelerCards}
                        rows={travelcardOrders}
                        nameTable={"My Orders (Travelcards)"}
                    />
                </Grid>
            </Grid>
        }

        </>
    );
}

const headCellsTickets = [
    {
        id: 'id',
        numeric: false,
        label: 'ID',
    },
    {
        id: 'status',
        numeric: false,
        label: 'Status',
    },
    {
        id: 'type_of_purchase',
        numeric: false,
        label: 'Type of Purchase', 
    },
    {
        id: 'quantity',
        numeric: true,
        label: 'Quantity',
    }

];

const headCellsTravelerCards = [
    {
        id: 'id',
        numeric: false,
        label: 'ID',
    },
    {
        id: 'status',
        numeric: false,
        label: 'Status',
    },
    {
        id: 'type_of_purchase',
        numeric: false,
        label: 'Type of Purchase', 
    },
    {
        id: 'owner',
        numeric: false,
        label: 'Owner',
    },
]


export default UserOrdersList
