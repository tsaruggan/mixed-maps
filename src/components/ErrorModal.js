// components/Modal.js
import styles from '@/styles/Home.module.css';

import ActionButton from './ActionButton';

const ErrorModal = ({ message, onClose }) => {
  return (
    <div className={styles.modalBackdrop}>
      <div className={styles.modalContent}>
        <b>Error</b>
        <p>{message}</p>
        <ActionButton handleOnClick={onClose} text={"Close"} backgroundColor={"#8783D1"}/>
      </div>
    </div>
  );
};

export default ErrorModal;
