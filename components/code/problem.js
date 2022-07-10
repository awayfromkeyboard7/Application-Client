import styles from '../../styles/components/code/problem.module.scss';

export default function Problem({ problems }) {
  return (
    <div className={styles.container}>
      <div className={styles.content}>{problems.content}</div>
      <div className={styles.title}>입력</div>
      <div className={styles.text}>{problems.inputText}</div>
      <div className={styles.title}>출력</div>
      <div className={styles.text}>{problems.outputText}</div>
      <div className={styles.title}>예제</div>
      {
        problems?.examples?.map((example, idx) => 
          <div className={styles.exampleBox} key={idx}>
            <div className={styles.exampleItem}>
              <div className={styles.subTitle}>예제 입력</div>
              {
                example?.inputText?.split('\\n').map((text, idx) => 
                  <div className={styles.subText} key={idx}>{text}</div>
                )
              }
            </div>
            <div className={styles.exampleItem}>
              <div className={styles.subTitle}>예제 출력</div>
              {
                example?.outputText?.split('\\n').map((text, idx) => 
                  <div className={styles.subText} key={idx}>{text}</div>
                )
              }
            </div>
          </div>
        )
      }
    </div>
  )
}