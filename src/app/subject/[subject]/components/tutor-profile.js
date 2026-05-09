'use client'

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

function TutorProfile() {
    const searchParams = useSearchParams()
    const tutorUuid = searchParams.get("tutor")
    const [tutor, setTutor] = useState(null)
    const [tutorPrice, setTutorPrice] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    useEffect(() => {
        let cancelled = false

        async function loadTutorProfile() {
            if (!tutorUuid) {
                setTutor(null)
                setError(null)
                setLoading(false)
                return
            }

            try {
                setLoading(true)
                setError(null)

                const res = await fetch(
                    `/api/user/get-tutor-profile?tutor=${encodeURIComponent(tutorUuid)}`,
                    {
                        method: 'GET',
                        credentials: 'include',
                        cache: 'no-store',
                    }
                )

                let data = await res.json()
                if (!res.ok) {
                    throw new Error(data.message || 'Failed to load tutor profile')
                }

                if (!cancelled) {
                    setTutor(data.tutor ?? null)
                }

                const res2 = await fetch(
                    `/api/user/get-tutor-price?tutor=${encodeURIComponent(tutorUuid)}`,
                    {
                        method: 'GET',
                        credentials: 'include',
                        cache: 'no-store',
                    }
                )

                data = await res2.json()
                if (!res2.ok) {
                    throw new Error(data.message || 'Failed to load tutor prices')
                }
                if (!cancelled) {
                    setTutorPrice(data.tutorPrice ?? null)
                }

            } catch (err) {
                if (!cancelled) {
                    setTutor(null)
                    setTutorPrice(null)
                    setError(err.message)
                }
            } finally {
                if (!cancelled) {
                    setLoading(false)
                }
            }
        }

        loadTutorProfile()

        return () => {
            cancelled = true
        }
    }, [tutorUuid])

    if (!tutorUuid) {
        return (
            <section className="flex flex-col gap-6">
                <div className="rounded-4xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                    <h2 className="text-xl font-semibold tracking-tight text-slate-950">Choose a tutor</h2>
                    <p className="mt-4 text-sm leading-7 text-slate-600 sm:text-base">
                        Select a tutor from the list on the left to load their profile.
                    </p>
                </div>
            </section>
        );
    }

    if (loading) {
        return (
            <section className="flex flex-col gap-6">
                <div className="rounded-4xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                    <h2 className="text-xl font-semibold tracking-tight text-slate-950">Loading tutor profile</h2>
                    <p className="mt-4 text-sm leading-7 text-slate-600 sm:text-base">
                        Checking the database and loading the selected tutor.
                    </p>
                </div>
            </section>
        );
    }

    if (error || !tutor) {
        return (
            <section className="flex flex-col gap-6">
                <div className="rounded-4xl border border-rose-200 bg-rose-50 p-6 shadow-sm sm:p-8">
                    <h2 className="text-xl font-semibold tracking-tight text-rose-950">Tutor not found</h2>
                    <p className="mt-4 text-sm leading-7 text-rose-700 sm:text-base">
                        {error || 'The selected tutor does not exist for this subject.'}
                    </p>
                </div>
            </section>
        );
    }

    return (
        <section className="flex flex-col gap-6">
            <div className="rounded-4xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                <div className="flex flex-col gap-5 border-b border-slate-200 pb-6 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-4">
                        <img
                            src="/blank_profile_picture.png"
                            alt={tutor.first_name ? `${tutor.first_name} ${tutor.last_name} profile picture` : "Blank profile picture"}
                            className="rounded-full object-cover border border-slate-200 bg-slate-100 h-48 w-48"
                        />
                        <figcaption className="min-w-0">
                            <div className="truncate text-sm font-semibold tracking-tight text-slate-900">
                                {`${tutor.first_name ?? ''} ${tutor.last_name ?? ''}`.trim()}
                            </div>
                            <div className="mt-1 text-xs text-slate-500">
                                {tutor.education || "Tutor"}
                            </div>
                        </figcaption>
                    </div>
                    <div className="rounded-full border border-slate-200 px-3 py-1 text-xs font-medium text-slate-600">
                        {tutor.is_online ? "Online now" : "Offline"}
                    </div>
                </div>
                {tutorPrice && tutorPrice.length > 0 && (
                    <div className="flex flex-col gap-4 mt-4">
                        <h3 className="text-lg font-semibold text-slate-900">Price</h3>
                        {console.log(tutorPrice)}
                        <div className="grid gap-3">
                            {Object.entries(
                                tutorPrice.reduce((acc, { key, price, level }) => {
                                    if (!acc[key]) acc[key] = {};
                                    acc[key][level] = price;
                                    return acc;
                                }, {})
                            ).map(([subject, levels]) => (
                                <div key={subject} className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                                    <h4 className="font-medium text-slate-900">{subject}</h4>
                                    <div className="mt-2 grid gap-2 sm:grid-cols-2">
                                        {Object.entries(levels).map(([level, price]) => (
                                            <div key={level} className="flex items-center justify-between rounded-md bg-white px-3 py-2 shadow-sm">
                                                <span className="text-sm font-medium text-slate-700 capitalize">{level}</span>
                                                <span className="text-sm font-semibold text-slate-900">{price} zł/h</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className="grid gap-6 pt-6 md:grid-cols-[minmax(0,1.3fr)_minmax(260px,0.7fr)]">
                    <div>
                        <h2 className="text-xl font-semibold tracking-tight text-slate-950">About this tutor</h2>
                        <p className="mt-4 text-sm leading-7 text-slate-600 sm:text-base">
                            {tutor.bio || "This tutor has not added a bio yet."}
                        </p>
                    </div>
                </div>
            </div>

            <div className="rounded-4xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                <div className="flex flex-col gap-2 border-b border-slate-200 pb-5 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <h2 className="text-xl font-semibold tracking-tight text-slate-950">Student opinions</h2>
                        <p className="mt-1 text-sm text-slate-500">Recent feedback from learners</p>
                    </div>
                    {/* <div className="text-sm text-slate-400">{reviews.length} reviews</div> */}
                </div>

                <div className="mt-6 flex flex-col gap-4">
                    {/* {reviews.map((opinion) => (
                        <Review
                            key={`${opinion.name}-${opinion.rating}`}
                            rating={opinion.rating}
                            name={opinion.name}
                            comment={opinion.comment}
                        />
                    ))} */}
                </div>
            </div>
        </section>
    );
}

export default TutorProfile;
