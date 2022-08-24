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
    const [creditCardNumber, setCreditCardNumber] = useState('');
    const [cardHolder, setCardHolder] = useState('');
    const [expirationDate, setExpirationDate] = useState(new Date().toISOString().substring(0,10));
    const [cvv,setCvv]=useState('')
    const {total}=props
    const handleSubmit = (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);

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
                                {total} €
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
                            <TextField
                                id="expirationDate"
                                label="Expiration date"
                                autoFocus
                                margin="normal"
                                required
                                fullWidth
                                type="date"
                                inputProps={{
                                    min: new Date().toISOString().substring(0,10),
                                }}
                                value={expirationDate}
                                onChange={(event)=>setExpirationDate(event.target.value)}
                            />
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
