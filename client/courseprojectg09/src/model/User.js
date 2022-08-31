class User {
    constructor(userId, email, enroll, isActive, role, username) {
        this.userId = userId;
        this.email = email;
        this.enroll = enroll;
        this.isActive = isActive;
        this.role = role;
        this.username = username;
    }

    static from(json) {
        const user = new User();
        Object.assign(user, json);
        return user;
    }
}

export default User;