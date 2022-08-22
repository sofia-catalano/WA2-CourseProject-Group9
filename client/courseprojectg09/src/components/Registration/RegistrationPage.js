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
import {InputAdornment, Tooltip} from "@mui/material";
import {useState, useEffect} from 'react';
import { useNavigate } from "react-router-dom";
import Typography from "@mui/material/Typography";

const theme = createTheme();

function RegistrationPage() {

    const navigate = useNavigate();
    const [hidePassword, setHidePassword] = useState(true);
    const [showError, setShowError] = useState(false)
    const regex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[\$@!%*?&])(?!.*[\\s-]).*\$")
    const tipText = "● Password must not contain any whitespace\n" +
        "● It must be at least 8 characters long\n" +
        "● It must contain at least:\n" +
        "\t - one digit,\n" +
        "\t - one uppercase letter,\n " +
        "\t - one lowercase letter,\n" +
        "\t - one non alphanumeric character"

    const showPassword = () => {
        setHidePassword(!hidePassword)
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const username = data.get('username');
        const email = data.get('email');
        const password = data.get('password');
        console.log({
            username: username,
            email: email,
            password: password,
        });
        setShowError(false)
        if(username.length > 0 && email.length > 0 && regex.test(password.toString())){
            //redirect to validate page
            navigate("/user/validate")
        }else{
            setShowError(true)
        }
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
                            type="email"
                            required
                            fullWidth
                            id="email"
                            label="Email Address"
                            name="email"
                            autoComplete="email"
                        />
                        <Tooltip
                            title={<span style={{ whiteSpace: 'pre-line' }}>{tipText}</span>}
                            placement="right">

                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                name="password"
                                label="Password"
                                id="password"
                                autoComplete="current-password"
                                type={hidePassword ? "password" : "input"}
                                aria-valuemin={8}
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
                        </Tooltip>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2}}
                        >
                            Register
                        </Button>
                        {showError ?
                            (
                                <Typography sx={{display: "block", color:"red", textAlign:"center"}}>
                                    Invalid data inserted!
                                </Typography>
                            ) : (
                                <Typography sx={{display: "none", color:"red", textAlign:"center"}}>
                                    Invalid data inserted!
                                </Typography>
                            )
                        }

                    </Box>
                </Box>
            </Container>
        </ThemeProvider>
    );
}

export default RegistrationPage;