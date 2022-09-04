import {useEffect, useState, Spinner} from 'react';
import * as React from 'react';
import GenericTable from "../generic/Table/Table.js";
import {CircularProgress, Menu, TableCell, Tooltip} from "@mui/material";
import travelerAPI from "../../api/TravelerAPI";
import * as dayjs from "dayjs";
import qrCodeAPI from "../../api/QRCodeAPI";
import {TravelcardsFilterMenu} from "../generic/FilterMenu/TicketsFilterMenu";
import Loading from '../generic/Loading/Loading.js';

function UserTravelCardsList(props) {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState([]);
    const [nameTable, setNameTable] = useState('Travelcards');
    const [startDate, setStartDate] = useState(dayjs());
    const [endDate, setEndDate] = useState(dayjs().add(1,'day'));
    const [rangeDate, setRangeDate] = useState(false);
    const [typeTravelcardsSelected, setTypeTravelcardsSelected] = useState('all');


    useEffect(() => {
        getAllTravelcardsPurchased()
    }, [])

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
                        a.download = `travelcard-${id}.png`;
                        document.body.appendChild(a);
                        a.click();
                        document.body.removeChild(a);
                        window.URL.revokeObjectURL(url);
                    }
                )
            }
        )
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
                jws : element.jws,
            }
        })
        setData(tmp)
        setLoading(false)
    }

    const searchTravelcards = () => {
        if (typeTravelcardsSelected === 'all') {
            getAllTravelcardsPurchased()
        } else if (typeTravelcardsSelected === 'valid') {
            setLoading(true)
            travelerAPI.getMyTravelcardsValid(rangeDate, startDate.toISOString(), endDate.toISOString())
                .then(r => {
                    setTravelcards(r)
                    setNameTable('Valid Travelcards')
                })
                .catch(err => console.log(err))
        } else if (typeTravelcardsSelected === 'expired') {
            setLoading(true)
            travelerAPI.getMyTravelcardsExpired(rangeDate, startDate.toISOString(), endDate.toISOString())
                .then(r => {
                    setTravelcards(r)
                    setNameTable('Expired Travelcards')
                })
                .catch(err => console.log(err))
        }

    }

    const getAllTravelcardsPurchased = () => {
        setLoading(true);
        travelerAPI.getMyTravelcards()
            .then(r => {
                setTravelcards(r)
                setNameTable('All Travelcards')
            })
            .catch(err => console.log(err))
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
            onDownloadQRCode={downloadQRCode}
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
    {
        id: 'download',
        numeric: false,
        label: 'Download Travelcard QR Code',
    },

];


export default UserTravelCardsList









