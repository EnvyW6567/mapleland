import { CustomError } from '../../../core/custom.error';

export class SessionError extends CustomError {
    constructor(message: string) {
        super(message);
    }
}
