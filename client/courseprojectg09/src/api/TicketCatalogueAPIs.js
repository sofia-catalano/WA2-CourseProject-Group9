const BASEURL = '/catalogue';

function getCatalogue(){
    return new Promise((resolve,reject) => {
        fetch(BASEURL + '/tickets' ).then((response)=>{
            if(response.ok){
                response.json().then((json)=>{
                    resolve(json);
                }).catch((err)=> {
                    reject(err)
                });
            } else{
                reject();
            }
        }).catch((err) => {
            reject(err)
        });
    });
}

const catalogueAPI = {getCatalogue};

export default catalogueAPI;