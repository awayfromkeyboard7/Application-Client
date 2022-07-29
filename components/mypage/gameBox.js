import { useState, useEffect, useMemo } from 'react';
import { useSession } from 'next-auth/react';
import GamePlayer from './gamePlayer';
import Code from './code';
import UserPopup from '../userPopup'
import styles from '../../styles/pages/mypage.module.scss';

export default function GameBox({ gameLogId, gameLogIdx, idx, filter, ranking, myInfo }) {
  const { data } = useSession();
  const [gameInfo, setGameInfo] = useState({});
  const [isGetGameInfo, setIsGetGameInfo] = useState(false);
  const [isOpenCode, setIsOpenCode] = useState(false);
  const [playerCode, setPlayerCode] = useState('');
  const [playerLanguage, setPlayerLanguage] = useState('Python');
  const [isPopup, setIsPopup] = useState(false);
  const [winnerId, setWinnerId] = useState('');
  const isFilter = useMemo(() => checkFilter(), [filter]);

  useEffect(() => {
    if (idx < gameLogIdx && !isGetGameInfo) {
    // if(!isGetGameInfo) {
      getGameInfo();
    }
  }, [gameLogIdx, idx, isGetGameInfo]);
  
  const getGameInfo = async () => {
    console.log('get game ingo ????? ', idx, gameLogIdx);
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
        if (data.success) {
          setGameInfo(data.info);
          setIsGetGameInfo(true);
        }
      })
      .catch(error => console.log('[/components/mypage/gameBox] getGameLog error >> ', error));
  };

  const unixToTime = (ts) => {
    const date = new Date(ts);
    const year = date.getFullYear();
    const month = '0' + (date.getMonth() + 1);
    const day = '0' + date.getDate();
    const hour = '0' + date.getHours();
    const min = '0' + date.getMinutes();

    return `${year}. ${month.substr(-2)}. ${day.substr(-2)} ${hour.substr(-2)}:${min.substr(-2)}`;
  };

  const onClickPlayer = (player) => {
    setPlayerCode(player.code);
    setPlayerLanguage(player.language);
    setIsOpenCode(true);
  };

  const checkTeamGameWin = () => {
    if(gameInfo?.teamA[0].ranking === 0 || gameInfo?.teamB[0].ranking === 0) {
      if(0 < gameInfo?.teamA[0].ranking) {
        return checkMyTeam();
      }
      if(0 < gameInfo?.teamB[0].ranking) {
        return !checkMyTeam();
      }
      return (gameInfo?.teamA[0].passRate < gameInfo?.teamB[0].passRate) ^ checkMyTeam();
    }
    if (gameInfo?.teamA[0].ranking === gameInfo?.teamB[0].ranking) {
      return (gameInfo?.teamA[0].passRate < gameInfo?.teamB[0].passRate) ^ checkMyTeam();
    }
    return (gameInfo?.teamB[0].ranking < gameInfo?.teamA[0].ranking) ^ checkMyTeam();
  };

  const checkMyTeam = () => {
    for (let member of gameInfo?.teamA) {
      if (member.gitId === data?.gitId) {
        return true;
      }
    }
    return false;
  };

  function checkFilter() {
    switch (filter) {
      case 'all': return true;
      case 'team': return gameInfo?.gameMode === 'team';
      case 'solo': return gameInfo?.gameMode !== 'team';
    }
  };

  const getMyRanking = () => {
    if (gameInfo?.userHistory) {
      for (let info of gameInfo.userHistory) {
        if (info?.gitId === data?.gitId) {
          return info.ranking;
        }
      }
    }
    return 0;
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
              gameInfo?.teamA?.map(player => <GamePlayer info={gameInfo?.teamA[0]} myInfo={player} onClickPlayer={() => onClickPlayer(gameInfo?.teamA[0])} key={player.gitId} />)
            }
            </div>
            <div className={styles.splitterVerticalGray} />
            <div className={styles.gameHistoryPlayersCol}>
            {
              gameInfo?.teamB?.map(player => <GamePlayer info={gameInfo?.teamB[0]} myInfo={player} onClickPlayer={() => onClickPlayer(gameInfo?.teamB[0])} key={player.gitId} />)
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
              gameInfo?.teamA?.map(player => <GamePlayer info={gameInfo?.teamA[0]} myInfo={player} onClickPlayer={() => onClickPlayer(gameInfo?.teamA[0])} key={player.gitId} />)
            }
            </div>
            <div className={styles.splitterVerticalGray} />
            <div className={styles.gameHistoryPlayersCol}>
            {
              gameInfo?.teamB?.map(player => <GamePlayer info={gameInfo?.teamB[0]} myInfo={player} onClickPlayer={() => onClickPlayer(gameInfo?.teamB[0])} key={player.gitId} />)
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
          <div className={styles.gameHistoryRank}>{`${getMyRanking()} / ${gameInfo?.userHistory?.length ?? 0}`}</div>
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
    <div className={isFilter && isGetGameInfo ? styles.gameHistoryItem : styles.hidden}>
      {
        gameInfo?.gameMode === 'team'
          ? checkTeamGameWin()
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
      {
        isPopup
        && <UserPopup
          targetGitId={winnerId}
          ranking={ranking}
          onClick={() => { setIsPopup(false) }}
          myInfo={myInfo}
        />
      }
    </div>
  )
}