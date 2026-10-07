"use client";

import { useEffect, useState } from "react";
import CreateForm, { type NewSession } from "@/components/CreateForm";
import Modal from "@/components/Modal";
import SessionCard from "@/components/SessionCard";
import { ClosingSection, NeedSection, WhySection } from "@/components/Sections";
import { VIBES, type Vibe } from "@/lib/sessions";
import { useStudyState } from "@/lib/useStudyState";

type Filter = "all" | Vibe;

const primaryBtn =
  "rounded-full bg-brand px-5 py-3 text-sm font-semibold text-white shadow-[0_6px_18px_rgba(65,54,245,0.3)] transition hover:-translate-y-0.5 hover:bg-brand-dark active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand";

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
      sessions: [{ id, ...data, students: 1, host: data.host ?? "You", mine: true }, ...s.sessions],
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
    <main className="mx-auto max-w-6xl px-5 pb-16 pt-6 sm:pt-8">
      {/* Top bar */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <p className="text-2xl font-extrabold tracking-tighter">StudySpot.</p>
          <span className="rounded-full border border-line bg-card px-2.5 py-0.5 text-xs font-semibold text-muted">MVP / prototype</span>
        </div>
        <button onClick={() => setFormOpen(true)} className={`${primaryBtn} hidden sm:block`}>
          + Start a Study Spot
        </button>
      </div>

      {/* Hero: text on the left, the three vibes on the right */}
      <header className="mt-10 grid gap-8 lg:grid-cols-[1.3fr_1fr] lg:items-end">
        <div>
          <h1 className="text-5xl font-extrabold leading-[0.95] tracking-tighter sm:text-7xl">Don&apos;t study alone.</h1>
          <p className="mt-4 max-w-lg text-lg text-muted sm:text-xl">See who&apos;s studying around campus and join them.</p>

          <p className="mt-5 inline-flex items-center gap-2.5 rounded-full border border-line bg-card py-2 pl-3 pr-4 text-sm font-semibold shadow-sm" aria-live="polite">
            <span className="relative flex size-2.5" aria-hidden>
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex size-2.5 rounded-full bg-emerald-500" />
            </span>
            <span>
              <span key={totalStudents} className="inline-block animate-bump">{ready ? totalStudents : "–"}</span>{" "}
              {totalStudents === 1 ? "student" : "students"} studying around campus right now
            </span>
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button onClick={() => setFormOpen(true)} className={`${primaryBtn} sm:hidden`}>+ Start a Study Spot</button>
            <a href="#happening-now" className="rounded-full border border-ink/15 bg-card px-5 py-3 text-sm font-semibold transition hover:-translate-y-0.5 hover:border-ink/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand">
              See who&apos;s studying ↓
            </a>
          </div>
        </div>

        <ul className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1" aria-label="Study vibes">
          {VIBES.map((v) => (
            <li key={v.id} className="flex items-center gap-3 rounded-2xl border border-line bg-card/80 px-4 py-3">
              <span className="text-2xl" aria-hidden>{v.emoji}</span>
              <div className="leading-tight">
                <p className="font-bold">{v.label}</p>
                <p className="text-sm text-muted">{v.tagline}</p>
              </div>
            </li>
          ))}
        </ul>
      </header>

      {/* The feed is the core of the product */}
      <section id="happening-now" className="mt-12 scroll-mt-6" aria-labelledby="feed-title">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 id="feed-title" className="text-3xl font-extrabold tracking-tighter">Happening now</h2>
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
          <p className="mt-8 text-muted">Loading study spots…</p>
        ) : visible.length === 0 ? (
          <div className="mt-6 rounded-3xl border border-dashed border-ink/20 bg-card/60 p-10 text-center">
            <p className="text-xl font-bold">No study spots here yet.</p>
            <p className="mt-1 text-muted">Maybe you should start one 👀</p>
            <button onClick={() => setFormOpen(true)} className={`${primaryBtn} mt-5`}>Start a Study Spot</button>
          </div>
        ) : (
          <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
        <p className="mt-4 text-sm text-muted">Sessions are saved in your browser only. Sample sessions use made-up names.</p>
      </section>

      <WhySection />
      <NeedSection />
      <ClosingSection onStart={() => setFormOpen(true)} />

      <footer className="mt-12 text-center text-sm text-muted">
        StudySpot is an independent student project, not affiliated with or endorsed by UC Davis.
      </footer>

      <Modal open={formOpen} onClose={() => setFormOpen(false)}>
        <CreateForm onCreate={createSession} onCancel={() => setFormOpen(false)} />
      </Modal>

      {toast && (
        <div role="status" className="fixed bottom-6 left-1/2 z-50 max-w-[90vw] animate-toast rounded-full bg-ink px-5 py-3 text-sm font-semibold text-white shadow-lg">
          {toast}
        </div>
      )}
    </main>
  );
}
