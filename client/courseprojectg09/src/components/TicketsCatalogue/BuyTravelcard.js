import {useEffect, useState, Spinner} from 'react';
import * as React from 'react';
import GenericTable from "../generic/Table/Table.js";
import Typography from "@mui/material/Typography";
import {CircularProgress, Menu, Modal, Tooltip} from "@mui/material";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import PaymentForm from "../PaymentForm/PaymentForm";
import AddForm from './AddToCatalogue/AddToCatalogueForm.js';
import {useUser} from "../UserProvider";
import moment from 'moment';
import catalogueAPI from '../../api/TicketCatalogueAPIs.js';
import typeTicket from '../../utils/TicketType.js';

function BuyTravelcard(props) {
    const {loggedIn, userRole, setUserRole, setLoggedIn} = useUser()
    const [loading, setLoading] = useState(false);
    const [selectedValue, setSelectedValue] = React.useState('');
    const [buyTravelcardModal, setBuyTravelcardModal] = React.useState(false);
    const [addToCatalogueModal, setAddToCatalogueModal] = React.useState(false);
    const [holder, setHolder] = React.useState({
        name: 'Mario',
        surname: 'Rossi',
        address: '',
        birthday: '04/08/2020',
        telephone: ''
    });
    const [data, setData] = React.useState([]);

    const findType = (date1, date2) => {
        let diff= moment(date1).diff(moment(date2), 'days')
        if(diff<8){
            return 'ticket'
        }else
            return 'travelcard' 
    }

    catalogueAPI.getCatalogue().then(r => {
        console.log(r)
        const tmp = []
        r.forEach(element => {
            if(findType(element.exp, element.iat) === 'travelcard' ){
                tmp.push({
                    id: element.ticketId,
                    type: typeTicket(element.exp, element.iat),
                    price: element.price,
                    zones: element.zones,
                    minAge: element.minAge,
                    maxAge: element.maxAge
                })
            }
        })

        setData(tmp);
        setSelectedValue(tmp[0].id)
    });


    const handleChange = (prop) => (event) => {
        setHolder({ ...holder, [prop]: event.target.value });
    };

    const handleAddToCatalogueModal = () => setAddToCatalogueModal(true);

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log(selectedValue)
        let valid = true
    
        if(holder.name === "" || holder.surname === ""){
            valid = false
        }


        if(valid){
            setBuyTravelcardModal(true)
            //TODO salvare i campi
        }

    };

    const handleTypeTicketsChange=(id)=>{
        console.log(id)
        setSelectedValue(id)
    }
    return (
        <>{loading
            ?
            <CircularProgress />
            :
            <Box component="form" onSubmit={handleSubmit} sx={{p: 2}}>
                <GenericTable
                    headCells={headCells}
                    rows={data}
                    nameTable={userRole==="admin" ? "Travelcards list": "Buy travelcard"}
                    selectedValue={selectedValue}
                    handleTypeTicketsChange={handleTypeTicketsChange}
                    onAddElement={handleAddToCatalogueModal}
                ></GenericTable>
                {userRole != "admin" && <>
                <Box sx={{ width: '90%' , mr:5, ml:5 }}>
                    <Paper sx={{ width: '100%', mb: 2 }}>
                        <Typography
                            sx={{color: '#1976d2'}}
                            variant="h6"
                            id="holder"
                            component="div"
                            align="center"
                        >
                            Travelcard holder
                        </Typography>
                        <Grid container
                              spacing={1}
                              direction="row" sx={{ml:4}}
                              >
                            <Grid item xs={4} >
                                <TextField
                                    id="name"
                                    label="Name"
                                    defaultValue={holder.name}
                                    variant="standard"
                                    required
                                    onChange={handleChange("name")}
                                    error={holder.name === ""}
                                    //helperText="Required"
                                />
                            </Grid>
                            <Grid item xs={4}>
                                <TextField
                                    id="surname"
                                    label="Surname"
                                    defaultValue={holder.surname}
                                    variant="standard"
                                    required
                                    onChange={handleChange("surname")}
                                    error={holder.surname === ""}
                                    //helperText="Required"
                                />
                            </Grid>
                            <Grid item xs={4}>
                                <TextField
                                    id="address"
                                    label="Address"
                                    defaultValue={holder.address}
                                    variant="standard"
                                    onChange={handleChange("address")}
                                />
                            </Grid>
                            <Grid item xs={4}>
                                <TextField
                                    id="birthday"
                                    label="Birthday"
                                    defaultValue={holder.birthday}
                                    variant="standard"
                                    required
                                    error={holder.birthday === ""}
                                    onChange={handleChange("birthday")}
                                />
                            </Grid>
                            <Grid item xs={4}>
                                <TextField
                                    id="telephone"
                                    label="Telephone"
                                    defaultValue={holder.telephone}
                                    type="tel"
                                    variant="standard"
                                    onChange={handleChange("telephone")}
                                />
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
                                    Buy travelcard
                                </Button>
                            </Grid>
                        </Grid>
                    </Paper>
                </Box>
                <Modal
                    open={buyTravelcardModal}
                    onClose={()=>setBuyTravelcardModal((false))}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <PaymentForm total={data.find(element => element.id==selectedValue) ? data.find(element => element.id==selectedValue).price : 0}/>
                </Modal>
                </>
            }
                <Modal
                        open={addToCatalogueModal}
                        onClose={()=>setAddToCatalogueModal((false))}
                        aria-labelledby="modal-modal-title"
                        aria-describedby="modal-modal-description"
                    >
                  <AddForm type="travelcard"/>
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

export default BuyTravelcard