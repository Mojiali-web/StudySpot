"use client";

import { useEffect, useState } from "react";
import CreateForm, { type NewSession } from "@/components/CreateForm";
import SessionCard from "@/components/SessionCard";
import { VIBES, type Vibe } from "@/lib/sessions";
import { useStudyState } from "@/lib/useStudyState";

type Filter = "all" | Vibe;

export default function Home() {
  const { state, update, ready } = useStudyState();
  const [filter, setFilter] = useState<Filter>("all");
  const [newId, setNewId] = useState<string | null>(null); // card to animate in
  const [joinedNowId, setJoinedNowId] = useState<string | null>(null); // count to bump
  const [toast, setToast] = useState<string | null>(null);

  // Hide the toast after it finishes animating.
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2400);
    return () => clearTimeout(t);
  }, [toast]);

  function createSession(data: NewSession) {
    const id = crypto.randomUUID();
    // The creator is the first student, and counts as joined.
    update((s) => ({
      sessions: [{ id, ...data, students: 1 }, ...s.sessions],
      joinedIds: [...s.joinedIds, id],
    }));
    setFilter("all"); // make sure the new card is visible
    setNewId(id);
    setToast(`${data.course} is live — others can join now`);
  }

  function joinSession(id: string) {
    update((s) => {
      if (s.joinedIds.includes(id)) return s; // can't join twice
      return {
        sessions: s.sessions.map((x) => (x.id === id ? { ...x, students: x.students + 1 } : x)),
        joinedIds: [...s.joinedIds, id],
      };
    });
    setJoinedNowId(id);
    setToast("You're in. See you there!");
  }

  const totalStudents = state.sessions.reduce((sum, s) => sum + s.students, 0);
  const visible = state.sessions.filter((s) => filter === "all" || s.vibe === filter);

  const filters: { id: Filter; label: string }[] = [
    { id: "all", label: "All" },
    ...VIBES.map((v) => ({ id: v.id as Filter, label: v.label })),
  ];

  return (
    <main className="mx-auto max-w-2xl px-5 pb-24 pt-14 sm:pt-20">
      <header>
        <h1 className="text-5xl font-extrabold tracking-tighter sm:text-6xl">StudySpot.</h1>
        <p className="mt-3 text-xl text-muted">Find people studying what you&apos;re studying.</p>
      </header>

      <div className="mt-10">
        {ready ? (
          <CreateForm onCreate={createSession} />
        ) : (
          <div className="h-[34rem] rounded-3xl border border-line bg-card" aria-hidden />
        )}
      </div>

      <section className="mt-14" aria-labelledby="feed-title">
        <div className="flex items-end justify-between gap-4">
          <h2 id="feed-title" className="text-2xl font-bold tracking-tight">Happening around campus</h2>
          <p className="shrink-0 text-sm text-muted" aria-live="polite">
            <span key={totalStudents} className="inline-block animate-bump font-bold text-ink">{ready ? totalStudents : "–"}</span>{" "}
            studying now
          </p>
        </div>

        <div className="-mx-5 mt-5 flex gap-2 overflow-x-auto px-5 pb-1" role="group" aria-label="Filter by vibe">
          {filters.map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              aria-pressed={filter === f.id}
              className={`shrink-0 rounded-full border px-4 py-2 text-sm font-semibold transition active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand ${
                filter === f.id ? "border-ink bg-ink text-white" : "border-line bg-card hover:border-ink/30"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {!ready ? (
          <p className="mt-8 text-muted">Loading sessions…</p>
        ) : visible.length === 0 ? (
          <p className="mt-8 rounded-3xl border border-dashed border-line p-8 text-center text-muted">
            Nothing here yet. Create the first {filter === "all" ? "Study Spot" : "one"} above.
          </p>
        ) : (
          <ul className="mt-6 space-y-4">
            {visible.map((s) => (
              <SessionCard
                key={s.id}
                session={s}
                joined={state.joinedIds.includes(s.id)}
                isNew={s.id === newId}
                justJoined={s.id === joinedNowId}
                onJoin={joinSession}
              />
            ))}
          </ul>
        )}
      </section>

      <footer className="mt-16 text-center text-sm text-muted">
        An independent student project, not affiliated with or endorsed by UC Davis.
      </footer>

      {toast && (
        <div
          role="status"
          className="fixed bottom-6 left-1/2 z-10 max-w-[90vw] animate-toast rounded-full bg-ink px-5 py-3 text-sm font-semibold text-white shadow-lg"
        >
          {toast}
        </div>
      )}
    </main>
  );
}
