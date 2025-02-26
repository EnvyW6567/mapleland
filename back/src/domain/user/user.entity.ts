export class UserEntity {
    readonly username: string;
    readonly className: string;

    constructor(username: string, className: string) {
        this.username = username;
        this.className = className;
    }
}
