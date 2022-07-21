import Image from 'next/image';
import styles from '../../styles/components/code/player.module.scss';

export default function TeamPlayer({ teams }) {
  const ActivePlayer = ({ team }) => {
    return (
      <>
        <div className={styles.rate}>{`${team[0].passRate}%`}</div>
        <Image src={team[0].avatarUrl ?? '/default_profile.jpg'} width={40} height={40} className={styles.profileIcon} alt="user profile" />
        <div className={styles.infoBox}>
          <div className={styles.nickname}>{getTeamMemberGitId(team)}</div>
          <div className={styles.info}>{team[0].language}</div>
        </div>
      </>
    )
  };

  const InactivePlayer = ({ team }) => {
    return (
      <>
        <div className={`${styles.rate} ${styles.textGray}`}>-</div>
        <Image src={team[0].avatarUrl ?? '/default_profile.jpg'} width={40} height={40} className={styles.profileIconInactive} alt="user profile" />
        <div className={styles.infoBox}>
          <div className={`${styles.nickname} ${styles.textGray}`}>{getTeamMemberGitId(team)}</div>
          <div className={`${styles.info} ${styles.textGray}`}>Clashing...</div>
        </div>
      </>
    )
  };

  const getTeamMemberGitId = (teamInfo) => {
    let members = [];
    for(let member of teamInfo) {
      members.push(member.gitId);
    }
    return members.join(', ');
  };

  return (
    <div className={styles.container}>
      {
        teams?.map(team => 
          <div className={styles.playerBox} key={team[0]._id}>
          {
            team[0].passRate < 0
            ? <InactivePlayer team={team} />
            : <ActivePlayer team={team} />
          }
          </div>
        )
      }
    </div>
  )
}