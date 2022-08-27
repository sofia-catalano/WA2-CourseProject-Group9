class PaymentInfo {
    constructor(creditCardNumber, expirationDate, cvv, cardHolder) {
        this.creditCardNumber = creditCardNumber;
        this.expirationDate = expirationDate;
        this.cvv = cvv;
        this.cardHolder = cardHolder;
    }

    static from(json) {
        const paymentInfo = new PaymentInfo();
        Object.assign(paymentInfo, json);
        return paymentInfo;
    }
}

export default PaymentInfo;