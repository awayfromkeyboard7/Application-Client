import styles from '../styles/components/popup.module.css';

export default function Popup({ close }) {
  return (
    <div className={styles.popupBackground} onClick={close}>
      <div className={styles.popupBox}>
        <div className={styles.popupTitle}>아쉽지만 다음기회에..</div>
        <div className={styles.popupText}>문제를 틀렸습니다...</div>
        <div className={styles.popupBtn} onClick={close}>메인으로</div>
      </div>
    </div>
  )
}