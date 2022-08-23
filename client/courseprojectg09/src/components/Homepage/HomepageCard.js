import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

const bull = (
    <Box
        component="span"
        sx={{ display: 'inline-block', mx: '2px', transform: 'scale(0.8)' }}
    >
        •
    </Box>
);

const card = (
    <React.Fragment>
        <CardContent style={{minWidth:"25vw", minHeight:"25vh", textAlign:"center"}}>
            <Typography sx={{ fontSize: 34 }}  gutterBottom>
                Welcome to Turin Transport
            </Typography>
            <Typography color="text.secondary" component="div">
                Your best way to reach every area in Turin.
            </Typography>
            <Typography style={{marginTop :"10vh"}} variant="body2">
                See prices and season pass in Ticket Catalogue Section!
                <br />
            </Typography>
        </CardContent>
        <CardActions style={{justifyContent: "space-around", marginBottom: "0.5rem"}}>
            <Button size="big" variant="contained" style={{minWidth: "10vw"}}  href="/user/login">
                Log in
            </Button>
            <Button size="big" variant="outlined" style={{minWidth: "10vw"}} href="/user/register">
                Register
            </Button>
        </CardActions>
    </React.Fragment>
);

export default function OutlinedCard() {
    return (
        <Box sx={{ minWidth: 275 }}>
            <Card variant="outlined">{card}</Card>
        </Box>
    );
}