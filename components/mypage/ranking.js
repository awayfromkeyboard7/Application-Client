import { useState } from 'react';
import Rank from '../rank/item';
import UserPopup from '../userPopup';
import styles from '../../styles/pages/mypage.module.scss';

export default function RankingBox({ ranking }) {
  const [targetId, setTatgetId] = useState('');
  const [isPopup, setIsPopup] = useState(false);
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

  const onClickId = (gitId) => {
    setTatgetId(gitId);
    setIsPopup(true);
  };

  return (
    <div className={styles.rankTab}>
      <div className={styles.rankTabHeader}>
        <div className={styles.rankTabTitle}>전체 랭킹</div>
      </div>
      <div className={styles.rankTabMenu}></div>
      <div className={styles.rankingBox}>
      {
        ranking?.map(elem =>
          <Rank
            key={elem.ranking}
            rank={elem.ranking}
            nickname={elem.gitId}
            image={elem.avatarUrl}
            rankImg={getRankImg(elem.rank, elem.ranking)}
            language={getLangImg(elem.mostLanguage)}
            winrate={elem.winRate}
            onClickId={() => onClickId(elem.gitId)}
          />
        )
      }
      </div>
      {
        isPopup
        && <UserPopup
            targetGitId={targetId}
            onClick={() => setIsPopup(false)}
          />
      }
    </div>
  )
}