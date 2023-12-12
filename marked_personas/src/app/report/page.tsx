import { redirect } from "next/navigation";
import { isArray } from "util";

const fetchReport = async (r: string, g: string) => {
  return "";
};

export default async function Report({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const { r, g } = searchParams;
  if (!r && !g) redirect("/");
  if (isArray(r) || isArray(g)) redirect("/");

  const report = await fetchReport(r as string, g as string);
  if (!report) {
    return <text>Oops! Could not fetch report.</text>;
  }

  return (
    <div>
      <h1>
        {r} {g}
      </h1>
    </div>
  );
}
