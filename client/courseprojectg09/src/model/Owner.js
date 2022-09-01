class Owner {

    constructor(fiscal_code, name, surname, address, date_of_birth, telephone_number) {
        this.fiscal_code = fiscal_code;
        this.name = name;
        this.surname = surname;
        this.address = address;
        this.date_of_birth = date_of_birth;
        this.telephone_number = telephone_number;
    }

    static from(json) {
        const owner = new Owner();
        Object.assign(owner, json);
        return owner;
    }
}

export default Owner;