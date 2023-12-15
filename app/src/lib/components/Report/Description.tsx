import styles from "./styles.module.css";

export default function Description({
  text,
  query,
}: {
  text: string;
  query: string[];
}) {
  const highlightedWords = () => {
    return text
      .replace(
        new RegExp(`\\b(${query.slice(0, 10).join("|")})\\b`, "gi"),
        (match) => `<text style="color:red">${match}</text>`
      )
      .replace(
        new RegExp(`\\b(${query.slice(10, 20).join("|")})\\b`, "gi"),
        (match) => `<text style="color:darkorange">${match}</text>`
      );
  };

  return (
    <text
      className={styles.description}
      dangerouslySetInnerHTML={{ __html: highlightedWords() }}
    />
  );
}
