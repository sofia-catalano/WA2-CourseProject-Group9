const BASEURL = '/QRCode';

//TODO: da completare quando sarà pronta lato BE
function validateTicket(jwt) {
    return new Promise((resolve, reject) => {
        fetch(BASEURL+'/validateTicket', {
            method: 'POST',
            headers : {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({ jwt }),
        }).then((response) => {
            if (response.ok) {
                console.log(response)
                resolve();
            } else {
                reject();
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
