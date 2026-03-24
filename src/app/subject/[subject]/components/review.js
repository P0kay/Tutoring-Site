import StarEmpty from "../../../../../public/star-empty";
import StarFilled from "../../../../../public/star-filled";

function Review({ rating, name, comment }) {
    return (
        <article className="rounded-2xl border border-slate-200 bg-slate-100 p-5 shadow-sm">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                    <div className="text-sm font-semibold tracking-tight text-slate-900">
                        {name}
                    </div>
                    <div className="mt-2 flex items-center gap-1 text-slate-900">
                        {Array.from({ length: rating }).map((_, index) =>
                            <StarFilled key={`filled-${name}-${index}`} />
                        )}
                        {Array.from({ length: 5 - rating }).map((_, index) =>
                            <StarEmpty key={`empty-${name}-${index}`} />
                        )}
                    </div>
                </div>
                <div className="text-xs uppercase tracking-[0.2em] text-slate-400">
                    Verified review
                </div>
            </div>
            <p className="mt-4 text-sm leading-7 text-slate-600">{comment}</p>
        </article>
    );
}

export default Review;
