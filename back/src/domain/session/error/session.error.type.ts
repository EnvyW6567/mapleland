import { DomainErrors } from '../../../core/custom.error.type';

export const SessionErrorType: DomainErrors = Object.freeze({
    SESSION_NOT_FOUND: {
        message: 'session not found',
    },
    INVALID_PARTY_NAME: {
        message: 'invalid party name',
    },
} as const);
