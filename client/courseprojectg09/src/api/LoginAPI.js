

const BASEURL = '/login';

function logIn(username, password) {
    return new Promise((resolve, reject) => {
        fetch(BASEURL+'/user/login', {
            method: 'POST',
            headers : {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({ username, password }),
        }).then((response) => {
            if (response.ok) {
                sessionStorage.setItem('authorization', response.headers.get("authorization"));
                resolve();
            } else {
                reject();
            }
        }).catch((err) => reject(err));
    });
}
function registerUser(username, email, password) {
    return new Promise((resolve, reject) => {
        fetch(BASEURL+'/user/register', {
            method: 'POST',
            headers : {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({ username, email, password }),
        }).then((response) => {
            if(response.ok){
                response.json().then((json)=>{
                    sessionStorage.setItem("provisionalId", json["provisionalId"])
                    resolve(json);
                }).catch((err)=> {
                    reject(err)
                });
            } else{
                response.json().then((error) =>{
                    resolve(error)
                })
            }
        }).catch((err) => reject(err));
    });
}
function validateUser(activationCode) {
    return new Promise((resolve, reject) => {
        let provisionalId = sessionStorage.getItem("provisionalId");
        console.log(provisionalId)
        fetch(BASEURL+'/user/validate', {
            method: 'POST',
            headers : {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({provisionalId, activationCode}),
        }).then((response) => {
            if(response.ok){
                response.json().then((json)=>{
                    resolve(json);
                }).catch((err)=> {
                    reject(err)
                });
            } else{
                response.json().then((error) =>{
                    console.log(error)
                    resolve(error)
                })
            }
        }).catch((err) => reject(err));
    });
}

function registerAdmin(username, email, password) {
    return new Promise((resolve, reject) => {
        fetch(BASEURL+'/admin/registerAdmin', {
            method: 'POST',
            headers : {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': sessionStorage.getItem('authorization')
            },
            body: JSON.stringify({ username, email, password }),
        }).then((response) => {
            if(response.ok){
                resolve("New Admin correctly registered!");
            } else{
                response.json().then((error) =>{
                    resolve(error)
                })
            }
        }).catch((err) => reject(err));
    });
}

function getAllAdmins(){
    return new Promise((resolve, reject) => {
        fetch(BASEURL + '/admin/admins', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
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

function enrollAdmin(adminUsername){
    return new Promise((resolve, reject) => {
        fetch(BASEURL + '/admin/enrollAdmin/' + adminUsername, {
            method: 'GET',
            headers: {
                'Authorization': sessionStorage.getItem('authorization')
            }
        }).then((response) => {
            if (response.ok) {
                resolve("Set enrolling capability correctly");
            } else {
                response.json().then((error) =>{
                    resolve(error)
                })
            }
        }).catch((err) => reject(err));
    });
}
function getUserData(){
    return new Promise((resolve, reject) => {
        fetch(BASEURL + '/user/data', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
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



const loginAPI = {
    logIn,
    registerUser,
    validateUser,
    registerAdmin,
    getAllAdmins,
    getUserData,
    enrollAdmin
};

export default loginAPI;