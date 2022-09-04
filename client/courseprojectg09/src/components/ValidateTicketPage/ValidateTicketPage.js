import React, {useState} from 'react';
import {QrReader} from 'react-qr-reader';
import './ValidateTicketPage.css'
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from '@mui/material/Button';
import QRCodeAPI from "../../api/QRCodeAPI";
import ValidationResultModal from "./ValidationResultModal";
import Grid from "@mui/material/Grid";

export default function ValidateTicketPage() {

    const [zone, setZone] = useState('');
    const [openResultModal, setOpenResultModal] = useState(false);
    const [result, setResult] = useState({});

    const handleCloseResultModal = () => {
        setOpenResultModal(false) ;
    }

    const validateTicket = (jwt) => {
        QRCodeAPI.validateTicket(jwt, zone).then((r) => {
            if (r["error"]) {
                console.log(r);
                setResult(r);
            } else {
                console.log(r);
                setResult(r);
            }
            setOpenResultModal(true);
        });
    }

    const style = {
        bgcolor: '#1976d2',
        color:'#FFEB3BFF',
        mx:2,
        maxWidth: '150px',
        maxHeight: '150px',
        minWidth: '150px',
        minHeight: '150px',
        fontSize: '50px',
        borderRadius: 8,
        '&:hover': {
            backgroundColor: '#FFEB3BFF',
            color: '#1976d2',
        }
    };

    return (
        <Box sx={{mt: 2, mr: 5, ml: 5}}>
            <Typography
                sx={{color: '#1976d2'}}
                variant="h4"
                id="title"
                component="div"
                align="center"
            >
                Validate Tickets
            </Typography>
            {zone === '' ?
                <Box sx={{mt: 10, mx: 50,  p:5, border: '2px solid #1976d2', borderRadius: 8}}>
                    <Typography
                        sx={{color: '#1976d2'}}
                        variant="h4"
                        id="title"
                        component="div"
                        align="center"
                    >
                        Choose a zone:
                    </Typography>
                    <Box textAlign='center' mt={'5rem'} >
                        <Button size="large" sx={style} onClick={()=>setZone("A")}>A</Button>
                        <Button size="large" sx={style} onClick={()=>setZone("B")}>B</Button>
                        <Button size="large" sx={style} onClick={()=>setZone("C")}>C</Button>
                    </Box>
                </Box>
                :
                <div
                    style={{
                        margin: 'auto',
                        width: '400px',
                        textAlign: 'center'
                    }}
                >
                    <Typography mt={1} mb={2} sx={{color: '#1976d2'}} variant="h6">
                        Zone: <span style={{borderRadius: 8, backgroundColor: '#1976d2', color:'#FFEB3BFF', fontSize:30}}>&nbsp;{zone}&nbsp;</span>
                    </Typography>
                    <QrReader
                        onResult={(result, error) => {
                            if (!!result) {
                                validateTicket(result?.text)
                            }

                            if (!!error) {
                                //console.info(error);
                            }
                        }}
                        constraints={{
                            facingMode: 'user'
                        }}
                        scanDelay={2000}
                        ViewFinder={ScanOverlay}
                    />
                        <ValidationResultModal
                            openResultModal={openResultModal}
                            result={result}
                            handleClose={handleCloseResultModal}
                        />
                    <Grid mt={3}>
                        <Button  variant='contained' onClick={()=> setZone('')}>
                            ← Choose Zone
                        </Button>
                    </Grid>

                </div>
            }
        </Box>
    );
};

function ScanOverlay() {
    return (
        <svg viewBox="0 0 100 100" className="scanOverlay">
            <path fill="none" d="M13,0 L0,0 L0,13" stroke="rgba(255, 0, 0, 0.5)" strokeWidth="5"/>
            <path fill="none" d="M0,87 L0,100 L13,100" stroke="rgba(255, 0, 0, 0.5)" strokeWidth="5"/>
            <path fill="none" d="M87,100 L100,100 L100,87" stroke="rgba(255, 0, 0, 0.5)" strokeWidth="5"/>
            <path fill="none" d="M100,13 L100,0 87,0" stroke="rgba(255, 0, 0, 0.5)" strokeWidth="5"/>
        </svg>
    )
}