import * as React from 'react';
import Stack from '@mui/material/Stack';
import { Link as RouterLink} from 'react-router-dom';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography'; 
import Button from '@mui/material/Button'; 
//import {useUser} from "../UserProvider";

const Item = styled(Paper)(({ theme }) => ({

  padding: theme.spacing(1),
  textAlign: 'center',

}));

const catalogueTypes = ["Tickets", "Travelcard"]

export default function TicketsCatalogue() {
    //const {loggedIn, userRole, setUserRole, setLoggedIn}=useUser()
    const userRole = "admin" //TODO sistemare
    const findUrl = (type) => {
        if(userRole==="admin" && type==="Tickets" )
            return "/catalogue/admin/tickets"  
        else if(userRole==="admin" && type==="Travelcard" )
            return "/catalogue/admin/travelcard"
        else if (type==="Tickets")
            return "/catalogue/shop/tickets"
        else
            return "/catalogue/shop/travelcard"
    }
    return (
        <Box sx={{  display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'center', 
                    mt: 15}}
        >
            <Stack direction="row" spacing={5}>
                {catalogueTypes.map(type => {
                return(
                    <Button style={{
                            maxWidth: '250px', 
                            maxHeight: '250px', 
                            minWidth: '250px', 
                            minHeight: '250px',
                            border: '4px solid #1976d2',
                            borderRadius: '15px 15px 15px 15px'
                            }}
                            key = {type}
                            component={RouterLink}
                            to={findUrl(type)}
                    >
                        <Typography
                                sx={{ color:'#1976d2', display:'flex', justifyContent:'center'}}
                                variant="h5"
                                id="tickets"
                                component="div"
                        >
                            {type}
                        </Typography>
                    </Button>
                )
            })}
            </Stack>
        </Box>
    );
}