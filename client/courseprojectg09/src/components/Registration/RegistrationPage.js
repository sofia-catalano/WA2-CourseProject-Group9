import './RegistrationPage.css';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import VisibilityOffTwoToneIcon from '@mui/icons-material/VisibilityOffTwoTone';
import VisibilityTwoToneIcon from '@mui/icons-material/VisibilityTwoTone';
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import * as React from 'react';
import {InputAdornment} from "@mui/material";
import {useState, useEffect} from 'react';


const theme = createTheme();

function RegistrationPage() {

    const [hidePassword, setHidePassword] = useState(true);

    const showPassword = () => {
        setHidePassword(!hidePassword)
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        console.log({
            email: data.get('email'),
            password: data.get('password'),
        });
    };

    return (
        <ThemeProvider theme={theme}>
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <Box id="registrationForm">
                    <Avatar id="registrationIcon" sx={{ width: 60, height: 60, mb: 1, bgcolor: '#1976d2' }}>
                        <PeopleAltOutlinedIcon fontSize="large" sx={{color: '#ffeb3b' }}/>
                    </Avatar>
                    <Box component="form" onSubmit={handleSubmit} noValidate sx={{p: 2}}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="username"
                            label="Username"
                            name="username"
                            autoComplete="username"
                            autoFocus
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email Address"
                            name="email"
                            autoComplete="email"
                            autoFocus
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            id="password"
                            autoComplete="current-password"
                            type={hidePassword ? "password" : "input"}
                            InputProps={{
                                endAdornment: (
                                hidePassword ? (
                                    <InputAdornment position="end">
                                        <VisibilityOffTwoToneIcon
                                            fontSize="default"
                                            onClick={showPassword}
                                        />
                                    </InputAdornment>
                                ) : (
                                        <InputAdornment position="end">
                                            <VisibilityTwoToneIcon
                                                fontSize="default"
                                                onClick={showPassword}
                                            />
                                        </InputAdornment>
                                    ))}}
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2}}
                        >
                            Register
                        </Button>
                    </Box>
                </Box>
            </Container>
        </ThemeProvider>
    );
}

export default RegistrationPage;