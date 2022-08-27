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
                    console.log(response)
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

function getTravelersTicketsPurchased(){
    return new Promise((resolve, reject) => {
        fetch(BASEURL+'/admin/travelers/tickets/purchased', {
            method: 'GET',
            headers : {
                'Authorization' : sessionStorage.getItem('authorization')
            }
        }).then((response) => {
            console.log(response)
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
function getTravelersTicketsValidated(){
    return new Promise((resolve, reject) => {
        fetch(BASEURL+'/admin/travelers/tickets/validated', {
            method: 'GET',
            headers : {
                'Authorization' : sessionStorage.getItem('authorization')
            }
        }).then((response) => {
            console.log(response)
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
function getTravelerProfile(userID){
    return new Promise((resolve, reject) => {
        fetch(BASEURL+`/admin/traveler/${userID}/profile`, {
            method: 'GET',
            headers : {
                'Authorization' : sessionStorage.getItem('authorization')
            }
        }).then((response) => {
            console.log(response)
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
function getTravelerTicketPurchased(userID){
    return new Promise((resolve, reject) => {
        fetch(BASEURL+`/admin/traveler/${userID}/tickets/purchased`, {
            method: 'GET',
            headers : {
                'Authorization' : sessionStorage.getItem('authorization')
            }
        }).then((response) => {
            console.log(response)
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
function getTravelerTicketsValidated(userID){
    return new Promise((resolve, reject) => {
        fetch(BASEURL+`/admin/traveler/${userID}/tickets/validated`, {
            method: 'GET',
            headers : {
                'Authorization' : sessionStorage.getItem('authorization')
            }
        }).then((response) => {
            console.log(response)
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
const travelerAPI = {
        getMyProfile,
         getTravelers,
         getTravelersTicketsPurchased,
         getTravelersTicketsValidated,
         getTravelerProfile,
         getTravelerTicketPurchased,
         getTravelerTicketsValidated,
         updateMyProfile,
        getMyTickets};

export default travelerAPI;
