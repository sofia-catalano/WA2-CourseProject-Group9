import {useEffect, useState, Spinner} from 'react';
import * as React from 'react';
import GenericTable from "../Table/Table.js";
import Typography from "@mui/material/Typography";
import {CircularProgress, Menu, Modal, Tooltip} from "@mui/material";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import PaymentForm from "../PaymentForm/PaymentForm";

function BuyTickets(props) {
    const [loading, setLoading] = useState(false);
    const [selectedValue, setSelectedValue] = React.useState(rows[0].id);
    const [numberOfTickets, setNumberOfTickets]=useState(1)
    const [buyTicketsModal, setBuyTicketsModal] = React.useState(false);
    const [total,setTotal]=useState(rows[0].price*numberOfTickets)


    const handleSubmit = (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        setBuyTicketsModal(true)
        console.log(selectedValue)

    };
    const handleNumberOfTicketsChange=(event)=>{
        setNumberOfTickets(parseInt(event.target.value))
        const currentElement=rows.find(element => element.id==selectedValue)
        if(currentElement!=undefined) setTotal(event.target.value*currentElement.price)
    }
    const handleTypeTicketsChange=(id)=>{
        console.log(id)
        setSelectedValue(id)
        const currentElement=rows.find(element => element.id==id)
        if(currentElement!=undefined) setTotal(numberOfTickets*currentElement.price)
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
                    nameTable={"Buy tickets"}
                    selectedValue={selectedValue}
                    handleTypeTicketsChange={handleTypeTicketsChange}
                ></GenericTable>
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
                    onClose={()=>setBuyTicketsModal((false))}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <PaymentForm total={total}/>
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
    createData('3', 262, 16.0, 'C', 4,4),
    createData('4', 159, 6.0, 'AB', 2, 5),
    createData('5', 356, 16.0, 'AB', 5, 6),
    createData('6', 408, 3.2, 'AB', 2, 7),
    createData('7', 237, 9.0, 'AB', 3, 8),
]

export default BuyTickets









