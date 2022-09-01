import {useEffect, useState, Spinner} from 'react';
import * as React from 'react';
import GenericTable from "../generic/Table/Table.js";
import {CircularProgress, Menu, TableCell, Tooltip} from "@mui/material";
import travelerAPI from "../../api/TravelerAPI";
import * as dayjs from "dayjs";
import qrCodeAPI from "../../api/QRCodeAPI";

function UserTravelCardsList(props) {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState([]);
    const [nameTable, setNameTable] = useState('Travelcards')


    useEffect(() => {
        getAllTravelcardsPurchased()
    }, [])

    const downloadQRCode = (id) =>{
        console.log("scaricando")
        console.log(id)
        qrCodeAPI.downloadQRCode(id).then(
            (qrcode)=>{
                qrcode.blob().then(
                    image => {
                        const image_url = URL.createObjectURL(image)
                        const item = document.getElementById('container')
                        item.src = image_url
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
            <CircularProgress />
            :
            <GenericTable
                headCells={headCells}
                rows={data}
                nameTable={nameTable}
                onDownloadQRCode={downloadQRCode}
            ></GenericTable>
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









