import styles from "./styles.module.css";
import Image from "next/image";

export default function Gallery({
  images,
  descriptions,
}: {
  images: any[];
  descriptions: string[];
}) {
  return (
    <div className={styles.galleryContainer}>
      {Object.values(images).map((i, index) => (
        <div className={styles.imageContainer}>
          <Image
            alt=""
            height={400}
            width={400}
            src={`data:image/png;base64,${i}` as string}
          />
          <text className={styles.description}>{descriptions[index][0]}</text>
        </div>
      ))}
    </div>
  );
}
