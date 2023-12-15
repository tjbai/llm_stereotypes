import Navigator from "./Navigator";
import styles from "./styles.module.css";

export default function Header() {
  return (
    <div className={styles.headerContainer}>
      <h1>
        <a href="/" className={styles.link}>
          Marked Personas
        </a>
      </h1>
      <Navigator />
    </div>
  );
}
