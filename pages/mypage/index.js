import { useEffect } from 'react';
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

  const gameHistorys = [
    {
      gameMode: "team",
      teamA: [
        {
          gitId: "Son0-0",
          avatarUrl: "https://avatars.githubusercontent.com/u/63143159?v=4",
          language: "",
          code: "",
          ranking: 1,
          passRate: -1,
          submitAt: {
            $date: {
              $numberLong: "1657908128339"
            }
          }
        }
      ],
      teamB: [
        {
          gitId: "annie1229",
          avatarUrl: "https://avatars.githubusercontent.com/u/53402709?v=4",
          language: "",
          code: "",
          ranking: 2,
          passRate: -1,
          submitAt: {
            $date: {
              $numberLong: "1657908128342"
            }
          }
        },
        {
          gitId: "park-hg",
          avatarUrl: "https://avatars.githubusercontent.com/u/63143159?v=4",
          language: "",
          code: "",
          ranking: 2,
          passRate: -1,
          submitAt: {
            $date: {
              $numberLong: "1657908128342"
            }
          }
        }
      ],
      startAt: 1657908128342,
      userHistory: []
    },
    {
      gameMode: "personal",
      teamA: [],
      teamB: [],
      startAt: 1657908128342,
      userHistory: [
        {
          gitId: "swjungle",
          avatarUrl: "https://avatars.githubusercontent.com/u/53402709?v=4",
          language: "",
          code: "",
          ranking: 1,
          passRate: -1,
          submitAt: {
            $date: {
              $numberLong: "1657908128342"
            }
          }
        },
        {
          gitId: "park-hg",
          avatarUrl: "https://avatars.githubusercontent.com/u/53402709?v=4",
          language: "",
          code: "",
          ranking: 2,
          passRate: -1,
          submitAt: {
            $date: {
              $numberLong: "1657908128342"
            }
          }
        },
        {
          gitId: "Son0-0",
          avatarUrl: "https://avatars.githubusercontent.com/u/53402709?v=4",
          language: "",
          code: "",
          ranking: 3,
          passRate: -1,
          submitAt: {
            $date: {
              $numberLong: "1657908128342"
            }
          }
        },
        {
          gitId: "dd0114",
          avatarUrl: "https://avatars.githubusercontent.com/u/53402709?v=4",
          language: "",
          code: "",
          ranking: 4,
          passRate: -1,
          submitAt: {
            $date: {
              $numberLong: "1657908128342"
            }
          }
        },
        {
          gitId: "EiLargerTodd",
          avatarUrl: "https://avatars.githubusercontent.com/u/53402709?v=4",
          language: "",
          code: "",
          ranking: 5,
          passRate: -1,
          submitAt: {
            $date: {
              $numberLong: "1657908128342"
            }
          }
        },
        {
          gitId: "annie1229",
          avatarUrl: "https://avatars.githubusercontent.com/u/53402709?v=4",
          language: "",
          code: "",
          ranking: 6,
          passRate: -1,
          submitAt: {
            $date: {
              $numberLong: "1657908128342"
            }
          }
        },
        {
          gitId: "jinny",
          avatarUrl: "https://avatars.githubusercontent.com/u/53402709?v=4",
          language: "",
          code: "",
          ranking: 7,
          passRate: -1,
          submitAt: {
            $date: {
              $numberLong: "1657908128342"
            }
          }
        },
      ]
    },
    {
      gameMode: "team",
      teamA: [
        {
          gitId: "Son0-0",
          avatarUrl: "https://avatars.githubusercontent.com/u/63143159?v=4",
          language: "",
          code: "",
          ranking: 2,
          passRate: -1,
          submitAt: {
            $date: {
              $numberLong: "1657908128339"
            }
          }
        }
      ],
      teamB: [
        {
          gitId: "annie1229",
          avatarUrl: "https://avatars.githubusercontent.com/u/53402709?v=4",
          language: "",
          code: "",
          ranking: 1,
          passRate: -1,
          submitAt: {
            $date: {
              $numberLong: "1657908128342"
            }
          }
        },
        {
          gitId: "park-hg",
          avatarUrl: "https://avatars.githubusercontent.com/u/63143159?v=4",
          language: "",
          code: "",
          ranking: 1,
          passRate: -1,
          submitAt: {
            $date: {
              $numberLong: "1657908128342"
            }
          }
        }
      ],
      startAt: 1657908128342,
      userHistory: []
    },
    {
      gameMode: "team",
      teamA: [
        {
          gitId: "Son0-0",
          avatarUrl: "https://avatars.githubusercontent.com/u/63143159?v=4",
          language: "",
          code: "",
          ranking: 1,
          passRate: -1,
          submitAt: {
            $date: {
              $numberLong: "1657908128339"
            }
          }
        }
      ],
      teamB: [
        {
          gitId: "annie1229",
          avatarUrl: "https://avatars.githubusercontent.com/u/53402709?v=4",
          language: "",
          code: "",
          ranking: 2,
          passRate: -1,
          submitAt: {
            $date: {
              $numberLong: "1657908128342"
            }
          }
        },
        {
          gitId: "park-hg",
          avatarUrl: "https://avatars.githubusercontent.com/u/63143159?v=4",
          language: "",
          code: "",
          ranking: 2,
          passRate: -1,
          submitAt: {
            $date: {
              $numberLong: "1657908128342"
            }
          }
        }
      ],
      startAt: 1657908128342,
      userHistory: []
    },
    {
      gameMode: "personal",
      teamA: [],
      teamB: [],
      startAt: 1657908128342,
      userHistory: [
        {
          gitId: "swjungle",
          avatarUrl: "https://avatars.githubusercontent.com/u/53402709?v=4",
          language: "",
          code: "",
          ranking: 1,
          passRate: -1,
          submitAt: {
            $date: {
              $numberLong: "1657908128342"
            }
          }
        },
        {
          gitId: "park-hg",
          avatarUrl: "https://avatars.githubusercontent.com/u/53402709?v=4",
          language: "",
          code: "",
          ranking: 2,
          passRate: -1,
          submitAt: {
            $date: {
              $numberLong: "1657908128342"
            }
          }
        },
        {
          gitId: "Son0-0",
          avatarUrl: "https://avatars.githubusercontent.com/u/53402709?v=4",
          language: "",
          code: "",
          ranking: 3,
          passRate: -1,
          submitAt: {
            $date: {
              $numberLong: "1657908128342"
            }
          }
        },
        {
          gitId: "dd0114",
          avatarUrl: "https://avatars.githubusercontent.com/u/53402709?v=4",
          language: "",
          code: "",
          ranking: 4,
          passRate: -1,
          submitAt: {
            $date: {
              $numberLong: "1657908128342"
            }
          }
        },
        {
          gitId: "EiLargerTodd",
          avatarUrl: "https://avatars.githubusercontent.com/u/53402709?v=4",
          language: "",
          code: "",
          ranking: 5,
          passRate: -1,
          submitAt: {
            $date: {
              $numberLong: "1657908128342"
            }
          }
        },
        {
          gitId: "annie1229",
          avatarUrl: "https://avatars.githubusercontent.com/u/53402709?v=4",
          language: "",
          code: "",
          ranking: 6,
          passRate: -1,
          submitAt: {
            $date: {
              $numberLong: "1657908128342"
            }
          }
        },
        {
          gitId: "jinny",
          avatarUrl: "https://avatars.githubusercontent.com/u/53402709?v=4",
          language: "",
          code: "",
          ranking: 7,
          passRate: -1,
          submitAt: {
            $date: {
              $numberLong: "1657908128342"
            }
          }
        },
      ]
    },
    {
      gameMode: "team",
      teamA: [
        {
          gitId: "Son0-0",
          avatarUrl: "https://avatars.githubusercontent.com/u/63143159?v=4",
          language: "",
          code: "",
          ranking: 2,
          passRate: -1,
          submitAt: {
            $date: {
              $numberLong: "1657908128339"
            }
          }
        }
      ],
      teamB: [
        {
          gitId: "annie1229",
          avatarUrl: "https://avatars.githubusercontent.com/u/53402709?v=4",
          language: "",
          code: "",
          ranking: 1,
          passRate: -1,
          submitAt: {
            $date: {
              $numberLong: "1657908128342"
            }
          }
        },
        {
          gitId: "park-hg",
          avatarUrl: "https://avatars.githubusercontent.com/u/63143159?v=4",
          language: "",
          code: "",
          ranking: 1,
          passRate: -1,
          submitAt: {
            $date: {
              $numberLong: "1657908128342"
            }
          }
        }
      ],
      startAt: 1657908128342,
      userHistory: []
    },
    {
      gameMode: "team",
      teamA: [
        {
          gitId: "Son0-0",
          avatarUrl: "https://avatars.githubusercontent.com/u/63143159?v=4",
          language: "",
          code: "",
          ranking: 1,
          passRate: -1,
          submitAt: {
            $date: {
              $numberLong: "1657908128339"
            }
          }
        }
      ],
      teamB: [
        {
          gitId: "annie1229",
          avatarUrl: "https://avatars.githubusercontent.com/u/53402709?v=4",
          language: "",
          code: "",
          ranking: 2,
          passRate: -1,
          submitAt: {
            $date: {
              $numberLong: "1657908128342"
            }
          }
        },
        {
          gitId: "park-hg",
          avatarUrl: "https://avatars.githubusercontent.com/u/63143159?v=4",
          language: "",
          code: "",
          ranking: 2,
          passRate: -1,
          submitAt: {
            $date: {
              $numberLong: "1657908128342"
            }
          }
        }
      ],
      startAt: 1657908128342,
      userHistory: []
    },
    {
      gameMode: "personal",
      teamA: [],
      teamB: [],
      startAt: 1657908128342,
      userHistory: [
        {
          gitId: "swjungle",
          avatarUrl: "https://avatars.githubusercontent.com/u/53402709?v=4",
          language: "",
          code: "",
          ranking: 1,
          passRate: -1,
          submitAt: {
            $date: {
              $numberLong: "1657908128342"
            }
          }
        },
        {
          gitId: "park-hg",
          avatarUrl: "https://avatars.githubusercontent.com/u/53402709?v=4",
          language: "",
          code: "",
          ranking: 2,
          passRate: -1,
          submitAt: {
            $date: {
              $numberLong: "1657908128342"
            }
          }
        },
        {
          gitId: "Son0-0",
          avatarUrl: "https://avatars.githubusercontent.com/u/53402709?v=4",
          language: "",
          code: "",
          ranking: 3,
          passRate: -1,
          submitAt: {
            $date: {
              $numberLong: "1657908128342"
            }
          }
        },
        {
          gitId: "dd0114",
          avatarUrl: "https://avatars.githubusercontent.com/u/53402709?v=4",
          language: "",
          code: "",
          ranking: 4,
          passRate: -1,
          submitAt: {
            $date: {
              $numberLong: "1657908128342"
            }
          }
        },
        {
          gitId: "EiLargerTodd",
          avatarUrl: "https://avatars.githubusercontent.com/u/53402709?v=4",
          language: "",
          code: "",
          ranking: 5,
          passRate: -1,
          submitAt: {
            $date: {
              $numberLong: "1657908128342"
            }
          }
        },
        {
          gitId: "annie1229",
          avatarUrl: "https://avatars.githubusercontent.com/u/53402709?v=4",
          language: "",
          code: "",
          ranking: 6,
          passRate: -1,
          submitAt: {
            $date: {
              $numberLong: "1657908128342"
            }
          }
        },
        {
          gitId: "jinny",
          avatarUrl: "https://avatars.githubusercontent.com/u/53402709?v=4",
          language: "",
          code: "",
          ranking: 7,
          passRate: -1,
          submitAt: {
            $date: {
              $numberLong: "1657908128342"
            }
          }
        },
      ]
    },
    {
      gameMode: "team",
      teamA: [
        {
          gitId: "Son0-0",
          avatarUrl: "https://avatars.githubusercontent.com/u/63143159?v=4",
          language: "",
          code: "",
          ranking: 2,
          passRate: -1,
          submitAt: {
            $date: {
              $numberLong: "1657908128339"
            }
          }
        }
      ],
      teamB: [
        {
          gitId: "annie1229",
          avatarUrl: "https://avatars.githubusercontent.com/u/53402709?v=4",
          language: "",
          code: "",
          ranking: 1,
          passRate: -1,
          submitAt: {
            $date: {
              $numberLong: "1657908128342"
            }
          }
        },
        {
          gitId: "park-hg",
          avatarUrl: "https://avatars.githubusercontent.com/u/63143159?v=4",
          language: "",
          code: "",
          ranking: 1,
          passRate: -1,
          submitAt: {
            $date: {
              $numberLong: "1657908128342"
            }
          }
        }
      ],
      startAt: 1657908128342,
      userHistory: []
    },
    {
      gameMode: "team",
      teamA: [
        {
          gitId: "Son0-0",
          avatarUrl: "https://avatars.githubusercontent.com/u/63143159?v=4",
          language: "",
          code: "",
          ranking: 1,
          passRate: -1,
          submitAt: {
            $date: {
              $numberLong: "1657908128339"
            }
          }
        }
      ],
      teamB: [
        {
          gitId: "annie1229",
          avatarUrl: "https://avatars.githubusercontent.com/u/53402709?v=4",
          language: "",
          code: "",
          ranking: 2,
          passRate: -1,
          submitAt: {
            $date: {
              $numberLong: "1657908128342"
            }
          }
        },
        {
          gitId: "park-hg",
          avatarUrl: "https://avatars.githubusercontent.com/u/63143159?v=4",
          language: "",
          code: "",
          ranking: 2,
          passRate: -1,
          submitAt: {
            $date: {
              $numberLong: "1657908128342"
            }
          }
        }
      ],
      startAt: 1657908128342,
      userHistory: []
    },
    {
      gameMode: "personal",
      teamA: [],
      teamB: [],
      startAt: 1657908128342,
      userHistory: [
        {
          gitId: "swjungle",
          avatarUrl: "https://avatars.githubusercontent.com/u/53402709?v=4",
          language: "",
          code: "",
          ranking: 1,
          passRate: -1,
          submitAt: {
            $date: {
              $numberLong: "1657908128342"
            }
          }
        },
        {
          gitId: "park-hg",
          avatarUrl: "https://avatars.githubusercontent.com/u/53402709?v=4",
          language: "",
          code: "",
          ranking: 2,
          passRate: -1,
          submitAt: {
            $date: {
              $numberLong: "1657908128342"
            }
          }
        },
        {
          gitId: "Son0-0",
          avatarUrl: "https://avatars.githubusercontent.com/u/53402709?v=4",
          language: "",
          code: "",
          ranking: 3,
          passRate: -1,
          submitAt: {
            $date: {
              $numberLong: "1657908128342"
            }
          }
        },
        {
          gitId: "dd0114",
          avatarUrl: "https://avatars.githubusercontent.com/u/53402709?v=4",
          language: "",
          code: "",
          ranking: 4,
          passRate: -1,
          submitAt: {
            $date: {
              $numberLong: "1657908128342"
            }
          }
        },
        {
          gitId: "EiLargerTodddfasdfasdfsdfdsafsdfasdfsadfsadfsadfsadfsdfsadf",
          avatarUrl: "https://avatars.githubusercontent.com/u/53402709?v=4",
          language: "",
          code: "",
          ranking: 5,
          passRate: -1,
          submitAt: {
            $date: {
              $numberLong: "1657908128342"
            }
          }
        },
        {
          gitId: "annie1229",
          avatarUrl: "https://avatars.githubusercontent.com/u/53402709?v=4",
          language: "",
          code: "",
          ranking: 6,
          passRate: -1,
          submitAt: {
            $date: {
              $numberLong: "1657908128342"
            }
          }
        },
        {
          gitId: "jinny",
          avatarUrl: "https://avatars.githubusercontent.com/u/53402709?v=4",
          language: "",
          code: "",
          ranking: 7,
          passRate: -1,
          submitAt: {
            $date: {
              $numberLong: "1657908128342"
            }
          }
        },
      ]
    },
    {
      gameMode: "team",
      teamA: [
        {
          gitId: "Son0-0",
          avatarUrl: "https://avatars.githubusercontent.com/u/63143159?v=4",
          language: "",
          code: "",
          ranking: 2,
          passRate: -1,
          submitAt: {
            $date: {
              $numberLong: "1657908128339"
            }
          }
        }
      ],
      teamB: [
        {
          gitId: "annie1229",
          avatarUrl: "https://avatars.githubusercontent.com/u/53402709?v=4",
          language: "",
          code: "",
          ranking: 1,
          passRate: -1,
          submitAt: {
            $date: {
              $numberLong: "1657908128342"
            }
          }
        },
        {
          gitId: "park-hg",
          avatarUrl: "https://avatars.githubusercontent.com/u/63143159?v=4",
          language: "",
          code: "",
          ranking: 1,
          passRate: -1,
          submitAt: {
            $date: {
              $numberLong: "1657908128342"
            }
          }
        }
      ],
      startAt: 1657908128342,
      userHistory: []
    },
  ];

  useEffect(() => {
    if(status !== 'authenticated') {
      router.push('/');
    }
  }, [status]);

  const goToLobby = () => {
    router.push('/');
  };

  const logout = async() => {
    deleteCookie('uid');
    deleteCookie('uname');
    deleteCookie('uimg');
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
                gameHistorys.map(history => 
                  <GameHistory gameInfo={history} key={history.startAt} />
                )
              }
              </div>
            </div>
            <div className={styles.mainCol}>
              <div className={styles.profileBox}>
                <div className={styles.profileIcon}>
                  <Image src={getCookie('uimg') ?? '/default_profile.jpg'} width={100} height={100} className={styles.profileIcon} alt="프로필이미지" />
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