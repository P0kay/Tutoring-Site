import { notFound } from "next/navigation";

const SUBJECT_DATA = {
  chemia: {
    title: "CHEMIA",
    topicsBySchoolType: {
      primary: ["Atomy i cząsteczki", "Reakcje chemiczne", "Roztwory"],
      hs_base: ["Wiązania chemiczne", "Kwasy i zasady", "Sole"],
      hs_ext: ["Stechiometria", "Równowaga", "Kinetyka"],
    },
  },
  matematyka: {
    title: "MATEMATYKA",
    topicsBySchoolType: {
      primary: ["Ułamki", "Równania", "Geometria – pola i obwody"],
      hs_base: ["Funkcje", "Trygonometria", "Geometria analityczna"],
      hs_ext: ["Granice", "Pochodne", "Całki"],
    },
  },
  geografia: {
    title: "GEOGRAFIA",
    topicsBySchoolType: {
      primary: ["Mapa i skala", "Klimaty", "Kontynenty"],
      hs_base: ["Ludność", "Gospodarka", "Rzeźba terenu"],
      hs_ext: ["Geopolityka", "Globalizacja", "Rozwój"],
    },
  },
};

export default async function BlogPostPage({ params }) {
    const { subject } = await params
    const data = SUBJECT_DATA[subject];

    if (!data) notFound();

    return (
        <div className="mx-auto max-w-4xl px-4 py-10">
            <h1 className="text-center text-3xl font-bold tracking-tight">
                {data.title}
            </h1>

            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {Object.entries(data.topicsBySchoolType).map(([schoolType, topics]) => (
                    <div
                        key={schoolType}
                        className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm transition hover:shadow-md"
                    >
                        <div className="mb-3 flex items-center justify-between">
                            <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-700">
                                {schoolType}
                            </h2>
                            <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-600">
                                {topics.length}
                            </span>
                        </div>

                        <ul className="space-y-2 text-sm text-zinc-800">
                            {topics.map((topic) => (
                                <li key={topic} className="flex gap-2">
                                    <span className="mt-2 h-1.5 w-1.5 flex-none rounded-full bg-zinc-400" />
                                    <span>{topic}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </div>
    );
}