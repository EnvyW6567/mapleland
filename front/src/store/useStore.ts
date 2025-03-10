import { create } from 'zustand';
import { Parties } from '../component/expeditionPage/ExpeditionPage';
import { Session } from '../component/landingPage/LadingPage';

interface GlobalState {
    sessionId: string;
    parties: Parties;
    setSessionId: (sessionId: string) => void;
    setParties: (parties: Parties) => void;
    initSession: (session: Session) => void;
}

export const useStore = create<GlobalState>((set) => ({
    sessionId: '',
    parties: {},
    setSessionId: (sessionId: string) => set((state) => ({
        sessionId: sessionId,
    })),
    setParties: (parties: Parties) => set((state) => ({
        parties: parties,
    })),
    initSession: (session: Session) => set((state) => ({
        sessionId: session.sessionId,
        parties: session.parties,
    })),
}));
