import { useState, useEffect } from 'react';
import { getCookie } from 'cookies-next';
import GamePlayer from './gamePlayer';
import Code from './code';
import styles from '../../styles/pages/mypage.module.scss';

export default function GameHistory({ gameLogId }) {
  const [gameInfo, setGameInfo] = useState({});
  const [isOpenCode, setIsOpenCode] = useState(false);
  const [playerCode, setPlayerCode] = useState('');
  const [playerLanguage, setPlayerLanguage] = useState('Python');

  useEffect(() => {
    if(gameLogId) {
      getGameInfo();
    }
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
        if(gameLogId === '62d651067812f91c7e523a15')
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
    const hour = '0' + date.getHours();
    const min = '0' + date.getMinutes();
    
    return `${year}. ${month.substr(-2)}. ${day.substr(-2)} ${hour.substr(-2)}:${min.substr(-2)}`;
  };

  const onClickPlayer = (player) => {
    console.log('onClick player >>>', player);
    setPlayerCode(player.code);
    setPlayerLanguage(player.language);
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
          <div className={styles.gameHistoryDate}>{unixToTime(gameInfo?.startAt)}</div>
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
          <div className={styles.gameHistoryRank}>{`${getMyRanking()} / ${gameInfo?.userHistory?.length}`}</div>
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

  const getMyRanking = () => {
    if(gameInfo?.userHistory) {
      for(let info of gameInfo.userHistory) {
        if(info?.gitId === getCookie('gitId')) {
          return info.ranking;
        }
      }
    }
    return 0;
  }

  return (
    <div className={styles.gameHistoryItem}>
      {
        gameInfo?.gameMode === 'team'
        ? gameInfo?.teamA[0]?.ranking === 1 
          ? <TeamGameWin />
          : <TeamGameLose />
        : <SoloGame />
      }
      {
        isOpenCode
        && <div className={styles.codeBackground}>
            <div className={styles.codeBox}>
              <Code code={playerCode} language={playerLanguage} />
              <div className={styles.btn} onClick={() => setIsOpenCode(false)}>닫기</div>
            </div>
          </div>
      }
    </div>
  )
}