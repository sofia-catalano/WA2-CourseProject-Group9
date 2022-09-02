class Travelcard{

    constructor(duration, exp, iat, jws, type, ownerId, zid) {
        this.duration = duration;
        this.exp = exp;
        this.iat = iat;
        this.jws = jws;
        this.type = type;
        this.ownerId = ownerId;
        this.zid = zid;
    }
}

export default Travelcard;