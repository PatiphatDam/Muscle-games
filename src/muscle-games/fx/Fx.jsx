import { createContext, useContext, useMemo, useRef, useState } from 'react';
import { isMuted, play, setMuted, vibrate } from './sound.js';

// Game juice shared by every game: confetti, floating points, sound, vibration and Dukki's speech.
const ApiContext = createContext(null);
const StateContext = createContext(null);

export const CONFETTI = ['#14b8a6', '#f472b6', '#fbbf24', '#34d399', '#60a5fa', '#fb7185'];
export const GOLD = ['#fbbf24', '#f59e0b', '#fde68a', '#fff7cc'];
export const ICE = ['#7dd3fc', '#bae6fd', '#e0f2fe', '#a5b4fc'];

export function FxProvider({ children }) {
  const [items, setItems] = useState([]);
  const [speech, setSpeech] = useState({ text: '', mood: 'idle', id: 0 });
  const [muted, setMutedState] = useState(isMuted);
  const seq = useRef(0);

  const api = useMemo(() => {
    const add = (item, life) => {
      const id = ++seq.current;
      setItems((list) => [...list, { ...item, id }]);
      setTimeout(() => setItems((list) => list.filter((i) => i.id !== id)), life);
    };
    return {
      burst(x, y, count = 16, palette = CONFETTI) {
        const bits = Array.from({ length: count }, (_, k) => ({
          dx: (Math.random() - 0.5) * 260,
          dy: -40 - Math.random() * 180,
          rot: Math.random() * 720 - 360,
          color: palette[k % palette.length],
          round: Math.random() < 0.4,
        }));
        add({ kind: 'burst', x, y, bits }, 1100);
      },
      float(x, y, text, tone = 'good') {
        add({ kind: 'float', x, y, text, tone }, 1000);
      },
      centerOf(target) {
        const el = typeof target === 'string' ? document.querySelector(target) : target;
        if (!el) return { x: window.innerWidth / 2, y: window.innerHeight / 2 };
        const r = el.getBoundingClientRect();
        return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
      },
      say(text, mood = 'happy') {
        setSpeech((s) => ({ text, mood, id: s.id + 1 }));
      },
      sound: play,
      vibrate,
      setMuted(value) {
        setMuted(value);
        setMutedState(value);
      },
    };
  }, []);

  return (
    <ApiContext.Provider value={api}>
      <StateContext.Provider value={{ speech, muted }}>
        {children}
        <div className="mg-fx-layer" aria-hidden="true">
          {items.map((it) =>
            it.kind === 'float' ? (
              <span key={it.id} className={`mg-fx-float mg-fx-float--${it.tone}`} style={{ left: it.x, top: it.y }}>
                {it.text}
              </span>
            ) : (
              <span key={it.id} className="mg-fx-burst" style={{ left: it.x, top: it.y }}>
                {it.bits.map((b, k) => (
                  <i
                    key={k}
                    style={{
                      '--dx': `${b.dx}px`,
                      '--dy': `${b.dy}px`,
                      '--rot': `${b.rot}deg`,
                      background: b.color,
                      borderRadius: b.round ? '50%' : '2px',
                    }}
                  />
                ))}
              </span>
            )
          )}
        </div>
      </StateContext.Provider>
    </ApiContext.Provider>
  );
}

export const useFx = () => useContext(ApiContext);
export const useFxState = () => useContext(StateContext);
export const pick = (list) => list[Math.floor(Math.random() * list.length)];

/* ---------- Dukki, the little skeleton mascot ---------- */

// Mint "night" palette: a dark sea-green silhouette with glowing bones.
const HALO = 'hsl(165 28% 28%)';
const BONE = 'hsl(165 30% 94%)';
const EYE = 'hsl(165 25% 22%)';
const BLUSH = '#c98aa2';
// Joints the limbs rotate around (styles.css rotates .mg-dukki__arm / __leg per mood).
const SHOULDER = { l: [39, 87], r: [81, 87] };
const HIP = { l: [51, 121], r: [69, 121] };

const MOUTHS = {
  idle: 'M52 67 Q60 73 68 67',
  happy: 'M51 66 Q60 75 69 66',
  sad: 'M52 72 Q60 65 68 72',
};

const Bone = ({ x1, y1, x2, y2, w }) => <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={BONE} strokeWidth={w} strokeLinecap="round" />;

// One arm or leg: a straight bone hanging down from its joint, with its own bit of silhouette so it moves as one piece.
function Limb({ part, side, joint: [x, y], length }) {
  return (
    <g className={`mg-dukki__${part} mg-dukki__${part}--${side}`} style={{ transformOrigin: `${x}px ${y}px` }}>
      <line x1={x} y1={y} x2={x} y2={y + length} stroke={HALO} strokeWidth="14" strokeLinecap="round" />
      <Bone x1={x} y1={y + 2} x2={x} y2={y + length} w="4.5" />
      <circle cx={x - 2.6} cy={y + length} r="2.8" fill={BONE} />
      <circle cx={x + 2.6} cy={y + length} r="2.8" fill={BONE} />
      <circle cx={x} cy={y} r="3.4" fill={BONE} />
    </g>
  );
}

export function Dukki({ mood = 'idle', className = '', ...svgProps }) {
  const wow = mood === 'wow';
  const sad = mood === 'sad';
  const eyeY = sad ? 52 : 50;
  const eye = { rx: wow ? 11 : 9.5, ry: wow ? 12 : sad ? 8.5 : 10.5 };
  return (
    <svg viewBox="-6 0 132 150" className={`mg-dukki mg-dukki--${mood} ${className}`} aria-hidden="true" {...svgProps}>
      <g className="mg-dukki__body">
        <path
          d="M60 8 C28 8 14 32 16 56 C17 71 27 79 35 83 L36 116 C36 123 41 126 49 126 L71 126 C79 126 84 123 84 116 L85 83 C93 79 103 71 104 56 C106 32 92 8 60 8Z"
          fill={HALO}
        />
        <Limb part="leg" side="l" joint={HIP.l} length={17} />
        <Limb part="leg" side="r" joint={HIP.r} length={17} />
        <Bone x1={57} y1={85} x2={SHOULDER.l[0]} y2={SHOULDER.l[1]} w="4" />
        <Bone x1={63} y1={85} x2={SHOULDER.r[0]} y2={SHOULDER.r[1]} w="4" />
        {[92, 100, 108].map((y, k) => (
          <g key={y}>
            <Bone x1={57} y1={y} x2={42 + k * 2} y2={y + 3} w="5.5" />
            <Bone x1={63} y1={y} x2={78 - k * 2} y2={y + 3} w="5.5" />
          </g>
        ))}
        <rect x="56.5" y="83" width="7" height="34" rx="3.5" fill={BONE} />
        <path d="M48 117 Q60 128 72 117" fill="none" stroke={BONE} strokeWidth="7" strokeLinecap="round" />
        <Limb part="arm" side="l" joint={SHOULDER.l} length={19} />
        <Limb part="arm" side="r" joint={SHOULDER.r} length={19} />
        <g className="mg-dukki__head">
          <path d="M60 16 C34 16 22 34 23 52 C24 66 34 72 44 74 L44 80 Q60 88 76 80 L76 74 C86 72 96 66 97 52 C98 34 86 16 60 16Z" fill={BONE} />
          <ellipse cx="45" cy={eyeY} {...eye} fill={EYE} />
          <ellipse cx="75" cy={eyeY} {...eye} fill={EYE} />
          {!sad && (
            <>
              <circle cx="48" cy={eyeY - 4} r="2.6" fill="#fff" opacity=".9" />
              <circle cx="78" cy={eyeY - 4} r="2.6" fill="#fff" opacity=".9" />
            </>
          )}
          {sad && <path d="M37 37 l12 5 M83 37 l-12 5" stroke={EYE} strokeWidth="2.5" strokeLinecap="round" />}
          <ellipse cx="60" cy="61" rx="3" ry="2.4" fill={EYE} opacity=".55" />
          <ellipse cx="34" cy="64" rx="6.5" ry="3.6" fill={BLUSH} opacity=".7" />
          <ellipse cx="86" cy="64" rx="6.5" ry="3.6" fill={BLUSH} opacity=".7" />
          {wow ? (
            <ellipse cx="60" cy="69" rx="4.5" ry="5.5" fill={EYE} />
          ) : (
            <path d={MOUTHS[mood] ?? MOUTHS.idle} stroke={EYE} strokeWidth="3" fill="none" strokeLinecap="round" />
          )}
        </g>
      </g>
    </svg>
  );
}

export function MascotBar({ fallback }) {
  const { speech } = useFxState();
  return (
    <div className="mg-mascot-bar">
      <Dukki key={`m${speech.id}`} mood={speech.mood} className="mg-mascot-bar__mascot" />
      <p key={`b${speech.id}`} className="mg-mascot-bar__bubble" role="status" aria-live="polite">
        {speech.text || fallback}
      </p>
    </div>
  );
}
