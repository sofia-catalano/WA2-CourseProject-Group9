import getJson from './request'
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

const travelerAPI = {getMyProfile, getTravelers};

export default travelerAPI;
