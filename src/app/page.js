import Subject from "./components/subject";

export default function Home() {
  const SUBJECTS = ["CHEMIA", "MATEMATYKA", "ANGIELSKI", "BIOLOGIA", "FIZYKA", "POLSKI", "HISTORIA", "INFORMATYKA", "GEOGRAFIA"]
  return (
    <>
      {SUBJECTS.map(subject =>
        <Subject subject_name={subject} key={subject} />
      )}
    </>
  );
}
