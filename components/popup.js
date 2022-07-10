import styles from '../styles/components/popup.module.scss';

export default function Popup({ title, content, label, onClick }) {
  return (
    <div className={styles.popupBackground} onClick={onClick}>
      <div className={styles.popupBox}>
        <div className={styles.popupTitle}>{title}</div>
        <div className={styles.popupText}>
          {content}
        </div>
        <div className={styles.popupBtn} onClick={onClick}>{label}</div>
      </div>
    </div>
  )
}