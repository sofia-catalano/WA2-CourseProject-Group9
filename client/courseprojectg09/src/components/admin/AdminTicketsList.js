import {CircularProgress, Menu} from "@mui/material";
import {useState, useEffect} from "react";
import GenericTable from "../generic/Table/Table";
import {TicketsFilterMenu} from "../generic/FilterMenu/TicketsFilterMenu";
import travelerAPI from "../../api/TravelerAPI";
import * as dayjs from 'dayjs'
import Loading from '../generic/Loading/Loading.js';

function AdminTicketsList(props) {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState([]);
    const [typeTicketsSelected, setTypeTicketsSelected] = useState('all')
    const [nameTable, setNameTable] = useState('Tickets')
    const [startDate, setStartDate] = useState(dayjs())
    const [endDate, setEndDate] = useState(dayjs().add(1,'day'))
    const [rangeDate, setRangeDate] = useState(false)

    const searchTickets = () => {
        if (typeTicketsSelected == 'all') {
            getAllTravelersTicketPurchased()
        } else if (typeTicketsSelected == 'validated') {
            setLoading(true)
            travelerAPI.getTravelersTicketsValidated(rangeDate, startDate.toISOString(), endDate.toISOString())
                .then(r => {
                    setTickets(r)
                    setNameTable('Validated tickets')
                })
                .catch(err => console.log(err))
        } else if (typeTicketsSelected == 'valid') {
            setLoading(true)
            travelerAPI.getTravelersTicketsValid(rangeDate, startDate.toISOString(), endDate.toISOString())
                .then(r => {
                    setTickets(r)
                    setNameTable('Valid tickets')
                })
                .catch(err => console.log(err))

        } else if (typeTicketsSelected == 'expired') {
            setLoading(true)
            travelerAPI.getTravelersTicketsExpired(rangeDate, startDate.toISOString(), endDate.toISOString())
                .then(r => {
                    setTickets(r)
                    setNameTable('Expired tickets')
                })
                .catch(err => console.log(err))
        }
    }


    const setTickets = (result) => {
        const tmp = result.map((element) => {
            return {
                id: element.sub,
                zones: element.zid,
                acquired: dayjs(element.iat).format('YYYY-MM-DD HH:mm:ss'),
                validated: element.validated ? dayjs(element.validated).format('YYYY-MM-DD HH:mm:ss') : '',
                expired: element.validated ? dayjs(element.expired).format('YYYY-MM-DD HH:mm:ss') : '',
                username: element.userId,
                type: element.duration
            }
        })
        setData(tmp)
        setLoading(false)
    }
    const getAllTravelersTicketPurchased = () => {
        setLoading(true)
        travelerAPI.getTravelersTicketsPurchased(rangeDate, startDate.toISOString(), endDate.toISOString())
            .then(r => {
                setTickets(r)
                setNameTable('All tickets')
            })
            .catch(err => console.log(err))
    }

    useEffect(() => {
        getAllTravelersTicketPurchased()
    }, [])

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
        id: 'username',
        numeric: false,
        label: 'Username',
    },
    {
        id: 'type',
        numeric: false,
        label: 'Type',
    },

];

export default AdminTicketsList;
