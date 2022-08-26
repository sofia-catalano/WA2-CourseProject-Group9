import {useState} from "react";
import {CircularProgress, Modal} from "@mui/material";
import Grid from "@mui/material/Grid";
import GenericTable from "../generic/Table/Table";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import * as React from "react";

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

function AdminOrdersList(props){
    const [loading, setLoading] = useState(false);
    const [openTicketsModal, setOpenTicketsModal] = useState(false);
    const [openTravelerCardsModal, setOpenTravelerCardsModal] = useState(false);
    const handleOpenTicketsDetailsModal = () => setOpenTicketsModal(true);
    const handleCloseTicketsDetailsModal = () => setOpenTicketsModal(false);
    const handleOpenTravelerCardsDetailsModal = () => setOpenTravelerCardsModal(true);
    const handleCloseTravelerCardsDetailsModal = () => setOpenTravelerCardsModal(false);
    return (
        <>{loading
            ?
            <CircularProgress />
            :
            <Grid container>
                <Grid item xs={12}>
                    <GenericTable
                        headCells={headCellsTickets}
                        rows={rowsTickets}
                        nameTable={"All Orders (Tickets)"}
                        onClickElement={handleOpenTicketsDetailsModal}
                    ></GenericTable>
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
                            <Typography id="modal-modal-description" sx={{ mt: 2 }} onClick={()=>console.log("Vai alla pagina my tickets a questo ticket")}>
                                TicketID1
                            </Typography>
                        </Box>
                    </Modal>
                </Grid>
                <Grid item xs={12}>
                    <GenericTable
                        headCells={headCellsTravelerCards}
                        rows={rowsTravelerCards}
                        nameTable={"All Orders (Traveler Cards)"}
                        onClickElement={handleOpenTravelerCardsDetailsModal}
                    ></GenericTable>
                    <Modal
                        open={openTravelerCardsModal}
                        onClose={handleCloseTravelerCardsDetailsModal}
                        aria-labelledby="modal-modal-title"
                        aria-describedby="modal-modal-description"
                    >
                        <Box sx={style}>
                            <Typography id="modal-modal-title" variant="h6" component="h2">
                                Order Traveler Card Details:
                            </Typography>
                            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                                TravelerCardID1
                            </Typography>
                        </Box>
                    </Modal>
                </Grid>
                <Grid item xs={12} style={{marginLeft : "3vw"}}>
                    <Typography>
                        Click an element to see further details.
                    </Typography>
                </Grid>
            </Grid>
        }

        </>
    );
}
/*function FilterMenu (props){
    const {open, anchorEl, handleClose}=props

    return (
        <Menu
            id="basic-menu"
            open={open}
            onClose={handleClose}
            MenuListProps={{
                'aria-labelledby': 'basic-button',
            }}
            anchorEl={anchorEl}
        >
            {/!*<MenuItem onClick={handleClose}>Purchased tickets(All) </MenuItem>
            <MenuItem onClick={handleClose}>Valid tickets </MenuItem>
            <MenuItem onClick={handleClose}>Validated tickets</MenuItem>
            <MenuItem onClick={handleClose}>Expired Tickets</MenuItem>*!/}
        </Menu>
    );
}*/
function createDataTickets(id, status, type_of_purchase, quantity, username) {
    return {
        id,
        status,
        type_of_purchase,
        quantity,
        username
    };
}
function createDataTravelerCards(id, status, owner, username) {
    return {
        id,
        status,
        owner,
        username
    };
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

const rowsTickets=[
    createDataTickets('1','ACCEPTED','Daily : 1h',3, "USER1"),
    createDataTickets('1','ACCEPTED','Daily : 1h',3, "USER1"),
    createDataTickets('1','ACCEPTED','Daily : 1h',3, "USER1"),
    createDataTickets('1','ACCEPTED','Daily : 1h',3, "USER1"),
    createDataTickets('1','ACCEPTED','Daily : 1h',3, "USER1"),
    createDataTickets('1','ACCEPTED','Daily : 1h',3, "USER1"),
    createDataTickets('1','ACCEPTED','Daily : 1h',3, "USER1"),
    createDataTickets('1','ACCEPTED','Daily : 1h',3, "USER1"),
    createDataTickets('1','ACCEPTED','Daily : 1h',3, "USER1"),
    createDataTickets('1','ACCEPTED','Daily : 1h',3, "USER1"),
    createDataTickets('1','ACCEPTED','Daily : 1h',3, "USER1"),


];
const rowsTravelerCards=[
    createDataTravelerCards('1','CANCELLED','Isabella Verdi',"USER1"),
    createDataTravelerCards('1','CANCELLED','Isabella Verdi',"USER1"),
    createDataTravelerCards('1','CANCELLED','Isabella Verdi',"USER1"),
    createDataTravelerCards('1','CANCELLED','Isabella Verdi',"USER1"),
    createDataTravelerCards('1','CANCELLED','Isabella Verdi',"USER1"),
    createDataTravelerCards('1','CANCELLED','Isabella Verdi',"USER1"),
];

export default AdminOrdersList;