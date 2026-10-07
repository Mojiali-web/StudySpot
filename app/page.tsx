"use client";

import { useEffect, useState } from "react";
import CreateForm, { type NewSession } from "@/components/CreateForm";
import Modal from "@/components/Modal";
import SessionCard from "@/components/SessionCard";
import { VIBES, type Vibe } from "@/lib/sessions";
import { useStudyState } from "@/lib/useStudyState";

type Filter = "all" | Vibe;

export default function Home() {
  const { state, update, ready } = useStudyState();
  const [filter, setFilter] = useState<Filter>("all");
  const [formOpen, setFormOpen] = useState(false);
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
      sessions: [{ id, ...data, students: 1, host: "You" }, ...s.sessions],
      joinedIds: [...s.joinedIds, id],
    }));
    setFormOpen(false);
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
    ...VIBES.map((v) => ({ id: v.id as Filter, label: `${v.emoji} ${v.label}` })),
  ];

  return (
    <main className="mx-auto max-w-5xl px-5 pb-24 pt-6 sm:pt-8">
      {/* Top bar: logo + the main call to action */}
      <div className="flex items-center justify-between gap-4">
        <p className="text-2xl font-extrabold tracking-tighter">StudySpot.</p>
        <button
          onClick={() => setFormOpen(true)}
          className="rounded-full bg-ink px-5 py-3 text-sm font-semibold text-white shadow-[0_6px_18px_rgba(22,22,42,0.25)] transition hover:-translate-y-0.5 hover:bg-brand active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
        >
          + Start a Study Spot
        </button>
      </div>

      {/* Hero: short and punchy so the feed stays above the fold */}
      <header className="mt-8 sm:mt-10">
        <h1 className="text-4xl font-extrabold tracking-tighter sm:text-6xl">Don&apos;t study alone.</h1>
        <p className="mt-2 text-lg text-muted sm:text-xl">See who&apos;s studying around campus and join them.</p>

        <p
          className="mt-4 inline-flex items-center gap-2.5 rounded-full border border-line bg-card/80 py-2 pl-3 pr-4 text-sm font-semibold shadow-sm"
          aria-live="polite"
        >
          <span className="relative flex size-2.5" aria-hidden>
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex size-2.5 rounded-full bg-emerald-500" />
          </span>
          <span>
            <span key={totalStudents} className="inline-block animate-bump">{ready ? totalStudents : "–"}</span>{" "}
            {totalStudents === 1 ? "student" : "students"} studying around campus right now
          </span>
        </p>
      </header>

      {/* The feed is the star of the page */}
      <section className="mt-8 sm:mt-10" aria-labelledby="feed-title">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 id="feed-title" className="text-2xl font-bold tracking-tight">Happening now</h2>

          <div className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-1 sm:mx-0 sm:px-0 sm:pb-0" role="group" aria-label="Filter by vibe">
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
        </div>

        {!ready ? (
          <p className="mt-8 text-muted">Loading sessions…</p>
        ) : visible.length === 0 ? (
          <div className="mt-6 rounded-3xl border border-dashed border-line p-8 text-center text-muted">
            <p>Nothing here yet.</p>
            <button onClick={() => setFormOpen(true)} className="mt-2 font-semibold text-brand hover:underline">
              Start the first one
            </button>
          </div>
        ) : (
          <ul className="mt-5 grid gap-4 sm:grid-cols-2">
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

      <Modal open={formOpen} onClose={() => setFormOpen(false)}>
        <CreateForm onCreate={createSession} onCancel={() => setFormOpen(false)} />
      </Modal>

      {toast && (
        <div
          role="status"
          className="fixed bottom-6 left-1/2 z-50 max-w-[90vw] animate-toast rounded-full bg-ink px-5 py-3 text-sm font-semibold text-white shadow-lg"
        >
          {toast}
        </div>
      )}
    </main>
  );
}
