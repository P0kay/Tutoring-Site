export default function flattenSubjects(userUuid, subjects) {
    const rows = []
    const subjectsMap = subjects?.subjects ?? subjects ?? {};

    for (const [subject_id, subjectData] of Object.entries(subjectsMap)) {
        const levels = subjectData?.levels ?? [];
        for (const level of levels) {
            rows.push([userUuid, subject_id, level]);
        }
    }

    return rows;
}