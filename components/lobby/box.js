import Image from 'next/image';
import styles from '../../styles/components/lobby.module.scss';

export default function LobbyBox({ mode, onClick }) {
  return (
    <div className={styles.box} onClick={onClick}>
      <div>
        <Image 
          src={mode === 'team' ? '/team.png' : '/solo.png'} 
          alt={mode === 'team' ? 'teamGame' : 'soloGame'} 
          width={150} 
          height={150} 
        />
        <div className={styles.boxText}>{mode === 'team' ? '팀전' : '개인전'}</div>
      </div>
    </div>
  )
}