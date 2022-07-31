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
  const { status } = useSession();
  const [isLoading, setIsLoading] = useState(true);
  const [myInfo, setMyInfo] = useState({});
  const [gameLogs, setGameLogs] = useState([]);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    getUserInfo();
    getUserCount();
  }, []);

  useEffect(() => {
    if(status === 'unauthenticated') {
      router.replace('/');
    }
  }, [status]);

  const getUserInfo = async () => {
    await fetch(`/server/api/user/getMyInfo`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
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

  const getUserCount = async () => {
    await fetch(`/server/api/user/count`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        setTotalCount(data.count);
      }
    })
    .catch(error => console.log('[/pages/mypage] getUserInfo error >> ', error));
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
              <MyInfoBox myInfo={myInfo} totalUser={totalCount} />
              <RankingBox />
            </div>
            <GameHistory gameLogs={gameLogs} />
          </div>
        </>
      }
    />
  )
}

// export const getServerSideProps = async () => {
//   const res = await fetch(`${process.env.NEXT_PUBLIC_API_PROVIDER}/api/ranking/getRanking`, {
//       method: 'GET',
//       headers: {
//         'Content-Type': 'application/json',
//       }
//     });
  
//   const data = await res.json();

//   return {
//     props: { ranking: data.data },
//   };
// };