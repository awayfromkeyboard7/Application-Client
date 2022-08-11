import { useState, useEffect, useLayoutEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import Rank from './rankingItem';
import UserPopup from '../userPopup';
import styles from '../../styles/pages/mypage.module.scss';

export default function RankingBox() {
  const router = useRouter();
  const listRef = useRef();
  const [targetId, setTatgetId] = useState('');
  const [isPopup, setIsPopup] = useState(false);
  const [ranking, setRanking] = useState([]);
  const [start, setStart] = useState(0);
  const [count, setCount] = useState(20);
  const [isLoading, setIsLoading] = useState(true);
  const [isEnd, setIsEnd] = useState(false);

  useLayoutEffect(() => {
    function updateListHeight() {
      if(listRef.current?.clientHeight) {
        if(!isEnd && ranking.length * 48 < listRef?.current?.clientHeight) {
          setIsLoading(true);
        }
        setCount(parseInt(listRef?.current?.clientHeight / 48));
      }
    }
    window.addEventListener('resize', updateListHeight);
    updateListHeight();
    return () => {
      window.removeEventListener('resize', updateListHeight);
    }
  }, [isEnd, ranking]);

  useEffect(() => {
    if(isLoading && !isEnd) {
      pagingRanking();
    }
  }, [isLoading, isEnd]);

  const pagingRanking = async () => {
    await fetch(`/server/api/user/rank?start=${start}&count=${count}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
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
      if(data.success) {
        setStart(prev => prev + count);
        setRanking(prev => [...prev, ...data.ranking]);
        setIsLoading(false);
        setIsEnd(!data.next);
      }
    })
    .catch(error => console.log('[/pages/mypage] pagingRanking error >> ', error));
  };

  const getRankImg = (rank, ranking) => {
    let imgUrl = '/rank/rank0.png';
    switch(rank) {
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
    if(ranking == 1) {
      imgUrl = '/rank/king.png';
    }
    return imgUrl;
  };

  const getLangImg = (language) => {
    let imgUrl = null;
    switch(language) {
      case 'Python':
        imgUrl = '/rank/Python.png';
        break;
      case 'JavaScript':
        imgUrl = '/rank/JavaScript.png';
        break;
    }
    return imgUrl;
  };

  const onClickId = (userId) => {
    setTatgetId(userId);
    setIsPopup(true);
  };

  const onScroll = (e) => {
    const { scrollHeight, clientHeight, scrollTop } = e.target;
    if((scrollHeight - scrollTop) < clientHeight * 1.5) {
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
            key={elem._id}
            ranking={elem.ranking}
            nickname={elem.gitId}
            image={elem.avatarUrl}
            rankImg={getRankImg(elem.rank, elem.ranking)}
            language={getLangImg(elem.mostLanguage)}
            winrate={(elem.totalSolo + elem.totalTeam) ? parseInt(100 * (elem.winSolo + elem.winTeam) / (elem.totalSolo + elem.totalTeam)) : 0}
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