import React, { useState } from "react";
import styles from "./ExpeditionPage.module.css";
import logo from "../../asset/images/logo.png";
import AddMemberModal from '../addMemberModal/AddMemberModal';

interface PartyMember {
    nickname: string;
    job: string;
}

interface Party {
    id: string; // "1파티", "2파티", ... "솔로 파티"
    members: PartyMember[];
}

const initialParties: Party[] = [
    { id: "1파티", members: [] },
    { id: "2파티", members: [] },
    { id: "3파티", members: [] },
    { id: "4파티", members: [] },
    { id: "5파티", members: [] },
    { id: "6파티", members: [] },
    { id: "솔로", members: [] },
];

const ExpeditionPage: React.FC = () => {
    const [parties, setParties] = useState<Party[]>(initialParties);
    const [selectedPartyIndex, setSelectedPartyIndex] = useState<number | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = (partyIndex: number) => {
        setSelectedPartyIndex(partyIndex);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedPartyIndex(null);
    };

    const handleAddMember = async (nickname: string, job: string) => {
        if (selectedPartyIndex === null) return;
        // POST 요청: 초대 코드 대신 닉네임, 직업, 파티 아이디 전달
        const response = await fetch("http://localhost:3000/session/add", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                partyId: parties[selectedPartyIndex].id,
                nickname,
                job,
            }),
        });

        if (response.ok) {
            // 성공 시 state 업데이트 (새 멤버 추가)
            const newMember: PartyMember = { nickname, job };
            setParties((prevParties) => {
                const updatedParties = [...prevParties];
                updatedParties[selectedPartyIndex].members.push(newMember);
                return updatedParties;
            });
            closeModal();
        } else {
            console.error("파티원 추가 실패");
        }
    };

    return (
        <div className={styles.expeditionPage}>
            <header className={styles.expeditionPage__header}>
                <img src={logo} alt="앱 로고" className={styles.expeditionPage__logo} />
            </header>
            <main className={styles.expeditionPage__main}>
                {parties.map((party, index) => (
                    <div key={party.id} className={styles.party}>
                        <h2 className={styles.party__title}>{party.id}</h2>
                        <div className={styles.party__members}>
                            {party.members.map((member, idx) => (
                                <div key={idx} className={styles.party__member}>
                                    {member.nickname} ({member.job})
                                </div>
                            ))}
                            {party.members.length < 6 && (
                                <button
                                    className={styles.party__addButton}
                                    onClick={() => openModal(index)}
                                >
                                    파티원 추가
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </main>
            {isModalOpen && (
                <AddMemberModal onClose={closeModal} onSubmit={handleAddMember} />
            )}
        </div>
    );
};

export default ExpeditionPage;
