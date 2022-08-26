const BASEURL = '/catalogue';

function getCatalogue() {
    return new Promise((resolve, reject) => {
        fetch(BASEURL + '/tickets').then((response) => {
            if (response.ok) {
                response.json().then((json) => {
                    resolve(json);
                }).catch((err) => {
                    reject(err)
                });
            } else {
                reject();
            }
        }).catch((err) => {
            reject(err)
        });
    });
}

function getAllOrders() {
    return new Promise((resolve, reject) => {
        fetch(BASEURL + '/admin/orders', {
            method: 'GET',
            headers: {
                'Authorization': sessionStorage.getItem('authorization')
            }
        }).then((response) => {
            if (response.ok) {
                response.json().then((json) => {
                    resolve(json);
                }).catch((err) => {
                    reject(err)
                });
            } else {
                reject();
            }
        }).catch((err) => {
            reject(err)
        });
    });
}

function getUserOrders(userId) {
    return new Promise((resolve, reject) => {
        fetch(`${BASEURL}/admin/orders/${userId}`, {
            method: 'GET',
            headers: {
                'Authorization': sessionStorage.getItem('authorization')
            }
        }).then((response) => {
            if (response.ok) {
                response.json().then((json) => {
                    resolve(json);
                }).catch((err) => {
                    reject(err)
                });
            } else {
                reject();
            }
        }).catch((err) => {
            reject(err)
        });
    });
}

function addNewTicketToCatalogue(ticketCatalogue) {
    return new Promise((resolve, reject) => {
        fetch(BASEURL + '/admin/tickets', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': sessionStorage.getItem('authorization')
            },
            body: JSON.stringify({
                type: ticketCatalogue.type,
                price: ticketCatalogue.price,
                zones: ticketCatalogue.zones,
                maxAge: ticketCatalogue.maxAge,
                minAge: ticketCatalogue.minAge,
            }),
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

const catalogueAPI = {getCatalogue, getAllOrders, getUserOrders, addNewTicketToCatalogue};

export default catalogueAPI;