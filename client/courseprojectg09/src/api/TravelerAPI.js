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

const travelerAPI = {getMyProfile};

export default travelerAPI;