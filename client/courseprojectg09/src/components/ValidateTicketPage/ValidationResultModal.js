import Typography from "@mui/material/Typography";
import * as React from "react";
import Grid from "@mui/material/Grid";
import {Dialog, DialogTitle} from "@mui/material";
import DialogContent from "@mui/material/DialogContent";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';


function ValidationResultModal(props) {

    const {result, handleClose, openResultModal} = props;

    return (
        <Dialog
            open={openResultModal}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            PaperProps={{
                style: { borderRadius: 25 }
            }}
        >
            <DialogTitle>
                <IconButton
                    style={{
                        margin: 10,
                        position: "absolute",
                        top: "0",
                        right: "0",
                        border: "4px solid grey",
                        borderRadius: 25
                    }}
                    onClick={handleClose}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent style={{position: "relative", width: "400px", height: "400px"}}>
                {result.hasOwnProperty("error") ?
                    <Grid
                        container
                        spacing={4}
                        mt={5}
                        direction="column"
                        alignItems="center"
                        justifyContent="center"
                    >
                        <Grid item textAlign='center'>
                            <HighlightOffIcon sx={{fontSize: '100px', color: 'red'}}/>
                        </Grid>
                        <Grid item>
                            <Typography
                                variant='h4'
                                sx={{color: 'red', textAlign: 'center'}}
                            >
                                {result["error"]}
                            </Typography>
                        </Grid>

                    </Grid>
                    :
                    <Grid
                        container
                        spacing={2}
                        mt={5}
                        direction="column"
                        alignItems="center"
                        justifyContent="center"
                    >
                        <Grid item textAlign='center'>
                            <CheckCircleOutlineIcon sx={{fontSize: '100px', color: 'green'}}/>
                        </Grid>
                        <Grid item>
                            <Typography
                                variant='h6'
                                sx={{color: 'green', textAlign: 'center'}}
                            >
                                Type: {result.duration} <br/>
                                Expire at: {convertDate(result.exp)} <br/>
                                Issued at: {convertDate(result.iat)} <br/>
                                Zone(s): {result.zid} <br/>
                                {result.hasOwnProperty("ownerId") && `Holder: ${result.ownerId}`}
                            </Typography>
                        </Grid>

                    </Grid>
                }

            </DialogContent>
        </Dialog>
    );
}

function convertDate(date){
    let d =  new Date(date).toLocaleDateString("it-IT")
    let t = new Date(date).toLocaleTimeString("it-IT")
    return `${d} - ${t}`
}

export default ValidationResultModal;
