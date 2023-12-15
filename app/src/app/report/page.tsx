import { redirect } from "next/navigation";
import { isArray } from "util";
import { db } from "@/firestore/clientApp";
import { ref, child, get } from "firebase/database";
import Gallery from "@/lib/components/Report/Gallery";
import styles from "./styles.module.css";

const fetchReport = async (r: string | undefined, g: string | undefined) => {
  const dbRef = ref(db);
  let key = "";
  if (!r && !g) return null;
  else if (!r) key = g!.toLowerCase();
  else if (!g) key = r!.toLowerCase();
  else key = `${r!.toLowerCase()}_${g!.toLowerCase()}`;
  try {
    const snapshot = await get(child(dbRef, key));
    return snapshot.val();
  } catch (error) {
    return null;
  }
};

export default async function Report({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const { r, g } = searchParams;
  if (!r && !g) redirect("/");
  if (isArray(r) || isArray(g)) redirect("/");

  const report = await fetchReport(
    r as string | undefined,
    g as string | undefined
  );
  if (!report) {
    return <text>Oops! Could not fetch report.</text>;
  }

  return (
    <div className={styles.container}>
      <Gallery
        images={report["portraits"]}
        descriptions={report["top_personas"]}
        query={report["words"].map((x: string[]) => x[0])}
      />
    </div>
  );
}
