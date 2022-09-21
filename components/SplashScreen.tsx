import Image from 'next/image'
import styles from '../styles/Home.module.css'

const SplashScreen = () => {
  return (
    <div className={styles.main}>
      <span className={styles.logo}>
        <Image src="/Splitas.gif" alt="Splitas logo" width={100} height={100} />
      </span>
    </div>
  )
}

export default SplashScreen