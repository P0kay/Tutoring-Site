export default function unflattenSubjects(subjectsRaw) {
    const subjects = subjectsRaw.reduce((acc, { uuid, level }) => {
        if (!acc[uuid]) acc[uuid] = [];
        acc[uuid].push(level);
        return acc;
    }, {});
    return subjects
}