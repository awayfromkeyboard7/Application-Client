import { Grid } from 'react-loader-spinner';
import styles from '../styles/components/loading.module.scss';

export default function Loading() {
  return (
    <div className={styles.background}>
      <Grid 
        height={100} 
        width={100} 
        color="#282A35" 
        ariaLabel="loading" 
      />
    </div>
  )
}