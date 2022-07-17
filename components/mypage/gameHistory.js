import Image from 'next/image';
import styles from '../../styles/pages/mypage.module.scss';

export default function GameHistory({ gameInfo }) {
  const unixToTime = (ts) => {
    const date = new Date(ts); 
    const year = date.getFullYear();
    const month = '0' + (date.getMonth()+1);
    const day = '0' + date.getDate();
    let hour = '0' + date.getHours();
    const min = '0' + date.getMinutes();
    const isAM = date.getHours() < 12 ? true : false;

    if(!isAM) hour = '0' + (date.getHours() - 12);
    
    return `${year}. ${month.substr(-2)}. ${day.substr(-2)}`;
  };

  const PlayerItem = ({ info }) => {
    return (
      <div className={styles.gameHistoryPlayerItem}>
        <div className={styles.gameHistoryPlayerProfileImage}>
          <Image src={info.avatarUrl ?? '/default_profile.jpg'} width={20} height={20} alt="profile" className={styles.gameHistoryPlayerProfileImage} />
        </div>
        <div className={styles.gameHistoryPlayerNickname}>{info.gitId}</div>
      </div>
    )
  };

  const TeamGameWin = () => {
    return (
      <div className={styles.gameHistoryItemBlue}>
        <div className={styles.gameHistoryColorTagBlue} />
        <div className={styles.gameHistoryMain}>
          <div className={styles.gameHistoryMode}>팀전</div>
          <div className={styles.gameHistoryWin}>승리</div>
        </div>
        <div className={styles.gameHistoryInfo}>
          <div className={styles.gameHistoryDate}>{unixToTime(gameInfo.startAt)}</div>
          <div className={styles.gameHistoryPlayersBox}>
            <div className={styles.gameHistoryPlayersCol}>
            {
              gameInfo?.teamA?.map(player => <PlayerItem info={player} key={player.gitId} />)
            }
            </div>
            <div className={styles.splitterVerticalGray} />
            <div className={styles.gameHistoryPlayersCol}>
            {
              gameInfo?.teamB?.map(player => <PlayerItem info={player} key={player.gitId} />)
            }
            </div>
          </div>
        </div>
      </div>
    )
  };

  const TeamGameLose = () => {
    return (
      <div className={styles.gameHistoryItemRed}>
        <div className={styles.gameHistoryColorTagRed} />
        <div className={styles.gameHistoryMain}>
          <div className={styles.gameHistoryMode}>팀전</div>
          <div className={styles.gameHistoryLose}>패배</div>
        </div>
        <div className={styles.gameHistoryInfo}>
          <div className={styles.gameHistoryDate}>{unixToTime(gameInfo.startAt)}</div>
          <div className={styles.gameHistoryPlayersBox}>
            <div className={styles.gameHistoryPlayersCol}>
            {
              gameInfo?.teamB?.map(player => <PlayerItem info={player} key={player.gitId} />)
            }
            </div>
            <div className={styles.splitterVerticalGray} />
            <div className={styles.gameHistoryPlayersCol}>
            {
              gameInfo?.teamA?.map(player => <PlayerItem info={player} key={player.gitId} />)
            }
            </div>
          </div>
        </div>
      </div>
    )
  };

  const SoloGame = () => {
    return (
      <>
        <div className={styles.gameHistoryColorTag} />
        <div className={styles.gameHistoryMain}>
          <div className={styles.gameHistoryMode}>개인전</div>
          <div className={styles.gameHistoryRank}>3 / 7</div>
        </div>
        <div className={styles.gameHistoryInfo}>
          <div className={styles.gameHistoryDate}>{unixToTime(gameInfo.startAt)}</div>
          <div className={styles.gameHistoryPlayersBox}>
            <div className={styles.gameHistoryPlayersCol}>
            {
              gameInfo?.userHistory?.slice(0, 4).map(player => <PlayerItem info={player} key={player.gitId} />)
            }
            </div>
            <div className={styles.splitterVertical} />
            <div className={styles.gameHistoryPlayersCol}>
            {
              gameInfo?.userHistory?.slice(4)?.map(player => <PlayerItem info={player} key={player.gitId} />)
            }
            </div>
          </div>
        </div>
      </>
    )
  };


  return (
    <div className={styles.gameHistoryItem}>
      {
        gameInfo.gameMode === 'team'
        ? gameInfo.teamA[0]?.ranking === 1 
          ? <TeamGameWin />
          : <TeamGameLose />
        : <SoloGame />
      }
    </div>
  )
}