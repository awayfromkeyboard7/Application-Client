import { useState } from 'react';
import Item from './soloItem';
import Code from '../mypage/code';
import styles from '../../styles/components/result.module.scss';

export default function SoloResultBox({ ranks, startAt, onClickPlayAgain, onClickGoToMain }) {
  const [isOpenCode, setIsOpenCode] = useState(false);
  const [playerCode, setPlayerCode] = useState('');
  const [playerLanguage, setPlayerLanguage] = useState('Python');

  const onClickPlayer = (player) => {
    setPlayerCode(player.code);
    setPlayerLanguage(player.language);
    setIsOpenCode(true);
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
            <Item info={item} startAt={startAt} onClickPlayer={() => onClickPlayer(item)} key={item.gitId} idx={idx} />
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