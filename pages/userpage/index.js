import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSession, signOut } from 'next-auth/react';
import { deleteCookie } from 'cookies-next';
import Layout from '../../components/layouts/main';
import Header from '../../components/header';
import { MyInfoBox } from '../../components/mypage/myInfo';
import RankingBox from '../../components/mypage/ranking';
import GameHistory from '../../components/mypage/gameHistory';
import Loading from '../../components/loading';
import styles from '../../styles/pages/mypage.module.scss'

export default function UserPage() {
  const router = useRouter();
  const { status } = useSession();
  const [isLoading, setIsLoading] = useState(true);
  const [myInfo, setMyInfo] = useState({});
  const [gameLogs, setGameLogs] = useState([]);
  const [teamGameLogs, setTeamGameLogs] = useState([]);
  const [soloGameLogs, setSoloGameLogs] = useState([]);

  useEffect(() => {
    if(router?.query?.targetUserId) {
      getTargetUserInfo();
    }
  }, [router?.query?.targetUserId]);

  useEffect(() => {
    if(status === 'unauthenticated') {
      router.replace('/');
    }
  }, [status]);

  const getTargetUserInfo = async () => {
    await fetch(`/server/api/user/getUserInfo`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: router?.query?.targetUserId
      })
    })
      .then(res => res.json())
      .then(data => {
        if(data.success) {
          setMyInfo(data.UserInfo);
          setGameLogs(data.UserInfo.gameLogHistory.reverse());
          setSoloGameLogs(data.UserInfo.soloGameLogHistory.reverse());
          setTeamGameLogs(data.UserInfo.teamGameLogHistory.reverse());
          setIsLoading(false);
        }
      })
      .catch(error => console.log('[/pages/userpage] getUserInfo error >> ', error));
  };

  const logout = async () => {
    deleteCookie('jwt');
    deleteCookie('sidebar');
    signOut();
    router.replace('/');
  };

  return (
    <Layout
      header={<Header label="로그아웃" onClickBtn={logout} />}
      body={
        <>
          { status !== 'authenticated' && isLoading && <Loading /> }
          <div className={styles.mainBox}>
            <div className={styles.mainCol}>
              <MyInfoBox myInfo={myInfo} isMine={false} />
              <RankingBox />
            </div>
            <GameHistory 
              totalLogs={gameLogs} 
              soloLogs={soloGameLogs}
              teamLogs={teamGameLogs} 
              winSolo={myInfo?.winSolo ?? 0}
              winTeam={myInfo?.winTeam ?? 0}
              totalSolo={myInfo?.totalSolo ?? 0}
              totalTeam={myInfo?.totalTeam ?? 0}
            />
          </div>
        </>
      }
    />
  )
}