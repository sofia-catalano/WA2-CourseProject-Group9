import {useState} from 'react';
import * as React from 'react';
import {CircularProgress, Modal, TableCell} from "@mui/material";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import Paper from "@mui/material/Paper";
import StarRoundedIcon from '@mui/icons-material/StarRounded';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import {RiUserStarFill} from "react-icons/ri";
import AdminRegistrationForm from "../AdminRegistrationForm/AdminRegistrationForm";

function AdminsList(props) {
    const [loading, setLoading] = useState(false);
    let data = [
        {
            username: "admin2",
            email: "admin2@gmail.com",
            isEnrolled: false
        },
        {
            username: "admin3",
            email: "admin3@gmail.com",
            isEnrolled: true
        }, {
            username: "admin4",
            email: "admin4@gmail.com",
            isEnrolled: false
        }]

    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const handleClick = (userName) => {
        // data.find(userName === username).isEnrolled = !data.find(userName === username).isEnrolled
        const i = data.findIndex(admin => {
            return admin.username === userName
        });
        data[i].isEnrolled = !data[i].isEnrolled
    }

    return (
        <>{loading
            ?
            <CircularProgress/>
            :
            <Box sx={{width: '90%', mt: 2, mr: 5, ml: 5}}>
                <Typography
                    sx={{color: '#1976d2'}}
                    variant="h4"
                    id="title"
                    component="div"
                    align="center"
                >
                    Admins list
                </Typography>
                <Box sx={{width: '90%', mt: 2, mr: 5, ml: 5}}>
                    <Paper sx={{width: '100%', mb: 2}}>
                        <Table>
                            <TableHead>
                                <TableRow
                                    align={'center'}
                                    padding={'normal'}
                                >
                                    <TableCell align="center">Username</TableCell>
                                    <TableCell align="center">Email</TableCell>
                                    <TableCell align="center">Enrolling Capability</TableCell>
                                    <TableCell align="center">Action</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {data.map(row => {
                                    return (
                                        <TableRow key={row.username} align="center">
                                            <TableCell component="th" scope="row" align="center">
                                                {row.username}
                                            </TableCell>
                                            <TableCell align="center" >{row.email}</TableCell>
                                            <TableCell align="center">
                                                {
                                                    row.isEnrolled ? (
                                                        <FiberManualRecordIcon sx={{color:"green"}}/>
                                                    ) : (
                                                        <FiberManualRecordIcon sx={{color:"red"}}/>
                                                    )
                                                }
                                            </TableCell>
                                            <TableCell align="center">
                                                <Button variant="contained" disabled={row.isEnrolled} click={() => handleClick(row.username)} startIcon={<StarRoundedIcon fontSize="small" />}>
                                                    Give Enroll Capability
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </Paper>
                </Box>
                <Box textAlign="center">
                    <Button variant="contained" sx={{mx:5}} startIcon={<RiUserStarFill/>} onClick={handleOpen}>
                        Register New Admin
                    </Button>
                    <Modal
                        open={open}
                        onClose={handleClose}
                        aria-labelledby="modal-modal-title"
                        aria-describedby="modal-modal-description"
                    >
                        <AdminRegistrationForm handleClose={handleClose}/>
                    </Modal>
                </Box>

            </Box>

        }
        </>
    );
}

export default AdminsList









