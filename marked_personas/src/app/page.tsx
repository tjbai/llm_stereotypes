import Navigator from "../../lib/components/Home/Navigator";
import styles from "./page.module.css";

export default function Home() {
  return (
    <main>
      <h1 className={styles.header}>Marked Personas</h1>
      <p>Examining racial stereotypes and biases in GPT-4 descriptions.</p>
      <p>
        Final project for F23{" "}
        <em>Visual Cultures of Medicine, Science, and Technology</em>
      </p>
      <Navigator />
    </main>
  );
}
