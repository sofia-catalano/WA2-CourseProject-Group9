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
import AddForm from './AddToCatalogue/AddToCatalogueForm.js';
import {useUser} from "../UserProvider";
import catalogueAPI from '../../api/TicketCatalogueAPIs.js';
import IconButton from "@mui/material/IconButton";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import Loading from '../generic/Loading/Loading.js';

function BuyTravelcard(props) {
    const {loggedIn, userRole, setUserRole, setLoggedIn} = useUser()
    const [loading, setLoading] = useState(true);
    const [dirty, setDirty] = useState(false);
    const [selectedValue, setSelectedValue] = React.useState('');
    const [selectedType, setSelectedType] = React.useState('');
    const [buyTravelcardModal, setBuyTravelcardModal] = React.useState(false);
    const [addToCatalogueModal, setAddToCatalogueModal] = React.useState(false);
    const [holder, setHolder] = React.useState({
        fiscal_code: '',
        name: '',
        surname: '',
        address: '',
        birthday: '',
        telephone: ''
    });
    const [data, setData] = React.useState([]);

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
                if(findType(element.type) === 'travelcard' ){
                    tmp.push({
                        id: element.ticketId,
                        type: element.type,
                        price: element.price,
                        zones: element.zones,
                        minAge: element.minAge,
                        maxAge: element.maxAge
                    })
                }
            })
            if(userRole === 'ADMIN'){
                tmp.forEach((element)=>element.delete =
                    <IconButton aria-label={'delete'}
                                onClick={()=> handleDeleteElement(element)}>
                        <DeleteIcon fontSize="small"/>
                    </IconButton>
                )}
            setData(tmp);
            if(tmp.length){
                setSelectedType(tmp[0].type)
                setSelectedValue(tmp[0].id)
            }
            setLoading(false)
            setDirty(false)
        });
    }, [dirty])

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
        setSelectedValue(id)
        const currentElement=data.find(element => element.id===id)
        if(currentElement!==undefined) {
            setSelectedType(currentElement.type);
        }
    }

    const handleDeleteElement = (element) =>{
        setLoading(true)
        setDirty(true)
        catalogueAPI.deleteTicketToCatalogue(element.id)
            .then(()=>{
                setLoading(false)
                setDirty(false)
            })
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
                    nameTable={userRole === "ADMIN" ? "Travelcards list" : "Buy travelcard"}
                    selectedValue={selectedValue}
                    handleTypeTicketsChange={handleTypeTicketsChange}
                    onAddElement={handleAddToCatalogueModal}
                />
                {userRole !== "ADMIN" && <>
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
                                    id="fiscal_code"
                                    label="Fiscal Code"
                                    defaultValue={holder.fiscal_code}
                                    variant="standard"
                                    required
                                    onChange={handleChange("fiscal_code")}
                                />
                            </Grid>
                            <Grid item xs={4} >
                                <TextField
                                    id="name"
                                    label="Name"
                                    defaultValue={holder.name}
                                    variant="standard"
                                    required
                                    onChange={handleChange("name")}
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
                                />
                            </Grid>
                            <Grid item xs={4}>
                                <TextField
                                    id="birthday"
                                    label="Birthday"
                                    InputLabelProps={{ shrink: true }}
                                    type="date"
                                    defaultValue={holder.birthday}
                                    variant="standard"
                                    required
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
                            <Grid item xs={4}>
                                <TextField
                                    id="address"
                                    label="Address"
                                    defaultValue={holder.address}
                                    variant="standard"
                                    onChange={handleChange("address")}
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
                    onClose={()=>setBuyTravelcardModal(false)}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <PaymentForm total={data.find(element => element.id===selectedValue) ? data.find(element => element.id===selectedValue).price : 0} ticketId={selectedValue} selectedType={selectedType} holder={holder} setPaymentModal={setBuyTravelcardModal}/>
                </Modal>
                </>
            }
                <Modal
                        open={addToCatalogueModal}
                        onClose={()=>setAddToCatalogueModal(false)}
                        aria-labelledby="modal-modal-title"
                        aria-describedby="modal-modal-description"
                    >
                  <AddForm type="travelcard" setDirty={setDirty} setAddToCatalogueModal={setAddToCatalogueModal}/>
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
        numeric: true,
        label: 'Delete',
    },
])
export default BuyTravelcard
