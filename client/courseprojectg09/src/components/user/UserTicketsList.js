import {useEffect, useState, Spinner} from 'react';
import * as React from 'react';
import GenericTable from "../generic/Table/Table.js";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import {CircularProgress, Menu, Tooltip} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import FilterListIcon from '@mui/icons-material/FilterList';
import MenuItem from "@mui/material/MenuItem";
import {TicketsFilterMenu} from "../generic/FilterMenu/TicketsFilterMenu";
import travelerAPI from "../../api/TravelerAPI";
import * as dayjs from 'dayjs'
import qrCodeAPI from "../../api/QRCodeAPI";
import Backdrop from '@mui/material/Backdrop';
import Loading from '../generic/Loading/Loading.js';
function UserTicketsList(props) {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);
    const [typeTicketsSelected, setTypeTicketsSelected] = useState('all');
    const [nameTable, setNameTable] = useState('Tickets');
    const [startDate, setStartDate] = useState(dayjs());
    const [endDate, setEndDate] = useState(dayjs().add(1,'day'));
    const [rangeDate, setRangeDate] = useState(false);

    useEffect(() => {
        getAllTicketsPurchased()
    }, [])

    const setTickets = (result) => {
        const tmp = result.map((element) => {
            return {
                id: element.sub,
                zones: element.zid,
                acquired: dayjs(element.iat).format('YYYY-MM-DD HH:mm:ss'),
                validated: element.validated ? dayjs(element.validated).format('YYYY-MM-DD HH:mm:ss') : '',
                expired: element.validated ? dayjs(element.exp).format('YYYY-MM-DD HH:mm:ss') : '',
                type: element.duration,
                jws : element.jws,
            }
        })
        setData(tmp)
        setLoading(false)
    }

    const getAllTicketsPurchased = () => {
        setLoading(true)
        travelerAPI.getMyTickets(rangeDate, startDate && startDate.toISOString(), endDate && endDate.toISOString())
            .then(r => {
                setTickets(r)
                setNameTable('My tickets')
            })
            .catch(err => console.log(err))
    }

    const searchTickets = () => {
        if (typeTicketsSelected === 'all') {
            getAllTicketsPurchased()
        } else if (typeTicketsSelected === 'validated') {
            setLoading(true)
            travelerAPI.getMyTicketsValidated(rangeDate, startDate.toISOString(), endDate.toISOString())
                .then(r => {
                    setTickets(r)
                    setNameTable('My validated tickets')
                })
                .catch(err => console.log(err))
        } else if (typeTicketsSelected === 'valid') {
            setLoading(true)
            travelerAPI.getMyTicketsValid(rangeDate, startDate.toISOString(), endDate.toISOString())
                .then(r => {
                    setTickets(r)
                    setNameTable('My valid tickets')
                })
                .catch(err => console.log(err))
        } else if (typeTicketsSelected === 'expired') {
            setLoading(true)
            travelerAPI.getMyTicketsExpired(rangeDate, startDate.toISOString(), endDate.toISOString())
                .then(r => {
                    setTickets(r)
                    setNameTable('My expired tickets')
                })
                .catch(err => console.log(err))
        }

    }

    const downloadQRCode = (id) =>{
        console.log("scaricando")
        console.log(id)
        qrCodeAPI.downloadQRCode(id).then(
            (qrcode)=>{
                qrcode.blob().then(
                    blob => {
                        const url = window.URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.style.display = 'none';
                        a.href = url;
                        a.download = `ticket-${id}.png`;
                        document.body.appendChild(a);
                        a.click();
                        document.body.removeChild(a);
                        window.URL.revokeObjectURL(url);
                    }
                )
            }
        )
    }

    return (
        <>{loading
            ?
            <Loading loading={loading}/>
            :
            <GenericTable
                headCells={headCells}
                rows={data}
                nameTable={nameTable}
                FilterMenu={TicketsFilterMenu}
                typeSelected={typeTicketsSelected}
                setTypeSelected={setTypeTicketsSelected}
                startDate={startDate}
                endDate={endDate}
                setStartDate={setStartDate}
                setEndDate={setEndDate}
                searchTickets={searchTickets}
                rangeDate={rangeDate}
                setRangeDate={setRangeDate}
                onDownloadQRCode={downloadQRCode}
            ></GenericTable>
        }

        </>
    );
}


const headCells = [
    {
        id: 'id',
        numeric: false,
        label: 'ID',
    },
    {
        id: 'zones',
        numeric: false,
        label: 'Zones allowed',
    },
    {
        id: 'acquired',
        numeric: true,
        label: 'Acquired',
    },
    {
        id: 'validated',
        numeric: true,
        label: 'Validated',
    },
    {
        id: 'expired',
        numeric: true,
        label: 'Expired',
    },
    {
        id: 'type',
        numeric: false,
        label: 'Type',
    },
    {
        id: 'download',
        numeric: false,
        label: 'Download Tickets QR Code',
    },
];

export default UserTicketsList









