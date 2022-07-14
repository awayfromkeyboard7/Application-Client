import Image from 'next/image';
import styles from '../../styles/components/code/player.module.scss';

export default function Player({ players }) {
  const ActivePlayer = ({ player }) => {
    return (
      <>
        <div className={styles.rate}>{`${player.passRate}%`}</div>
        <Image src={player.avatarUrl} width={40} height={40} className={styles.profileIcon} alt="user profile" />
        <div className={styles.infoBox}>
          <div className={styles.nickname}>{player.gitId}</div>
          <div className={styles.info}>{player.language}</div>
        </div>
      </>
    )
  };

  const InactivePlayer = ({ player }) => {
    return (
      <>
        <div className={`${styles.rate} ${styles.textGray}`}>-</div>
        <Image src={player.avatarUrl} width={40} height={40} className={styles.profileIconInactive} alt="user profile" />
        <div className={styles.infoBox}>
          <div className={`${styles.nickname} ${styles.textGray}`}>{player.gitId}</div>
          <div className={`${styles.info} ${styles.textGray}`}>Clashing...</div>
        </div>
      </>
    )
  };

  return (
    <div className={styles.container}>
      {
        players?.map(player => 
          <div className={styles.playerBox} key={player._id}>
          {
            player.passRate < 0
            ? <InactivePlayer player={player} />
            : <ActivePlayer player={player} />
          }
          </div>
        )
      }
    </div>
  )
}