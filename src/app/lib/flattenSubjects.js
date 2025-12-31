export default function flattenSubjects(userUuid, subjects) {
    const rows = [];
    for (const [subject_id, levels] of Object.entries(subjects)) {
        for (const level of levels) {
            rows.push([userUuid, subject_id, level]);
        }
    }

    return rows;
}