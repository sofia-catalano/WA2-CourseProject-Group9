import { useState} from 'react';
import * as React from 'react';
import {CircularProgress, Divider, List, ListItem, Stack} from "@mui/material";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import { Link as RouterLink} from 'react-router-dom';

function UsersList(props) {
    const [loading, setLoading] = useState(false);
    const data = ["user1", "user2", "user3", "user4"]
    const style = {
        width: '100%',
        maxWidth: 700,
        bgcolor: 'background.paper',
        marginTop: 5,
        marginLeft: 10
    };

    return (
        <>{loading
            ?
            <CircularProgress />
            :
            <Box>
                <Typography
                    sx={{ color:'#1976d2'}}
                    variant="h4"
                    id="title"
                    component="div"
                    align="center"
                >
                    Users list
                </Typography>
                <List sx={style} component="nav" aria-label="user-list">
                    {data.map( user => {
                        return(
                            <Box key={user}>
                                <ListItem>
                                    <Stack spacing={4} direction="row">
                                        <Typography sx={{mr: 5}} variant="subtitle1" gutterBottom>
                                            {user}
                                        </Typography>
                                        <Link component={RouterLink} to={{pathname: `/admin/traveler/${user}/profile`}}>
                                            <Button variant="outlined">Profile</Button>
                                        </Link>


                                        <Button variant="outlined">Orders</Button>
                                        <Button variant="outlined">Tickets</Button>
                                        <Button variant="outlined">Travelcards</Button>
                                    </Stack>
                                </ListItem>
                                <Divider/>
                            </Box>
                        )}
                    )}
                </List>
            </Box>
        }
        </>
    );
}

export default UsersList









