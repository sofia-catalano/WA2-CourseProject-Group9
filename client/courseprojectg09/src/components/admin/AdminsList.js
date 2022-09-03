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
import AdminRegistrationForm from "./AdminRegistrationForm/AdminRegistrationForm";
import {useEffect} from "react";
import loginAPI from "../../api/LoginAPI";
import ConfirmationModal from "../generic/ConfirmationModal/ConfirmationModal";
import Loading from '../generic/Loading/Loading.js';

function AdminsList(props) {
    const [loading, setLoading] = useState(true);
    const [admins, setAdmins] = useState([]);
    const [dirty, setDirty] = useState(true);
    const [open, setOpen] = React.useState(false);
    const [adminUsername, setAdminUsername] = useState('');
    const [showError, setShowError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [openModalCapability, setOpenModalCapability] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const handleCloseModalCapability = () => setOpenModalCapability(false);

    useEffect(() => {
        if(dirty){
            //fix fetch when no other admins are registered
            loginAPI.getAllAdmins()
                .then((fetchedAdmins) => {
                    fetchedAdmins.forEach(function (obj) {
                        obj['isActive'] && delete obj['isActive'];
                    })
                    setAdmins(fetchedAdmins);
                    setLoading(false);
                    setDirty(false);
                });
        }
    }, [dirty]);

    const handleClick = (userName) => {
        admins.findIndex(admin => {
            setAdminUsername(admin.username)
            return admin.username === userName
        });
        setOpenModalCapability(true);
    }

    function handleConfirmationModal(adminUsername){
        loginAPI.enrollAdmin(adminUsername)
            .then(r => {
                if(r["error"]){
                    setErrorMessage(r["error"]);
                    setShowError(true)
                }else {
                    setDirty(true);
                    handleCloseModalCapability();
                }
            })
    }

    return (
        <>{loading
            ?
            <Loading loading={loading}/>
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
                                    <TableCell align="center"><b>Username</b></TableCell>
                                    <TableCell align="center"><b>Email</b></TableCell>
                                    <TableCell align="center"><b>Enrolling Capability</b></TableCell>
                                    <TableCell align="center"><b>Action</b></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {admins.map(row => {
                                    return (
                                        <TableRow key={row.username} align="center">
                                            <TableCell component="th" scope="row" align="center">
                                                {row.username}
                                            </TableCell>
                                            <TableCell align="center" >{row.email}</TableCell>
                                            <TableCell align="center">
                                                {
                                                    row.enroll ? (
                                                        <FiberManualRecordIcon sx={{color:"green"}}/>
                                                    ) : (
                                                        <FiberManualRecordIcon sx={{color:"red"}}/>
                                                    )
                                                }
                                            </TableCell>
                                            <TableCell align="center">
                                                <Button variant="contained" disabled={row.enroll} onClick={() => handleClick(row.username)} startIcon={<StarRoundedIcon fontSize="small" />}>
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
                        <AdminRegistrationForm handleClose={handleClose} setDirty={setDirty}/>
                    </Modal>
                    <Modal
                        open={openModalCapability}
                        onClose={handleCloseModalCapability}
                        aria-labelledby="modal-modal-title"
                        aria-describedby="modal-modal-description"
                    >
                        <ConfirmationModal
                            icon={<RiUserStarFill style={{color: '#ffeb3b', fontSize: "1.5em"}}/>}
                            question={"Do you really want to give to the admin: "+adminUsername+" the enrolling capability?"}
                            confirmationText={"Confirm"}
                            cancelText={"Cancel"}
                            handleConfirmation={() => handleConfirmationModal(adminUsername)}
                            handleCancel={handleCloseModalCapability}
                            showError={showError}
                            errorMessage={errorMessage}/>
                    </Modal>
                </Box>

            </Box>

        }
        </>
    );
}

export default AdminsList









