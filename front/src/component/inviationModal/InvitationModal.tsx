import React, { useState, ChangeEvent } from "react";
import styles from "./InvitationModal.module.css";

interface InvitationModalProps {
    onClose: () => void;                         // 모달 닫기 콜백
    onSubmit: (code: string, text: string) => void; // 참여 버튼 클릭 시 처리할 로직
}

const InvitationModal: React.FC<InvitationModalProps> = ({ onClose, onSubmit }) => {
    const [inviteCode, setInviteCode] = useState("");
    const [description, setDescription] = useState("");

    const handleCodeChange = (e: ChangeEvent<HTMLInputElement>) => {
        setInviteCode(e.target.value);
    };

    const handleTextChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
        setDescription(e.target.value);
    };

    const handleSubmit = () => {
        onSubmit(inviteCode, description);
    };

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContainer}>
                {/* 상단 NPC 이미지나 제목 영역 */}
                <div className={styles.modalHeader}>
                    {/* NPC 이미지를 사용한다면 (public/images/npc.png) */}
                    {/* <img src="/images/npc.png" alt="NPC" className={styles.modalNpcImage} /> */}
                    <div className={styles.modalTitle}>원정대 참여</div>
                </div>

                <div className={styles.modalBody}>
                    <div className={styles.inputGroup}>
                        <label htmlFor="inviteCode">초대 코드 입력하기</label>
                        <input
                            id="inviteCode"
                            type="text"
                            value={inviteCode}
                            onChange={handleCodeChange}
                            placeholder="초대 코드"
                        />
                    </div>
                </div>

                {/* 하단 버튼 영역 */}
                <div className={styles.modalFooter}>
                    <button className={styles.button} id={styles.participateBtn} onClick={handleSubmit}>
                        참여
                    </button>
                    <button className={styles.button} id={styles.cancelBtn} onClick={onClose}>
                        닫기
                    </button>
                </div>
            </div>
        </div>
    );
};

export default InvitationModal;
