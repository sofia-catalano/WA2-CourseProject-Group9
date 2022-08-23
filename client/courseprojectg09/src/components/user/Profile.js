import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import {useState} from "react";
import {AccountCircle, Visibility, VisibilityOff} from "@mui/icons-material";
import {InputAdornment} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Toolbar from "@mui/material/Toolbar";

export default function UserProfile() {
    const [values, setValues] = React.useState({
        name: 'Mario',
        surname: 'Rossi',
        username: 'mariorossi',
        address: 'Via Torino',
        birthday: '04/08/2020',
        telephone: '43274392487',
        email: 'mariorossi@gmail.com',
        password: 'Passw0rd1!',
        showPassword: false,
        edit: false,
    });

    const handleChange = (prop) => (event) => {
        setValues({ ...values, [prop]: event.target.value });
    };

    const handleClickShowPassword = () => {
        setValues({
            ...values,
            showPassword: !values.showPassword,
        });
    };


    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const handleSubmit = evt => {
        evt.preventDefault();
        let valid = true
        if(values.edit){
            if(values.name === "" || values.surname === "" || values.email === "" || values.password === ""){
                valid = false
            }

        }

        if(valid){
            //TODO salvare i campi

            setValues({
                ...values,
                edit: !values.edit
            });
        }

    }

    return (
        <Box>
            <Toolbar
                sx={{
                    pl: { sm: 5 },
                    pr: { xs: 1, sm: 1 },
                }}
            >
                <Typography
                    sx={{color:'#1976d2'}}
                    variant="h4"
                    id="tableTitle"
                    component="div"
                    align="center"
                >
                    {values.edit ? "Edit Profile" : "My Profile"}
                </Typography>

            </Toolbar>
            <Box
                component="form"
                sx={{
                    '& > :not(style)': { m: 1, width: '25ch' },
                    mt:2 , mr:5, ml:5
                }}
                autoComplete="off"
            >
                <TextField
                    id="username"
                    label="Username"
                    defaultValue={values.username}
                    InputProps={{
                        readOnly: !values.edit,
                        endAdornment: (
                            <InputAdornment position="start">
                                <AccountCircle />
                            </InputAdornment>
                        )
                    }}
                    disabled={values.edit}
                    variant="standard"
                />
                <TextField
                    id="name"
                    label="Name"
                    defaultValue={values.name}
                    InputProps={{
                        readOnly: !values.edit,
                    }}
                    variant="standard"
                    required
                    onChange={handleChange("name")}
                    error={values.name === ""}
                    helperText="Required"
                />
                <TextField
                    id="surname"
                    label="Surname"
                    defaultValue={values.surname}
                    InputProps={{
                        readOnly: !values.edit,
                    }}
                    variant="standard"
                    required
                    onChange={handleChange("surname")}
                    error={values.surname === ""}
                    helperText="Required"
                />
                <TextField
                    id="address"
                    label="Address"
                    defaultValue={values.address}
                    InputProps={{
                        readOnly: !values.edit,
                    }}
                    variant="standard"
                    onChange={handleChange("address")}
                />
                <TextField
                    id="birthday"
                    label="Birthday"
                    defaultValue={values.birthday}
                    InputProps={{
                        readOnly: !values.edit,
                    }}
                    //type="date"
                    variant="standard"
                    onChange={handleChange("birthday")}
                />
                <TextField
                    id="telephone"
                    label="Telephone"
                    defaultValue={values.telephone}
                    InputProps={{
                        readOnly: !values.edit,
                    }}
                    type="tel"
                    variant="standard"
                    onChange={handleChange("telephone")}
                />
                <TextField
                    id="email"
                    label="Email"
                    defaultValue={values.email}
                    InputProps={{
                        readOnly: !values.edit,
                    }}
                    type="email"
                    variant="standard"
                    required
                    onChange={handleChange("email")}
                    error={values.email === ""}
                    helperText="Required"
                />
                <TextField
                    id="password"
                    label="Password"
                    defaultValue={values.password}
                    InputProps={{
                        readOnly: !values.edit,
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={handleClickShowPassword}
                                    onMouseDown={handleMouseDownPassword}
                                    edge="end"
                                >
                                    {values.showPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                        )
                    }}
                    type={values.showPassword ? 'text' : 'password'}
                    variant="standard"
                    required
                    onChange={handleChange("password")}
                    error={values.password === ""}
                    helperText="Required"
                />
            </Box>
            <Box
                sx={{display: 'flex', flexDirection: 'row-reverse', mr: 25, mt: 10}}>
                <Button
                    size="big"
                    variant="contained"
                    style={{minWidth: "10vw"}}
                    onClick={handleSubmit}
                >
                    {values.edit ? "Submit" : "Edit profile"}
                </Button>
            </Box>
        </Box>
    );
}