import Box from "@mui/material/Box";
import {createTheme, ThemeProvider} from "@mui/material/styles";
import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";
import Avatar from "@mui/material/Avatar";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import {useState} from "react";
import MenuItem from "@mui/material/MenuItem";
import { IoTicketOutline } from "react-icons/io5";
import './AddToCatalogueForm.css'
const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 500,
    bgcolor: 'transparent',
    pb: 3,
};
const theme = createTheme();

function AddForm(props) {
    const typeTickets=[
        {
            value: '60 min',
            label: '1 hour',
        },
        {
            value: '90 min',
            label: '1 hour 30 minutes',
        },
        {
            value: '120 min',
            label: '2 hours',
        },
        {
            value: '1 day',
            label: '1 day',
        },
        {
            value: '2 day',
            label: '2 days',
        },
        {
            value: '3 day',
            label: '3 days',
        },
        {
            value: '1 week',
            label: '1 week',
        },
    ];

    const typeTravelcard=[
        {
            value: '1 month',
            label: '1 month'
        },
        {
            value: '1 year',
            label: '1 year'
        }
    ];

    const zones=[
        {
            value: 'A',
            label: 'A'
        },
        {
            value: 'B',
            label: 'B'
        },
        {
            value: 'C',
            label: 'C'
        },
        {
            value: 'AB',
            label: 'AB'
        },
        {
            value: 'BC',
            label: 'BC'
        },
        {
            value: 'AC',
            label: 'AC'
        },
        {
            value: 'ABC',
            label: 'ABC'
        },
    ];

    const [ticketsType, setTicketsType] = useState('60 min');
    const [allowedZones, setAllowedZones] = useState('A');
    const [minAge, setMinAge]=useState(0);
    const [maxAge, setMaxAge]=useState(100);
    const [price, setPrice] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        console.log(data)

    };
    return (
        <Box sx={style}>
            <ThemeProvider theme={theme}>
                <Container component="main">
                    <CssBaseline />
                    <Box id="formStyle">
                        <Avatar id="iconFormStyle" sx={{ width: 60, height: 60, mb: 1, bgcolor: '#1976d2' }}>
                            <IoTicketOutline fontSize="large" sx={{color: '#ffeb3b' }}/>
                        </Avatar>
                        <Box component="form" onSubmit={handleSubmit} sx={{p: 2}}>
                            <TextField
                                margin="normal"
                                required
                                id="typeTickets"
                                select
                                fullWidth
                                label="Type ticktes"
                                value={ticketsType}
                                onChange={(event)=> setTicketsType(event.target.value)}
                                helperText="Please select the type of the tickets"
                            >
                                {typeTickets.map((option) => (
                                    <MenuItem key={option.value} value={option.value}>
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </TextField>
                            <TextField
                                margin="normal"
                                required
                                id="allowedZones"
                                select
                                fullWidth
                                label="Allowed zones"
                                value={allowedZones}
                                onChange={(event)=> setAllowedZones(event.target.value)}
                                helperText="Please select the allowed zones"
                            >
                                {zones.map((option) => (
                                    <MenuItem key={option.value} value={option.value}>
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </TextField>

                            <TextField
                                id="price"
                                label="Price"
                                type="number"
                                autoFocus
                                margin="normal"
                                required
                                fullWidth
                                InputProps={{ inputProps: { min: 1, max: 500} }}
                                value={price}
                                onChange={(event)=>setPrice(parseFloat(event.target.value))}
                            />
                            <TextField
                                id="minAge"
                                label="min Age"
                                type="number"
                                autoFocus
                                margin="normal"
                                fullWidth
                                InputProps={{ inputProps: { min: 1, max: 100} }}
                                value={minAge}
                                onChange={(event)=>setMinAge(parseInt(event.target.value))}
                            />
                            <TextField
                                id="maxAge"
                                label="max Age"
                                type="number"
                                autoFocus
                                margin="normal"
                                fullWidth
                                InputProps={{ inputProps: { min: 1, max: 100} }}
                                value={maxAge}
                                onChange={(event)=>setMaxAge(parseInt(event.target.value))}
                            />
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{ mt: 3, mb: 2 }}
                            >
                                Add to Catalogue
                            </Button>
                        </Box>
                    </Box>
                </Container>
            </ThemeProvider>
        </Box>
    );
}
export default  AddForm;