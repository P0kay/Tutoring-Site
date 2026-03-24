import Subject from "./components/subject";
import { getSql } from "./lib/db";

export default async function Home() {
  const sql = getSql()
  const subjects = await sql.query(
    `
        SELECT
          key
        FROM
          subjects
        `
  );
  return (
    <div className="flex flex-wrap justify-center gap-8 max-w-[90%] w-300 py-10">
      {subjects.map(subject =>
        <Subject key={subject.key}
          subject_name={subject.key} />
      )}
    </div>
  );
}
