import { useState, useEffect } from 'react';
import { Watch } from 'react-loader-spinner';
import styles from '../../styles/components/code/output.module.scss';

export default function Output({ outputs, isExecuting }) {
  const loadingText = ['채점 중', '채점 중.', '채점 중..', '채점 중...'];
  const [textIdx, setTextIdx] = useState(0);

  useEffect(() => {
    if(isExecuting) {
      const interval = setInterval(() => {
        setTextIdx(prev => ((prev + 1) % 4));
      }, 300);

      return () => {
        clearInterval(interval);
      }
    }
  }, [isExecuting]);

  return (
    <div className={styles.container}>
    {
      isExecuting
      ? <div className={styles.loadingBox}>
          <Watch 
            height={40} 
            width={40}
            color="#f3f3f3" 
            ariaLabel="loading" 
          />
          <div className={styles.loadingText}>{loadingText[textIdx]}</div>
        </div>
      : outputs?.msg?.map((output, idx) => 
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