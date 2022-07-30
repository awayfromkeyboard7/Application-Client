import { useState, useEffect } from 'react';
import Item from './teamItem';
import Code from '../mypage/code';
import styles from '../../styles/components/result.module.scss';

export default function TeamResultBox({ ranks, startAt, onClickPlayAgain, onClickGoToMain }) {
  const [maxTeamLength, setMaxTeamLength] = useState(1);
  const [isOpenCode, setIsOpenCode] = useState(false);
  const [playerCode, setPlayerCode] = useState('');
  const [playerLanguage, setPlayerLanguage] = useState('Python');

  const onClickCode = (player) => {
    setPlayerCode(player.code);
    setPlayerLanguage(player.language);
    setIsOpenCode(true);
  };

  useEffect(() => {
    ranks.map(team => {
      setMaxTeamLength(prev => {
        if(prev < team.length) {
          return team.length;
        } else {
          return prev;
        }
      })
    })
  }, [ranks]);

  return (
    <div className={styles.body}>
      <div className={styles.mainHeader}>
        <div className={styles.mainTitle}>팀전 결과</div>
      </div>
      <div className={styles.mainBody}> 
        <div className={styles.resultBox}>
        {
          ranks?.map((item, idx) => 
            <Item teamInfo={item} startAt={startAt} onClickCode={() => onClickCode(item[0])} maxLength={maxTeamLength} key={item[0].gitId} idx={idx} />
          )
        }
        </div>
      </div>
      <div className={styles.mainFooter}>
        {/* <div className={styles.btn} onClick={onClickPlayAgain}>한번 더 하기</div> */}
        <div className={styles.btn} onClick={onClickGoToMain}>메인으로</div>
      </div>
      {
        isOpenCode
        && <div className={styles.codeBackground}>
          <div className={styles.codeBox}>
            <Code code={playerCode} language={playerLanguage} />
            <div className={styles.btn} onClick={() => setIsOpenCode(false)}>닫기</div>
          </div>
        </div>
      }
    </div>
  )
}