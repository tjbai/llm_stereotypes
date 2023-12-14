import styles from "./styles.module.css";

export default function Description({
  text,
  query,
}: {
  text: string;
  query: string[];
}) {
  const highlightedWords = () => {
    console.log(`\\b(${query[0]} | ${query[1]})\\b`);
    return text
      .replace(
        new RegExp(`\\b(${query.slice(0, 10).join("|")})\\b`, "gi"),
        (match) => `<text style="font-weight; color:red">${match}</text>`
      )
      .replace(
        new RegExp(`\\b(${query.slice(10, 20).join("|")})\\b`, "gi"),
        (match) => `<text style="font-weight; color:darkorange">${match}</text>`
      );
  };

  return (
    <text
      className={styles.description}
      dangerouslySetInnerHTML={{ __html: highlightedWords() }}
    />
  );
}
