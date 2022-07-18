import Image from 'next/image';
import styles from '../../styles/pages/mypage.module.scss';

export default function GamePlayer({ info, onClickPlayer }) {
  return (
    <div className={styles.gameHistoryPlayerItem} onClick={onClickPlayer}>
      <div className={styles.gameHistoryPlayerProfileImage}>
        <Image src={info.avatarUrl ?? '/default_profile.jpg'} width={20} height={20} alt="profile" className={styles.gameHistoryPlayerProfileImage} />
      </div>
      <div className={styles.gameHistoryPlayerNickname}>{info.gitId}</div>
    </div>
  )
}