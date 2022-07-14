import styles from '../../styles/components/code/problem.module.scss';

export default function Problem({ problems }) {
  return (
    <div className={styles.container}>
      <div className={styles.content}>{problems?.content?.replaceAll('\\n', '\n')}</div>
      <div className={styles.title}>입력</div>
      <div className={styles.text}>{problems?.inputText?.replaceAll('\\n', '\n')}</div>
      <div className={styles.title}>출력</div>
      <div className={styles.text}>{problems?.outputText?.replaceAll('\\n', '\n')}</div>
      <div className={styles.title}>예제</div>
      {
        problems?.examples?.map((example, idx) => 
          <div className={styles.exampleBox} key={idx}>
            <div className={styles.exampleItem}>
              <div className={styles.subTitle}>예제 입력</div>
              <div className={styles.subText}>{example?.inputText?.replaceAll('\\n', '\n')}</div>
            </div>
            <div className={styles.exampleItem}>
              <div className={styles.subTitle}>예제 출력</div>
              <div className={styles.subText}>{example?.outputText?.replaceAll('\\n', '\n')}</div>
            </div>
          </div>
        )
      }
    </div>
  )
}