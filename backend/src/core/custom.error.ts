export class CustomError extends Error {
    constructor(message: string) {
        super(message);

        this.name = this.constructor.name;
        console.log(`[${Date.now()}] ${this.name} 에러 발생.\n${this.stack}`); //TODO: 로거로 변경
    }
}
