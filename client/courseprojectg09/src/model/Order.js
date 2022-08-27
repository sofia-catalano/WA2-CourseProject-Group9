class Order {
    constructor(orderId, status, ticketCatalogueId, quantity, customerUsername, owner) {
        this.orderId = orderId;
        this.status = status;
        this.ticketCatalogueId = ticketCatalogueId;
        this.quantity = quantity;
        this.customerUsername = customerUsername;
        this.owner = owner;
    }

    static from(json) {
        const order = new Order();
        Object.assign(order, json);
        return order;
    }
}

export default Order;