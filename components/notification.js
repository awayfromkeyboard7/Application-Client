import Image from 'next/image';
import styles from '../styles/components/notification.module.scss';

export default function Notification({ title, content, imgUrl, onClickAccept, onClickDecline }) {
  return (
    <div className={styles.notiBox}>
      <div className={styles.notiMain}>
        <Image src={imgUrl ?? '/default_profile.jpg'} width={50} height={50} />
        <div className={styles.notiInfo}>
          <div className={styles.title}>{title}</div>
          <div className={styles.content}>{content}</div>
        </div>
      </div>
      <div className={styles.notiFooter}>
        <div className={styles.acceptBtn} onClick={onClickAccept}>참가하기</div>
        <div className={styles.declineBtn} onClick={onClickDecline}>거절하기</div>
      </div>
    </div>
  )
}