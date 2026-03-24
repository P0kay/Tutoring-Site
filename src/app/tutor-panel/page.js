'use client';

import { useEffect, useMemo, useState } from 'react';
import Forbidden from '../components/forbidden';
import Unauthorized from '../components/unauthorized';

const LEVEL_LABELS = {
  primary: 'Szkoła podstawowa',
  hs_base: 'Szkoła średnia (podstawa)',
  hs_ext: 'Szkoła średnia (rozszerzenie)',
};

export default function TutorPanel() {
  const [tutorSubjects, setTutorSubjects] = useState({});
  const [selectedTutorSubjects, setSelectedTutorSubjects] = useState({});

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errorStatus, setErrorStatus] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isOnline, setIsOnline] = useState(false)

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setErrorMessage(null);
      setErrorStatus(null);
      try {
        const online_res = await fetch('/api/tutor/get-online-status', { method: 'GET', credentials: 'include', cache: 'no-store' });
        if (!online_res.ok) {
          if (!cancelled) {
            setErrorMessage(online_res.statusText);
            setErrorStatus(online_res.status);
          }
          return;
        }
        const online_data = await online_res.json().catch(() => ({}));
        const isOnline = online_data.is_online;
        if (!cancelled) setIsOnline(Boolean(isOnline));
        else {
          setIsOnline(isOnline);
        }

        const res = await fetch('/api/tutor/get-tutor-subjects', {
          method: 'GET',
          credentials: 'include',
          cache: 'no-store'
        });
        if (!res.ok) {
          setErrorMessage(res.statusText || 'Failed to load tutor subjects')
          setErrorStatus(res.status);
          throw new Error(res.statusText || 'Failed to load tutor subjects');
        }
        const data = await res.json().catch(() => ({}));
        const options = data?.tutorSubjects ? data.tutorSubjects : {}

        if (!cancelled) {
          setTutorSubjects(options);
          setSelectedTutorSubjects(options);
        }
      } catch (err) {
        if (!cancelled) setErrorMessage(err.message || 'Something went wrong');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);
  const selectedForSend = useMemo(() => selectedTutorSubjects, [selectedTutorSubjects]);

  function handleSubjectLevelToggle(subjectUuid, level, checked) {
    setSelectedTutorSubjects((prev) => {
      const currentSubject = tutorSubjects[subjectUuid];
      if (!currentSubject) return prev;

      const currentLevels = prev[subjectUuid]?.levels || [];
      const hasLevel = currentLevels.includes(level);

      let nextLevels = currentLevels;
      if (checked && !hasLevel) {
        nextLevels = [...currentLevels, level];
      }
      if (!checked && hasLevel) {
        nextLevels = currentLevels.filter((lvl) => lvl !== level);
      }

      const next = { ...prev };
      if (nextLevels.length === 0) {
        delete next[subjectUuid];
      } else {
        next[subjectUuid] = {
          name: currentSubject.name,
          levels: nextLevels,
        };
      }
      return next;
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setErrorMessage(null);
    setErrorStatus(null)

    try {
      const res = await fetch('/api/tutor/go-online', {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subjects: selectedForSend }),
      });
      if (!res.ok) {
        setErrorMessage(res.statusText)
        setErrorStatus(res.status)
        throw new Error(res.statusText || 'Failed to go online');
      }
      setIsOnline(true)
    } catch (err) {
      setErrorMessage(err.message || 'Something went wrong');
    } finally {
      setSubmitting(false);
    }
  }
  async function goOffline() {
    try {
      const res = await fetch('/api/tutor/go-offline', { method: 'PATCH', credentials: 'include' });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.message || 'Failed to go offline');
      }
    } catch (err) {
      setErrorMessage(err.message || 'Something went wrong');
    }
    setIsOnline(false)
  }
  if (errorStatus === 403) return <Forbidden />
  if (errorStatus === 401) return <Unauthorized />
  if (loading) return <div className="p-6">Loading…</div>;
  if (errorMessage) return <div className="p-6 text-red-600">{errorMessage}</div>;
  if (isOnline) return (
    <section className='mt-8'>
      <p className='text-center'>
        You're online
      </p>
      <div className="flex flex-col gap-4 w-full max-w-sm bg-white p-6 rounded-2xl shadow-md">

        <button
          type="button"
          className="mt-2 rounded-lg bg-red-600 py-2 text-white font-medium hover:bg-red-700 transition p-4 cursor-pointer"
          onClick={goOffline}
        >
          GO OFFLINE
        </button>
      </div>
    </section>)
  return (
    <form onSubmit={handleSubmit} className="m-6 gap-8 flex flex-col">
      {Object.keys(tutorSubjects).length === 0 ? (
        <p className="text-gray-600">No subjects available.</p>
      ) : (
        <div className="flex flex-wrap gap-4">
          {Object.entries(tutorSubjects).map(([subjectUuid, subject]) => (
            <div key={subjectUuid} className="rounded-xl border p-4 w-72">
              <p className="font-semibold">{subject.name}</p>

              <div className="mt-2 space-y-2">
                {(subject.levels || []).map((lvl) => (
                  <label key={`${subjectUuid}-${lvl}`} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={(selectedTutorSubjects[subjectUuid]?.levels || []).includes(lvl)}
                      onChange={(e) => handleSubjectLevelToggle(subjectUuid, lvl, e.target.checked)}
                    />
                    <span className="text-sm text-gray-700">
                      {LEVEL_LABELS[lvl] || lvl}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="rounded-xl border bg-gray-50 p-4">
        <p className="font-semibold mb-2">Selected object (to send later)</p>
        <pre className="text-sm overflow-auto">{JSON.stringify(selectedForSend, null, 2)}</pre>
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="rounded-lg bg-green-600 p-3 text-white font-medium hover:bg-green-700 disabled:opacity-60 transition"
      >
        {submitting ? 'Going online…' : 'Go online'}
      </button>
    </form>
  );
}
