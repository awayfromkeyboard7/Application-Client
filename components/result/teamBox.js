import { useState, useEffect } from 'react';
import Item from './teamItem';
import Code from '../mypage/code';
import styles from '../../styles/components/result.module.scss';

export default function TeamResultBox({ ranks, startAt, onClickGoToMain }) {
  const [maxTeamLength, setMaxTeamLength] = useState(1);
  const [isOpenCode, setIsOpenCode] = useState(false);
  const [playerCode, setPlayerCode] = useState('');
  const [playerLanguage, setPlayerLanguage] = useState('Python');

  const getCode = async (codeId, language) => {
    console.log('get code >>> ', codeId, language);
    await fetch(`/server/api/code/getCode`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        codeId
      })
    })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        setPlayerCode(data.info);
        setPlayerLanguage(language);
        setIsOpenCode(true);
      }
    })
    .catch(error => console.log('[/components/result/soloBox] getCode error >> ', error));
  };

  const onClickCode = (player) => {
    getCode(player.code, player.language);
  };

  useEffect(() => {
    ranks.map(team => setMaxTeamLength(prev => prev < team.length ? team.length : prev))
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