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
              <MyInfoBox myInfo={myInfo} />
              <RankingBox />
            </div>
            <GameHistory gameLogs={gameLogs} />
          </div>
        </>
      }
    />
  )
}