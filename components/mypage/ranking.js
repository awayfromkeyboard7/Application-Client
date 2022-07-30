import { useEffect, useState, useRef } from 'react';
import Rank from '../rank/item';
import UserPopup from '../userPopup';
import styles from '../../styles/pages/mypage.module.scss';

export default function RankingBox() {
  const listRef = useRef();
  const [targetId, setTatgetId] = useState('');
  const [isPopup, setIsPopup] = useState(false);
  const [ranking, setRanking] = useState([]);
  const [start, setStart] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isEnd, setIsEnd] = useState(false);

  useEffect(() => {
    pagingRanking();
  }, []);

  useEffect(() => {
    if(isLoading && !isEnd) {
      pagingRanking();
    }
  }, [isLoading, isEnd]);

  const pagingRanking = async () => {
    await fetch(`/server/api/user/paging`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        start,
        count: 20
      })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setStart(prev => prev + 20);
          setRanking(prev => [...prev, ...data.ranking]);
          setIsLoading(false);
          if(data.ranking.length === 0) {
            setIsEnd(true);
          }
        }
      })
      .catch(error => console.log('[/pages/mypage] pagingRanking error >> ', error));
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

  const getLangImg = (language) => {
    let imgUrl = '/default_profile.jpg'
    switch (language) {
      case 'Python':
        imgUrl = '/rank/Python.png';
        break;
      case 'JavaScript':
        imgUrl = '/rank/JavaScript.png';
        break;
      default:
        imgUrl = '/default_profile.jpg';
    }
    return imgUrl;
  };

  const onClickId = (userId) => {
    setTatgetId(userId);
    setIsPopup(true);
  };

  const onScroll = (e) => {
    const { scrollHeight, clientHeight, scrollTop } = e.target;
    // console.log('on scroll e >>> ', scrollHeight, clientHeight, scrollTop);
    if((scrollHeight - scrollTop) < clientHeight + 360) {
      setIsLoading(true);
    }
  };

  return (
    <div className={styles.rankTab}>
      <div className={styles.rankTabHeader}>
        <div className={styles.rankTabTitle}>전체 랭킹</div>
      </div>
      <div className={styles.rankTabMenu}></div>
      <div className={styles.rankingBox} ref={listRef} onScroll={onScroll}>
      {
        ranking?.map(elem =>
          <Rank
            key={elem.gitId}
            rank={elem.ranking}
            nickname={elem.gitId}
            image={elem.avatarUrl}
            rankImg={getRankImg(elem.rank, elem.ranking)}
            language={getLangImg(elem.mostLanguage)}
            // winrate={elem.winRate}
            winrate={parseInt(100 * (elem.winSolo + elem.winTeam) / (elem.totalSolo + elem.totalTeam))}
            onClickId={() => onClickId(elem._id)}
          />
        )
      }
      </div>
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