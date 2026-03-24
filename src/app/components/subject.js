import Link from "next/link";

export default function Subject({ subject_name }) {
    return (
        <Link href={`/subject/${subject_name.toLowerCase()}`} className="block w-48 h-48">
            <div className={`subject-component w-48 h-48 border-2 border-slate-600 rounded-4xl flex justify-center items-center bg-cover text-2xl shadow-xl hover:-translate-y-1 hover:translate-x-1 duration-100`} style={{
                backgroundImage: `url(/${subject_name.toLowerCase()}.png)`
            }}>
                <span className="text-white font-bold"
                    style={{
                        WebkitTextStroke: "1px black"
                    }}>
                    {subject_name}
                </span>
            </div>
        </Link>
    );
}
