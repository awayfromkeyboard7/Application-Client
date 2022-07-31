import styles from '../../styles/components/code/output.module.scss';

export default function Output({ outputs }) {
  return (
    <div className={styles.container}>
    {
      outputs?.msg?.map((output, idx) => 
        <div className={outputs?.results[idx] === true ? styles.resultBoxBlue : styles.resultBoxRed} key={idx}>
          <div className={styles.test}>{`테스트 ${idx + 1}`}</div>
          <div className={styles.outputBox}>
            <div className={styles.title}>{`실행 결과 >>`}</div>
            {
              outputs?.results[idx] === true
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