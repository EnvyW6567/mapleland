import React, { useEffect, useState } from 'react';
import styles from './ExpeditionPage.module.css';
import logo from '../../asset/images/logo.png';
import AddMemberModal from '../addMemberModal/AddMemberModal';
import { useStore } from '../../store/useStore';
import { useShallow } from 'zustand/shallow';

export type Member = {
    username: string;
    className: string;
}

export type Parties = Record<string, Member[]>;

type Notification = {
    type: string;
    sessionId: string;
    parties: Parties;
}

const ExpeditionPage: React.FC = () => {
    const { parties, setParties, sessionId } = useStore(
        useShallow((state) => ({
            parties: state.parties,
            setParties: state.setParties,
            sessionId: state.sessionId,
        })));

    const [selectedPartyIndex, setSelectedPartyIndex] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const eventSource = new EventSource(process.env.REACT_APP_BASE_URL + '/session/connect/' + sessionId);

        eventSource.onopen = () => {
            console.log('SSE 연결 성공'); // TODO: 로거로 변경
        };

        eventSource.addEventListener("UPDATE", (event) => {
            try {
                const data: Notification = JSON.parse(event.data);
                setParties(data.parties);
            } catch (err) {
                console.error("JSON 파싱 오류:", err); // TODO: 로거로 변경
            }
        });

        eventSource.onerror = (error) => {
            console.error('SSE 에러:', error); // TODO: 로거로 변경
        };

        return () => {
            console.log('eventSrouce Closed'); // TODO: 로거로 변경
            eventSource.close();
        };
    }, []);

    const handleAddMember = () => {

    };

    const openModal = (partyIndex: string) => {
        setSelectedPartyIndex(partyIndex);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedPartyIndex(null);
    };

    return (
        <div className={styles.expeditionPage}>
            <header className={styles.expeditionPage__header}>
                <img src={logo} alt="앱 로고" className={styles.expeditionPage__logo} />
            </header>
            <main className={styles.expeditionPage__main}>
                {parties ? Object.entries(parties).map(([partyName, members]) => (
                    <div key={partyName} className={styles.party}>
                        <h2 className={styles.party__title}>{partyName}</h2>
                        <div className={styles.party__members}>
                            {members.map((member, idx) => (
                                <div key={idx} className={styles.party__member}>
                                    {member.username} ({member.className})
                                </div>
                            ))}
                            {members.length < 6 && (
                                <button
                                    className={styles.party__addButton}
                                    onClick={() => openModal(partyName)}
                                >
                                    파티원 추가
                                </button>
                            )}
                        </div>
                    </div>
                )) : null}
            </main>
            {isModalOpen && (
                <AddMemberModal onClose={closeModal} onSubmit={handleAddMember} />
            )}
        </div>
    );
};

export default ExpeditionPage;
