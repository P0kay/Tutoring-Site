export default function unflattenSubjects(subjectsRaw) {
    return subjectsRaw.reduce((acc, { uuid, key, level }) => {
        if (!acc[uuid]) acc[uuid] = { name: key, levels: [] };
        if (!acc[uuid].levels.includes(level)) acc[uuid].levels.push(level);
        return acc;
    }, {});
}