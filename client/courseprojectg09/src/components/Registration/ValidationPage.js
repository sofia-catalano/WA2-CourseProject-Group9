import './RegistrationPage.css';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import HowToRegOutlinedIcon from '@mui/icons-material/HowToRegOutlined';
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import * as React from 'react';
import {useState} from 'react';
import Typography from "@mui/material/Typography";
import loginAPI from "../../api/LoginAPI";
import Link from "@mui/material/Link";

const theme = createTheme();

export default function ValidationPage(){

    const [showError, setShowError] = useState(false);
    const [activationCompleted, setActivationCompleted] = useState(false);
    const [errorMessage , setErrorMessage] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        if(data.get('validation').length !== 6){
            setShowError(true)
        }else{
            setShowError(false)
            loginAPI.validateUser(data.get('validation')).then(
                r => {
                    if(r["error"]){
                        setErrorMessage(r["error"])
                        setShowError(true)
                    }else{
                        setActivationCompleted(true);
                    }
                }
            )
        }
    };

    return (
        <ThemeProvider theme={theme}>
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <Box id="registrationForm">
                    <Avatar id="registrationIcon" sx={{ width: 60, height: 60, mb: 1, bgcolor: '#1976d2' }}>
                        <HowToRegOutlinedIcon fontSize="large" sx={{color: '#ffeb3b' }}/>
                    </Avatar>
                    <Box component="form" onSubmit={handleSubmit} noValidate sx={{p: 2}}>
                        <TextField
                            type="number"
                            error={showError}
                            margin="normal"
                            required
                            fullWidth
                            id="validation"
                            label="Validation Code"
                            name="validation"
                            autoFocus
                            helperText={"Validation code should be 6 digit long"}
                            aria-valuemax={6}
                            inputProps={{
                                inputMode: 'tel',
                                pattern: '[0-9]*'
                            }}
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2}}
                        >
                            Validate
                        </Button>
                        {showError ?
                            (
                                <Typography sx={{display: "block", color:"red", textAlign:"center"}}>
                                    {errorMessage}
                                </Typography>
                            ) : activationCompleted ?
                                (
                                    <Typography sx={{display: "block", color:"green", textAlign:"center"}}>
                                        User correctly registered! Please Login at this: <Link href={"/user/login"}>page.</Link>
                                    </Typography>
                                ) : ''
                        }
                    </Box>
                </Box>
            </Container>
        </ThemeProvider>
    );
}