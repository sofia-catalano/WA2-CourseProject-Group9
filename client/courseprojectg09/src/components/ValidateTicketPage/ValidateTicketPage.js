import React, {useState} from 'react';
import {QrReader} from 'react-qr-reader';
import './ValidateTicketPage.css'
import Typography from "@mui/material/Typography";


export default function ValidateTicketPage() {
    const [data, setData] = useState('No result');
    return (
        <div
            style={{
                margin: 'auto',
                width: '400px',
                paddingTop:'3rem'
            }}
        >
            {/*TODO: MODIFICARE 'onResult' implementando la reale validazione del qrCode + mostrando un messagio di risposta*/}
            <QrReader
                onResult={(result, error) => {
                    if (!!result) {
                        setData(result?.text);
                    }

                    if (!!error) {
                        console.info(error);
                    }
                }}
                constraints={{
                    facingMode: 'user'
                }}
                scanDelay={500}
                ViewFinder={ScanOverlay}
            />
            <Typography mt={3}>
                DATA: {data}
            </Typography>
        </div>
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