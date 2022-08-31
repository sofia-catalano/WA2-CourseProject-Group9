import {CircularProgress, Menu} from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import {useEffect, useState} from "react";
import GenericTable from "../generic/Table/Table";
import {useParams} from "react-router-dom";
import {TicketsFilterMenu} from "../generic/FilterMenu/TicketsFilterMenu";
import {useUser} from "../UserProvider";
import travelerAPI from "../../api/TravelerAPI";
import * as dayjs from 'dayjs'


function AdminTicketsList(props) {
    const {loggedIn, userRole, setUserRole, setLoggedIn} = useUser()
    const [loading, setLoading] = useState(false);
    const {user} = useParams();
    const [data, setData] = useState([])
    const [typeTicketsSelected, setTypeTicketsSelected] = useState('all')
    const [nameTable, setNameTable] = useState('Tickets')
    const [startDate, setStartDate] = useState(dayjs())
    const [endDate, setEndDate] = useState(dayjs().add(1,'day'))
    const [rangeDate, setRangeDate] = useState(false)

    const searchTickets = () => {
        if (typeTicketsSelected == 'all') {
            getAllTravelerTicketsPurchased()
        } else if (typeTicketsSelected == 'validated') {
            setLoading(true)
            travelerAPI.getTravelerTicketsValidated(user,
                rangeDate, startDate.toISOString(), endDate.toISOString())
                .then(r => {
                    setTickets(r)
                    setNameTable('Validated tickets')
                })
                .catch(err => console.log(err))
        } else if (typeTicketsSelected == 'valid') {
            setLoading(true)
            travelerAPI.getTravelerTicketsValid(user,
                rangeDate, startDate.toISOString(), endDate.toISOString())
                .then(r => {
                    setTickets(r)
                    setNameTable('Valid tickets')
                })
                .catch(err => console.log(err))
        } else if (typeTicketsSelected == 'expired') {
            setLoading(true)
            travelerAPI.getTravelerTicketsExpired(user,
                rangeDate, startDate.toISOString(), endDate.toISOString())
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
                type: element.duration
            }
        })
        setData(tmp)
        setLoading(false)
    }
    const getAllTravelerTicketsPurchased = () => {
        setLoading(true)
        travelerAPI.getTravelerTicketPurchased(user,
            rangeDate, startDate.toISOString(), endDate.toISOString()
        )
            .then(r => {
                setTickets(r)
                setNameTable('All tickets')
            })
            .catch(err => console.log(err))
    }

    useEffect(() => {
        getAllTravelerTicketsPurchased(rangeDate,
            startDate.toISOString(),
            endDate.toISOString())
    }, [])

    return (

        <>
            {loading
                ?
                <CircularProgress/>
                :
                <GenericTable
                    headCells={headCells}
                    rows={data}
                    nameTable={`${user} 's ${nameTable}`}
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
        id: 'type',
        numeric: false,
        label: 'Type',
    },
];

export default AdminTicketsList;
