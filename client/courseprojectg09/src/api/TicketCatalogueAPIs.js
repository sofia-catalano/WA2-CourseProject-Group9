import Orders from "../model/Order";

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
                    console.log(json)
                    const orders = json.map((ordersJson) => Orders.from(ordersJson));
                    resolve(orders);
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
                    console.log(json)
                    const orders = json.map((ordersJson) => Orders.from(ordersJson));
                    resolve(orders);
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

//ista di tutti gli ordini effettuati da un utente
function getTravelerOrders() {
    return new Promise((resolve, reject) => {
        fetch(`${BASEURL}/orders`, {
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

function buyTickets(numberOfTickets, ticketId, type, paymentInfo) {
    return new Promise((resolve, reject) => {
        fetch(`${BASEURL}/shop/${ticketId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': sessionStorage.getItem('authorization')
            },
            body: JSON.stringify({
                numberOfTickets: numberOfTickets,
                ticketId: ticketId,
                type: type,
                paymentInfo: {
                    creditCardNumber: paymentInfo.creditCardNumber,
                    expirationDate: paymentInfo.expirationDate,
                    cvv: paymentInfo.cvv,
                    cardHolder: paymentInfo.cardHolder,
                },
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

function buyTravelcard( ticketId, type, paymentInfo, owner) {
    return new Promise((resolve, reject) => {
        fetch(`${BASEURL}/shop/${ticketId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': sessionStorage.getItem('authorization')
            },
            body: JSON.stringify({
                numberOfTickets: 1,
                ticketId: ticketId,
                type: type,
                paymentInfo: {
                    creditCardNumber: paymentInfo.creditCardNumber,
                    expirationDate: paymentInfo.expirationDate,
                    cvv: paymentInfo.cvv,
                    cardHolder: paymentInfo.cardHolder,
                },
                owner: {
                    fiscal_code: owner.fiscal_code,
                    name: owner.name,
                    surname: owner.surname,
                    address: owner.address,
                    date_of_birth: owner.date_of_birth,
                    telephone_number: owner.telephone_number,
                },
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

const catalogueAPI = {
    getCatalogue,
    getAllOrders,
    getUserOrders,
    getTravelerOrders,
    addNewTicketToCatalogue,
    buyTickets,
    buyTravelcard
};

export default catalogueAPI;