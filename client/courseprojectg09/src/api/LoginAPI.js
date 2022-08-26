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

const loginAPI = {logIn};

export default loginAPI;