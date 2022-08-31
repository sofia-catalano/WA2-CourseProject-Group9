import Box from "@mui/material/Box";
import {createTheme, ThemeProvider} from "@mui/material/styles";
import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";
import Avatar from "@mui/material/Avatar";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import {useState} from "react";
import {RiUserStarFill} from "react-icons/ri";
import './AdminRegistrationForm.css'
import Typography from "@mui/material/Typography";
import {InputAdornment, Tooltip} from "@mui/material";
import VisibilityOffTwoToneIcon from "@mui/icons-material/VisibilityOffTwoTone";
import VisibilityTwoToneIcon from "@mui/icons-material/VisibilityTwoTone";
import * as React from "react";
import { useNavigate } from "react-router-dom";
import loginAPI from "../../../api/LoginAPI";

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 500,
    bgcolor: 'transparent',
    pb: 3,
};

const iconStyle = { color: '#ffeb3b', fontSize: "1.5em" }

const theme = createTheme();

function AdminRegistrationForm(props) {

    const {handleClose, setDirty} = props;
    const navigate = useNavigate();
    const [hidePassword, setHidePassword] = useState(true);
    const [showError, setShowError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
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
        setShowError(false)
        if(username.length > 0 && email.length > 0 && regex.test(password.toString())){
            loginAPI.registerAdmin(username,email,password).then(
                r =>{
                    if(r["error"]){
                        setErrorMessage(r["error"]);
                        setShowError(true)
                    }else {
                        setDirty(true);
                        handleClose();
                        navigate("/admin/admins");
                    }
                }
            )
            //redirect to validate page
        }else{
            setErrorMessage('Invalid Fields!');
            setShowError(true)
        }
    };

    return (
        <Box sx={style}>
            <ThemeProvider theme={theme}>
                <Container component="main">
                    <CssBaseline />
                    <Box id="formStyle">
                        <Avatar id="iconFormStyle" sx={{ width: 60, height: 60, mb: 1, bgcolor: '#1976d2' }}>
                            <RiUserStarFill style={iconStyle}/>
                        </Avatar>
                        <Box component="form" onSubmit={handleSubmit} sx={{p: 2}}>
                            <Typography variant="h4" sx={{ textAlign: 'center', color:'#1976d2' }}>
                                Register New Admin
                            </Typography>
                            <Typography variant="subtitle1" sx={{ textAlign: 'center'}} >
                                Fill the form below with their personal details
                            </Typography>
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
                                        {errorMessage}
                                    </Typography>
                                ) : ''
                            }
                        </Box>
                    </Box>
                </Container>
            </ThemeProvider>
        </Box>
    );
}
export default  AdminRegistrationForm;
