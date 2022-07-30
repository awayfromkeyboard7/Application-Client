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

export default function MyPage() {
  const router = useRouter();
  const { data, status } = useSession();
  const [isLoading, setIsLoading] = useState(true);
  const [myInfo, setMyInfo] = useState({});
  const [gameLogs, setGameLogs] = useState([]);
  const [ranking, setRanking] = useState([]);

  useEffect(() => {
    if(data) {
      getUserInfo();
      getRanking();
    }
  }, [data?.gitId]);

  useEffect(() => {
    if(status === 'unauthenticated') {
      router.replace('/');
    }
  }, [status]);

  const getUserInfo = async () => {
    await fetch(`/server/api/user/getUser`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        gitId: data?.gitId
      })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setMyInfo(data.UserInfo);
          setGameLogs(data.UserInfo.gameLogHistory.reverse());
          setIsLoading(false);
        }
      })
      .catch(error => console.log('[/pages/mypage] getUserInfo error >> ', error));
  };

  const getRanking = async () => {
    await fetch(`/server/api/ranking/getRanking`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    })
      .then(res => res.json())
      .then(data => {
        // console.log(data)
        if (data.success) {
          setRanking(data.data);
        }
      })
      .catch(error => console.log('[/pages/mypage] getRanking error >> ', error));
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
          {status !== 'authenticated' && isLoading && <Loading />}
          <div className={styles.mainBox}>
            <div className={styles.mainCol}>
              <MyInfoBox myInfo={myInfo} ranking={ranking} />
              <RankingBox ranking={ranking} myInfo={myInfo}/>
            </div>
            <GameHistory gameLogs={gameLogs} ranking={ranking} myInfo={myInfo} />
          </div>
        </>
      }
    />
  )
}