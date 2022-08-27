class Transaction {
    constructor(transactionId, amount, date, isConfirmed, orderId, customerUsername) {
        this.transactionId = transactionId;
        this.amount = amount;
        this.date = date;
        this.isConfirmed = isConfirmed;
        this.orderId = orderId;
        this.customerUsername = customerUsername;
    }

    static from(json) {
        let newJson = {transactionId: json.transactionId, amount: `€ ${json.amount}`, date: convertDate(json.date), isConfirmed: (json.isConfirmed ? 'ACCEPTED' : 'REJECTED') , orderId: json.orderId, customerUsername: json.customerUsername}
        const transaction = new Transaction();
        Object.assign(transaction, newJson);
        return transaction;
    }
}

function convertDate(date){
    let d =  new Date(date).toLocaleDateString("it-IT")
    let t = new Date(date).toLocaleTimeString("it-IT")
    return `${d} - ${t}`
}

export default Transaction;