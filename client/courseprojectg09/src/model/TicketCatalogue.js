class TicketCatalogue {
    constructor(id, type, price, zones, maxAge, minAge) {
        this.id = id;
        this.type = type;
        this.price = price;
        this.zones = zones;
        this.maxAge = maxAge;
        this.minAge = minAge;
    }

    static from(json) {
        const ticketCatalogue = new TicketCatalogue();
        Object.assign(ticketCatalogue, json);
        return ticketCatalogue;
    }
}

export default TicketCatalogue;