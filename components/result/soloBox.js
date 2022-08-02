import { useState } from 'react';
import { useRouter } from 'next/router';
import Item from './soloItem';
import { CodePopup } from '../codeEditor';
import UserPopup from '../userPopup';
import styles from '../../styles/components/result.module.scss';

export default function SoloResultBox({ ranks, startAt, onClickGoToMain }) {
  const router = useRouter();
  const [isOpenCode, setIsOpenCode] = useState(false);
  const [playerCode, setPlayerCode] = useState('');
  const [playerLanguage, setPlayerLanguage] = useState('Python');
  const [targetId, setTatgetId] = useState('');
  const [isPopup, setIsPopup] = useState(false);

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

  const onClickId = (userId) => {
    setTatgetId(userId);
    setIsPopup(true);
  };

  return (
    <div className={styles.body}>
      <div className={styles.mainHeader}>
        <div className={styles.mainTitle}>{`개인전(${ranks?.length}인) 결과`}</div>
      </div>
      <div className={styles.mainBody}> 
        <div className={styles.resultBox}>
        {
          ranks?.map((item, idx) => 
            <Item info={item} startAt={startAt} onClickCode={() => onClickCode(item)} onClickId={() => onClickId(item.userId)} key={item.gitId} idx={idx} />
          )
        }
        </div>
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