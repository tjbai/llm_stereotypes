"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./styles.module.css";

export default function Navigator() {
  const [race, setRace] = useState<Race>("");
  const [gender, setGender] = useState<Gender>("");
  const router = useRouter();

  const handleNav = () => {
    if (!race && !gender) return;
    let url = "/report?";
    if (race) url += `r=${race}`;
    if (gender) url += `&g=${gender}`;
    router.push(url);
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
        {["Man", "Woman", "Nonbinary"].map((g) => (
          <option key={g} value={g}>
            {g}
          </option>
        ))}
        Gender persona
      </select>
      <button onClick={handleNav}>Go</button>
    </div>
  );
}
