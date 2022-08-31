import {useState, useEffect} from "react";
import {CircularProgress, Menu, Modal} from "@mui/material";
import Grid from "@mui/material/Grid";
import GenericTable from "../generic/Table/Table";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import * as React from "react";
import MenuItem from "@mui/material/MenuItem";
import ticketCatalogueAPIs from "../../api/TicketCatalogueAPIs";

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

function AdminOrdersList(props) {
    const [loading, setLoading] = useState(false);
    const [openTicketsModal, setOpenTicketsModal] = useState(false);
    const [openTravelerCardsModal, setOpenTravelerCardsModal] = useState(false);
    const handleOpenTicketsDetailsModal = () => setOpenTicketsModal(true);
    const handleCloseTicketsDetailsModal = () => setOpenTicketsModal(false);
    const handleOpenTravelerCardsDetailsModal = () => setOpenTravelerCardsModal(true);
    const handleCloseTravelerCardsDetailsModal = () => setOpenTravelerCardsModal(false);

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
            <CircularProgress/>
            :
            <Grid container>
                <Grid item xs={12}>
                    <GenericTable
                        headCells={headCellsTickets}
                        rows={ticketOrders}
                        nameTable={"All Orders (Tickets)"}
                        onClickElement={handleOpenTicketsDetailsModal}
                    />
                    <Modal
                        open={openTicketsModal}
                        onClose={handleCloseTicketsDetailsModal}
                        aria-labelledby="modal-modal-title"
                        aria-describedby="modal-modal-description"
                    >
                        <Box sx={style}>
                            <Typography id="modal-modal-title" variant="h6" component="h2">
                                Order Tickets Details:
                            </Typography>
                            <Typography id="modal-modal-description" sx={{mt: 2}}
                                        onClick={() => console.log("Vai alla pagina my tickets a questo ticket")}>
                                TicketID1
                            </Typography>
                        </Box>
                    </Modal>
                </Grid>
                <Grid item xs={12}>
                    <GenericTable
                        headCells={headCellsTravelerCards}
                        rows={travelcardOrders}
                        nameTable={"All Orders (Travelcards)"}
                        onClickElement={handleOpenTravelerCardsDetailsModal}
                    />
                    <Modal
                        open={openTravelerCardsModal}
                        onClose={handleCloseTravelerCardsDetailsModal}
                        aria-labelledby="modal-modal-title"
                        aria-describedby="modal-modal-description"
                    >
                        <Box sx={style}>
                            <Typography id="modal-modal-title" variant="h6" component="h2">
                                Order Travelcard Details:
                            </Typography>
                            <Typography id="modal-modal-description" sx={{mt: 2}}>
                                TravelerCardID1
                            </Typography>
                        </Box>
                    </Modal>
                </Grid>
                <Grid item xs={12} style={{marginLeft: "3vw"}}>
                    <Typography>
                        Click an element to see further details.
                    </Typography>
                </Grid>
            </Grid>
        }

        </>
    );
};

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