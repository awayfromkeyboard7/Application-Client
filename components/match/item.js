import Image from 'next/image';
import styles from '../../styles/components/match.module.scss';

export default function MatchItem({ info }) {
  return (
    <div className={styles.waitItem}>
      <Image src={info.avatarUrl} width={100} height={100} className={styles.profileIcon} />
      <div className={styles.nickname}>{info.gitId}</div>
    </div>
  )
}