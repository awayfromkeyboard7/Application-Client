import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Item from './teamItem';
import { CodePopup } from '../codeEditor';
import styles from '../../styles/components/result.module.scss';

export default function TeamResultBox({ ranks, startAt, onClickGoToMain }) {
  const router = useRouter();
  const [maxTeamLength, setMaxTeamLength] = useState(1);
  const [isOpenCode, setIsOpenCode] = useState(false);
  const [playerCode, setPlayerCode] = useState('');
  const [playerLanguage, setPlayerLanguage] = useState('Python');

  useEffect(() => {
    ranks.map(team => setMaxTeamLength(prev => prev < team.length ? team.length : prev))
  }, [ranks]);

  const getCode = async (codeId, language) => {
    await fetch(`/server/api/code?id=${codeId}`, {
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

  return (
    <div className={styles.body}>
      <div className={styles.mainHeader}>
        <div className={styles.mainTitle}>팀전 결과</div>
      </div>
      <div className={styles.mainBody}> 
      {
        ranks.length
        && <div className={styles.resultBox}>
          {
            ranks?.map((item, idx) => 
              <Item teamInfo={item} startAt={startAt} onClickCode={() => onClickCode(item[0])} maxLength={maxTeamLength} key={item[0].gitId} idx={idx} />
            )
          }
          </div>
      }
      </div>
      <div className={styles.mainFooter}>
        <div className={styles.btn} onClick={onClickGoToMain}>메인으로</div>
      </div>
      {
        isOpenCode
        && <CodePopup 
            code={playerCode} 
            language={playerLanguage}
            onClose={() => setIsOpenCode(false)}
          />
      }
    </div>
  )
}