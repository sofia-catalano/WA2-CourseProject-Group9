import Transaction from "../model/Transaction";

const BASEURL = '/payment';

function getUserTransactions() {
    return new Promise((resolve, reject) => {
        fetch(BASEURL + '/transactions', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': sessionStorage.getItem('authorization')
            }
        }).then((response) => {
            if (response.ok) {
                response.json().then((json) => {
                    console.log(json)
                    const transactions = json.map((transactionJson) => Transaction.from(transactionJson));
                    resolve(transactions);
                }).catch((err) => {
                    reject(err)
                });
            } else {
                reject();
            }
        }).catch((err) => reject(err));
    });
}

function getAllTransactions() {
    return new Promise((resolve, reject) => {
        fetch(BASEURL + '/admin/transactions', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': sessionStorage.getItem('authorization')
            }
        }).then((response) => {
            if (response.ok) {
                response.json().then((json) => {
                    console.log(json)
                    const transactions = json.map((transactionJson) => Transaction.from(transactionJson));
                    resolve(transactions);
                }).catch((err) => {
                    reject(err)
                });
            } else {
                reject();
            }
        }).catch((err) => reject(err));
    });
}

const paymentAPI = {getUserTransactions, getAllTransactions};

export default paymentAPI;