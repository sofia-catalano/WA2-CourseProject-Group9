import {CircularProgress, Menu} from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import {useState} from "react";
import GenericTable from "../generic/Table/Table";
import {useParams} from "react-router-dom";
import {TicketsFilterMenu, TravelcardsFilterMenu} from "../generic/FilterMenu/TicketsFilterMenu";
import {useUser} from "../UserProvider";
import * as dayjs from "dayjs";
import travelerAPI from "../../api/TravelerAPI";
import {useEffect} from "react";

function AdminUserTravelcardsList(props) {
    const {loggedIn, userRole, setUserRole, setLoggedIn}=useUser()
    const [loading, setLoading] = useState(false);
    const {user} = useParams();
    const [data, setData] = useState([]);
    const [typeTravelcardSelected, setTypeTravelcardSelected] = useState('all');
    const [nameTable, setNameTable] = useState('Travelcards');
    const [startDate, setStartDate] = useState(dayjs());
    const [endDate, setEndDate] = useState(dayjs().add(1,'day'));
    const [rangeDate, setRangeDate] = useState(false);

    const searchTravelcards = () => {
        if (typeTravelcardSelected === 'all') {
            getAllTravelerTravelcardPurchased()
        } else if (typeTravelcardSelected === 'valid') {
            setLoading(true)
            travelerAPI.getTravelerTravelcardValid(user,
                rangeDate, startDate.toISOString(), endDate.toISOString())
                .then(r => {
                    setTravelcards(r)
                    setNameTable('Valid Travelcards')
                })
                .catch(err => console.log(err))
        } else if (typeTravelcardSelected === 'expired') {
            setLoading(true)
            travelerAPI.getTravelerTravelcardExpired(user,
                rangeDate, startDate.toISOString(), endDate.toISOString())
                .then(r => {
                    setTravelcards(r)
                    setNameTable('Expired Travelcards')
                })
                .catch(err => console.log(err))
        }
    }

    const setTravelcards = (result) => {
        const tmp = result.map((element) => {
            return {
                id : element.sub,
                duration: element.duration === "1 year" ? "Annual" : "Monthly",
                issued: dayjs(element.iat).format('YYYY-MM-DD HH:mm:ss'),
                expired: dayjs(element.exp).format('YYYY-MM-DD HH:mm:ss'),
                status: dayjs().format('YYYY-MM-DD HH:mm:ss') < dayjs(element.exp).format('YYYY-MM-DD HH:mm:ss') ? "VALID" : "EXPIRED",
                zones: element.zid,
                ownerId: element.ownerId,
            }
        })
        setData(tmp)
        setLoading(false)
    }

    const getAllTravelerTravelcardPurchased = () => {
        setLoading(true)
        travelerAPI.getTravelerTravelcardPurchased(user,
            rangeDate, startDate.toISOString(), endDate.toISOString()
        )
            .then(r => {
                setTravelcards(r)
                setNameTable('All Travelcards')
            })
            .catch(err => console.log(err))
    }

    useEffect(() => {
        getAllTravelerTravelcardPurchased(rangeDate,
            startDate.toISOString(),
            endDate.toISOString())
    }, [])

    return (

        <>
            {loading
            ?
            <CircularProgress />
            :
                <GenericTable
                headCells={headCells}
                rows={data}
                nameTable={`${user} 's ${nameTable}`}
                FilterMenu={TravelcardsFilterMenu}
                typeSelected={typeTravelcardSelected}
                setTypeSelected={setTypeTravelcardSelected}
                startDate={startDate}
                endDate={endDate}
                setStartDate={setStartDate}
                setEndDate={setEndDate}
                searchTickets={searchTravelcards}
                rangeDate={rangeDate}
                setRangeDate={setRangeDate}
                />
        }

        </>
    );
}

const headCells = [
    {
        id: 'ID',
        numeric: false,
        label: 'ID',
    },
    {
        id: 'duration',
        numeric: false,
        label: 'Type',
    },
    {
        id: 'purchase_date',
        numeric: false,
        label: 'Purchase Date',
    },
    {
        id: 'expiration_date',
        numeric: false,
        label: 'Expiration Date',
    },
    {
        id: 'status',
        numeric: false,
        label: 'Status', //if now < expiration date then valid otherwise status = EXPIRED
    },
    {
        id: 'zid',
        numeric: false,
        label: 'Zone Allowed',
    },
    {
        id: 'holder',
        numeric: false,
        label: 'Holder',
    },

];
export default AdminUserTravelcardsList;
