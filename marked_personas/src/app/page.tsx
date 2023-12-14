import styles from "./page.module.css";

export default function Home() {
  return (
    <main>
      <div className={styles.home}>
        <p>
          Examining and visualizing <em>marked words</em> in GPT-4 personas.
        </p>
        <p>
          Final project for F23{" "}
          <em>Visual Cultures of Medicine, Science, and Technology</em>.
        </p>
      </div>
    </main>
  );
}
