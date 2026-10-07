"use client";

import { useState } from "react";
import { LOCATIONS, VIBES, nextHalfHour, type Vibe } from "@/lib/sessions";

export type NewSession = { course: string; location: string; vibe: Vibe; startTime: string };

type Errors = Partial<Record<"course" | "location" | "customLocation" | "vibe" | "startTime", string>>;

const inputClass =
  "w-full rounded-2xl border border-line bg-paper px-4 py-3 text-base outline-none transition placeholder:text-muted/60 focus:border-brand focus:ring-4 focus:ring-brand/10";

export default function CreateForm({ onCreate, onCancel }: { onCreate: (s: NewSession) => void; onCancel: () => void }) {
  const [course, setCourse] = useState("");
  const [location, setLocation] = useState("");
  const [customLocation, setCustomLocation] = useState("");
  const [vibe, setVibe] = useState<Vibe | "">("");
  const [startTime, setStartTime] = useState(nextHalfHour);
  const [errors, setErrors] = useState<Errors>({});

  function validate(): Errors {
    const e: Errors = {};
    if (!course.trim()) e.course = "Enter a course or subject, like MAT 21B.";
    else if (course.trim().length > 30) e.course = "Keep it under 30 characters.";
    if (!location) e.location = "Pick a place to study.";
    if (location === "Other" && !customLocation.trim()) e.customLocation = "Tell people where to find you.";
    if (!vibe) e.vibe = "Choose a vibe.";
    if (!startTime) e.startTime = "Pick a start time.";
    return e;
  }

  function handleSubmit(ev: React.SyntheticEvent) {
    ev.preventDefault();
    const found = validate();
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    onCreate({
      course: course.trim().toUpperCase(),
      location: location === "Other" ? customLocation.trim() : location,
      vibe: vibe as Vibe,
      startTime,
    });

    // Reset the form for next time.
    setCourse("");
    setLocation("");
    setCustomLocation("");
    setVibe("");
    setStartTime(nextHalfHour());
  }

  const err = (msg?: string) => (msg ? <p className="mt-1.5 text-sm font-medium text-red-600">{msg}</p> : null);

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="bg-card p-6 sm:p-8"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Start a Study Spot</h2>
          <p className="mt-1 text-muted">Tell people where to find you.</p>
        </div>
        <button
          type="button"
          onClick={onCancel}
          aria-label="Close"
          className="-mr-2 -mt-2 grid size-9 shrink-0 place-items-center rounded-full text-xl text-muted transition hover:bg-paper hover:text-ink focus-visible:outline-2 focus-visible:outline-brand"
        >
          ×
        </button>
      </div>

      <div className="mt-6 space-y-5">
        <div>
          <label htmlFor="course" className="mb-1.5 block text-sm font-semibold">Course or subject</label>
          <input id="course" className={inputClass} placeholder="e.g. MAT 21B" value={course} onChange={(e) => setCourse(e.target.value)} />
          {err(errors.course)}
        </div>

        <div>
          <label htmlFor="location" className="mb-1.5 block text-sm font-semibold">Location</label>
          <select id="location" className={inputClass} value={location} onChange={(e) => setLocation(e.target.value)}>
            <option value="">Choose a spot</option>
            {LOCATIONS.map((l) => (
              <option key={l} value={l}>{l}</option>
            ))}
          </select>
          {err(errors.location)}
          {location === "Other" && (
            <>
              <input aria-label="Other location" className={`${inputClass} mt-2`} placeholder="Where exactly?" value={customLocation} onChange={(e) => setCustomLocation(e.target.value)} />
              {err(errors.customLocation)}
            </>
          )}
        </div>

        <fieldset>
          <legend className="mb-1.5 text-sm font-semibold">Study vibe</legend>
          <div className="grid grid-cols-3 gap-2">
            {VIBES.map((v) => (
              <button
                type="button"
                key={v.id}
                aria-pressed={vibe === v.id}
                onClick={() => setVibe(v.id)}
                className={`rounded-2xl border px-2 py-3 text-sm font-semibold transition active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand ${
                  vibe === v.id ? "border-brand bg-brand/10 text-brand" : "border-line bg-paper hover:border-ink/30"
                }`}
              >
                <span className="block text-lg">{v.emoji}</span>
                {v.label}
              </button>
            ))}
          </div>
          {err(errors.vibe)}
        </fieldset>

        <div>
          <label htmlFor="startTime" className="mb-1.5 block text-sm font-semibold">Start time</label>
          <input id="startTime" type="time" className={inputClass} value={startTime} onChange={(e) => setStartTime(e.target.value)} />
          {err(errors.startTime)}
        </div>
      </div>

      <button
        type="submit"
        className="mt-7 w-full rounded-full bg-brand px-6 py-3.5 text-base font-semibold text-white shadow-[0_6px_18px_rgba(65,54,245,0.3)] transition hover:bg-brand-dark active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
      >
        Create Study Spot
      </button>
    </form>
  );
}
