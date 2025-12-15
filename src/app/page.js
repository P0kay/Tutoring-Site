import Subject from "./components/subject";

export default function Home() {
  const SUBJECTS = [
    { label: "CHEMIA", slug: "chemia" },
    { label: "MATEMATYKA", slug: "matematyka" },
    { label: "ANGIELSKI", slug: "angielski" },
    { label: "BIOLOGIA", slug: "biologia" },
    { label: "FIZYKA", slug: "fizyka" },
    { label: "POLSKI", slug: "polski" },
    { label: "HISTORIA", slug: "historia" },
    { label: "INFORMATYKA", slug: "informatyka" },
    { label: "GEOGRAFIA", slug: "geografia" },
  ];

  return (
    <span className="flex gap-16 p-16 flex-wrap justify-center">
      {SUBJECTS.map(subject =>
        
         <Subject key={subject.slug} 
         subject_name={subject.label} 
         href={`/${subject.slug}`} />
        
      )}
    </span>
  );
}
