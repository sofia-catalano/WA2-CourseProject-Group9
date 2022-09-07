import {useState, useEffect} from "react";
import Grid from "@mui/material/Grid";
import GenericTable from "../generic/Table/Table";
import * as React from "react";
import ticketCatalogueAPIs from "../../api/TicketCatalogueAPIs";
import {useLocation} from "react-router-dom";
import Loading from '../generic/Loading/Loading.js';

function AdminUserOrdersList(props) {

    const username = useLocation().state;

    const [loading, setLoading] = useState(true);
    const [userTicketOrders, setUserTicketOrders] = useState([])
    const [userTravelcardOrders, setUserTravelcardOrders] = useState([])

    useEffect(() => {
        let tmp1 = [];
        let tmp2 = [];
        ticketCatalogueAPIs.getUserOrders(username).then(r => {
            console.log(r)
            r.forEach(element => {
                if (element.owner === null) {
                    tmp1.push({
                        id: element.orderId,
                        status: element.status,
                        type_of_purchase: element.duration,
                        quantity: element.quantity,
                    })
                } else {
                    tmp2.push({
                        id: element.orderId,
                        status: element.status,
                        type_of_purchase: element.duration,
                        owner: `${element.owner.name} ${element.owner.surname}`,
                    })
                }
            })
            setUserTicketOrders(tmp1);
            setUserTravelcardOrders(tmp2);
            setLoading(false)
        });
    }, []);


    return (
        <>{loading
            ?
            <Loading loading={loading}/>
            :
            <Grid container>
                <Grid item xs={12}>
                    <GenericTable
                        headCells={headCellsTickets}
                        rows={userTicketOrders}
                        nameTable={`${username}'s orders (Tickets)`}
                    />
                </Grid>
                <Grid item xs={12}>
                    <GenericTable
                        headCells={headCellsTravelerCards}
                        rows={userTravelcardOrders}
                        nameTable={`${username}'s orders (Travelcards)`}
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
        label: 'Type of Purchase', //if tickets specify the type of ticket(1h,2h...)
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
        label: 'Type of Purchase', //if tickets specify the type of ticket(1h,2h...)
    },
    {
        id: 'owner',
        numeric: false,
        label: 'Owner',
    }
]

export default AdminUserOrdersList;
