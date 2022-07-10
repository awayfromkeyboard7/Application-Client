import styles from '../../styles/components/code/result.module.scss';

export default function Result({ result }) {
  return (
    <div className={styles.container}>
      {
        result?.msg?.map((output, idx) => 
          <div className={styles.resultBox} key={idx}>
            <div className={styles.test}>{`테스트 ${idx + 1}`}</div>
            <div className={styles.outputBox}>
              <div className={styles.title}>{`실행 결과 >>`}</div>
              {
                result?.result === true
                ? <div className={styles.textBlue}>성공</div>
                : <div className={styles.textRed}>실패</div>
              }
              
            </div>
            <div className={styles.outputBox}>
              <div className={styles.title}>{`출력 >>`}</div>
              <div className={styles.text}>{output}</div>
            </div>
          </div>
        )
      }
    </div>
  )
}