import { describePeople, formatTime, getVibe, type Session } from "@/lib/sessions";

// Soft color per vibe so cards are scannable at a glance.
const VIBE_STYLES = {
  "locked-in": { chip: "bg-indigo-100 text-indigo-800", dot: "bg-indigo-400" },
  casual: { chip: "bg-amber-100 text-amber-800", dot: "bg-amber-400" },
  social: { chip: "bg-rose-100 text-rose-800", dot: "bg-rose-400" },
} as const;

const AVATAR_COLORS = ["bg-sky-200", "bg-orange-200", "bg-emerald-200", "bg-fuchsia-200"];

type Props = {
  session: Session;
  joined: boolean;
  isNew: boolean; // plays the "pop in" animation
  justJoined: boolean; // plays the "bump" animation on the count
  onJoin: (id: string) => void;
};

// Overlapping circles: the host's initial first, then simple dots for everyone else.
function Avatars({ session }: { session: Session }) {
  const shown = Math.min(session.students, 3);
  const extra = session.students - shown;
  const initial = session.host && session.host !== "You" ? session.host[0] : "★";
  return (
    <div className="flex -space-x-2" aria-hidden>
      {Array.from({ length: shown }, (_, i) => (
        <span
          key={i}
          className={`grid size-8 place-items-center rounded-full border-2 border-card text-xs font-bold text-ink/70 ${
            AVATAR_COLORS[(session.id.charCodeAt(session.id.length - 1) + i) % AVATAR_COLORS.length]
          }`}
        >
          {i === 0 ? initial : ""}
        </span>
      ))}
      {extra > 0 && (
        <span className="grid size-8 place-items-center rounded-full border-2 border-card bg-paper text-xs font-bold text-muted">
          +{extra}
        </span>
      )}
    </div>
  );
}

export default function SessionCard({ session, joined, isNew, justJoined, onJoin }: Props) {
  const vibe = getVibe(session.vibe);
  const style = VIBE_STYLES[session.vibe];

  return (
    <li
      className={`group rounded-3xl border border-line bg-card p-5 shadow-[0_2px_12px_rgba(60,40,10,0.06)] transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_10px_28px_rgba(60,40,10,0.12)] ${
        isNew ? "animate-pop-in" : ""
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        <span className={`rounded-full px-3 py-1 text-sm font-semibold ${style.chip}`}>
          {vibe.emoji} {vibe.label}
        </span>
        <span className="text-sm font-semibold text-ink">{formatTime(session.startTime)}</span>
      </div>

      <h3 className="mt-4 text-2xl font-extrabold tracking-tight">{session.course}</h3>
      <p className="mt-0.5 text-muted">📍 {session.location}</p>

      <div className="mt-5 flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <Avatars session={session} />
          <div className="min-w-0 text-sm leading-tight">
            <p className="font-bold text-ink">
              <span key={session.students} className={`inline-block ${justJoined ? "animate-bump" : ""}`}>
                {session.students}
              </span>{" "}
              studying
            </p>
            <p className="truncate text-muted">{describePeople(session, joined)}</p>
          </div>
        </div>

        <button
          onClick={() => onJoin(session.id)}
          disabled={joined}
          className={`shrink-0 rounded-full px-5 py-2.5 text-sm font-semibold transition active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand ${
            joined
              ? "cursor-default bg-emerald-100 text-emerald-800"
              : "bg-brand text-white hover:bg-brand-dark hover:shadow-[0_6px_16px_rgba(65,54,245,0.35)]"
          }`}
        >
          {joined ? "Joined ✓" : "Join"}
        </button>
      </div>
    </li>
  );
}
