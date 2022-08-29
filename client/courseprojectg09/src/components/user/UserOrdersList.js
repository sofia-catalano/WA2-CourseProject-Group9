import {useState} from "react";
import {CircularProgress, Menu, Modal} from "@mui/material";
import GenericTable from "../generic/Table/Table";
import * as React from "react";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import catalogueAPI from "../../api/TicketCatalogueAPIs";

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

function UserOrdersList(props) {
    const [loading, setLoading] = useState(true);
    const [openTicketsModal, setOpenTicketsModal] = useState(false);
    const [openTravelerCardsModal, setOpenTravelerCardsModal] = useState(false);
    const [ticketOrders, setTIcketOrders] = useState([])
    const [travelcardOrders, setTravelcardOrders] = useState([])
    const handleOpenTicketsDetailsModal = () => setOpenTicketsModal(true);
    const handleCloseTicketsDetailsModal = () => setOpenTicketsModal(false);
    const handleOpenTravelerCardsDetailsModal = () => setOpenTravelerCardsModal(true);
    const handleCloseTravelerCardsDetailsModal = () => setOpenTravelerCardsModal(false);

    React.useEffect(() => {
        catalogueAPI.getTravelerOrders().then(r => {
            console.log(r)
            let tmp1, tmp2 = []
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
    
            setTIcketOrders(tmp1);
            setTravelcardOrders(tmp2);
            setLoading(false)
        });
    })

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
                        nameTable={"My Orders (Tickets)"}
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
                        nameTable={"My Orders (Travelcards)"}
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
