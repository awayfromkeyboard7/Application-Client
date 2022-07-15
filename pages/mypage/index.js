import Image from 'next/image'
import { useRouter } from 'next/router';
import { 
  getCookie, 
  deleteCookie 
} from 'cookies-next';
import Layout from '../../components/layouts/main';
import Header from '../../components/header';
import Rank from '../../components/rank/item';
import styles from '../../styles/pages/mypage.module.scss'

export default function MyPage() {
  const router = useRouter();

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

  const logout = async() => {
    deleteCookie('uid');
    deleteCookie('uname');
    goToLobby();
  }

  const goToLobby = () => {
    router.push('/');
  };

  return (
    <Layout 
      header={<Header label="로그아웃" onClickBtn={logout} />}
      body={
      <>
        <div className={styles.mainRow}>
          <div className={styles.gameHistoryBox}>
            <div className={styles.gameHistoryHeader}>
              <div className={styles.title}>게임 기록</div>
              <div className={styles.toggleBtn}>필터</div>
            </div>
            <div className={styles.gameHistoryBody}>
              <div className={styles.gameHistoryItem}>
                <div className={styles.dateBox}>
                  <div className={styles.myRank}>3</div>
                  <div className={styles.totalRank}>7</div>
                </div>
                <div className={styles.infoBox}>
                  <div className={styles.infoTitle}>clash code</div>
                </div>
              </div>
              <div className={styles.gameHistoryItem}>
                <div className={styles.dateBox}>
                  <div className={styles.myRank}>3</div>
                  <div className={styles.totalRank}>7</div>
                </div>
                <div className={styles.infoBox}>
                  <div className={styles.infoTitle}>clash code</div>
                </div>
              </div>
              <div className={styles.gameHistoryItem}>
                <div className={styles.dateBox}>
                  <div className={styles.myRank}>3</div>
                  <div className={styles.totalRank}>7</div>
                </div>
                <div className={styles.infoBox}>
                  <div className={styles.infoTitle}>clash code</div>
                </div>
              </div>
            </div>
          </div>
          <div className={styles.mainCol}>
            <div className={styles.profileBox}>
              <div className={styles.profileIcon}>
                <Image src={getCookie('uimg')} width={100} height={100} className={styles.profileIcon} alt="프로필이미지" />
              </div>
              <div className={styles.nickname}>{getCookie('uname')}</div>
            </div>
            <div className={styles.rankingBox}>
              <div className={styles.textMenu}>내 랭킹</div>
              <Rank 
                key={1234}
                rank={56} 
                nickname={getCookie('uname')} 
                info="lee hye jin"
                image={getCookie('uimg')} 
              />
              <div className={styles.textMenu}>전체 랭킹</div>
            {
              ranks.map((elem, idx) => 
                <Rank 
                  key={elem.ranking}
                  rank={elem.ranking} 
                  nickname={elem.gitId} 
                  info={elem.info} 
                  image={elem.avatarUrl} 
                />
              )
            }
            </div>
          </div>
        </div>
      </>
      }
    />
  )
}