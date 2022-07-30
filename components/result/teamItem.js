import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import styles from '../../styles/components/result.module.scss';

export default function TeamResultItem({ teamInfo, startAt, onClickCode, maxLength, idx }) {
  const { data } = useSession();
  const [rankText, setRankText] = useState(teamInfo[0].ranking);
  const [isEmoji, setIsEmoji] = useState(false);
  const [isMyTeam, setIsMyTeam] = useState(false);
  const [profileBoxStyle, setProfileBoxStyle] = useState(styles.profileIconBox4);

  useEffect(() => {
    for(let member of teamInfo) {
      if(member.gitId === data?.gitId) {
        setIsMyTeam(true);
        break;
      }
    }
  }, [teamInfo]);

  useEffect(() => {
    switch(maxLength) {
      case 1: return setProfileBoxStyle(styles.profileIconBox1);
      case 2: return setProfileBoxStyle(styles.profileIconBox2);
      case 3: return setProfileBoxStyle(styles.profileIconBox3);
      case 4: return setProfileBoxStyle(styles.profileIconBox4);
    }
  }, [maxLength]);

  useEffect(() => {
    setRankText(teamInfo[0].passRate < 0 ? '-' : convertRank(idx + 1));
  }, [teamInfo[0].passRate, idx]);

  const convertRank = (rank) => {
    let result;
    switch(rank) {
      case 1:
        result = '🥇';
        setIsEmoji(true);
        break;
      case 2:
        result = '🥈';
        setIsEmoji(true);
        break;
      case 3:
        result = '🥉';
        setIsEmoji(true);
        break;
      case 0:
        result = '-';
        setIsEmoji(false);
        break;
      default:
        result = rank;
        break;
    }
    return result;
  }

  const getTeamMemberGitId = () => {
    let members = [];
    for(let member of teamInfo) {
      members.push(member.gitId);
    }
    return members.join(', ');
  };

  const unixToTime = (ts) => {
    const start = new Date(startAt).getTime();
    const end = new Date(ts).getTime();
    const s = parseInt((end - start) / 1000);
    const min = '0' + String(parseInt((s % 3600) / 60));
    const sec = '0' + String(parseInt(s % 60));
    
    return `${min.substr(-2)}:${sec.substr(-2)}`;
  };

  return (
    <div className={isMyTeam ? styles.resultItemMine : styles.resultItem}>
      <div className={isEmoji ? styles.rankEmoji : styles.rank}>{rankText}</div>
      <div className={profileBoxStyle}>
        {
          teamInfo?.map(info => 
            <div className={styles.profileIconOverlap} key={info.gitId}>
              <Image src={info.avatarUrl ?? '/default_profile.jpg'} width={40} height={40} className={styles.profileIconOverlap} alt="프로필" />
            </div>
          )
        }
      </div>
      <div className={styles.resultInfoBox}>
        <div className={styles.nickname}>{getTeamMemberGitId()}</div>
        {
          teamInfo[0].passRate < 0
          ? <div className={styles.text}>Clashing...</div>
          : <div className={styles.resultInfos}>
              <div className={styles.text}>✅ {teamInfo[0].passRate < 0 ? 'N/A' : `${parseInt(teamInfo[0].passRate)}%`}</div>
              <div className={styles.text}>⏳ {unixToTime(teamInfo[0].submitAt) ?? 'Clashing...'}</div>
              <div className={styles.codeBtn} onClick={onClickCode}>💻 {teamInfo[0].language}</div>
            </div>
        }
      </div>
    </div>
  )
}