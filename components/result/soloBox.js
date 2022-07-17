import Item from './soloItem';
import styles from '../../styles/components/result.module.scss';

export default function SoloResultBox({ type, ranks, startAt, onClickPlayAgain, onClickGoToMain }) {
  return (
    <div className={styles.body}>
      <div className={styles.mainHeader}>
        <div className={styles.mainTitle}>{`${type === 'team' ? '팀전 결과' : `개인전(${ranks?.length}인) 결과`}`}</div>
      </div>
      <div className={styles.mainBody}> 
        <div className={styles.resultBox}>
        {
          ranks?.map((item, idx) => 
            <Item info={item} startAt={startAt} key={item.gitId} idx={idx} />
          )
        }
        </div>
      </div>
      <div className={styles.mainFooter}>
        <div className={styles.btn} onClick={onClickPlayAgain}>한번 더 하기</div>
        <div className={styles.btn} onClick={onClickGoToMain}>메인으로</div>
      </div>
    </div>
  )
}