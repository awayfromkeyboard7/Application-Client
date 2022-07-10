import Image from 'next/image';
import styles from '../../styles/components/friend.module.scss';

export default function RankingElem({ nickname, isOnline }) {
  return (
    <div className={styles.friendElem} key={nickname}>
      <div className={styles.friendNickname}>{nickname}</div>
      <div className={styles.connectInfo}>
        <Image src={isOnline ? '/online.png' : '/offline.png'} alt="online" width={10} height={10} />
        <div className={styles.infoText}>{isOnline ? 'online' : 'offline'}</div>
      </div>
    </div>
  )
}