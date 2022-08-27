import './LoginPage.css';
import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import {useState} from 'react';
import {InputAdornment} from "@mui/material";
import VisibilityOffTwoToneIcon from "@mui/icons-material/VisibilityOffTwoTone";
import VisibilityTwoToneIcon from "@mui/icons-material/VisibilityTwoTone";
import loginAPI from "../../api/LoginAPI";
import {useUser} from "../UserProvider";
import {useNavigate} from "react-router-dom";

const theme = createTheme();

export default function LoginPage() {

    const [hidePassword, setHidePassword] = useState(true);
    const {loggedIn, userRole, setUserRole, setLoggedIn}=useUser()
    const navigate=useNavigate()
    const showPassword = () => {
        setHidePassword(!hidePassword)
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        loginAPI
            .logIn(data.get('username'), data.get('password'))
            .then((role)=>
                {
                    setLoggedIn(true)
                    setUserRole(role)
                    navigate(role === "CUSTOMER"? '/my/tickets' : '/admin/travelers')
                }
            )
            .catch((err)=>console.err(err))
    };

    return (
        <ThemeProvider theme={theme}>
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <Box id="loginForm">
                    <Avatar id="loginIcon" sx={{ width: 60, height: 60, mb: 1, bgcolor: '#1976d2' }}>
                        <LockOutlinedIcon fontSize="large" sx={{color: '#ffeb3b' }}/>
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
                            name="password"
                            label="Password"
                            type={hidePassword ? "password" : "input"}
                            id="password"
                            autoComplete="current-password"
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
                                    )
                                )}}
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Login
                        </Button>
                    </Box>
                </Box>
            </Container>
        </ThemeProvider>
    );
}
