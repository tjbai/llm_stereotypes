import Description from "./Description";
import styles from "./styles.module.css";
import Image from "next/image";

export default function Gallery({
  images,
  descriptions,
  query,
}: {
  images: any[];
  descriptions: string[];
  query: string[];
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
          <Description text={descriptions[index][0]} query={query} />
        </div>
      ))}
    </div>
  );
}
