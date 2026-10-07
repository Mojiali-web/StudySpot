import { describePeople, formatTime, getVibe, type Session } from "@/lib/sessions";

// Each vibe gets its own color: a top accent bar, a chip, and a hover tint.
const VIBE_STYLES = {
  "locked-in": { bar: "bg-indigo-500", chip: "bg-indigo-100 text-indigo-800" },
  casual: { bar: "bg-amber-400", chip: "bg-amber-100 text-amber-800" },
  social: { bar: "bg-rose-400", chip: "bg-rose-100 text-rose-800" },
} as const;

const AVATAR_COLORS = ["bg-sky-200", "bg-orange-200", "bg-emerald-200", "bg-fuchsia-200", "bg-lime-200"];
const colorFor = (letter: string) => AVATAR_COLORS[letter.charCodeAt(0) % AVATAR_COLORS.length];

type Props = {
  session: Session;
  joined: boolean;
  isNew: boolean; // plays the "pop in" animation
  justJoined: boolean; // plays the "bump" animation after joining
  onJoin: (id: string) => void;
};

// Overlapping initial circles: the host, then you (if you joined), then neutral dots.
function Avatars({ session, joined }: { session: Session; joined: boolean }) {
  const hostIsYou = session.mine || !session.host || session.host === "You";
  const known = [hostIsYou ? "Y" : session.host![0].toUpperCase()];
  if (joined && !hostIsYou) known.push("Y");
  const shown = Math.min(session.students, 3);
  const circles = Array.from({ length: shown }, (_, i) => known[i] ?? "");
  const extra = session.students - shown;
  return (
    <div className="flex -space-x-2" aria-hidden>
      {circles.map((letter, i) => (
        <span
          key={i}
          className={`grid size-9 place-items-center rounded-full border-2 border-card text-sm font-bold text-ink/70 ${
            letter ? colorFor(letter) : "bg-line"
          }`}
        >
          {letter}
        </span>
      ))}
      {extra > 0 && (
        <span className="grid size-9 place-items-center rounded-full border-2 border-card bg-paper text-xs font-bold text-muted">
          +{extra}
        </span>
      )}
    </div>
  );
}

export default function SessionCard({ session, joined, isNew, justJoined, onJoin }: Props) {
  const vibe = getVibe(session.vibe);
  const style = VIBE_STYLES[session.vibe];
  const hostLabel = session.mine || session.host === "You" || !session.host ? "you" : session.host;

  return (
    <li
      className={`relative overflow-hidden rounded-3xl border bg-card p-5 pt-6 shadow-[0_2px_12px_rgba(60,40,10,0.06)] transition duration-200 hover:-translate-y-1 hover:shadow-[0_12px_30px_rgba(60,40,10,0.13)] ${
        joined ? "border-emerald-300" : "border-line"
      } ${isNew ? "animate-pop-in" : ""}`}
    >
      <span className={`absolute inset-x-0 top-0 h-1.5 ${style.bar}`} aria-hidden />

      <div className="flex items-center justify-between gap-3">
        <span className={`rounded-full px-3 py-1 text-sm font-semibold ${style.chip}`}>
          {vibe.emoji} {vibe.label}
        </span>
        <span className="text-sm font-bold">{formatTime(session.startTime)}</span>
      </div>

      <h3 className="mt-4 text-3xl font-extrabold tracking-tight">{session.course}</h3>
      <p className="mt-1 text-sm text-muted">
        Hosted by {hostLabel}
        {session.id.startsWith("seed-") && <span className="ml-2 rounded-full bg-sand px-2 py-0.5 text-xs">sample</span>}
      </p>
      <p className="mt-3 font-medium">📍 {session.location}</p>

      <div className="mt-5 flex items-center justify-between gap-3 border-t border-line pt-4">
        <div className="flex min-w-0 items-center gap-3">
          <Avatars session={session} joined={joined} />
          <div className="min-w-0 text-sm leading-tight">
            <p className="font-bold">
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
              ? `cursor-default bg-emerald-100 text-emerald-800 ${justJoined ? "animate-bump" : ""}`
              : "bg-brand text-white hover:bg-brand-dark hover:shadow-[0_6px_16px_rgba(65,54,245,0.35)]"
          }`}
        >
          {joined ? "Joined ✓" : "Join →"}
        </button>
      </div>
    </li>
  );
}
