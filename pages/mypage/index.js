import { useEffect, useState } from 'react';
import Image from 'next/image'
import { useRouter } from 'next/router';
import { useSession, signOut } from 'next-auth/react';
import { getCookie, deleteCookie } from 'cookies-next';
import Layout from '../../components/layouts/main';
import Header from '../../components/header';
import Rank from '../../components/rank/item';
import GameHistory from '../../components/mypage/gameHistory';
import Loading from '../../components/loading';
import styles from '../../styles/pages/mypage.module.scss'

export default function MyPage() {
  const router = useRouter();
  const { status } = useSession();
  const [myRanking, setMyRanking] = useState(0);
  const [myTotalScore, setMyTotalScore] = useState(0);
  const [gameLogs, setGameLogs] = useState([]);

  useEffect(() => {
    getUserInfo();
  }, []);

  const ranks = [
    {
      gitId: 'annie1229',
      avatarUrl: '/jinny.jpg',
      ranking: 1,
      info: 'swjungle'
    },
    {
      gitId: 'annie1229',
      avatarUrl: '/jinny.jpg',
      ranking: 1,
      info: 'swjungle'
    },
    {
      gitId: 'annie1229',
      avatarUrl: '/jinny.jpg',
      ranking: 1,
      info: 'swjungle'
    },
    {
      gitId: 'annie1229',
      avatarUrl: '/jinny.jpg',
      ranking: 1,
      info: 'swjungle'
    },
    {
      gitId: 'annie1229',
      avatarUrl: '/jinny.jpg',
      ranking: 1,
      info: 'swjungle'
    },
    {
      gitId: 'annie1229',
      avatarUrl: '/jinny.jpg',
      ranking: 1,
      info: 'swjungle'
    },
    {
      gitId: 'annie1229',
      avatarUrl: '/jinny.jpg',
      ranking: 1,
      info: 'swjungle'
    },
    {
      gitId: 'annie1229',
      avatarUrl: '/jinny.jpg',
      ranking: 1,
      info: 'swjungle'
    },
    {
      gitId: 'annie1229',
      avatarUrl: '/jinny.jpg',
      ranking: 1,
      info: 'swjungle'
    },
    {
      gitId: 'annie1229',
      avatarUrl: '/jinny.jpg',
      ranking: 1,
      info: 'swjungle'
    },
    {
      gitId: 'annie1229',
      avatarUrl: '/jinny.jpg',
      ranking: 1,
      info: 'swjungle'
    },
    {
      gitId: 'annie1229',
      avatarUrl: '/jinny.jpg',
      ranking: 1,
      info: 'swjungle'
    },
    {
      gitId: 'annie1229',
      avatarUrl: '/jinny.jpg',
      ranking: 1,
      info: 'swjungle'
    },
    {
      gitId: 'annie1229',
      avatarUrl: '/jinny.jpg',
      ranking: 1,
      info: 'swjungle'
    },
    {
      gitId: 'annie1229',
      avatarUrl: '/jinny.jpg',
      ranking: 1,
      info: 'swjungle'
    },
    {
      gitId: 'annie1229',
      avatarUrl: '/jinny.jpg',
      ranking: 1,
      info: 'swjungle'
    }
  ];

  useEffect(() => {
    if(status !== 'authenticated') {
      router.push('/');
    }
  }, [status]);

  const getUserInfo = async() => {
    await fetch(`/server/api/user/getUser`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        gitId: getCookie('gitId')
      })
    })
    .then(res => res.json())
    .then(data => {
      if(data.success) {
        console.log('[mypage] get user', data);
        setMyRanking(data.UserInfo.ranking);
        setMyTotalScore(data.UserInfo.totalScore);
        setGameLogs(data.UserInfo.gameLogHistory);
      }
    })
    .catch(error => console.log('error >> ', error));
  };

  const goToLobby = () => {
    router.push('/');
  };

  const logout = async() => {
    deleteCookie('nodeId');
    deleteCookie('gitId');
    deleteCookie('avatarUrl');
    signOut();
    goToLobby();
  }

  return (
    <Layout 
      header={<Header label="로그아웃" onClickBtn={logout} />}
      body={
        <>
          { status !== 'authenticated' && <Loading /> }
          <div className={styles.mainRow}>
            <div className={styles.gameHistoryBox}>
              <div className={styles.gameHistoryHeader}>
                <div className={styles.gameHistoryHeaderLeft}>
                  <div className={styles.title}>게임 기록</div>
                </div>
                <div className={styles.gameHistoryHeaderRight}>
                  <div className={styles.toggleBtn}>필터</div>
                </div>
              </div>
              <div className={styles.gameHistoryBody}>
              {
                gameLogs.map(gameLogId => 
                  <GameHistory gameLogId={gameLogId} key={gameLogId} />
                )
              }
              </div>
            </div>
            <div className={styles.mainCol}>
              <div className={styles.profileBox}>
                <div className={styles.profileIcon}>
                  <Image src={getCookie('avatarUrl') ?? '/default_profile.jpg'} width={100} height={100} className={styles.profileIcon} alt="프로필이미지" />
                </div>
                <div className={styles.nickname}>{getCookie('gitId')}</div>
              </div>
              <div className={styles.rankingBox}>
                <div className={styles.textMenu}>내 랭킹</div>
                <Rank 
                  rank={myRanking} 
                  nickname={getCookie('gitId')} 
                  info={myTotalScore}
                  image={getCookie('avatarUrl')} 
                />
                {/* <div className={styles.textMenu}>전체 랭킹</div> */}
                {/* {
                  ranks.map((elem, idx) => 
                    <Rank 
                      key={elem.ranking}
                      rank={elem.ranking} 
                      nickname={elem.gitId} 
                      info={elem.info} 
                      image={elem.avatarUrl} 
                    />
                  )
                } */}
              </div>
            </div>
          </div>
        </>
      }
    />
  )
}