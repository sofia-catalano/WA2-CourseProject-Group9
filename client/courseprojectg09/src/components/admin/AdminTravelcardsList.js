import {CircularProgress, Menu} from "@mui/material";
import {useState, useEffect} from "react";
import GenericTable from "../generic/Table/Table";
import {TravelcardsFilterMenu} from "../generic/FilterMenu/TicketsFilterMenu";
import travelerAPI from "../../api/TravelerAPI";
import moment from "moment";
import * as dayjs from "dayjs";
import Loading from '../generic/Loading/Loading.js';

function AdminTravelcardsList(props) {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState([]);
    const [typeTravelcardsSelected, setTypeTravelcardsSelected]=useState('all')
    const [nameTable, setNameTable] = useState('Travelcards')
    const [startDate, setStartDate] = useState(dayjs())
    const [endDate, setEndDate] = useState(dayjs().add(1,'day'))
    const [rangeDate, setRangeDate] = useState(false)

    const getAllTravelersTravelcardsPurchased = () => {
        setLoading(true)
        travelerAPI.getTravelersTravelcardsPurchased(rangeDate, startDate.toISOString(), endDate.toISOString())
            .then(r => {
                console.log(r)
                setTravelcards(r)
                setNameTable('All travelcards')
            })
            .catch(err => console.log(err))
    }

    const setTravelcards = (result) => {
        const tmp = result.map((element)=> {
            return {
                id:element.sub,
                type:  element.duration,
                acquired: dayjs(element.iat).format('YYYY-MM-DD HH:mm:ss'),
                expired: dayjs(element.exp).format('YYYY-MM-DD HH:mm:ss'),
                status:  (moment(element.exp)).diff(moment(), 'days') > 0 ? 'VALID' : 'EXPIRED',
                zones:element.zid,
                username:element.userId,
            }
        })
        setData(tmp)
        setLoading(false)
    }

    useEffect(()=>{
        getAllTravelersTravelcardsPurchased()
    },[])


    const searchTravelcards = () => {
        if(typeTravelcardsSelected === 'all') {
            getAllTravelersTravelcardsPurchased()
        }
        else if(typeTravelcardsSelected === 'valid'){
            setLoading(true)
            travelerAPI.getTravelersTravelcardsValid(rangeDate, startDate.toISOString(), endDate.toISOString())
                .then(r => {
                    setTravelcards(r)
                    setNameTable('Valid travelcards')
                })
                .catch(err => console.log(err))
        }
        else if(typeTravelcardsSelected === 'expired'){
            setLoading(true)
            travelerAPI.getTravelersTravelcardsExpired(rangeDate, startDate.toISOString(), endDate.toISOString())
                .then(r => {
                    setTravelcards(r)
                    setNameTable('Expired travelcards')
                })
                .catch(err => console.log(err))
        }
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
                FilterMenu={TravelcardsFilterMenu}
                typeSelected={typeTravelcardsSelected}
                setTypeSelected={setTypeTravelcardsSelected}
                startDate={startDate}
                endDate={endDate}
                setStartDate={setStartDate}
                setEndDate={setEndDate}
                searchTickets={searchTravelcards}
                rangeDate={rangeDate}
                setRangeDate={setRangeDate}
            ></GenericTable>
        }

        </>
    )}

const headCells = [
    {
        id: 'id',
        numeric: false,
        label: 'ID',
    },
    {
        id: 'type',
        numeric: false,
        label: 'Type',
    },
    {
        id: 'acquired',
        numeric: true,
        label: 'Purchase Date',
    },
    {
        id: 'expired',
        numeric: true,
        label: 'Expiration Date',
    },
    {
        id: 'status',
        numeric: false,
        label: 'Status',
    },
    {
        id: 'zones',
        numeric: false,
        label: 'Zones allowed',
    },
    {
        id: 'username',
        numeric: false,
        label: 'Username',
    }
];

export default AdminTravelcardsList;
