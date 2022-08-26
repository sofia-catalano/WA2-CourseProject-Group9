export default function getJson(httpResponsePromise) {
    return new Promise((resolve, reject) => {
        httpResponsePromise
            .then((response) => {
                console.log(response.json())
                if (response.ok) {
                    // always return {} from server, never null or non json, otherwise it will fail
                    response.json()
                        .then( json => resolve(json) )
                        .catch( err => reject({ error: "Cannot parse server response" }))

                } else {
                    // analyze the cause of error
                    response.json()
                        .then(obj => reject(obj)) // error msg in the response body
                        .catch(err => reject({ error: response.statusText}))
                }
            })
            .catch(err => reject({ error: "Cannot communicate with server"  })) // connection error
    });
}
