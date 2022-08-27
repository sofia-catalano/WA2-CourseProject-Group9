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

const qrCodeAPI = {validateTicket};

export default qrCodeAPI;