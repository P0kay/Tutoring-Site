import Subject from "./components/subject";

export default function Home() {
  const SUBJECTS = ["CHEMIA", "MATEMATYKA", "ANGIELSKI", "BIOLOGIA", "FIZYKA", "POLSKI", "HISTORIA", "INFORMATYKA", "GEOGRAFIA"]
  return (
    <span className="flex gap-16 p-16 flex-wrap justify-center">
      {SUBJECTS.map(subject =>
        <Subject subject_name={subject} key={subject} />
      )}
    </span>
  );
}
