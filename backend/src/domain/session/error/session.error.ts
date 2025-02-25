import { CustomError } from '../../../core/custom.error';
import { ErrorDetails } from '../../../core/custom.error.type';

export class SessionError extends CustomError {
    constructor(errorDetails: ErrorDetails) {
        super(errorDetails);
    }
}
