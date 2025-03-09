import React, { useState, ChangeEvent } from "react";
import styles from "./AddMemberModal.module.css";

interface AddMemberModalProps {
    onClose: () => void;
    onSubmit: (nickname: string, job: string) => void;
}

const jobOptions = ["다크나이트", "비숍"];

const AddMemberModal: React.FC<AddMemberModalProps> = ({ onClose, onSubmit }) => {
    const [nickname, setNickname] = useState("");
    const [job, setJob] = useState("");

    const handleNicknameChange = (e: ChangeEvent<HTMLInputElement>) => {
        setNickname(e.target.value);
    };

    const handleJobChange = (e: ChangeEvent<HTMLInputElement>) => {
        setJob(e.target.value);
    };

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContainer}>
                <h2 className={styles.modalTitle}>초대 코드 입력 및 파티원 추가</h2>
                <div className={styles.formGroup}>
                    <label htmlFor="nickname">닉네임</label>
                    <input
                        id="nickname"
                        type="text"
                        value={nickname}
                        onChange={handleNicknameChange}
                        placeholder="닉네임 입력"
                    />
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="job">직업</label>
                    <input
                        id="job"
                        list="jobOptions"
                        type="text"
                        value={job}
                        onChange={handleJobChange}
                        placeholder="직업 선택"
                    />
                    <datalist id="jobOptions">
                        {jobOptions.map((option) => (
                            <option key={option} value={option} />
                        ))}
                    </datalist>
                </div>
                <div className={styles.buttonGroup}>
                    <button className={styles.submitButton} onClick={() => onSubmit(nickname, job)}>
                        추가하기
                    </button>
                    <button className={styles.cancelButton} onClick={onClose}>
                        취소
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddMemberModal;
