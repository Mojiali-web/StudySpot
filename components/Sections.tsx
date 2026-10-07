import { StoryPanel, VibeArt } from "@/components/illustrations";
import { VIBES } from "@/lib/sessions";

// Static story sections below the feed. No state, so this is a plain server component.

const STEPS = [
  { title: "See who's studying", body: "Browse live study spots around campus." },
  { title: "Pick your vibe", body: "Locked In, Casual, or Social." },
  { title: "Show up", body: "Join a session and study together." },
];

const PAIN_POINTS = [
  { title: "Spontaneity", body: "Study plans often happen at the last minute." },
  { title: "Fragmentation", body: "Friends, class group chats, Discords and clubs live in different places." },
  { title: "Social friction", body: "Asking people one by one \u201Cwant to study?\u201D takes more effort than making yourself joinable." },
];

function Flow({ steps, tone }: { steps: string[]; tone: "old" | "new" }) {
  return (
    <ol className="flex flex-wrap items-center gap-2">
      {steps.map((step, i) => (
        <li key={step} className="flex items-center gap-2">
          <span
            className={`rounded-full px-4 py-2 text-sm font-semibold ${
              tone === "new" ? "bg-brand text-white" : "bg-paper text-muted"
            }`}
          >
            {step}
          </span>
          {i < steps.length - 1 && <span className={tone === "new" ? "text-brand" : "text-muted"} aria-hidden>→</span>}
        </li>
      ))}
    </ol>
  );
}

export function WhySection() {
  return (
    <section id="why" className="mt-20 scroll-mt-6">
      <p className="text-sm font-semibold text-muted">Built for students at UC Davis</p>
      <h2 className="mt-2 max-w-3xl text-3xl font-extrabold tracking-tighter sm:text-5xl">
        Studying shouldn&apos;t require making plans three days in advance.
      </h2>
      <p className="mt-3 max-w-2xl text-lg text-muted">
        StudySpot turns &ldquo;I&apos;m heading to the library&rdquo; into an open invitation.
      </p>

      {/* The whole product in three pictures */}
      <div className="mt-10 grid items-center gap-2 md:grid-cols-[1fr_auto_1fr_auto_1fr]">
        {([["Studying alone", "Texting around"], ["StudySpot", "See what's nearby"], ["Together", "Same table"]] as const).map(([title, sub], i) => (
          <div key={title} className="contents">
            {i > 0 && <span className="hidden text-2xl text-muted md:block" aria-hidden>→</span>}
            <figure className="rounded-3xl border border-line bg-card p-3 text-center">
              <StoryPanel step={i as 0 | 1 | 2} className="mx-auto w-full max-w-[17rem]" />
              <figcaption className="pb-2 pt-1 font-bold leading-tight">{title}<span className="block text-sm font-normal text-muted">{sub}</span></figcaption>
            </figure>
          </div>
        ))}
      </div>

      <ol className="mt-4 grid gap-4 md:grid-cols-3">
        {STEPS.map((s, i) => (
          <li key={s.title} className="rounded-3xl border border-line bg-card p-6">
            <span className="grid size-10 place-items-center rounded-full bg-brand text-lg font-extrabold text-white">{i + 1}</span>
            <h3 className="mt-4 text-xl font-bold tracking-tight">{s.title}</h3>
            <p className="mt-1 text-muted">{s.body}</p>
            {i === 1 && (
              <div className="mt-3 flex gap-2">
                {VIBES.map((v) => (
                  <VibeArt key={v.id} vibe={v.id} className="h-14 w-auto" />
                ))}
              </div>
            )}
          </li>
        ))}
      </ol>
    </section>
  );
}

export function NeedSection() {
  return (
    <section className="-mx-5 mt-20 bg-sand px-5 py-14 sm:rounded-[2rem] sm:mx-0 sm:px-10">
      <h2 className="text-3xl font-extrabold tracking-tighter sm:text-4xl">Why this needs to exist</h2>
      <p className="mt-2 max-w-2xl text-muted">
        Campus is full of students who end up studying alone anyway. Here&apos;s what gets in the way.
      </p>

      <ul className="mt-8 grid gap-4 md:grid-cols-3">
        {PAIN_POINTS.map((p) => (
          <li key={p.title} className="rounded-3xl bg-card p-6 shadow-[0_2px_12px_rgba(60,40,10,0.05)]">
            <h3 className="text-lg font-bold">{p.title}</h3>
            <p className="mt-1 text-muted">{p.body}</p>
          </li>
        ))}
      </ul>

      <div className="mt-8 space-y-5 rounded-3xl bg-card p-6 sm:p-8">
        <div>
          <p className="mb-2 text-sm font-semibold text-muted">Today</p>
          <Flow tone="old" steps={["Text friends", "Wait for replies", "Coordinate", "Decide where to meet"]} />
        </div>
        <div>
          <p className="mb-2 text-sm font-semibold">With StudySpot</p>
          <Flow tone="new" steps={["Open", "Join", "Study"]} />
        </div>
      </div>
    </section>
  );
}

export function ClosingSection({ onStart }: { onStart?: () => void }) {
  return (
    <section className="mt-20 rounded-[2rem] bg-ink px-6 py-14 text-white sm:px-12">
      <h2 className="max-w-3xl text-3xl font-extrabold tracking-tighter sm:text-5xl">
        From &ldquo;anyone studying?&rdquo; to studying together.
      </h2>
      <p className="mt-4 max-w-xl text-lg text-white/70">
        StudySpot is built around spontaneous campus behavior, not scheduled study groups.
      </p>
      <ul className="mt-6 space-y-1 text-lg font-semibold">
        <li>No complicated planning.</li>
        <li>No awkward mass texts.</li>
        <li>Just see who&apos;s around and join.</li>
      </ul>
      {onStart && (
        <button
          onClick={onStart}
          className="mt-8 rounded-full bg-white px-6 py-3 font-semibold text-ink transition hover:-translate-y-0.5 active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          + Start a Study Spot
        </button>
      )}
    </section>
  );
}
