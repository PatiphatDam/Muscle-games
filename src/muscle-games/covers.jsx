import { jigsawPath } from './fx/jigsaw.jsx';
import { AirshipShapes, WizardShapes } from './art.jsx';

// Animated cartoon scenes for the hub cards.
// Idle loops run all the time; ".is-preview" on the cover plays a short gameplay preview.

// Balloon Pop: the hooded sage close up, his orb glowing on the left, goblin balloons over the shadow castle.
// Preview: the orb turns red, a fireball flies to the near balloon, it bursts and "+30" floats up.
const BC_SKYLINE =
  'M0 46h320v24H0z M0 40h8v6H0z M16 40h8v6h-8z M300 40h8v6h-8z M284 40h8v6h-8z ' +
  'M20 46V22h20v24z M16 22L30 6l14 16z M60 46V16h30v30z M54 16L75 0l21 16z M120 46V6h40v40z M114 8l26-22 26 22z ' +
  'M178 46v-70h24v70z M172-24l18-32 18 32z M224 46V18h40v28z M218 18l26-20 26 20z M286 46V24h20v22z M282 24l14-16 14 16z';

export function BalloonScene() {
  return (
    <svg viewBox="0 0 320 200" className="mg-scene mg-bc" aria-hidden="true">
      <defs>
        <linearGradient id="bc-night" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="hsl(245 55% 12%)" />
          <stop offset=".6" stopColor="hsl(262 48% 24%)" />
          <stop offset="1" stopColor="hsl(285 40% 34%)" />
        </linearGradient>
        <radialGradient id="bc-orb">
          <stop offset="0" stopColor="#fff" stopOpacity=".95" />
          <stop offset=".35" stopColor="#ffd9a8" stopOpacity=".55" />
          <stop offset="1" stopColor="#ff8a3d" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="bc-red">
          <stop offset="0" stopColor="#fff2e0" />
          <stop offset=".3" stopColor="#ff5a3c" stopOpacity=".85" />
          <stop offset="1" stopColor="#e0322b" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="bc-fire">
          <stop offset="0" stopColor="#fff7d6" />
          <stop offset=".45" stopColor="#ffb020" />
          <stop offset="1" stopColor="#e0322b" />
        </radialGradient>
        <linearGradient id="bc-gold" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff3c4" />
          <stop offset=".45" stopColor="#f6c453" />
          <stop offset="1" stopColor="#b9771d" />
        </linearGradient>
        <linearGradient id="bc-fade" x1="0" y1="0" x2="0" y2="1">
          <stop offset=".6" stopColor="#0b0820" stopOpacity="0" />
          <stop offset="1" stopColor="#0b0820" stopOpacity=".6" />
        </linearGradient>
      </defs>
      <rect width="320" height="200" fill="url(#bc-night)" />
      <circle cx="300" cy="22" r="11" fill="#fde68a" opacity=".9" />
      <g fill="#fff">
        <circle cx="40" cy="22" r=".9" />
        <circle cx="170" cy="14" r="1.1" />
        <circle cx="250" cy="44" r=".8" />
        <circle cx="90" cy="60" r=".8" />
      </g>
      <g className="mg-sc-drift">
        <path d="M10 66q8-10 18-4q8-8 18 0q10-3 12 6z" fill="hsl(258 28% 40%)" opacity=".55" />
      </g>
      <path d={BC_SKYLINE} transform="translate(0 140)" fill="hsl(258 26% 20%)" opacity=".9" />
      <g className="mg-pv-pop">
        <g className="mg-sc-bob" style={{ '--color': '#2fb5a3', '--color-dark': '#1f8577' }}>
          <g transform="translate(208 16) scale(0.3167)">
            <AirshipShapes />
          </g>
        </g>
      </g>
      <g className="mg-sc-bob" style={{ animationDelay: '-1s', '--color': '#ec7fb0', '--color-dark': '#bf5285' }}>
        <g transform="translate(262 58) scale(0.25)">
          <AirshipShapes />
        </g>
      </g>
      <g className="mg-pv-confetti" style={{ transformOrigin: '227px 34px' }}>
        {Array.from({ length: 8 }, (_, k) => (
          <circle key={k} cx={227 + Math.cos(k * 0.79) * 14} cy={34 + Math.sin(k * 0.79) * 14} r="2.4" fill={['#ffb020', '#fbf1c7', '#2fb5a3', '#ff5a3c'][k % 4]} />
        ))}
      </g>
      <text className="mg-pv-score" x="244" y="20" fontFamily="'Cinzel Decorative', Georgia, serif" fontWeight="900" fontSize="12" fill="url(#bc-gold)" stroke="#3a2008" strokeWidth=".6">
        +30
      </text>
      {/* warm light from the orb, turning red when he casts */}
      <circle className="mg-bc-glow" cx="130" cy="72" r="70" fill="url(#bc-orb)" opacity=".75" />
      <circle className="mg-bc-redglow" cx="130" cy="72" r="70" fill="url(#bc-red)" />
      {/* the wizard, mirrored so the staff and orb sit on the left, cropped at the chest */}
      <g transform="translate(276 24) scale(-0.9 0.9)">
        <WizardShapes />
      </g>
      <g fill="#ffe1b0">
        <circle className="mg-bc-spark" cx="130" cy="72" r="1.6" style={{ '--dx': '-24px', '--dy': '-30px' }} />
        <circle className="mg-bc-spark" cx="130" cy="72" r="1.2" style={{ '--dx': '22px', '--dy': '-26px', animationDelay: '-0.8s' }} />
        <circle className="mg-bc-spark" cx="130" cy="72" r="1.4" style={{ '--dx': '-30px', '--dy': '8px', animationDelay: '-1.5s' }} />
      </g>
      <circle className="mg-bc-fire" cx="130" cy="72" r="5" fill="url(#bc-fire)" />
      <rect width="320" height="200" fill="url(#bc-fade)" />
      <text x="14" y="172" fontFamily="'Cinzel Decorative', Georgia, serif" fontWeight="900" fontSize="27" fill="url(#bc-gold)" stroke="#2a1606" strokeWidth="1.1" paintOrder="stroke">
        Balloon
      </text>
      <text x="16" y="192" fontFamily="'Cinzel Decorative', Georgia, serif" fontWeight="700" fontSize="15" letterSpacing="6" fill="url(#bc-gold)" stroke="#2a1606" strokeWidth=".9" paintOrder="stroke">
        POP
      </text>
    </svg>
  );
}

function MiniCard({ x, y, face }) {
  return (
    <g>
      <rect x={x} y={y} width="30" height="40" rx="5" fill="#fff" stroke="hsl(165 38% 70%)" strokeWidth="1.5" />
      {face === 'skeletal' && (
        <g>
          <rect x={x + 5} y={y + 13} width="20" height="12" rx="5" fill="#f9a8d4" />
          {[8, 12, 16, 20, 24].map((d) => (
            <line key={d} x1={x + d} y1={y + 14} x2={x + d} y2={y + 24} stroke="#be185d" strokeWidth="1.4" opacity=".5" />
          ))}
        </g>
      )}
      {face === 'text' && (
        <text x={x + 15} y={y + 24} textAnchor="middle" fontSize="7.5" fontWeight="700" fill="hsl(165 50% 20%)">
          Skeletal
        </text>
      )}
    </g>
  );
}

function CardBack({ x, y }) {
  return (
    <g>
      <rect x={x} y={y} width="30" height="40" rx="5" fill="hsl(165 52% 32%)" stroke="#fff" strokeWidth="2" />
      <text x={x + 15} y={y + 26} textAnchor="middle" fontSize="15" fontWeight="800" fill="hsl(165 34% 92%)">
        ?
      </text>
    </g>
  );
}

export function CardTableScene() {
  const backs = [
    [70, 46], [108, 46], [184, 46], [222, 46],
    [70, 96], [146, 96], [184, 96],
  ];
  return (
    <svg viewBox="0 0 320 200" className="mg-scene" aria-hidden="true">
      <defs>
        <linearGradient id="ct-bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="hsl(165 34% 92%)" />
          <stop offset="1" stopColor="hsl(165 38% 70%)" />
        </linearGradient>
      </defs>
      <rect width="320" height="200" fill="url(#ct-bg)" />
      <ellipse cx="160" cy="92" rx="148" ry="72" fill="hsl(165 50% 22%)" />
      <ellipse cx="160" cy="90" rx="138" ry="64" fill="hsl(165 52% 32%)" />
      <ellipse cx="160" cy="90" rx="120" ry="52" fill="none" stroke="hsl(195 55% 66%)" strokeWidth="1.5" strokeDasharray="4 5" opacity=".7" />
      {backs.map(([x, y], k) => (
        <g key={k} className="mg-sc-deal" style={{ animationDelay: `${k * 0.25}s` }}>
          <CardBack x={x} y={y} />
        </g>
      ))}
      {[
        [146, 46, 'skeletal'],
        [108, 96, 'text'],
        [222, 96, 'skeletal'],
      ].map(([x, y, face], k) => (
        <g key={k} className={k < 2 ? 'mg-pv-flipcard' : undefined}>
          <g className="mg-pv-back" style={{ transformOrigin: `${x + 15}px ${y + 20}px` }}>
            <CardBack x={x} y={y} />
          </g>
          <g className={k < 2 ? 'mg-pv-face' : 'mg-pv-face-static'} style={{ transformOrigin: `${x + 15}px ${y + 20}px` }}>
            <MiniCard x={x} y={y} face={face} />
          </g>
        </g>
      ))}
      <g className="mg-pv-sparkle">
        {[[150, 40], [180, 70], [100, 92], [140, 140]].map(([x, y], k) => (
          <path key={k} d={`M${x} ${y - 7} L${x + 2} ${y - 2} L${x + 7} ${y} L${x + 2} ${y + 2} L${x} ${y + 7} L${x - 2} ${y + 2} L${x - 7} ${y} L${x - 2} ${y - 2}Z`} fill="#fde68a" />
        ))}
      </g>
      <rect x="0" y="170" width="320" height="22" fill="hsl(165 45% 15%)" />
      <line x1="0" y1="181" x2="320" y2="181" stroke="hsl(165 52% 32%)" strokeWidth="14" strokeDasharray="10 8" className="mg-sc-belt" />
      {[0, 1, 2].map((k) => (
        <g key={k} className="mg-sc-convey" style={{ animationDelay: `${-k * 2}s` }}>
          <rect x="0" y="158" width="22" height="16" rx="3" fill="#fff" stroke="#f472b6" strokeWidth="1.5" />
        </g>
      ))}
    </svg>
  );
}

export function MicroscopeScene() {
  const fibers = [];
  for (let r = -3; r <= 3; r++) {
    for (let c = -3; c <= 3; c++) {
      const x = 120 + c * 17 + (r % 2 ? 8 : 0);
      const y = 100 + r * 15;
      if (Math.hypot(x - 120, y - 100) < 58) fibers.push([x, y]);
    }
  }
  const gap = jigsawPath(132, 92, 26, 26, { top: 1, right: -1, bottom: 1, left: -1 }, 7);
  const pieces = [
    { x: 236, y: 44, c: 'hsl(195 55% 66%)', e: { top: 1, right: -1, bottom: 1, left: 1 }, d: 0 },
    { x: 262, y: 100, c: '#fbbf24', e: { top: -1, right: 1, bottom: -1, left: 1 }, d: 0.8 },
  ];
  return (
    <svg viewBox="0 0 320 200" className="mg-scene" aria-hidden="true">
      <defs>
        <radialGradient id="ms-bg" cx=".3" cy=".3" r="1">
          <stop offset="0" stopColor="hsl(165 40% 96%)" />
          <stop offset="1" stopColor="hsl(165 38% 70%)" />
        </radialGradient>
        <clipPath id="ms-view">
          <circle cx="120" cy="100" r="66" />
        </clipPath>
      </defs>
      <rect width="320" height="200" fill="url(#ms-bg)" />
      {[[30, 30], [290, 170], [210, 20], [30, 175]].map(([x, y], k) => (
        <circle key={k} cx={x} cy={y} r={4 + k} fill="#fff" opacity=".6" className="mg-sc-twinkle" style={{ animationDelay: `${k * 0.5}s` }} />
      ))}
      <circle cx="120" cy="100" r="80" fill="hsl(165 40% 12%)" />
      <circle cx="120" cy="100" r="72" fill="hsl(165 50% 20%)" />
      <g clipPath="url(#ms-view)">
        <rect x="40" y="20" width="160" height="160" fill="hsl(38 55% 95%)" />
        <g className="mg-sc-breathe mg-pv-zoom" style={{ transformOrigin: '145px 105px' }}>
          {fibers.map(([x, y]) => (
            <circle key={`${x}-${y}`} cx={x} cy={y} r="7.5" fill="#f9a8d4" stroke="hsl(165 38% 70%)" strokeWidth="2" />
          ))}
          <circle cx="120" cy="100" r="58" fill="none" stroke="hsl(195 55% 66%)" strokeWidth="4" />
          <path d={gap} fill="hsl(38 55% 95%)" stroke="hsl(165 52% 32%)" strokeWidth="1.6" strokeDasharray="3 3" />
        </g>
        <line x1="120" y1="28" x2="120" y2="172" stroke="hsl(165 50% 20%)" strokeWidth=".8" opacity=".3" />
        <line x1="48" y1="100" x2="192" y2="100" stroke="hsl(165 50% 20%)" strokeWidth=".8" opacity=".3" />
      </g>
      {pieces.map((p, k) => (
        <g key={k} className="mg-sc-bob" style={{ animationDelay: `${p.d}s` }}>
          <path d={jigsawPath(p.x, p.y, 26, 26, p.e, 7)} fill={p.c} stroke="#fff" strokeWidth="2" />
        </g>
      ))}
      <g className="mg-pv-snap">
        <path d={jigsawPath(250, 150, 26, 26, { top: 1, right: -1, bottom: 1, left: -1 }, 7)} fill="#f472b6" stroke="#fff" strokeWidth="2" />
      </g>
      <g className="mg-pv-sparkle">
        {[[132, 84], [168, 120], [150, 74]].map(([x, y], k) => (
          <path key={k} d={`M${x} ${y - 7} L${x + 2} ${y - 2} L${x + 7} ${y} L${x + 2} ${y + 2} L${x} ${y + 7} L${x - 2} ${y + 2} L${x - 7} ${y} L${x - 2} ${y - 2}Z`} fill="#fde68a" />
        ))}
      </g>
      <g className="mg-sc-bob" style={{ animationDelay: '.4s' }}>
        <circle cx="262" cy="150" r="11" fill="hsl(195 60% 90%)" stroke="hsl(165 45% 15%)" strokeWidth="3" opacity=".9" />
        <line x1="270" y1="158" x2="282" y2="170" stroke="hsl(165 45% 15%)" strokeWidth="5" strokeLinecap="round" />
      </g>
    </svg>
  );
}
