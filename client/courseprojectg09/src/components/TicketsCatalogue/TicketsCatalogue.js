import * as React from 'react';
import Stack from '@mui/material/Stack';
import { Link as RouterLink} from 'react-router-dom';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography'; 

const Item = styled(Paper)(({ theme }) => ({

  padding: theme.spacing(1),
  textAlign: 'center',

}));

const catalogueTypes = ["Tickets", "Travelcard"]

export default function TicketsCatalogue() {
    return (
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            mr: 20,
            '& > :not(style)': {
              m: 5,
              width: 250,
              height: 250,
            },
          }}
        >
        {catalogueTypes.map(type => {
            return(
                <Paper component={RouterLink} elevation={3} to={type==="Tickets" ? "/catalogue/shop/tickets" : "/catalogue/shop/travelcard"}>
                        <Typography
                            sx={{ color:'#1976d2', display:'flex', justifyContent:'center'}}
                            variant="h4"
                            id="tickets"
                            component="div"
                        >
                            {type}
                        </Typography>
                    
                    
                </Paper>
            )
        })}
        </Box>

  );
}