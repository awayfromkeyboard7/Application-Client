import { useState, useEffect } from 'react';
import Image from 'next/image';
import { getCookie } from 'cookies-next';
import styles from '../../styles/components/result.module.scss';

export default function TeamResultItem({ teamInfo, startAt, idx }) {
  const myNickname = getCookie('gitId');
  const [rankText, setRankText] = useState(info.ranking);
  const [isEmoji, setIsEmoji] = useState(false);
  const [isMyTeam, setIsMyTeam] = useState(false);

  useEffect(() => {
    for(let member of teamInfo) {
      if(member.gitId === getCookie('gitId')) {
        setIsMyTeam(true);
        break;
      }
    }
  }, [teamInfo]);

  // useEffect(() => {
  //   setRankText(convertRank(info.ranking));
  // }, [info.ranking]);

  useEffect(() => {
    setRankText(teamInfo[0].passRate < 0 ? '-' : convertRank(idx + 1));
  }, [teamInfo[0].passRate]);

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
      <div className={styles.profileIconBox}>
        {
          teamInfo?.map(info => 
            <div className={styles.profileIcon} key={info.gitId}>
              <Image src={info.avatarUrl ?? '/default_profile.jpg'} width={40} height={40} className={styles.profileIcon} alt="프로필" />
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
              <div className={styles.text}>✅ {teamInfo[0].passRate < 0 ? 'N/A' : `${teamInfo[0].passRate}%`}</div>
              <div className={styles.text}>⏳ {unixToTime(teamInfo[0].submitAt) ?? 'Clashing...'}</div>
              <div className={styles.text}>💻 {teamInfo[0].language}</div>
            </div>
        }
      </div>
    </div>
  )
}