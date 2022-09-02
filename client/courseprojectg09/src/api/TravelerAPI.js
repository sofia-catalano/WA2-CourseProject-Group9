const BASEURL = '/traveler';

function getMyProfile() {
    return new Promise((resolve, reject) => {
        fetch(BASEURL + '/my/profile', {
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
        }).catch((err) => reject(err));
    });
}

function updateMyProfile(user) {
    return new Promise((resolve, reject) => {
        fetch(BASEURL + '/my/profile', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': sessionStorage.getItem('authorization')
            },
            body: JSON.stringify(user),
        }).then((response) => {
            if (response.ok) {
                response.json().then((json) => {
                    resolve()
                }).catch((err) => {
                    reject(err)
                });
            } else {
                response.json().then((error) => {
                    reject(error)
                })
            }
        }).catch((err) => reject(err));
    });
}

function getMyTickets(rangeDate, startDate, endDate) {
    return new Promise((resolve, reject) => {
        const url = rangeDate ? BASEURL + `/my/tickets?start=${startDate}&end=${endDate}` : BASEURL + '/my/tickets'
        fetch(url, {
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
        }).catch((err) => reject(err));
    });
}

function getMyTicketsValidated(rangeDate, startDate, endDate) {
    return new Promise((resolve, reject) => {
        const url = rangeDate ? BASEURL + `/my/tickets/validated?start=${startDate}&end=${endDate}` : BASEURL + '/my/tickets/validated'
        fetch(url, {
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
        }).catch((err) => reject(err));
    });
}

function getMyTicketsValid(rangeDate, startDate, endDate) {
    return new Promise((resolve, reject) => {
        const url = rangeDate ? BASEURL + `/my/tickets/valid?start=${startDate}&end=${endDate}` : BASEURL + '/my/tickets/valid'
        fetch(url, {
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
        }).catch((err) => reject(err));
    });
}

function getMyTicketsExpired(rangeDate, startDate, endDate) {
    return new Promise((resolve, reject) => {
        const url = rangeDate ? BASEURL + `/my/tickets/expired?start=${startDate}&end=${endDate}` : BASEURL + '/my/tickets/expired'
        fetch(url, {
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
        }).catch((err) => reject(err));
    });
}

function getMyTravelcards(){
    return new Promise((resolve, reject) => {
        fetch(BASEURL+'/my/travelcards', {
            method: 'GET',
            headers : {
                'Authorization' : sessionStorage.getItem('authorization')
            }
        }).then((response) => {
            if(response.ok){
                response.json().then((json)=>{
                    console.log(json)
                    resolve(json);
                }).catch((err)=> {
                    reject(err)
                });
            } else{
                reject();
            }
        }).catch((err) => reject(err));
    });
}

function getMyTravelcardsValid(rangeDate, startDate, endDate) {
    return new Promise((resolve, reject) => {
        const url = rangeDate ? BASEURL + `/my/travelcards/valid?start=${startDate}&end=${endDate}` : BASEURL + '/my/travelcards/valid'
        fetch(url, {
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
        }).catch((err) => reject(err));
    });
}

function getMyTravelcardsExpired(rangeDate, startDate, endDate) {
    return new Promise((resolve, reject) => {
        const url = rangeDate ? BASEURL + `/my/travelcards/expired?start=${startDate}&end=${endDate}` : BASEURL + '/my/travelcards/expired'
        fetch(url, {
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
        }).catch((err) => reject(err));
    });
}

function getTravelers() {
    return new Promise((resolve, reject) => {
        fetch(BASEURL + '/admin/travelers', {
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
        }).catch((err) => reject(err));
    });
}

function getTravelersTicketsPurchased(rangeDate, startDate, endDate) {
    return new Promise((resolve, reject) => {
        const url = rangeDate ?
            BASEURL + `/admin/travelers/tickets/purchased?start=${startDate}&end=${endDate}` :
            BASEURL + '/admin/travelers/tickets/purchased'
        fetch(url, {
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
        }).catch((err) => reject(err));
    });

}

function getTravelersTravelcardsPurchased(rangeDate, startDate, endDate) {
    return new Promise((resolve, reject) => {
        const url = rangeDate ?
            BASEURL + `/admin/travelers/travelcards/purchased?start=${startDate}&end=${endDate}` :
            BASEURL + '/admin/travelers/travelcards/purchased'
        fetch(url, {
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
        }).catch((err) => reject(err));
    });

}

function getTravelersTicketsValidated(rangeDate, startDate, endDate) {
    return new Promise((resolve, reject) => {
        const url = rangeDate ?
            BASEURL + `/admin/travelers/tickets/validated?start=${startDate}&end=${endDate}` :
            BASEURL + '/admin/travelers/tickets/validated'
        fetch(url, {
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
        }).catch((err) => reject(err));
    });

}

function getTravelersTicketsValid(rangeDate, startDate, endDate) {
    return new Promise((resolve, reject) => {
        const url = rangeDate ?
            BASEURL + `/admin/travelers/tickets/valid?start=${startDate}&end=${endDate}` :
            BASEURL + '/admin/travelers/tickets/valid'
        fetch(url, {
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
        }).catch((err) => reject(err));
    });

}

function getTravelersTicketsExpired(rangeDate, startDate, endDate) {
    return new Promise((resolve, reject) => {
        const url = rangeDate ?
            BASEURL + `/admin/travelers/tickets/expired?start=${startDate}&end=${endDate}` :
            BASEURL + '/admin/travelers/tickets/expired'
        fetch(url, {
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
        }).catch((err) => reject(err));
    });

}

function getTravelerProfile(userID) {
    return new Promise((resolve, reject) => {
        fetch(BASEURL + `/admin/traveler/${userID}/profile`, {
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
        }).catch((err) => reject(err));
    });

}

function getTravelerTicketPurchased(userID, rangeDate, startDate, endDate) {
    return new Promise((resolve, reject) => {
        const url = rangeDate ?
            BASEURL + `/admin/traveler/${userID}/tickets/purchased?start=${startDate}&end=${endDate}` :
            BASEURL + `/admin/traveler/${userID}/tickets/purchased`
        fetch(url, {
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
        }).catch((err) => reject(err));
    });

}

function getTravelerTicketsValidated(userID, rangeDate, startDate, endDate) {
    return new Promise((resolve, reject) => {
        const url = rangeDate ?
            BASEURL + `/admin/traveler/${userID}/tickets/validated?start=${startDate}&end=${endDate}` :
            BASEURL + `/admin/traveler/${userID}/tickets/validated`
        fetch(url, {
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
        }).catch((err) => reject(err));
    });

}

function getTravelerTicketsValid(userID, rangeDate, startDate, endDate) {
    return new Promise((resolve, reject) => {
        const url = rangeDate ?
            BASEURL + `/admin/traveler/${userID}/tickets/valid?start=${startDate}&end=${endDate}` :
            BASEURL + `/admin/traveler/${userID}/tickets/valid`
        fetch(url, {
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
        }).catch((err) => reject(err));
    });

}

function getTravelerTicketsExpired(userID, rangeDate, startDate, endDate) {
    return new Promise((resolve, reject) => {
        const url = rangeDate ?
            BASEURL + `/admin/traveler/${userID}/tickets/expired?start=${startDate}&end=${endDate}` :
            BASEURL + `/admin/traveler/${userID}/tickets/expired`
        fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': sessionStorage.getItem('authorization')
            }
        }).then((response) => {
            if (response.ok) {
                response.json().then((json) => {
                    console.log(json)
                    resolve(json);
                }).catch((err) => {
                    console.log(err)
                    reject(err)
                });
            } else {
                reject();
            }
        }).catch((err) => reject(err));
    });

}

function getTravelersTravelcardsExpired(rangeDate, startDate, endDate) {
    return new Promise((resolve, reject) => {
        const url = rangeDate ?
            BASEURL + `/admin/travelers/travelcards/expired?start=${startDate}&end=${endDate}` :
            BASEURL + '/admin/travelers/travelcards/expired'
        fetch(url, {
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
        }).catch((err) => reject(err));
    });

}


function getTravelersTravelcardsValid(rangeDate, startDate, endDate) {
    return new Promise((resolve, reject) => {
        const url = rangeDate ?
            BASEURL + `/admin/travelers/travelcards/valid?start=${startDate}&end=${endDate}` :
            BASEURL + '/admin/travelers/travelcards/valid'
        fetch(url, {
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
        }).catch((err) => reject(err));
    });

}

function getTravelerTravelcardPurchased(userID, rangeDate, startDate, endDate) {
    return new Promise((resolve, reject) => {
        const url = rangeDate ?
            BASEURL + `/admin/traveler/${userID}/travelcards/purchased?start=${startDate}&end=${endDate}` :
            BASEURL + `/admin/traveler/${userID}/travelcards/purchased`
        fetch(url, {
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
        }).catch((err) => reject(err));
    });

}

function getTravelerTravelcardExpired(userID, rangeDate, startDate, endDate) {
    return new Promise((resolve, reject) => {
        const url = rangeDate ?
            BASEURL + `/admin/traveler/${userID}/travelcards/expired?start=${startDate}&end=${endDate}` :
            BASEURL + `/admin/traveler/${userID}/travelcards/expired`
        fetch(url, {
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
        }).catch((err) => reject(err));
    });

}

function getTravelerTravelcardValid(userID, rangeDate, startDate, endDate) {
    return new Promise((resolve, reject) => {
        const url = rangeDate ?
            BASEURL + `/admin/traveler/${userID}/travelcards/valid?start=${startDate}&end=${endDate}` :
            BASEURL + `/admin/traveler/${userID}/travelcards/valid`
        fetch(url, {
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
        }).catch((err) => reject(err));
    });

}

const travelerAPI = {
    getMyProfile,
    getTravelers,
    getTravelersTicketsPurchased,
    getTravelersTicketsValidated,
    getTravelersTicketsValid,
    getTravelersTicketsExpired,
    getTravelersTravelcardsPurchased,
    getTravelerProfile,
    getTravelerTicketPurchased,
    getTravelerTicketsValidated,
    getTravelerTicketsValid,
    getTravelerTicketsExpired,
    updateMyProfile,
    getMyTickets,
    getMyTicketsValidated,
    getMyTicketsExpired,
    getMyTravelcards,
    getMyTravelcardsValid,
    getMyTravelcardsExpired,
    getTravelersTravelcardsExpired,
    getTravelersTravelcardsValid,
    getMyTicketsValid,
    getTravelerTravelcardPurchased,
    getTravelerTravelcardExpired,
    getTravelerTravelcardValid
};

export default travelerAPI;
