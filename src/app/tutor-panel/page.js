'use client';

import { useEffect, useMemo, useState } from 'react';

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
  const [error, setError] = useState(null);
  const [status, setStatus] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      setStatus(null);

      try {
        const res = await fetch('/api/tutor/get-tutor-subjects', {
          method: 'GET',
          credentials: 'include',
          cache: 'no-store',
        });

        const data = await res.json().catch(() => ({}));

        if (!res.ok) {
          throw new Error(data?.message || 'Failed to load tutor subjects');
        }

        const options = data?.tutorSubjects && typeof data.tutorSubjects === 'object'
          ? data.tutorSubjects
          : {};

        // Default selection: start checked exactly as returned by API
        // (if you want default empty, replace nextSelected with {})
        const nextSelected = {};
        for (const [subjectKey, levels] of Object.entries(options)) {
          nextSelected[subjectKey] = Array.isArray(levels) ? [...levels] : [];
        }

        if (!cancelled) {
          setTutorSubjects(options);
          setSelectedTutorSubjects(nextSelected);
        }
      } catch (err) {
        if (!cancelled) setError(err.message || 'Something went wrong');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  function isChecked(subjectKey, level) {
    return (selectedTutorSubjects[subjectKey] || []).includes(level);
  }

  function toggle(subjectKey, level) {
    setSelectedTutorSubjects((prev) => {
      const current = prev[subjectKey] || [];
      const exists = current.includes(level);

      const nextLevels = exists
        ? current.filter((l) => l !== level)
        : [...current, level];

      const next = { ...prev };

      // If none selected for subject, remove key (keeps object clean)
      if (nextLevels.length === 0) delete next[subjectKey];
      else next[subjectKey] = nextLevels;

      return next;
    });
  }

  const selectedForSend = useMemo(() => selectedTutorSubjects, [selectedTutorSubjects]);

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setStatus(null);

    try {
      const res = await fetch('/api/tutor/go-online', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subjects: selectedForSend }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data?.message || 'Failed to go online');
      }

      setStatus('You are now online!');
    } catch (err) {
      setError(err.message || 'Something went wrong');
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return <div className="p-6">Loading…</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;

  return (
    <form onSubmit={handleSubmit} className="m-6 gap-8 flex flex-col">
      {Object.keys(tutorSubjects).length === 0 ? (
        <p className="text-gray-600">No subjects available.</p>
      ) : (
        <div className="flex flex-wrap gap-4">
          {Object.entries(tutorSubjects).map(([subjectKey, levels]) => (
            <div key={subjectKey} className="rounded-xl border p-4 w-72">
              <p className="font-semibold">{subjectKey}</p>

              <div className="mt-2 space-y-2">
                {(levels || []).map((lvl) => (
                  <label key={`${subjectKey}-${lvl}`} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={isChecked(subjectKey, lvl)}
                      onChange={() => toggle(subjectKey, lvl)}
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

      {status && <p className="text-green-700">{status}</p>}

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
