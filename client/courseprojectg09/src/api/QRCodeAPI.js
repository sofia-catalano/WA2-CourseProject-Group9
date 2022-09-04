const BASEURL = '/QRCode';

//TODO: da completare quando sarà pronta lato BE
function validateTicket(jwt, zid) {
    return new Promise((resolve, reject) => {
        fetch(BASEURL+'/validateQRCode', {
            method: 'POST',
            headers : {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({ jwt, zid }),
        }).then((response) => {
            if (response.ok) {
                response.json().then((json) =>{
                    resolve(json)
                })
            } else {
                response.json().then((error) =>{
                    resolve(error)
                })
            }
        }).catch((err) => reject(err));
    });
}

function downloadQRCode(id){
    return new Promise((resolve, reject) => {
        fetch(BASEURL+'/generateQRCode/' +id, {
            method: 'GET',
            headers : {
                'Authorization' : sessionStorage.getItem('authorization')
            }
        }).then((response) => {
            if (response) {
                console.log(response)
                resolve(response);
            }
        }).catch((err) => reject(err));
    });
}


const qrCodeAPI = {validateTicket, downloadQRCode};

export default qrCodeAPI;
