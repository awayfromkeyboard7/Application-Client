import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import GamePlayer from './gamePlayer';
import { CodePopup } from '../codeEditor';
import UserPopup from '../userPopup';
import styles from '../../styles/pages/mypage.module.scss';

export default function GameBox({ gameLogId }) {
  const router = useRouter();
  const { data } = useSession();
  const [gameInfo, setGameInfo] = useState({});
  const [isGetGameInfo, setIsGetGameInfo] = useState(false);
  const [isOpenCode, setIsOpenCode] = useState(false);
  const [playerCode, setPlayerCode] = useState('');
  const [playerLanguage, setPlayerLanguage] = useState('Python');
  const [targetId, setTatgetId] = useState('');
  const [isPopup, setIsPopup] = useState(false);

  useEffect(() => {
    getGameInfo();
  }, []);
  
  const getGameInfo = async () => {
    await fetch(`/server/api/gamelog/getGameLog`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        gameLogId
      })
    })
    .then(res => {
      if(res.status === 403) {
        router.replace({
          pathname: '/',
          query: { msg: 'loginTimeout' }
        });
        return;
      }
      return res.json();
    })
    .then(data => {
      if (data.success) {
        setGameInfo(data.info);
        setIsGetGameInfo(true);
      }
    })
    .catch(error => console.log('[/components/mypage/gameBox] getGameLog error >> ', error));
  };

  const getCode = async (codeId, language) => {
    await fetch(`/server/api/code/getCode`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        codeId
      })
    })
    .then(res => {
      if(res.status === 403) {
        router.replace({
          pathname: '/',
          query: { msg: 'loginTimeout' }
        });
        return;
      }
      return res.json();
    })
    .then(data => {
      if (data.success) {
        setPlayerCode(data.info);
        setPlayerLanguage(language);
        setIsOpenCode(true);
      }
    })
    .catch(error => console.log('[/components/mypage/gameBox] getCode error >> ', error));
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

  const onClickCode = (player) => {
    getCode(player.code, player.language);
  };

  const onClickId = (player) => {
    setTatgetId(player.userId);
    setIsPopup(true);
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
    if(gameInfo?.teamA[0].ranking === gameInfo?.teamB[0].ranking) {
      return (gameInfo?.teamA[0].passRate < gameInfo?.teamB[0].passRate) ^ checkMyTeam();
    }
    return (gameInfo?.teamB[0].ranking < gameInfo?.teamA[0].ranking) ^ checkMyTeam();
  };

  const checkMyTeam = () => {
    for(let member of gameInfo?.teamA) {
      if(member.gitId === data?.gitId) {
        return true;
      }
    }
    return false;
  };

  const getMyRanking = () => {
    if(gameInfo?.userHistory) {
      for(let info of gameInfo.userHistory) {
        if(info?.gitId === data?.gitId) {
          return info.ranking;
        }
      }
    }
    return 0;
  };

  const TeamGameWin = () => {
    return useMemo(() => (
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
              gameInfo?.teamA?.map(player => <GamePlayer info={gameInfo?.teamA[0]} myInfo={player} onClickCode={() => onClickCode(gameInfo?.teamA[0])} onClickId={() => onClickId(player)} key={player.gitId} />)
            }
            </div>
            <div className={styles.splitterVerticalGray} />
            <div className={styles.gameHistoryPlayersCol}>
            {
              gameInfo?.teamB?.map(player => <GamePlayer info={gameInfo?.teamB[0]} myInfo={player} onClickCode={() => onClickCode(gameInfo?.teamB[0])} onClickId={() => onClickId(player)} key={player.gitId} />)
            }
            </div>
          </div>
        </div>
      </div>
    ), [gameInfo])
  };

  const TeamGameLose = () => {
    return useMemo(() => (
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
              gameInfo?.teamA?.map(player => <GamePlayer info={gameInfo?.teamA[0]} myInfo={player} onClickCode={() => onClickCode(gameInfo?.teamA[0])} onClickId={() => onClickId(player)} key={player.gitId} />)
            }
            </div>
            <div className={styles.splitterVerticalGray} />
            <div className={styles.gameHistoryPlayersCol}>
            {
              gameInfo?.teamB?.map(player => <GamePlayer info={gameInfo?.teamB[0]} myInfo={player} onClickCode={() => onClickCode(gameInfo?.teamB[0])} onClickId={() => onClickId(player)} key={player.gitId} />)
            }
            </div>
          </div>
        </div>
      </div>
    ), [gameInfo])
  };

  const SoloGame = () => {
    return useMemo(() => (
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
              gameInfo?.userHistory?.slice(0, 4).map(player => <GamePlayer info={player} onClickCode={() => onClickCode(player)} onClickId={() => onClickId(player)} key={player.gitId} />)
            }
            </div>
            <div className={styles.splitterVerticalGray} />
            <div className={styles.gameHistoryPlayersCol}>
            {
              gameInfo?.userHistory?.slice(4)?.map(player => <GamePlayer info={player} onClickCode={() => onClickCode(player)} onClickId={() => onClickId(player)} key={player.gitId} />)
            }
            </div>
          </div>
        </div>
      </>
    ), [gameInfo]);
  };

  return (
    <div className={isGetGameInfo ? styles.gameHistoryItem : styles.hidden}>
      {
        gameInfo?.gameMode === 'team'
        ? checkTeamGameWin()
          ? <TeamGameWin />
          : <TeamGameLose />
        : <SoloGame />
      }
      {
        isOpenCode
        && <CodePopup 
            code={playerCode} 
            language={playerLanguage}
            onClose={() => setIsOpenCode(false)}
          />
      }
      {
        isPopup
        && <UserPopup
            userId={targetId}
            onClick={() => setIsPopup(false)}
          />
      }
    </div>
  )
}