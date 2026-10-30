import { useEffect, useState } from 'react';
import { useScores } from '../scores.jsx';
import { MAX_SCORE } from './meta.js';
import { ConveyorCoverScene } from '../covers.jsx';
import Memory from './sort/Memory.jsx';
import Conveyor from './sort/Conveyor.jsx';

const MODES = [
  {
    id: 'memory',
    title: 'Picture Match',
    icon: '🖼️',
    desc: 'Photos and notes are pinned to an evidence board. Tap a photo, then its name or key feature to tie them with a string — 3 cases to clear.',
    meta: '3 cases · 18 pairs · 150 s',
  },
  {
    id: 'conveyor',
    title: 'Conveyor Sort',
    icon: '📦',
    desc: 'Crates roll down the factory belt. Press a picture button and the robot arm packs the crate into Skeletal, Cardiac or Smooth.',
    meta: '60 s · 3 lives',
  },
];

function ModeSelect({ onPick }) {
  const { best } = useScores();
  return (
    <div className="mg-modes">
      {MODES.map((m) => {
        const key = `group-sort:${m.id}`;
        return (
          <button key={m.id} type="button" className={`mg-mode mg-mode--${m.id}`} onClick={() => onPick(m.id)}>
            <span className="mg-mode__art" aria-hidden="true">
              {m.id === 'memory' ? (
                <span className="mg-mode__cork">
                  <b className="mg-mode__tape">Picture Match</b>
                  <svg className="mg-mode__string" viewBox="0 0 320 150" preserveAspectRatio="none">
                    <path d="M58 45 Q138 125 218 45" stroke="#e64980" />
                    <path d="M138 45 Q210 115 283 45" stroke="#1c7ed6" />
                  </svg>
                  {[['pic', '🫀'], ['pic', '💪'], ['note', 'Cardiac'], ['note', 'Skeletal']].map(([kind, c], k) => (
                    <i key={k} className={`mg-mode__${kind}`}>
                      {c}
                    </i>
                  ))}
                </span>
              ) : (
                <ConveyorCoverScene />
              )}
            </span>
            <span className="mg-mode__title">
              <span aria-hidden="true">{m.icon}</span> {m.title}
            </span>
            <span className="mg-mode__desc">{m.desc}</span>
            <span className="mg-mode__meta">
              <span>{m.meta}</span>
              {best[key] !== undefined && (
                <strong>
                  Best {best[key]}/{MAX_SCORE}
                </strong>
              )}
            </span>
            <span className="mg-btn mg-btn--primary mg-btn--block">▶ Play {m.title}</span>
          </button>
        );
      })}
    </div>
  );
}

// The mode played last. GamePage remounts the game on ↻ / Play again (`fresh`), which should replay that
// mode straight away instead of going back to the mode picker.
let lastMode = null;

export default function GroupSort({ onScore, onFinish, setScoreKey, fresh }) {
  const [mode, setMode] = useState(() => (fresh ? lastMode : null));
  useEffect(() => {
    if (mode) setScoreKey(`group-sort:${mode}`);
  }, [mode, setScoreKey]);
  if (!mode) {
    return (
      <ModeSelect
        onPick={(m) => {
          lastMode = m;
          setMode(m);
        }}
      />
    );
  }
  const finish = (score, info) => onFinish(score, { ...info, key: `group-sort:${mode}` });
  return mode === 'memory' ? <Memory onScore={onScore} onFinish={finish} /> : <Conveyor onScore={onScore} onFinish={finish} />;
}
