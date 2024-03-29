import {useEffect, useState} from 'react';
import * as React from 'react';
import GenericTable from "../generic/Table/Table.js";
import Typography from "@mui/material/Typography";
import {CircularProgress, Modal} from "@mui/material";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import PaymentForm from "../PaymentForm/PaymentForm";
import AddForm from './AddToCatalogue/AddToCatalogueForm';
import {useUser} from "../UserProvider";
import catalogueAPI from '../../api/TicketCatalogueAPIs.js';
import IconButton from "@mui/material/IconButton";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import Loading from '../generic/Loading/Loading.js';

function BuyTickets(props) {
    const [loading, setLoading] = useState(true);
    const [dirty, setDirty] = useState(false);
    const [selectedValue, setSelectedValue] = React.useState('');
    const [selectedType, setSelectedType] = React.useState('');
    const [numberOfTickets, setNumberOfTickets]=useState(1)
    const [buyTicketsModal, setBuyTicketsModal] = React.useState(false);
    const [addToCatalogueModal, setAddToCatalogueModal] = React.useState(false);
    const [total,setTotal]=useState(0)
    const {loggedIn, userRole, setUserRole, setLoggedIn} = useUser()
    const [data, setData] = React.useState([]);
    const [edit, setEdit] = React.useState(false)

    const findType = (duration) => {
        switch (duration) {
            case "60 min":
            case "90 min":
            case "120 min":
            case "1 day":
            case "2 day":
            case "3 day":
            case "1 week":
                 return "ticket";
            case "1 month":
            case "1 year" :
                return "travelcard";
            default:
                return "";
        }
    }

    useEffect(() => {
        catalogueAPI.getCatalogue().then(r => {
            console.log(r)
            const tmp = []
            r.forEach(element => {
                if(findType(element.type) === 'ticket' ){
                    tmp.push({
                        id: element.ticketId,
                        type: element.type,
                        price: element.price,
                        zones: element.zones,
                        minAge: element.minAge,
                        maxAge: element.maxAge,
                    })
                }
            })
            if(userRole === 'ADMIN'){
                tmp.forEach((element)=> {
                    element.delete =
                        <IconButton aria-label={'delete'}
                                    onClick={()=> handleDeleteElement(element)}>
                            <DeleteIcon fontSize="small"/>
                        </IconButton>

                    element.edit =
                        <IconButton aria-label={'edit'}
                                    onClick={()=> handleEditElement(element)}>
                            <EditIcon fontSize="small"/>
                        </IconButton>

                    }
                )}
            setData(tmp);
            console.log(tmp)
            if(tmp.length){
                setSelectedValue(tmp[0].id);
                setSelectedType(tmp[0].type);
                setTotal(tmp[0].price*numberOfTickets);
            }
            setLoading(false)
            setDirty(false)
        });

    }, [dirty])


    const handleSubmit = (event) => {
        event.preventDefault();
        setBuyTicketsModal(true)

    };
    const handleNumberOfTicketsChange=(event)=>{
        setNumberOfTickets(parseInt(event.target.value))
        const currentElement=data.find(element => element.id===selectedValue)
        if(currentElement!==undefined) setTotal(event.target.value*currentElement.price)
    }
    const handleTypeTicketsChange=(id)=>{
        setSelectedValue(id)
        const currentElement=data.find(element => element.id===id)
        if(currentElement!==undefined) {
            setSelectedType(currentElement.type);
            setTotal(numberOfTickets * currentElement.price);
        }
    }

    const handleAddToCatalogueModal = () => setAddToCatalogueModal(true);

    const handleDeleteElement = (element) =>{
        setLoading(true)
        setDirty(true)
        catalogueAPI.deleteTicketToCatalogue(element.id)
          .then(()=>{
                  setLoading(false)
                  setDirty(false)
          })
    }

    const handleEditElement = (element) =>{
        setEdit(true)
        setSelectedValue(element.id)
        handleAddToCatalogueModal()
    }
    return (
        <>{loading
            ?
            <Loading loading={loading}/>
            :
            <Box component="form" onSubmit={handleSubmit} sx={{p: 2}}>
                <GenericTable
                    headCells={userRole === "ADMIN" ? adminHeadCells : headCells}
                    rows={data}
                    nameTable={userRole === "ADMIN" ? "Tickets list" : "Buy tickets"}
                    selectedValue={selectedValue}
                    handleTypeTicketsChange={handleTypeTicketsChange}
                    onAddElement={handleAddToCatalogueModal}
                />
                {userRole!=="ADMIN" && <>
                <Box sx={{ width: '90%' , mr:5, ml:5 }}>
                    <Paper sx={{ width: '100%', mb: 2 }}>
                        <Grid container
                              spacing={1}
                              direction="row"
                              justifyContent="space-between">
                            <Grid item xs={4} sx={{ ml: 4 }} >
                                <TextField
                                    id="numberOfTickets"
                                    label="Number of tickets"
                                    type="number"
                                    autoFocus
                                    margin="normal"
                                    required
                                    fullWidth
                                    InputProps={{ inputProps: { min: 1, max: 10 } }}
                                    value={numberOfTickets}
                                    onChange={(event)=>handleNumberOfTicketsChange(event)}
                                />
                            </Grid>
                            <Grid item xs={3}  sx={{ mt: 3 }}>
                                <Typography variant="h4" gutterBottom>
                                    Total: {parseFloat(total).toFixed(2)} €
                                </Typography>
                            </Grid>
                        </Grid>
                        <Grid container
                              spacing={6}
                              direction="row"
                              justifyContent="center">
                            <Grid item xs={4}  sx={{ mt: 2, mb:2 }}>
                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    sx={{p:1}}
                                >
                                    Buy tickets
                                </Button>
                            </Grid>
                        </Grid>
                    </Paper>
                </Box>
                <Modal
                    open={buyTicketsModal}
                    onClose={()=>setBuyTicketsModal(false)}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <PaymentForm total={total} ticketId={selectedValue} numberOfTickets={numberOfTickets} selectedType={selectedType} setPaymentModal={setBuyTicketsModal}/>
                </Modal>
                </>}
                <Modal
                        open={addToCatalogueModal}
                        onClose={()=>setAddToCatalogueModal(false)}
                        aria-labelledby="modal-modal-title"
                        aria-describedby="modal-modal-description"
                    >
                  <AddForm type="ticket"
                           setDirty={setDirty}
                           setAddToCatalogueModal={setAddToCatalogueModal}
                           edit={edit}
                           setEdit={setEdit}
                           data={edit ? data.find(element => element.id===selectedValue) : ""}/>
                </Modal>
            </Box>

        }

        </>
    );
}


const headCells = [
    {
        id: 'select',
        numeric: false,
        label:'',
    },
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
        id: 'price',
        numeric: true,
        label: 'Price',
    },
    {
        id: 'zones',
        numeric: false,
        label: 'Zones allowed',
    },
    {
        id: 'minAge',
        numeric: true,
        label: 'Min Age',
    },
    {
        id: 'maxAge',
        numeric: true,
        label: 'Max Age',
    },

];

const adminHeadCells=headCells.concat([
    {
        id: 'delete',
        numeric: false,
        label: 'Delete',
    },
    {
        id: 'edit',
        numeric: false,
        label: 'Edit',
    },
])
export default BuyTickets









