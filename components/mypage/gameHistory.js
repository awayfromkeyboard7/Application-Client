import { useState, useEffect } from 'react';
import GamePlayer from './gamePlayer';
import styles from '../../styles/pages/mypage.module.scss';

export default function GameHistory({ gameLogId }) {
  const [gameInfo, setGameInfo] = useState({});
  const [isOpenCode, setIsOpenCode] = useState(false);
  const [playerCode, setPlayerCode] = useState('');

  useEffect(() => {
    getGameInfo();
  }, [gameLogId]);

  const getGameInfo = async() => {
    await fetch(`/server/api/gamelog/getGameLog`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        gameLogId
      })
    })
    .then(res => res.json())
    .then(data => {
      if(data.success) {
        console.log('[gameHistory] get game info', data.info);
        setGameInfo(data.info);
      }
    })
    .catch(error => console.log('error >> ', error));
  };

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

  const onClickPlayer = (player) => {
    console.log('onClick player >>>', player);
    setPlayerCode(player.code);
    setIsOpenCode(true);
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
              gameInfo?.teamA?.map(player => <GamePlayer info={player} onClickPlayer={() => onClickPlayer(gameInfo?.teamA[0])} key={player.gitId} />)
            }
            </div>
            <div className={styles.splitterVerticalGray} />
            <div className={styles.gameHistoryPlayersCol}>
            {
              gameInfo?.teamB?.map(player => <GamePlayer info={player} onClickPlayer={() => onClickPlayer(gameInfo?.teamB[0])} key={player.gitId} />)
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
              gameInfo?.teamB?.map(player => <GamePlayer info={player} onClickPlayer={() => onClickPlayer(gameInfo?.teamB[0])} key={player.gitId} />)
            }
            </div>
            <div className={styles.splitterVerticalGray} />
            <div className={styles.gameHistoryPlayersCol}>
            {
              gameInfo?.teamA?.map(player => <GamePlayer info={player} onClickPlayer={() => onClickPlayer(gameInfo?.teamA[0])} key={player.gitId} />)
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
              gameInfo?.userHistory?.slice(0, 4).map(player => <GamePlayer info={player} onClickPlayer={() => onClickPlayer(player)} key={player.gitId} />)
            }
            </div>
            <div className={styles.splitterVertical} />
            <div className={styles.gameHistoryPlayersCol}>
            {
              gameInfo?.userHistory?.slice(4)?.map(player => <GamePlayer info={player} onClickPlayer={() => onClickPlayer(player)} key={player.gitId} />)
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
      {
        isOpenCode
        && <div className={styles.codeBackground}>
            <div className={styles.codeBox}>
              <div className={styles.codeEditor}>{playerCode}</div>
              <div className={styles.btn} onClick={() => setIsOpenCode(false)}>닫기</div>
            </div>
          </div>
      }
    </div>
  )
}