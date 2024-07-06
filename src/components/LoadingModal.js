// components/LoadingModal.js
import styles from '@/styles/Home.module.css';

const LoadingModal = () => {
  return (
    <div className={styles.modalBackdrop}>
        <div className={styles.loader}></div>
    </div>
  );
};

export default LoadingModal;