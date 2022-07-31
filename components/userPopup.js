import { useState, useEffect } from 'react';
import Image from 'next/image'
import { useSession } from 'next-auth/react';
import { socket } from '../lib/socket';
import styles from '../styles/components/userPopup.module.scss';
import { PieChart, BarChart, Bar, Pie, LineChart, Line, Cell, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';

export default function UserPopup({ userId, onClick }) {
  const { data } = useSession();
  const [myInfo, setMyInfo] = useState({});
  const [info, setInfo] = useState({});
  const [isFollow, setIsFollow] = useState(false);
  const [userGameLog, setUserGameLog] = useState('');
  const [userLangData, setUserLangData] = useState('');
  const PieColors = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  useEffect(() => {
    if (userId) {
      getUserInfo();
    }
  }, [userId]);

  useEffect(() => {
    if (data?.gitId) {
      getUserInfo(true);
    }
  }, [data?.gitId]);

  useEffect(() => {
    myInfo?.following?.map(userNodeId => {
      if (userNodeId === info.nodeId) {
        setIsFollow(true);
      }
    });
  }, [myInfo, info]);

  useEffect(() => {
    socket.emit('getFollowingList');
  }, [isFollow]);

  useEffect(() => {
    userRankLog()
  }, [])

  const getRankName = (rank, ranking) => {
    let myrank = 'Bronze';
    switch (rank) {
      case 0:
        myrank = 'Bronze';
        break;
      case 1:
        myrank = 'Silver';
        break;
      case 2:
        myrank = 'Gold';
        break;
      case 3:
        myrank = 'Platinum';
        break;
      case 4:
        myrank = 'Diamond';
        break;
      case 5:
        myrank = 'Master';
        break;
      default:
        myrank = 'Bronze'
    }
    if (ranking === 1) {
      myrank = 'King';
    }
    return myrank;
  };

  const getRankImg = (rank, ranking) => {
    let imgUrl = '/rank/rank0.png';
    switch (rank) {
      case 0:
        imgUrl = '/rank/rank0.png';
        break;
      case 1:
        imgUrl = '/rank/rank1.png';
        break;
      case 2:
        imgUrl = '/rank/rank2.png';
        break;
      case 3:
        imgUrl = '/rank/rank3.png';
        break;
      case 4:
        imgUrl = '/rank/rank4.png';
        break;
      case 5:
        imgUrl = '/rank/rank5.png';
        break;
      default:
        imgUrl = '/rank/rank0.png';
    }
    if (ranking == 1) {
      imgUrl = '/rank/king.png';
    }
    return imgUrl;
  };

  const getMyInfo = async () => {
    await fetch(`/server/api/user/getMyInfo`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    }).then(res => res.json())
      .then(data => {
        if (data.success) {
          setMyInfo(data.UserInfo);
        }
      })
      .catch(error => console.log('[/component/userPopup] getMyInfo error >> ', error));
  };

  const getUserInfo = async () => {
    await fetch(`/server/api/user/getUserInfo`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId
      })
    }).then(res => res.json())
      .then(data => {
        if (data.success) {
          setInfo(data.UserInfo);
        }
      })
      .catch(error => console.log('[/component/userPopup] getUserInfo error >> ', error));
  };

  const onClickFollow = () => {
    socket.emit('followMember', info.gitId);
    setIsFollow(true);
  };

  const onClickUnFollow = () => {
    socket.emit('unFollowMember', info.gitId);
    setIsFollow(false);
  };



  // Chart

  const userRankLog = async () => {
    await fetch(`/server/api/gamelog/userRankLog`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        // gitId: targetGitId
        userId
      })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setUserGameLog(data.RankLogArr);
          setUserLangData(data.LangArr)
        }
      })
      .catch(error => console.log('[/components/userPopup] getUserInfo error >> ', error));
  };

  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text className={styles.rechartsFontSize} x={x} y={y} fill="white" textAnchor={'middle'} dominantBaseline="central">
        {percent === 0 ? null : `${userLangData[index]["name"]} ${(percent * 100).toFixed(0)}%`
        }
      </text >
    );
  };

  const Chart = ({ data, PieColors }) => {
    return (
      <>
        <ResponsiveContainer width="31%" height="110%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderCustomizedLabel}
              innerRadius={50}
              outerRadius={60}
              fill="#8884d8"
              dataKey="value"
            >
              {data.product?.map((index) => (
                <Cell key={`cell-${index}`} fill={PieColors[index % PieColors.length]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </>
    )
  }

  const BarChart = ({ data }) => {
    return (
      <LineChart
        width={300}
        height={236}
        data={data}
        margin={{
          top: 20,
          right: 10,
          left: 10,
          bottom: 20
        }}
      >
        {/* <XAxis dataKey="date" tick={{ fill: 'white' }} /> */}
        <YAxis reversed="true" tick={{ fill: 'white' }} ticks={[1, 2, 3, 4, 5, 6, 7, 8]} domain={[0, 1]} />
        <Line
          type="monotone"
          dataKey="rank"
          stroke="#8884d8"
          strokeWidth={5}
          dot={{ stroke: 'black', strokeWidth: 1, r: 5, strokeDasharray: '' }}
        />
        <Tooltip />
      </LineChart>
    );
  }

  // Chart

  return (
    <div className={styles.popupBackground}>
      {
        info.gitId
        && <div className={styles.infoTab}>
          <div className={styles.myProfileBox}>
            <div className={styles.gameHistoryHeader}>
              <div className={styles.myProfileTitle}>내 정보</div>
              {
                isFollow
                  ? <div className={styles.inviteBtnClicked} onClick={onClickUnFollow}>언팔로우</div>
                  : <div className={styles.inviteBtn} onClick={onClickFollow}>팔로우</div>
              }
            </div>
            <div className={styles.myProfileBody}>
              <div className={styles.myInfoRow}>
                <div className={styles.myProfileIcon}>
                  <Image src={info.avatarUrl ?? '/default_profile.jpg'} width={80} height={80} className={styles.myProfileIcon} alt="프로필이미지" />
                  <div className={styles.myRank}>
                    <Image src={getRankImg(info.rank, info.ranking) ?? '/rank/rank0.png'} width={30} height={30} className={styles.rankIcon} alt="프로필이미지" />
                  </div>
                </div>
                <div className={styles.myInfoCol}>
                  <div className={styles.nickname}>{info?.gitId ?? ''}</div>
                  <div className={styles.rankBox}>
                    <div className={styles.fieldTitle}>{getRankName(info?.rank, info?.ranking) ?? 0}</div>
                    <div className={styles.pointText}>{`${info?.totalScore ?? 0 * 5} Point`}</div>
                  </div>
                </div>
              </div>
              <div className={styles.splitterHorizontal} />
              <div className={styles.myInfoRow}>
                <div className={styles.myInfoCol}>
                  <div className={styles.fieldTitle}>랭킹</div>
                  <div className={styles.percentText}>{`${info?.ranking ?? 0}등 (상위 ${info?.rankingPercent ?? 100}%)`}</div>
                </div>
                <div className={styles.splitterVertical} />
                <div className={styles.myInfoCol}>
                  <div className={styles.fieldTitle}>사용 언어</div>
                  <div className={styles.percentText}>{info?.mostLanguage ?? ''}</div>
                </div>
                <div className={styles.splitterVertical} />
                <Chart data={userLangData} PieColors={PieColors} />
              </div>
              <div className={styles.splitterHorizontal} />
              <div className={styles.myInfoRow}>
                <div className={styles.myInfoCol}>
                  <div className={styles.fieldTitle}>평균 통과율</div>
                  <div className={styles.percentText}>
                    {info?.totalPassRate === 0 ? "전적 없음" : `${parseInt(info?.totalPassRate / (info?.totalSolo + info?.totalTeam)) ?? 0}%`}
                  </div>
                </div>
                <div className={styles.splitterVertical} />
                <div className={styles.myInfoCol}>
                  <div className={styles.fieldTitle}>Solo 승률</div>
                  <div className={styles.percentText}>
                    {/* {`${parseInt(info?.winSolo / info?.totalSolo * 100) ?? 0}%`} */}
                    {info?.winSolo === 0 ? "전적 없음" : `${parseInt(info?.winSolo / info?.totalSolo * 100) ?? 0}%`}
                  </div>
                </div>
                <div className={styles.splitterVertical} />
                <div className={styles.myInfoCol}>
                  <div className={styles.fieldTitle}>Team 승률</div>
                  <div className={styles.percentText}>
                    {/* {`${parseInt(info?.winTeam / info?.totalTeam * 100) ?? 0}%`} */}
                    {info?.winTeam === 0 ? "전적 없음" : `${parseInt(info?.winTeam / info?.totalTeam * 100) ?? 0}%`}
                  </div>
                </div>
              </div>
              <div className={styles.splitterHorizontal} />
              <div>
                <BarChart data={userGameLog} />
              </div>
              <div className={styles.splitterHorizontal} />
              <div className={styles.sorryannie}>
                <div className={styles.btn} onClick={onClick}>닫기</div>
              </div>
            </div>
          </div>
        </div>
      }
    </div>
  )
}