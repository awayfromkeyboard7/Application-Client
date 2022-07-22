import styles from '../styles/components/userPopup.module.scss';

export default function Popup({ }) {
    return (
        <div>
            <div className={styles.userProfile}>
                <Image src={'/default_profile.jpg'} width={100} height={100} className={styles.profileIcon} alt="프로필이미지" />
            </div>
            <div></div>
        </div>
    )
}