import {CircularProgress, Menu} from "@mui/material";
import {useState, useEffect} from "react";
import GenericTable from "../generic/Table/Table";
import {TravelcardsFilterMenu} from "../generic/FilterMenu/TicketsFilterMenu";
import travelerAPI from "../../api/TravelerAPI";
import moment from "moment";

function AdminTravelcardsList(props) {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState([]);
    const [typeTravelcardsSelected, setTypeTravelcardsSelected]=useState('all')
    const [nameTable, setNameTable] = useState('Travelcards')
    
    const getAllTravelersTravelcardsPurchased = () => {
        setLoading(true)
        travelerAPI.getTravelersTravelcardsPurchased()
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
                acquired:  moment(element.iat).format('YYYY-MM-DD HH:mm:ss'),
                expired: moment(element.expired).format('YYYY-MM-DD HH:mm:ss'),
                status:  (moment(element.expired)).diff(moment(), 'days') > 0 ? 'VALID' : 'EXPIRED',
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


    const handleTypeTravelcardsSelectedChange=(event)=>{
        console.log("Event "+ event.target.value)
        setTypeTravelcardsSelected(event.target.value)
        if(event.target.value!= typeTravelcardsSelected){
            if(event.target.value == 'all'){
                getAllTravelersTravelcardsPurchased()
            }
            else if(event.target.value == 'valid'){
                setLoading(true)
                travelerAPI.getTravelersTravelcardsValid()
                    .then(r => {
                        setTravelcards(r)
                        setNameTable('Valid travelcards')
                    })
                    .catch(err => console.log(err))

            }
            else if(event.target.value == 'expired'){
                setLoading(true)
                travelerAPI.getTravelersTravelcardsExpired()
                    .then(r => {
                        setTravelcards(r)
                        setNameTable('Expired travelcards')
                    })
                    .catch(err => console.log(err))

            }
        }
    }

    return (
        <>{loading
            ?
            <CircularProgress />
            :
            <GenericTable
                headCells={headCells}
                rows={data}
                nameTable={nameTable}
                FilterMenu={TravelcardsFilterMenu}
                typeSelected={typeTravelcardsSelected}
                handleTypeSelectedChange={handleTypeTravelcardsSelectedChange}
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
        id: 'type',
        numeric: false,
        label: 'Type',
    },
    {
        id: 'acquired',
        numeric: false,
        label: 'Purchase Date',
    },
    {
        id: 'expired',
        numeric: false,
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
