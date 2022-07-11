import Image from 'next/image';
import styles from '../../styles/components/friend.module.scss';

export default function FriendItem({ nickname, isOnline, onClick }) {
  return (
    <div className={styles.friendElem} onClick={() => onClick(nickname)} key={nickname}>
      <div className={styles.friendNickname}>{nickname}</div>
      <div className={styles.connectInfo}>
        <Image src={isOnline ? '/online.png' : '/offline.png'} alt="online" width={10} height={10} />
        <div className={styles.infoText}>{isOnline ? 'online' : 'offline'}</div>
      </div>
    </div>
  )
}