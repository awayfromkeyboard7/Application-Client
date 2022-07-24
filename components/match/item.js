import Image from 'next/image';
import styles from '../../styles/components/match.module.scss';

export default function MatchItem({ info }) {
  return (
    <div className={styles.matchItem}>
      <div className={styles.profileIcon}>
        <Image src={info.avatarUrl ?? '/default_profile.jpg'} layout="fill" objectFit="cover" />
      </div>
      <div className={styles.nickname}>{info.gitId}</div>
    </div>
  )
}