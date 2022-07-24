import Image from 'next/image';
import styles from '../../styles/components/wait.module.scss';

export default function WaitItem({ info }) {
  return (
    <div className={styles.waitItem}>
      <div className={styles.profileIcon}>
        <Image src={info.avatarUrl ?? '/default_profile.jpg'} layout="fill" objectFit="cover" />
      </div>
      <div className={styles.nickname}>{info.gitId}</div>
    </div>
  )
}