import Image from "next/image";
import Subject from "./components/subject";
import Link from "next/link";

export default function Home() {
  const SUBJECTS = ["CHEMIA","MATEMATYKA","ANGIELSKI","BIOLOGIA","FIZYKA","POLSKI","HISTORIA","INFORMATYKA","GEOGRAFIA"]
  return (
    <div className="layout">
      <header className="flex justify-end gap-8 p-8">
        <Link href='/signin' className="border-2 w-20 h-10 rounded-lg flex justify-center items-center">
          Sign In
        </Link>
        <Link href='/signup' className="border-2 w-20 h-10 rounded-lg flex justify-center items-center">
          Sign Up
        </Link>
      </header>
      <main className="flex gap-16 p-16 flex-wrap justify-center">
        {SUBJECTS.map(subject=>
          <Subject subject_name={subject} key={subject}/>
        )}
      </main>
    </div>
  );
}
