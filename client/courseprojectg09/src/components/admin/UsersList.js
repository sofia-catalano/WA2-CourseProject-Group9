import { useState, useEffect} from 'react';
import * as React from 'react';
import {CircularProgress, Divider, List, ListItem, Stack} from "@mui/material";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import Paper from "@mui/material/Paper";
import { Link as RouterLink} from 'react-router-dom';
import travelerAPI from "../../api/TravelerAPI";

function UsersList(props) {
    const [loading, setLoading] = useState(true);
    const [data, setData]=useState([])
    const style = {
        width: '100%',
        maxWidth: 850,
        bgcolor: 'bckground.paper',
        marginTop: 5,
        marginLeft: 10
    };

    
    useEffect(()=>{
        travelerAPI.getTravelers()
        .then(r => {
            setData(r)
            setLoading(false)
        })
        .catch(err => console.log(err))
    },[])

    return (
        <>{loading
            ?
            <CircularProgress />
            :
            <Box sx={{width: '90%', mt: 2, mr: 5, ml: 5}}>
                <Typography
                    sx={{color: '#1976d2'}}
                    variant="h4"
                    id="title"
                    component="div"
                    align="center"
                >
                    Users list
                </Typography>
                <Box sx={{width: '90%', mt: 2, mr: 5, ml: 5}}>
                    <Paper sx={{width: '100%'}}>
                        <List sx={style} aria-label="user-list">
                        {data.map( user => {
                            return(
                                <Box textAlign="center">
                                    <ListItem key={user}>
                                        <Stack spacing={10} direction="row">
                                            <Typography sx={{mr: 5}} variant="subtitle1" gutterBottom>
                                                {user.username}
                                            </Typography>
                                            <Link component={RouterLink} to={{pathname: `/admin/traveler/${user.username}/profile`}}>
                                                <Button variant="outlined">Profile</Button>
                                            </Link>
                                            <Link component={RouterLink} to={{pathname: `/admin/traveler/${user.username}/orders`}}>
                                                <Button variant="outlined">Orders</Button>
                                            </Link>
                                            <Link component={RouterLink} to={{pathname: `/admin/traveler/${user.username}/tickets`}}>
                                                <Button variant="outlined">Tickets</Button>
                                            </Link>
                                            <Link component={RouterLink} to={{pathname: `/admin/traveler/${user.username}/travelcards`}}>
                                                <Button variant="outlined">Travelcards</Button>
                                            </Link>
                                        </Stack>
                                    </ListItem>
                                    <Divider/>
                                </Box>
                            )}
                        )}
                        </List>
                    </Paper>
                </Box>
            </Box>
        }
        </>
    );
}

export default UsersList









