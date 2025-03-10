import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './LandingPage.module.css';
import logo from '../../asset/images/logo.png';
import InvitationModal from '../inviationModal/InvitationModal';
import { createSession } from '../../api/createSession';
import { useStore } from '../../store/useStore';
import { Parties } from '../expeditionPage/ExpeditionPage';

export type Session = {
    sessionId: string;
    parties: Parties;
}

const LandingPage: React.FC = () => {
    const navigate = useNavigate();
    const initSession = useStore((state) => state.initSession);
    const [isModalOpen, setIsModalOpen] = useState(false);


    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleSubmitModal = (code: string, text: string) => {
        console.log('초대 코드:', code);

        setIsModalOpen(false);
    };

    const handleCreateExpedition = async () => {
        const session: Session = await createSession();

        console.log(session);
        initSession(session);
        navigate('/expedition');
    };

    return (
        <div className={styles.landingPage}>
            <div className={styles.landingPage__background}></div>
            <main className={styles.landingPage__main}>
                <img src={logo} alt="앱 로고" className={styles.landingPage__logo} />
                <div>
                    <button className={`${styles.landingPage__button} ${styles['landingPage__button--new']}`}
                            onClick={handleCreateExpedition}>
                        원정대 생성하기
                    </button>
                    <button className={`${styles.landingPage__button} ${styles['landingPage__button--join']}`}
                            onClick={handleOpenModal}>
                        원정대 참여하기
                    </button>
                </div>
            </main>

            {isModalOpen && (
                <InvitationModal onClose={handleCloseModal} onSubmit={handleSubmitModal} />
            )}
        </div>
    );
};

export default LandingPage;
