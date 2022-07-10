import Item from './item';
import styles from '../../styles/components/result.module.scss';

export default function Result({ type, ranks, onClickPlayAgain, onClickGoToMain }) {
  return (
    <div className={styles.body}>
      <div className={styles.mainHeader}>{`${type === 'team' ? '팀' : '개인'}전(${ranks.length}인)결과`}</div>
      <div className={styles.mainBody}> 
        <div className={styles.resultBox}>
        {
          ranks.map(item => 
            <Item 
              key={item.rank}
              rank={item.rank} 
              nickname={item.nickname} 
              time={item.time} 
              image={item.imageUrl} 
            />
          )
        }
        </div>
      </div>
      <div className={styles.mainFooter}>
        <div className={styles.myPageBtn} onClick={onClickPlayAgain}>한번 더 하기</div>
        <div className={styles.myPageBtn} onClick={onClickGoToMain}>메인으로</div>
      </div>
    </div>
  )
}