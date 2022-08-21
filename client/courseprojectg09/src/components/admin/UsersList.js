import { useState} from 'react';
import * as React from 'react';
import GenericTable from "../Table/Table.js";
import {CircularProgress} from "@mui/material";

function UsersList(props) {
    const [loading, setLoading] = useState(false);
    return (
        <>{loading
            ?
            <CircularProgress />
            :
            <GenericTable
                headCells={headCells}
                rows={rows}
                nameTable={"Customers list"}
            />
        }

        </>
    );
}

function createData(id, username, name, surname, address, birthday, telephone, email, password, isActive) {
    return {
        id,
        username,
        name,
        surname,
        address,
        birthday,
        telephone,
        email,
        password,
        isActive
    };
}

const headCells = [
    {
        id: 'id',
        numeric: true,
        label: 'ID',
    },
    {
        id: 'username',
        numeric: true,
        label: 'Username',
    },
    {
        id: 'name',
        numeric: false,
        label: 'Name',
    },
    {
        id: 'surname',
        numeric: false,
        label: 'Surname',
    },
    {
        id: 'address',
        numeric: false,
        label: 'Address',
    },
    {
        id: 'birthday',
        numeric: true,
        label: 'Birthday',
    },
    {
        id: 'telephone',
        numeric: false,
        label: 'Telephone number',
    },
    {
        id: 'email',
        numeric: false,
        label: 'Email',
    },
    {
        id: 'password',
        numeric: false,
        label: 'Password',
    },
    {
        id: 'isActive',
        numeric: false,
        label: 'Active',
    },
];
const rows=[
    createData(1, 'provaUsername', 'provaName', 'provaSurname', 'provaAddress', 'birth', '3396438473892', 'email', 'password', 'true'),
    createData(2, 'provaUsername', 'provaName', 'provaSurname', 'provaAddress', 'birth', '3396438473892', 'email', 'password', 'true'),
    createData(3, 'provaUsername', 'provaName', 'provaSurname', 'provaAddress', 'birth', '3396438473892', 'email', 'password', 'true'),
    createData(4, 'provaUsername', 'provaName', 'provaSurname', 'provaAddress', 'birth', '3396438473892', 'email', 'password', 'true'),
    createData(5, 'provaUsername', 'provaName', 'provaSurname', 'provaAddress', 'birth', '3396438473892', 'email', 'password', 'true'),
    createData(6, 'provaUsername', 'provaName', 'provaSurname', 'provaAddress', 'birth', '3396438473892', 'email', 'password', 'true'),
    createData(7, 'provaUsername', 'provaName', 'provaSurname', 'provaAddress', 'birth', '3396438473892', 'email', 'password', 'true')
]

export default UsersList









