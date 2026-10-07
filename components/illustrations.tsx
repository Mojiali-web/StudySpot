// StudySpot's illustration system: tiny hand-drawn-style students built from SVG.
// Every scene reuses <Student>, so the whole product shares one look.
import type { ReactNode } from "react";
import type { Vibe } from "@/lib/sessions";

const INK = "#2b2540";
const SKINS = ["#f6d3b3", "#e0a979", "#b97a50", "#8a5a3b", "#fbdcc4"];
const HAND = `"Segoe Print", "Bradley Hand", "Marker Felt", "Comic Sans MS", cursive`;

// Palette: lavender = Locked In, yellow/orange = Casual, mint/coral = Social.
const C = { lav: "#b9a7f5", lavSoft: "#e3dcff", yellow: "#ffd36e", orange: "#ffa564", mint: "#8fdcc0", mintSoft: "#d4f3e8", coral: "#ff9a8a", paper: "#fff7e8" };

// Mounted once in the layout: the wobble filter that makes outlines look hand-drawn.
export function IllustrationDefs() {
  return (
    <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden focusable="false">
      <filter id="wobble" x="-5%" y="-5%" width="110%" height="110%">
        <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="2" seed="4" result="n" />
        <feDisplacementMap in="SourceGraphic" in2="n" scale="3.2" />
      </filter>
    </svg>
  );
}

/* ---------- the student ---------- */

type Hair = "short" | "bun" | "curly" | "long" | "beanie" | "buzz";
type Pose = "laptop" | "write" | "coffee" | "wave" | "look" | "phone";
type StudentProps = {
  x: number; y: number; hoodie: string;
  skin?: number; hair?: Hair; hairColor?: string; pose?: Pose; phones?: boolean; s?: number;
};

const ARM_L = { d: "M-26 -40 Q-36 -14 -16 -8", hand: [-16, -8] };
const ARM_R: Record<Pose, { d: string; hand: number[] }> = {
  laptop: { d: "M26 -40 Q36 -14 16 -8", hand: [16, -8] },
  write: { d: "M26 -40 Q36 -14 16 -8", hand: [16, -8] },
  look: { d: "M26 -40 Q36 -14 16 -8", hand: [16, -8] },
  coffee: { d: "M26 -40 Q42 -36 32 -24", hand: [32, -24] },
  phone: { d: "M26 -40 Q42 -38 34 -26", hand: [34, -26] },
  wave: { d: "M26 -42 Q48 -48 44 -72", hand: [44, -76] },
};

function Arm({ d, hand, hoodie, skin }: { d: string; hand: number[]; hoodie: string; skin: string }) {
  return (
    <g>
      <path d={d} fill="none" stroke={INK} strokeWidth={15} />
      <path d={d} fill="none" stroke={hoodie} strokeWidth={10} />
      <circle cx={hand[0]} cy={hand[1]} r={5.5} fill={skin} />
    </g>
  );
}

const hairBack = (h: Hair, c: string) =>
  h === "long" ? <path d="M-18 -3 Q-23 20 -15 26 L-9 26 L-9 -3Z M18 -3 Q23 20 15 26 L9 26 L9 -3Z" fill={c} /> :
  h === "bun" ? <circle cx={0} cy={-24} r={7} fill={c} /> : null;

const cap = (c: string) => <path d="M-17 -3 Q-19 -22 0 -21 Q19 -22 17 -3 Q9 -12 -2 -11 Q-11 -10 -17 -3Z" fill={c} />;
const hairFront = (h: Hair, c: string) => {
  if (h === "curly")
    return (
      <g fill={c}>
        <circle cx={-12} cy={-12} r={7} /><circle cx={0} cy={-18} r={8} /><circle cx={12} cy={-12} r={7} />
        <circle cx={-17} cy={-3} r={5} /><circle cx={17} cy={-3} r={5} />
      </g>
    );
  if (h === "beanie")
    return (
      <g>
        <path d="M-18 -4 Q-19 -27 0 -27 Q19 -27 18 -4Z" fill={c} />
        <rect x={-19} y={-9} width={38} height={7} rx={3} fill="#fff7e8" />
        <circle cx={0} cy={-29} r={4} fill="#fff7e8" />
      </g>
    );
  if (h === "buzz") return <path d="M-16 -5 Q-17 -19 0 -18 Q17 -19 16 -5 Q8 -12 0 -12 Q-8 -12 -16 -5Z" fill={c} opacity={0.85} />;
  return cap(c); // short, bun, long
};

// Origin is the table edge: the torso ends just below y=0 so a table drawn afterwards hides it.
export function Student({ x, y, hoodie, skin = 0, hair = "short", hairColor = "#3b2a22", pose = "look", phones, s = 1 }: StudentProps) {
  const sk = SKINS[skin];
  const down = pose === "laptop" || pose === "write";
  const eyes = down ? (
    <path d="M-9 0 q3 3 6 0 M3 0 q3 3 6 0" fill="none" strokeWidth={2} />
  ) : (
    <g fill={INK} stroke="none">
      <circle cx={pose === "look" ? -3 : -6} cy={-1} r={1.9} /><circle cx={pose === "look" ? 9 : 6} cy={-1} r={1.9} />
    </g>
  );
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <ellipse cx={0} cy={-50} rx={24} ry={9} fill={hoodie} />
      <path d="M-34 4 Q-38 -40 -20 -50 Q0 -56 20 -50 Q38 -40 34 4Z" fill={hoodie} />
      <path d="M-5 -45 v10 M5 -45 v10" strokeWidth={2} fill="none" />
      <Arm {...ARM_L} hoodie={hoodie} skin={sk} />
      <Arm {...ARM_R[pose]} hoodie={hoodie} skin={sk} />
      {pose === "coffee" && (
        <g>
          <rect x={33} y={-38} width={13} height={13} rx={3} fill={C.paper} />
          <path d="M46 -34 q5 0 4 4 q-1 3 -4 3" fill="none" />
          <circle cx={32} cy={-24} r={5.5} fill={sk} />
        </g>
      )}
      {pose === "phone" && <rect x={36} y={-46} width={10} height={18} rx={2.5} fill="#fff" />}
      {pose === "wave" && <path d="M54 -84 q4 -4 8 0 M55 -74 q5 0 9 3" fill="none" strokeWidth={2} />}
      <g transform={`translate(0 ${down ? -63 : -67})`}>
        {hairBack(hair, hairColor)}
        <circle r={17} fill={sk} />
        {hairFront(hair, hairColor)}
        {eyes}
        <path d="M-4 7 Q0 10 4 7" fill="none" strokeWidth={2} />
        <g fill="#f4a3a0" opacity={0.55} stroke="none"><circle cx={-11} cy={5} r={3} /><circle cx={11} cy={5} r={3} /></g>
        {phones && (
          <g>
            <path d="M-19 -2 Q-19 -26 0 -26 Q19 -26 19 -2" fill="none" strokeWidth={4} />
            <rect x={-23} y={-6} width={7} height={13} rx={3} fill={C.paper} />
            <rect x={16} y={-6} width={7} height={13} rx={3} fill={C.paper} />
          </g>
        )}
      </g>
    </g>
  );
}

/* ---------- props ---------- */

const Table = ({ x1, x2, y }: { x1: number; x2: number; y: number }) => (
  <g>
    <path d={`M${x1 + 22} ${y + 12} L${x1 + 16} ${y + 66} M${x2 - 22} ${y + 12} L${x2 - 16} ${y + 66}`} fill="none" strokeWidth={4} />
    <rect x={x1} y={y} width={x2 - x1} height={14} rx={7} fill="#f0d5ab" />
  </g>
);
const Laptop = ({ x, y, c }: { x: number; y: number; c: string }) => (
  <g>
    <rect x={x - 24} y={y - 30} width={48} height={30} rx={5} fill={c} />
    <circle cx={x + 7} cy={y - 15} r={5} fill={C.paper} strokeWidth={1.8} />
    <path d={`M${x - 16} ${y - 20} l6 5`} strokeWidth={1.8} />
  </g>
);
const Mug = ({ x, y }: { x: number; y: number }) => (
  <g>
    <rect x={x - 7} y={y - 14} width={14} height={14} rx={3} fill={C.paper} />
    <path d={`M${x + 7} ${y - 10} q6 0 5 5 q-1 4 -5 3`} fill="none" />
    <path d={`M${x - 2} ${y - 18} q-3 -4 0 -7`} fill="none" strokeWidth={1.6} />
  </g>
);
const Books = ({ x, y }: { x: number; y: number }) => (
  <g>
    <rect x={x - 18} y={y - 9} width={36} height={9} rx={2} fill={C.coral} />
    <rect x={x - 14} y={y - 18} width={32} height={9} rx={2} fill={C.mint} />
    <rect x={x - 16} y={y - 27} width={30} height={9} rx={2} fill={C.yellow} />
  </g>
);
const Notebook = ({ x, y }: { x: number; y: number }) => (
  <g>
    <path d={`M${x - 22} ${y} L${x + 22} ${y} L${x + 30} ${y - 8} L${x - 14} ${y - 8}Z`} fill="#fffaf0" />
    <path d={`M${x - 8} ${y - 4} h18 M${x - 4} ${y - 6.5} h14`} strokeWidth={1.4} fill="none" />
    <path d={`M${x + 22} ${y - 4} l14 -8`} strokeWidth={3} />
  </g>
);
const Backpack = ({ x, y, c }: { x: number; y: number; c: string }) => (
  <g>
    <rect x={x - 17} y={y - 42} width={34} height={42} rx={12} fill={c} />
    <rect x={x - 11} y={y - 20} width={22} height={14} rx={5} fill="none" />
    <path d={`M${x - 8} ${y - 42} q8 -12 16 0`} fill="none" />
  </g>
);
const Note = ({ x, y, text, rot = 0, c = C.yellow }: { x: number; y: number; text: string; rot?: number; c?: string }) => {
  const w = text.length * 7.2 + 18;
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot})`}>
      <rect x={-w / 2} y={-14} width={w} height={28} rx={4} fill={c} stroke={INK} strokeWidth={1.6} />
      <text textAnchor="middle" y={5} fontSize={14} fill={INK} fontFamily={HAND}>{text}</text>
    </g>
  );
};

// Shared wrapper: sets the line style and applies the wobble to everything inside.
function Scene({ viewBox, label, className, children, after }: { viewBox: string; label: string; className?: string; children: ReactNode; after?: ReactNode }) {
  return (
    <svg viewBox={viewBox} role="img" aria-label={label} className={className}>
      <g filter="url(#wobble)" stroke={INK} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">{children}</g>
      {after}
    </svg>
  );
}

/* ---------- scenes ---------- */

export function HeroScene({ className }: { className?: string }) {
  return (
    <Scene
      viewBox="10 52 520 308"
      className={className}
      label="Three students studying together around a table"
      after={
        <>
          <Note x={85} y={95} text="Shields?" rot={-8} />
          <Note x={440} y={75} text="ECN 100A" rot={6} c={C.mintSoft} />
          <Note x={62} y={185} text="locked in" rot={-4} c={C.lavSoft} />
          <Note x={470} y={165} text="come thru" rot={5} c="#ffd7cf" />
        </>
      }
    >
      <ellipse cx={270} cy={352} rx={235} ry={12} fill="#e8dfcf" stroke="none" />
      <Backpack x={52} y={350} c={C.yellow} />
      <Backpack x={492} y={350} c={C.lav} />
      <Student x={150} y={262} s={1.15} hoodie={C.lav} skin={2} hair="curly" hairColor="#2b2019" pose="laptop" phones />
      <Student x={270} y={262} s={1.15} hoodie={C.coral} skin={0} hair="bun" hairColor="#6b3f2a" pose="write" />
      <Student x={390} y={262} s={1.15} hoodie={C.mint} skin={3} hair="beanie" hairColor="#ffa564" pose="coffee" />
      <Table x1={70} x2={470} y={262} />
      <Laptop x={150} y={262} c="#d6cff7" />
      <Notebook x={262} y={262} />
      <Mug x={205} y={262} />
      <Books x={436} y={262} />
    </Scene>
  );
}

// Small vibe illustrations: lavender / yellow-orange / mint-coral.
export function VibeArt({ vibe, className }: { vibe: Vibe; className?: string }) {
  const label = { "locked-in": "Student locked in on a laptop", casual: "Two students studying with coffee", social: "Three students, one waving" }[vibe];
  return (
    <Scene viewBox="0 0 120 90" className={className} label={label}>
      {vibe === "locked-in" && (
        <>
          <circle cx={60} cy={44} r={40} fill={C.lavSoft} stroke="none" />
          <Student x={52} y={70} s={0.72} hoodie={C.lav} skin={1} hair="bun" hairColor="#2b2019" pose="laptop" phones />
          <Table x1={14} x2={106} y={70} />
          <Laptop x={52} y={70} c="#d6cff7" />
          <Books x={90} y={70} />
        </>
      )}
      {vibe === "casual" && (
        <>
          <circle cx={60} cy={44} r={40} fill="#ffeab8" stroke="none" />
          <Student x={36} y={70} s={0.62} hoodie={C.yellow} skin={4} hair="short" hairColor="#7a4a2a" pose="coffee" />
          <Student x={84} y={70} s={0.62} hoodie={C.orange} skin={3} hair="curly" hairColor="#2b2019" pose="laptop" />
          <Table x1={10} x2={110} y={70} />
          <Laptop x={84} y={70} c="#ffe1b0" />
          <Mug x={58} y={70} />
        </>
      )}
      {vibe === "social" && (
        <>
          <circle cx={60} cy={44} r={40} fill={C.mintSoft} stroke="none" />
          <Student x={24} y={74} s={0.52} hoodie={C.mint} skin={0} hair="long" hairColor="#3b2a22" pose="laptop" />
          <Student x={60} y={74} s={0.52} hoodie={C.coral} skin={2} hair="short" hairColor="#2b2019" pose="wave" />
          <Student x={96} y={74} s={0.52} hoodie={C.mint} skin={4} hair="buzz" hairColor="#8a5a3b" pose="look" />
          <Table x1={6} x2={114} y={74} />
          <path d="M72 10 h26 a5 5 0 0 1 5 5 v8 a5 5 0 0 1 -5 5 h-14 l-6 6 v-6 h-6 a5 5 0 0 1 -5 -5 v-8 a5 5 0 0 1 5 -5Z" fill="#fff" strokeWidth={1.8} />
        </>
      )}
    </Scene>
  );
}

export function EmptyScene({ className }: { className?: string }) {
  return (
    <Scene
      viewBox="0 0 300 190"
      className={className}
      label="A student sitting alone at a table while another peeks in"
      after={<Note x={70} y={44} text="anyone?" rot={-6} c={C.lavSoft} />}
    >
      <Student x={125} y={132} s={0.95} hoodie={C.lav} skin={4} hair="long" hairColor="#5a3a2a" pose="look" />
      <Table x1={50} x2={215} y={132} />
      <Mug x={90} y={132} />
      <Laptop x={160} y={132} c="#d6cff7" />
      {/* a friend peeking in from the right */}
      <g>
        <circle cx={262} cy={118} r={17} fill={SKINS[2]} />
        <circle cx={262} cy={104} r={9} fill="#2b2019" />
        <g fill={INK} stroke="none"><circle cx={255} cy={118} r={2} /><circle cx={266} cy={118} r={2} /></g>
        <path d="M257 127 Q261 130 266 127" fill="none" strokeWidth={2} />
        <rect x={238} y={132} width={62} height={56} rx={10} fill="#f3ecdf" />
        <circle cx={248} cy={133} r={5.5} fill={SKINS[2]} /><circle cx={277} cy={133} r={5.5} fill={SKINS[2]} />
      </g>
    </Scene>
  );
}

/* ---------- join celebration ---------- */

function Walker() {
  return (
    <Scene viewBox="-48 -100 96 132" className="h-16 w-auto" label="">
      <g className="leg"><path d="M-9 2 V26" strokeWidth={9} /><path d="M-9 2 V26" stroke="#6a78c4" strokeWidth={4} /><circle cx={-9} cy={28} r={4.5} fill="#fff" /></g>
      <g className="leg r"><path d="M9 2 V26" strokeWidth={9} /><path d="M9 2 V26" stroke="#6a78c4" strokeWidth={4} /><circle cx={9} cy={28} r={4.5} fill="#fff" /></g>
      <rect x={-46} y={-50} width={18} height={34} rx={7} fill={C.yellow} />
      <Student x={0} y={0} hoodie={C.coral} skin={3} hair="curly" hairColor="#2b2019" pose="wave" />
    </Scene>
  );
}

// A new friend walks up to the group, plus a few hand-drawn sparkles. Fades out by itself.
export function JoinCelebration() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-x-0 -top-[3.6rem] h-16 animate-celebrate">
      <div className="absolute bottom-0 left-0 animate-walk-in"><Walker /></div>
      <svg viewBox="0 0 90 50" className="absolute -bottom-3 left-0 h-9 animate-sparkle" fill="none" stroke="#ff9a8a" strokeWidth={3} strokeLinecap="round">
        <path d="M12 8 v10 M7 13 h10" /><path d="M48 4 l0 8 M44 8 h8" stroke="#4136f5" /><path d="M78 22 v9 M73.5 26.5 h9" stroke="#f0b400" />
      </svg>
    </div>
  );
}

/* ---------- Before / StudySpot / After story ---------- */

export function StoryPanel({ step, className }: { step: 0 | 1 | 2; className?: string }) {
  const labels = ["A student studying alone and texting", "A student spotting a nearby study spot on a phone", "Three students studying together"];
  return (
    <Scene viewBox="0 0 200 150" className={className} label={labels[step]}>
      <circle cx={100} cy={78} r={62} fill={["#f3ecdf", C.lavSoft, C.mintSoft][step]} stroke="none" />
      {step === 0 && (
        <>
          <Student x={62} y={128} s={0.9} hoodie={C.lav} skin={1} hair="long" hairColor="#2b2019" pose="phone" />
          <Table x1={14} x2={118} y={128} />
          <Books x={92} y={128} />
          <path d="M96 10 h92 a6 6 0 0 1 6 6 v16 a6 6 0 0 1 -6 6 h-70 l-8 8 v-8 h-14 a6 6 0 0 1 -6 -6 v-16 a6 6 0 0 1 6 -6Z" fill="#fff" strokeWidth={1.8} />
          <text x={142} y={29} textAnchor="middle" fontSize={10.5} fill={INK} stroke="none" fontFamily={HAND}>anyone at Shields?</text>
        </>
      )}
      {step === 1 && (
        <>
          <Student x={48} y={140} s={0.8} hoodie={C.lav} skin={1} hair="long" hairColor="#2b2019" pose="look" />
          <Table x1={4} x2={96} y={140} />
          <rect x={112} y={10} width={74} height={128} rx={13} fill="#fff" />
          <rect x={120} y={24} width={58} height={44} rx={7} fill={C.mintSoft} strokeWidth={1.6} />
          <text x={126} y={40} fontSize={9.5} fontWeight={700} fill={INK} stroke="none">ECN 100A</text>
          <path d="M126 48 h30" strokeWidth={1.6} /><path d="M126 55 h20" strokeWidth={1.6} />
          <rect x={150} y={52} width={22} height={11} rx={5.5} fill="#4136f5" strokeWidth={1.4} />
          <rect x={120} y={76} width={58} height={30} rx={7} fill="#ffeab8" strokeWidth={1.6} />
          <path d="M126 86 h28 M126 94 h18" strokeWidth={1.6} />
        </>
      )}
      {step === 2 && (
        <>
          <Student x={42} y={116} s={0.62} hoodie={C.lav} skin={1} hair="long" hairColor="#2b2019" pose="laptop" />
          <Student x={100} y={116} s={0.62} hoodie={C.coral} skin={0} hair="bun" hairColor="#6b3f2a" pose="coffee" />
          <Student x={158} y={116} s={0.62} hoodie={C.mint} skin={3} hair="curly" hairColor="#2b2019" pose="write" />
          <Table x1={8} x2={192} y={116} />
          <Laptop x={42} y={116} c="#d6cff7" /><Mug x={72} y={116} /><Notebook x={156} y={116} />
        </>
      )}
    </Scene>
  );
}
