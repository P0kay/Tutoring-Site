'use client'

import { use, useEffect, useState } from "react"
import Review from "./components/review"
import UserIcon from "./components/user-icon"

function SubjectPanel({ params }) {
  const { subject } = use(params)
  const formattedSubject = `${subject[0].toUpperCase()}${subject.slice(1)}`

  const [onlineTutors, setOnlineTutors] = useState([])
  const [loadingTutors, setLoadingTutors] = useState(true)
  const [tutorsError, setTutorsError] = useState(null)

  useEffect(() => {
    let cancelled = false

    async function loadTutors() {
      try {
        setLoadingTutors(true)
        setTutorsError(null)

        const res = await fetch('/api/user/get-online-tutors', {
          method: 'GET',
          credentials: 'include',
          cache: 'no-store',
        })
        if (!res.ok) {
          throw new Error('Failed to load tutors')
        }

        const data = await res.json()

        if (!cancelled) {
          setOnlineTutors(data.onlineTutors ?? [])
        }
      } catch (err) {
        if (!cancelled) {
          setTutorsError(err.message)
        }
      } finally {
        if (!cancelled) {
          setLoadingTutors(false)
        }
      }
    }

    loadTutors()
    return () => {
      cancelled = true
    }
  }, [])

  const reviews = [
    {
      rating: 5,
      name: "Jakub",
      comment:
        "Lessons are precise, calm, and very well structured. Difficult topics are broken into steps that are easy to follow, and every meeting feels purposeful.",
    },
    {
      rating: 4,
      name: "Zuzanna",
      comment:
        "Great pacing and very clear explanations. The materials are tidy and the atmosphere is focused without feeling stressful.",
    },
    {
      rating: 2,
      name: "Szymon",
      comment:
        "Helpful overall, though I would have liked more practice exercises between meetings.",
    },
    {
      rating: 5,
      name: "Harold",
      comment:
        "Strong subject knowledge and a professional approach. The lessons felt tailored to my level instead of generic.",
    },
  ]

  return (
    <div className="min-h-full w-full bg-linear-to-b from-white via-slate-50 to-white">
      <section className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-10 lg:px-8">
        <div className="rounded-4xl border border-slate-200 bg-white px-6 py-8 shadow-sm sm:px-8 sm:py-10">
          <h1 className="text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
            {formattedSubject}
          </h1>
        </div>

        <div className="grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
          <aside className="rounded-4xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div>
                <h2 className="text-lg font-semibold tracking-tight text-slate-950">Tutors online</h2>
                <p className="mt-1 text-sm text-slate-500">Ready to start a lesson now</p>
              </div>
              <div className="rounded-full border border-slate-200 px-3 py-1 text-xs font-medium text-slate-600">
                {onlineTutors.length} active
              </div>
            </div>

            <div className="mt-5 flex flex-col gap-3">
              {onlineTutors.map((tutor) => (
                <UserIcon
                  key={tutor.name}
                  name={`${tutor.first_name} ${tutor.last_name}`}
                  subtitle={"Sigma"}
                  online={tutor.is_online}
                  width={8}
                  height={8}
                />
              ))}
            </div>
          </aside>

          <section className="flex flex-col gap-6">
            <div className="rounded-4xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
              <div className="flex flex-col gap-5 border-b border-slate-200 pb-6 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
                  <img
                    src="/blank_profile_picture.png"
                    alt="Blank profile picture"
                    className="rounded-full object-cover border border-slate-200 bg-slate-100 h-48 w-48"
                  />
                  <figcaption className="min-w-0">
                    <div className="truncate text-sm font-semibold tracking-tight text-slate-900">Jakub Kornodor</div>
                    <div className="mt-1 text-xs text-slate-500">PhD in Mathematics</div>
                  </figcaption>
                </div>
                {/* <div className="flex flex-wrap gap-2 text-sm text-slate-600">
                  <div className="rounded-full border border-slate-200 px-3 py-1">12 years experience</div>
                  <div className="rounded-full border border-slate-200 px-3 py-1">1:1 classes</div>
                  <div className="rounded-full border border-slate-200 px-3 py-1">Online</div>
                </div> */}
              </div>

              <div className="grid gap-6 pt-6 md:grid-cols-[minmax(0,1.3fr)_minmax(260px,0.7fr)]">
                <div>
                  <h2 className="text-xl font-semibold tracking-tight text-slate-950">About this tutor</h2>
                  <p className="mt-4 text-sm leading-7 text-slate-600 sm:text-base">
                    Lessons are designed around clarity, structure, and measurable progress. Each session focuses on one concrete goal, with time for guided practice and questions.
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
                <div className="text-sm text-slate-400">{reviews.length} reviews</div>
              </div>

              <div className="mt-6 flex flex-col gap-4">
                {reviews.map((opinion) => (
                  <Review
                    key={`${opinion.name}-${opinion.rating}`}
                    rating={opinion.rating}
                    name={opinion.name}
                    comment={opinion.comment}
                  />
                ))}
              </div>
            </div>
          </section>
        </div>
      </section>
    </div>
  )
}

export default SubjectPanel
