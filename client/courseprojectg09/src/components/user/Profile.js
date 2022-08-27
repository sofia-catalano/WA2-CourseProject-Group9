import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import {useState, useEffect} from "react";
import {AccountCircle, Visibility, VisibilityOff} from "@mui/icons-material";
import {InputAdornment} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import {useParams} from "react-router-dom";
import travelerAPI from "../../api/TravelerAPI";
import {useUser} from "../UserProvider";
import {CircularProgress, Divider, List, ListItem, Stack} from "@mui/material";


export default function UserProfile() {
    let { user } = useParams();
    const {userRole}=useUser()

    const [userData, setUserData] = React.useState();
    const [showPassword, setShowPassword]=React.useState(false);
    const [edit, setEdit]=React.useState(false);
    const [loading,setLoading]=React.useState(true)

    useEffect(()=>{

        if(user!=undefined){
            travelerAPI.getTravelerProfile(user).then((r)=>
            {
                setUserData(r)
                setLoading(false)
            })
        }
        else {
            travelerAPI.getMyProfile().then(r =>
            {
                setUserData(r)
                setLoading(false)
            })
        }

    },[user])

    const handleChange = (prop) => (event) => {
        setUserData({ ...userData, [prop]: event.target.value });
    };

    const handleClickShowPassword = () => {
       setShowPassword(!showPassword)
    };


    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const handleSubmit = evt => {
        evt.preventDefault();
        let valid = true
        if(edit){
            if(userData.name === "" || userData.surname === "" /*|| values.email === "" || values.password === ""*/){
                valid = false
            }

        }

        if(valid){
            //TODO salvare i campi
            const userUpdate={
                name: userData.name,
                surname: userData.surname,
                address: userData.address,
                date_of_birth: userData.date_of_birth,
                telephone_number: userData.telephone_number
            }
            travelerAPI
                .updateMyProfile(userUpdate)
                .then(console.log("ok"))
                .catch((err)=>console.log(err))
           setEdit(!edit)
        }

    }

    return (
        <>{ loading ?  <CircularProgress /> :
        <Box sx={{width: '90%', mt: 2, mr: 5, ml: 5}}>
            <Typography
                sx={{color: '#1976d2'}}
                variant="h4"
                id="title"
                component="div"
                align="center"
            >
                {edit ? "Edit profile" : user!= undefined ? `${user}'s tickets` : "My profile"}
            </Typography>
            <Box
                component="form"
                sx={{
                    '& > :not(style)': { m: 1, width: '25ch' },
                    width: '90%', mt: 2, mr: 5, ml: 12
                }}
                autoComplete="off"
            >
                <TextField
                    id="username"
                    label="Username"
                    defaultValue={userData.username ? userData.username : ''}
                    InputProps={{
                        readOnly: !edit,
                        endAdornment: (
                            <InputAdornment position="start">
                                <AccountCircle />
                            </InputAdornment>
                        )
                    }}
                    disabled={true}
                    variant="standard"
                />
                <TextField
                    id="name"
                    label="Name"
                    defaultValue={userData.name ? userData.name : ''}
                    InputProps={{
                        readOnly: !edit,
                    }}
                    variant="standard"
                    required={edit}
                    onChange={handleChange("name")}
                    error={userData.name === ""}
                    helperText={edit ? "Required" : ""}
                />
                <TextField
                    id="surname"
                    label="Surname"
                    defaultValue={userData.surname ? userData.surname : ''}
                    InputProps={{
                        readOnly: !edit,
                    }}
                    variant="standard"
                    required={edit}
                    onChange={handleChange("surname")}
                    error={userData.surname === ""}
                    helperText={edit ? "Required" : ""}
                />
                <TextField
                    id="address"
                    label="Address"
                    defaultValue={userData.address ? userData.address : ''}
                    InputProps={{
                        readOnly: !edit,
                    }}
                    variant="standard"
                    onChange={handleChange("address")}
                />
                <TextField
                    id="date_of_birth"
                    label="Date of birth"
                    defaultValue={userData.date_of_birth ? userData.date_of_birth  : ''}
                    InputProps={{
                        readOnly: !edit,
                    }}
                    //type="date"
                    variant="standard"
                    onChange={handleChange("date_of_birth")}
                />
                <TextField
                    id="telephone_number"
                    label="Telephone"
                    defaultValue={userData.telephone_number? userData.telephone_number : ''}
                    InputProps={{
                        readOnly: !edit,
                    }}
                    type="tel"
                    variant="standard"
                    onChange={handleChange("telephone_number")}
                />
                {/*
                <TextField
                    id="email"
                    label="Email"
                    defaultValue={values.email}
                    InputProps={{
                        readOnly: !edit,
                    }}
                    type="email"
                    variant="standard"
                    required={edit}
                    onChange={handleChange("email")}
                    error={values.email === ""}
                    helperText={edit ? "Required" : ""}
                />
                <TextField
                    id="password"
                    label="Password"
                    defaultValue={values.password}
                    InputProps={{
                        readOnly: !edit,
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={handleClickShowPassword}
                                    onMouseDown={handleMouseDownPassword}
                                    edge="end"
                                >
                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                        )
                    }}
                    type={showPassword ? 'text' : 'password'}
                    variant="standard"
                    required={edit}
                    onChange={handleChange("password")}
                    error={values.password === ""}
                    helperText={edit ? "Required" : ""}

                />
                */}
            </Box>
            {user === undefined &&
                <Box
                sx={{display: 'flex', flexDirection: 'row-reverse', mr: 25, mt: 10}}>
                <Button
                    size="big"
                    variant="contained"
                    style={{minWidth: "10vw"}}
                    onClick={handleSubmit}
                >
                    {edit ? "Submit" : "Edit profile"}
                </Button>
            </Box>}
        </Box>
    }
    </>
    );
}
