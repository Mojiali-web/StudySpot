// Shared types, constants, and starter data for StudySpot.

export const LOCATIONS = [
  "Shields Library",
  "Memorial Union",
  "Student Community Center",
  "ARC",
  "Silo",
  "Other",
] as const;

export const VIBES = [
  { id: "locked-in", label: "Locked In", emoji: "🔒" },
  { id: "casual", label: "Casual", emoji: "☕" },
  { id: "social", label: "Social", emoji: "👋" },
] as const;

export type Vibe = (typeof VIBES)[number]["id"];

export type Session = {
  id: string;
  course: string;
  location: string; // one of LOCATIONS, or custom text if "Other" was picked
  vibe: Vibe;
  startTime: string; // "HH:MM" in 24-hour format, as given by <input type="time">
  students: number;
  host?: string; // first name of whoever started it; "You" for sessions made here. Optional so older saved data still works.
};

// What we save in localStorage.
export type SavedState = {
  sessions: Session[];
  joinedIds: string[];
};

export const STORAGE_KEY = "studyspot:v1";

// Example sessions so the feed never looks empty on a first visit.
export const STARTER_SESSIONS: Session[] = [
  { id: "seed-1", course: "ECN 100A", location: "Shields Library", vibe: "locked-in", startTime: "14:00", students: 4, host: "Kelly" },
  { id: "seed-2", course: "MAT 21B", location: "Memorial Union", vibe: "casual", startTime: "15:30", students: 3, host: "Marcus" },
  { id: "seed-3", course: "ECS 36A", location: "Student Community Center", vibe: "social", startTime: "17:00", students: 3, host: "Priya" },
  { id: "seed-4", course: "BIS 2A", location: "Silo", vibe: "casual", startTime: "18:30", students: 2, host: "Jordan" },
];

export function getVibe(id: Vibe) {
  return VIBES.find((v) => v.id === id)!;
}

// "15:30" -> "3:30 PM"
export function formatTime(hhmm: string): string {
  const [h, m] = hhmm.split(":").map(Number);
  const suffix = h >= 12 ? "PM" : "AM";
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return `${hour12}:${String(m).padStart(2, "0")} ${suffix}`;
}

// Next half hour from now, as "HH:MM" — a friendly default for the form.
export function nextHalfHour(): string {
  const d = new Date();
  d.setMinutes(d.getMinutes() < 30 ? 30 : 60, 0, 0);
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

const plural = (n: number) => `${n} other${n === 1 ? "" : "s"}`;

// Natural copy for who's in a session, e.g. "Kelly + 2 others".
export function describePeople(session: Session, joined: boolean): string {
  const { host, students } = session;
  if (!host) return "Open to everyone";
  if (host === "You") return students <= 1 ? "Just you so far" : `You + ${plural(students - 1)}`;
  if (joined) return students <= 2 ? `${host} + you` : `${host}, you + ${plural(students - 2)}`;
  return students <= 1 ? host : `${host} + ${plural(students - 1)}`;
}
