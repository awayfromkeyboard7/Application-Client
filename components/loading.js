import { Grid } from 'react-loader-spinner';
import styles from '../styles/components/loading.module.scss';

export default function Loading() {
  return (
    <div className={styles.background}>
      <Grid 
        height={60} 
        width={60} 
        color="rgb(89, 0, 148)" 
        ariaLabel="loading" 
      />
    </div>
  )
}