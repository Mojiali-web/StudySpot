import { formatTime, getVibe, type Session } from "@/lib/sessions";

// Soft color per vibe so cards are scannable at a glance.
const VIBE_STYLES = {
  "locked-in": "bg-indigo-100 text-indigo-800",
  casual: "bg-amber-100 text-amber-800",
  social: "bg-rose-100 text-rose-800",
} as const;

type Props = {
  session: Session;
  joined: boolean;
  isNew: boolean; // plays the "pop in" animation
  justJoined: boolean; // plays the "bump" animation on the count
  onJoin: (id: string) => void;
};

export default function SessionCard({ session, joined, isNew, justJoined, onJoin }: Props) {
  const vibe = getVibe(session.vibe);

  return (
    <li
      className={`rounded-3xl border border-line bg-card p-5 shadow-[0_2px_12px_rgba(60,40,10,0.06)] ${
        isNew ? "animate-pop-in" : ""
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-xl font-bold tracking-tight">{session.course}</h3>
        <span className={`shrink-0 rounded-full px-3 py-1 text-sm font-semibold ${VIBE_STYLES[session.vibe]}`}>
          {vibe.emoji} {vibe.label}
        </span>
      </div>

      <p className="mt-1 text-muted">{session.location}</p>

      <div className="mt-5 flex items-center justify-between gap-3">
        <div className="text-sm text-muted">
          <p className="font-semibold text-ink">{formatTime(session.startTime)}</p>
          <p>
            <span key={session.students} className={`inline-block font-semibold text-ink ${justJoined ? "animate-bump" : ""}`}>
              {session.students}
            </span>{" "}
            {session.students === 1 ? "student" : "students"}
          </p>
        </div>

        <button
          onClick={() => onJoin(session.id)}
          disabled={joined}
          className={`rounded-full px-5 py-2.5 text-sm font-semibold transition active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand ${
            joined
              ? "cursor-default bg-emerald-100 text-emerald-800"
              : "bg-brand text-white hover:bg-brand-dark"
          }`}
        >
          {joined ? "Joined ✓" : "Join"}
        </button>
      </div>
    </li>
  );
}
