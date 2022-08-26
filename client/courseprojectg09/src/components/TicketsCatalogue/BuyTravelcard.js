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

function BuyTravelcard(props) {
    const {loggedIn, userRole, setUserRole, setLoggedIn} = useUser()
    const [loading, setLoading] = useState(false);
    const [selectedValue, setSelectedValue] = React.useState(rows[0].id);
    const [buyTravelcardModal, setBuyTravelcardModal] = React.useState(false);
    const [addToCatalogueModal, setAddToCatalogueModal] = React.useState(false);
    const [holder, setHolder] = React.useState({
        name: 'Mario',
        surname: 'Rossi',
        address: '',
        birthday: '04/08/2020',
        telephone: ''
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
                    rows={rows}
                    nameTable={userRole==="admin" ? "Travelcards list": "Buy travelcard"}
                    selectedValue={selectedValue}
                    handleTypeTicketsChange={handleTypeTicketsChange}
                    filterMenu="AddCatalogue"
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
                    <PaymentForm total={rows.find(element => element.id==selectedValue).price}/>
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


function createData(id, type, price, zones, minAge,maxAge) {
    return {
        id,
        type,
        price,
        zones,
        minAge,
        maxAge
    };
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
const rows=[
    createData('1', 305, 3.7, 'AB', 2, 2),
    createData('2', 452, 25.0, 'A', 3, 3),
]

export default BuyTravelcard