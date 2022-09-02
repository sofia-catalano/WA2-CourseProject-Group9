import Box from "@mui/material/Box";
import {createTheme, ThemeProvider} from "@mui/material/styles";
import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";
import Avatar from "@mui/material/Avatar";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import {useState} from "react";
import MenuItem from "@mui/material/MenuItem";
import ShoppingCartSharpIcon from '@mui/icons-material/ShoppingCartSharp';
import './PaymentForm.css'
import Typography from "@mui/material/Typography";
import ticketCatalogueAPIs from "../../api/TicketCatalogueAPIs";
import PaymentInfo from "../../model/PaymentInfo";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from "dayjs";
import Owner from "../../model/Owner";
import {useNavigate} from "react-router-dom";

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
function PaymentForm(props) {

    const {total, ticketId, numberOfTickets, selectedType, holder} = props;
    const [creditCardNumber, setCreditCardNumber] = useState('');
    const [cardHolder, setCardHolder] = useState('');
    const [expirationDate, setExpirationDate] = useState(dayjs());
    const [cvv,setCvv]=useState('')
    const navigate=useNavigate()

    const handleSubmit = (event) => {
        event.preventDefault();
        let expDate;
        if(expirationDate.month().toString().length === 1){
            expDate = `0${expirationDate.month() + 1}/${expirationDate.year().toString().slice(-2)}`
        }else{
            expDate = `${expirationDate.month() + 1}/${expirationDate.year().toString().slice(-2)}`
        }
        console.log(expDate)
        const paymentInfo = new PaymentInfo(creditCardNumber, expDate, cvv, cardHolder)

        if(holder){
            const owner = new Owner(holder.fiscal_code, holder.name, holder.surname, holder.address, `${holder.birthday}`, holder.telephone)
            ticketCatalogueAPIs.buyTravelcard(ticketId, selectedType, paymentInfo, owner).then( r =>{
                console.log(r)
                navigate('/my/travelcards')

            })
        }else{
            ticketCatalogueAPIs.buyTickets(numberOfTickets, ticketId, selectedType, paymentInfo).then( r =>{
                console.log(r)
                navigate('my/tickets')
            })
        }

    };

    return (
        <Box sx={style}>
            <ThemeProvider theme={theme}>
                <Container component="main">
                    <CssBaseline />
                    <Box id="formStyle">
                        <Avatar id="iconFormStyle" sx={{ width: 60, height: 60, mb: 1, bgcolor: '#1976d2' }}>
                            <ShoppingCartSharpIcon fontSize="large" sx={{color: '#ffeb3b' }}/>
                        </Avatar>
                        <Box component="form" onSubmit={handleSubmit} sx={{p: 2}}>
                            <Typography variant="h3" sx={{ textAlign: 'center', color:'#1976d2' }}>
                                {parseFloat(total).toFixed(2)} €
                            </Typography>
                            <Typography variant="subtitle1" sx={{ textAlign: 'center'}} >
                                Insert data and proceed with payment
                            </Typography>
                            <TextField
                                id="creditCardNumber"
                                label="Credit card number"
                                autoFocus
                                margin="normal"
                                required
                                fullWidth
                                inputProps={{ maxLength: 16, minLength:16 }}
                                value={creditCardNumber}
                                onChange={(event)=>setCreditCardNumber(event.target.value)}
                            />
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DatePicker
                                    views={['month', 'year']}
                                    label="Expiration date"
                                    minDate={dayjs()}
                                    maxDate={dayjs('2029-01-01')}
                                    value={expirationDate}
                                    onChange={(newValue) => {
                                        setExpirationDate(newValue);
                                    }}
                                    renderInput={(params) =>
                                        <TextField {...params}
                                                   helperText={null}
                                                   required
                                                   margin="normal"
                                                   fullWidth/>}
                                />
                            </LocalizationProvider>
                            <TextField
                                id="cvv"
                                label="Cvv"
                                autoFocus
                                margin="normal"
                                required
                                fullWidth
                                type="number"
                                value={cvv}
                                inputProps={{ maxLength: 3, minLength:3 }}
                                onChange={(event)=>setCvv(event.target.value)}
                            />
                            <TextField
                                required
                                id="cardHolder"
                                label="Card Holder"
                                autoFocus
                                margin="normal"
                                fullWidth
                                value={cardHolder}
                                onChange={(event)=>setCardHolder(event.target.value)}
                            />
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{ mt: 3, mb: 2 }}
                            >
                                Buy tickets
                            </Button>
                        </Box>
                    </Box>
                </Container>
            </ThemeProvider>
        </Box>
    );
}
export default  PaymentForm;
