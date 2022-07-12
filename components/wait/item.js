import Image from 'next/image';
import styles from '../../styles/components/wait.module.scss';

export default function WaitItem({ info }) {
  return (
    <div className={styles.waitItem}>
      <Image src={info.avatarUrl} width={100} height={100} className={styles.profileIcon} />
      <div className={styles.nickname}>{info.gitId}</div>
    </div>
  )
}