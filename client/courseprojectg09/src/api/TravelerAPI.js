const BASEURL = '/traveler';

function getMyProfile() {
    return new Promise((resolve, reject) => {
        fetch(BASEURL+'/my/profile', {
            method: 'GET',
            headers : {
                'Authorization' : sessionStorage.getItem('authorization')
            }
        }).then((response) => {
            if(response.ok){
                response.json().then((json)=>{
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
function updateMyProfile(user) {
    return new Promise((resolve, reject) => {
        fetch(BASEURL+'/my/profile', {
            method: 'PUT',
            headers : {
                'Content-Type': 'application/json',
                'Authorization' : sessionStorage.getItem('authorization')
            },
            body: JSON.stringify(user),
        }).then((response) => {
            if(response.ok){
                response.json().then((json)=>{
                   resolve()
                }).catch((err)=> {
                    reject(err)
                });
            } else{
                response.json().then((error) =>{
                    reject(error)
                })
            }
        }).catch((err) => reject(err));
    });
}
function getMyTickets() {
    return new Promise((resolve, reject) => {
        fetch(BASEURL+'/my/tickets', {
            method: 'GET',
            headers : {
                'Authorization' : sessionStorage.getItem('authorization')
            }
        }).then((response) => {
            if(response.ok){
                response.json().then((json)=>{
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

function getMyTicketsValidated() {
    return new Promise((resolve, reject) => {
        fetch(BASEURL+'/my/tickets/validated', {
            method: 'GET',
            headers : {
                'Authorization' : sessionStorage.getItem('authorization')
            }
        }).then((response) => {
            if(response.ok){
                response.json().then((json)=>{
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
function getMyTicketsValid() {
    return new Promise((resolve, reject) => {
        fetch(BASEURL+'/my/tickets/valid', {
            method: 'GET',
            headers : {
                'Authorization' : sessionStorage.getItem('authorization')
            }
        }).then((response) => {
            if(response.ok){
                response.json().then((json)=>{
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
function getMyTicketsExpired() {
    return new Promise((resolve, reject) => {
        fetch(BASEURL+'/my/tickets/expired', {
            method: 'GET',
            headers : {
                'Authorization' : sessionStorage.getItem('authorization')
            }
        }).then((response) => {
            if(response.ok){
                response.json().then((json)=>{
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
function getTravelers() {
    return new Promise((resolve, reject) => {
        fetch(BASEURL+'/admin/travelers', {
            method: 'GET',
            headers : {
                'Authorization' : sessionStorage.getItem('authorization')
            }
        }).then((response) => {
            if(response.ok){
                response.json().then((json)=>{
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

function getTravelersTicketsPurchased(){
    return new Promise((resolve, reject) => {
        fetch(BASEURL+'/admin/travelers/tickets/purchased', {
            method: 'GET',
            headers : {
                'Authorization' : sessionStorage.getItem('authorization')
            }
        }).then((response) => {
            if(response.ok){
                response.json().then((json)=>{
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

function getTravelersTravelcardsPurchased(){
    return new Promise((resolve, reject) => {
        fetch(BASEURL+'/admin/travelers/travelcards/purchased', {
            method: 'GET',
            headers : {
                'Authorization' : sessionStorage.getItem('authorization')
            }
        }).then((response) => {
            if(response.ok){
                response.json().then((json)=>{
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

function getTravelersTicketsValidated(){
    return new Promise((resolve, reject) => {
        fetch(BASEURL+'/admin/travelers/tickets/validated', {
            method: 'GET',
            headers : {
                'Authorization' : sessionStorage.getItem('authorization')
            }
        }).then((response) => {
            if(response.ok){
                response.json().then((json)=>{
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
function getTravelersTicketsValid(){
    return new Promise((resolve, reject) => {
        fetch(BASEURL+'/admin/travelers/tickets/valid', {
            method: 'GET',
            headers : {
                'Authorization' : sessionStorage.getItem('authorization')
            }
        }).then((response) => {
            if(response.ok){
                response.json().then((json)=>{
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
function getTravelersTicketsExpired(){
    return new Promise((resolve, reject) => {
        fetch(BASEURL+'/admin/travelers/tickets/expired', {
            method: 'GET',
            headers : {
                'Authorization' : sessionStorage.getItem('authorization')
            }
        }).then((response) => {
            if(response.ok){
                response.json().then((json)=>{
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
function getTravelerProfile(userID){
    return new Promise((resolve, reject) => {
        fetch(BASEURL+`/admin/traveler/${userID}/profile`, {
            method: 'GET',
            headers : {
                'Authorization' : sessionStorage.getItem('authorization')
            }
        }).then((response) => {
            if(response.ok){
                response.json().then((json)=>{
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
function getTravelerTicketPurchased(userID){
    return new Promise((resolve, reject) => {
        fetch(BASEURL+`/admin/traveler/${userID}/tickets/purchased`, {
            method: 'GET',
            headers : {
                'Authorization' : sessionStorage.getItem('authorization')
            }
        }).then((response) => {
            if(response.ok){
                response.json().then((json)=>{
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
function getTravelerTicketsValidated(userID){
    return new Promise((resolve, reject) => {
        fetch(BASEURL+`/admin/traveler/${userID}/tickets/validated`, {
            method: 'GET',
            headers : {
                'Authorization' : sessionStorage.getItem('authorization')
            }
        }).then((response) => {
            if(response.ok){
                response.json().then((json)=>{
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
function getTravelerTicketsValid(userID){
    return new Promise((resolve, reject) => {
        fetch(BASEURL+`/admin/traveler/${userID}/tickets/valid`, {
            method: 'GET',
            headers : {
                'Authorization' : sessionStorage.getItem('authorization')
            }
        }).then((response) => {
            if(response.ok){
                response.json().then((json)=>{
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
function getTravelerTicketsExpired(userID){
    return new Promise((resolve, reject) => {
        fetch(BASEURL+`/admin/traveler/${userID}/tickets/expired`, {
            method: 'GET',
            headers : {
                'Authorization' : sessionStorage.getItem('authorization')
            }
        }).then((response) => {
            if(response.ok){
                response.json().then((json)=>{
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
function getTravelersTravelcardsExpired(){
    return new Promise((resolve, reject) => {
        fetch(BASEURL+'/admin/travelers/travelcards/expired', {
            method: 'GET',
            headers : {
                'Authorization' : sessionStorage.getItem('authorization')
            }
        }).then((response) => {
            if(response.ok){
                response.json().then((json)=>{
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


function getTravelersTravelcardsValid(){
    return new Promise((resolve, reject) => {
        fetch(BASEURL+'/admin/travelers/travelcards/valid', {
            method: 'GET',
            headers : {
                'Authorization' : sessionStorage.getItem('authorization')
            }
        }).then((response) => {
            if(response.ok){
                response.json().then((json)=>{
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
        getTravelersTravelcardsExpired,
        getTravelersTravelcardsValid,
        getMyTicketsValid};

export default travelerAPI;
