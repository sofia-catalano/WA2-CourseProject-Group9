import {useState, useEffect} from "react";
import Grid from "@mui/material/Grid";
import GenericTable from "../generic/Table/Table";
import * as React from "react";
import ticketCatalogueAPIs from "../../api/TicketCatalogueAPIs";
import Loading from '../generic/Loading/Loading.js';

function AdminOrdersList(props) {

    const [loading, setLoading] = useState(true);
    const [ticketOrders, setTicketOrders] = useState([])
    const [travelcardOrders, setTravelcardOrders] = useState([])

    useEffect(() => {
        let tmp1 = [];
        let tmp2 = [];
        //fill ticket orders table
        ticketCatalogueAPIs.getAllOrders()
            .then(r => {
                console.log(r)
                r.forEach(element => {
                    if (element.owner === null) {
                        tmp1.push({
                            id: element.orderId,
                            status: element.status,
                            type_of_purchase: element.duration,
                            quantity: element.quantity,
                            username: element.customerUsername,
                        })
                    } else {
                        tmp2.push({
                            id: element.orderId,
                            status: element.status,
                            type_of_purchase: element.duration,
                            owner: `${element.owner.name} ${element.owner.surname}`,
                            username: element.customerUsername,
                        })
                    }
                })

                setTicketOrders(tmp1);
                setTravelcardOrders(tmp2);
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
                        rows={ticketOrders}
                        nameTable={"All Orders (Tickets)"}
                    />
                </Grid>
                <Grid item xs={12}>
                    <GenericTable
                        headCells={headCellsTravelerCards}
                        rows={travelcardOrders}
                        nameTable={"All Orders (Travelcards)"}
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
    },
    {
        id: 'username',
        numeric: true,
        label: 'Username',
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
    },
    {
        id: 'username',
        numeric: false,
        label: 'Username',
    }
]

export default AdminOrdersList;