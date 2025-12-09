function Subject({ subject_name }) {
    return (
        <div className={`subject-component w-48 h-48 border-3 border-black rounded-md flex justify-center items-center bg-cover text-2xl`} style={{
            backgroundImage: `url(/${subject_name.toLowerCase()}.png)`
        }}>
            <span className="text-white font-bold"
                style={{
                    WebkitTextStroke: "1px black"
                }}>
                {subject_name}
            </span>
        </div>
    );
}

export default Subject;