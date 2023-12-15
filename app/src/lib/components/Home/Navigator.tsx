"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./styles.module.css";

export default function Navigator() {
  const [race, setRace] = useState<Race>("");
  const [gender, setGender] = useState<Gender>("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // so hacky
  const handleNav = () => {
    if (!race || !gender) {
      setError("Must select menu options!");
      return;
    }
    let url = "/report?";
    if (gender == "All") {
      if (race == "Latinx") url += `r=latino`;
      else url += `r=${race}`;
    } else {
      if (race == "Latinx" && gender == "Woman") {
        url += `r=latina`;
      } else if (race == "Latinx" && gender == "Man") {
        url += `r=latino`;
      } else if (race == "Latinx" && gender == "Nonbinary") {
        url += `r=latino&g=nonbinary`;
      } else {
        url += `r=${race}&g=${gender}`;
      }
    }
    setError("");
    setLoading(true);
    router.push(url);
    setTimeout(() => setLoading(false), 1000);
  };

  return (
    <div className={styles.container}>
      <select value={race} onChange={(e) => setRace(e.target.value as Race)}>
        <option value={""}>Select</option>
        {["Asian", "Latinx", "Middle-eastern", "Black"].map((r) => (
          <option key={r} value={r}>
            {r}
          </option>
        ))}
      </select>
      <select
        value={gender}
        onChange={(e) => setGender(e.target.value as Gender)}
      >
        <option value={""}>Select</option>
        {["All", "Man", "Woman", "Nonbinary"].map((g) => (
          <option key={g} value={g}>
            {g}
          </option>
        ))}
        Gender persona
      </select>
      <button onClick={handleNav}>Go</button>
      <text className={styles.error}>{error}</text>
      <text className={styles.loading}>{loading ? "Loading..." : ""}</text>
    </div>
  );
}
