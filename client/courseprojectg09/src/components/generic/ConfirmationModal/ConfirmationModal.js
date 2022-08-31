import Box from "@mui/material/Box";
import {createTheme, ThemeProvider} from "@mui/material/styles";
import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import {RiUserStarFill} from "react-icons/ri";
import Typography from "@mui/material/Typography";
import * as React from "react";
import Grid from "@mui/material/Grid";

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

function ConfirmationModal(props) {

    const {question, confirmationText, cancelText, handleConfirmation, handleCancel, showError, errorMessage} = props;

    return (
        <Box sx={style}>
            <ThemeProvider theme={theme}>
                <Container component="main">
                    <CssBaseline />
                    <Box id="formStyle">
                        <Avatar id="iconFormStyle" sx={{ width: 60, height: 60, mb: 1, bgcolor: '#1976d2' }}>
                            <RiUserStarFill style={iconStyle}/>
                        </Avatar>
                        <Box component="form" sx={{p: 2}}>
                            <Typography variant="h5" sx={{ textAlign: 'center', color:'#1976d2' }}>
                                {question}
                            </Typography>
                            <Grid container spacing={2}>
                                <Grid item xs={6}>
                                    <Button
                                        fullWidth
                                        variant="contained"
                                        onClick={handleCancel}
                                        sx={{ mt: 3, mb: 2}}
                                    >
                                        {cancelText}
                                    </Button>
                                </Grid>
                                <Grid item xs={6}>
                                    <Button
                                        fullWidth
                                        variant="contained"
                                        onClick={handleConfirmation}
                                        sx={{ mt: 3, mb: 2}}
                                    >
                                        {confirmationText}
                                    </Button>
                                </Grid>
                            </Grid>
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
export default  ConfirmationModal;
