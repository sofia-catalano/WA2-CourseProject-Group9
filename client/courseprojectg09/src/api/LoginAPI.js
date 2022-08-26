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
                console.log(response)
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



const loginAPI = {
    logIn,
    registerUser,
    validateUser
};

export default loginAPI;