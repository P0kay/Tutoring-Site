function UserIcon({ name, online = false, width = 8, height = 8, subtitle }) {
    return (
        <figure className={`relative flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3 cursor-pointer`}>
            <div className="relative">
                <img
                    src="/blank_profile_picture.png"
                    alt={name ? `${name} profile picture` : "Blank profile picture"}
                    style={{ height: height * 4, width: width * 4 }}
                    className={`rounded-full object-cover border border-slate-200 bg-slate-100`}
                />
                {online && (
                    <div className="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-2 border-white bg-emerald-500"></div>
                )}
            </div>
            <figcaption className="min-w-0">
                {name && <div className="truncate text-sm font-semibold tracking-tight text-slate-900">{name}</div>}
                {subtitle && <div className="mt-1 text-xs text-slate-500">{subtitle}</div>}
            </figcaption>
        </figure>
    );
}

export default UserIcon;
