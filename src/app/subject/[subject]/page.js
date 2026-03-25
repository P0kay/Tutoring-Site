'use client'

import { use, useEffect, useState } from "react"
import { usePathname, useSearchParams } from "next/navigation"
import UserIcon from "./components/user-icon"
import Link from "next/link"
import TutorProfile from "./components/tutor-profile"

function SubjectPanel({ params }) {
  const { subject } = use(params)
  const formattedSubject = `${subject[0].toUpperCase()}${subject.slice(1)}`
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [onlineTutors, setOnlineTutors] = useState([])
  const [loadingTutors, setLoadingTutors] = useState(true)
  const [tutorsError, setTutorsError] = useState(null)

  useEffect(() => {
    let cancelled = false

    async function loadTutors() {
      try {
        setLoadingTutors(true)
        setTutorsError(null)

        const res = await fetch(`/api/user/get-online-tutors?subject=${subject}`, {
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
  }, [subject])

  function getTutorHref(tutorKey) {
    const params = new URLSearchParams(searchParams.toString())
    params.set('tutor', tutorKey)

    return `${pathname}?${params.toString()}`
  }

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
              {loadingTutors && (
                <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-500">
                  Loading tutors...
                </div>
              )}

              {tutorsError && (
                <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                  {tutorsError}
                </div>
              )}

              {onlineTutors.map((tutor) => (
                <Link href={getTutorHref(tutor.uuid)} key={tutor.uuid}>
                  <UserIcon
                    name={`${tutor.first_name} ${tutor.last_name}`}
                    subtitle={"Sigma"}
                    online={tutor.is_online}
                    width={8}
                    height={8}
                  />
                </Link>
              ))}
            </div>
          </aside>
          <TutorProfile />
        </div>
      </section>
    </div>
  )
}

export default SubjectPanel
