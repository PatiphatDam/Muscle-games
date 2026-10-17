import { useEffect, useMemo, useRef, useState } from 'react';
import { pick, useFx } from '../../fx/Fx.jsx';
import { ComboMeter, TimerBar, comboMult, useCountdown } from '../../components/Hud.jsx';
import { sample, shuffle } from '../util.js';
import { PAIRS } from './data.js';

const TIME = 90;
const PAIR_COUNT = 6;
const PEEK_MS = 2600;

export default function Memory({ onScore, onFinish }) {
  const fx = useFx();
  const deck = useMemo(
    () =>
      shuffle(
        sample(PAIRS, PAIR_COUNT).flatMap((p) => [
          { uid: `${p.id}-pic`, pair: p.id, kind: 'pic', p },
          { uid: `${p.id}-name`, pair: p.id, kind: 'name', p },
        ])
      ),
    []
  );
  const [peek, setPeek] = useState(true);
  const [open, setOpen] = useState([]);
  const [matched, setMatched] = useState({});
  const [wrongPair, setWrongPair] = useState([]);
  const [over, setOver] = useState(false);
  const st = useRef({ score: 0, streak: 0, maxStreak: 0, misses: 0, mistakes: [] });
  const timers = useRef([]);
  const later = (fn, ms) => timers.current.push(setTimeout(fn, ms));
  const s = st.current;

  const [left, , leftRef] = useCountdown(TIME, { running: !peek && !over, onExpire: () => end(false) });

  useEffect(() => {
    fx.say('จำตำแหน่งการ์ดให้ดีนะ! 👀', 'wow');
    const t = setTimeout(() => {
      setPeek(false);
      fx.sound('flip');
      fx.say('พลิกทีละ 2 ใบ จับคู่ภาพกับชื่อ!', 'happy');
    }, PEEK_MS);
    return () => {
      clearTimeout(t);
      timers.current.forEach(clearTimeout);
    };
  }, [fx]);

  function end(completed) {
    if (st.current.over) return;
    st.current.over = true;
    setOver(true);
    const found = Object.keys(matched).length + (completed ? 1 : 0);
    const bonus = completed ? Math.round(leftRef.current * 2) : 0;
    s.score += bonus;
    onScore(s.score);
    if (completed) {
      fx.say(`ครบทุกคู่! โบนัสเวลา +${bonus} ⏱`, 'wow');
    } else {
      fx.say('หมดเวลาแล้ว! ⏰', 'sad');
    }
    later(
      () =>
        onFinish(s.score, {
          summary: `${completed ? PAIR_COUNT : found}/${PAIR_COUNT} pairs · time bonus +${bonus}`,
          mistakes: s.mistakes,
          stats: {
            memPerfect: completed && s.misses === 0,
            memFast: completed && leftRef.current >= 45,
            maxStreak: s.maxStreak,
          },
        }),
      1100
    );
  }

  const flip = (card) => {
    if (peek || over || open.length >= 2 || open.includes(card.uid) || matched[card.pair]) return;
    fx.sound('flip');
    const next = [...open, card.uid];
    setOpen(next);
    if (next.length < 2) return;

    const [a, b] = next.map((uid) => deck.find((c) => c.uid === uid));
    if (a.pair === b.pair) {
      later(() => {
        s.streak += 1;
        s.maxStreak = Math.max(s.maxStreak, s.streak);
        const mult = comboMult(s.streak);
        const pts = 20 * mult;
        s.score += pts;
        onScore(s.score);
        const { x, y } = fx.centerOf(`[data-card="${b.uid}"]`);
        fx.sound(mult > 1 ? 'combo' : 'good', mult);
        fx.burst(x, y, 20);
        fx.float(x, y - 20, `+${pts}${mult > 1 ? ` ×${mult}` : ''}`);
        fx.say(mult > 1 ? `คอมโบ ×${mult}! 🔥 ${a.p.name}` : `${pick(['ถูกคู่!', 'เยี่ยม!', 'จำแม่นมาก!'])} ${a.p.name}`, mult > 1 ? 'wow' : 'happy');
        const nextMatched = { ...matched, [a.pair]: true };
        setMatched(nextMatched);
        setOpen([]);
        if (Object.keys(nextMatched).length === PAIR_COUNT) end(true);
      }, 380);
    } else {
      s.streak = 0;
      s.misses += 1;
      const pic = [a, b].find((c) => c.kind === 'pic');
      const name = [a, b].find((c) => c.kind === 'name');
      if (pic && name) {
        s.mistakes.push({ prompt: 'ภาพนี้คืออะไร? (การ์ดรูป)', yours: name.p.name, answer: pic.p.name, why: pic.p.why });
      }
      fx.sound('bad');
      fx.vibrate(100);
      fx.say(pick(['ไม่ใช่คู่กัน ลองจำใหม่นะ', 'อุ๊ย คนละคู่!', 'เกือบแล้ว! 😅']), 'sad');
      setWrongPair(next);
      later(() => {
        setOpen([]);
        setWrongPair([]);
      }, 900);
    }
  };

  return (
    <section className="mg-memory">
      <div className="mg-hud">
        <TimerBar left={left} total={TIME} />
        <div className="mg-hud__row">
          <span className="mg-hud__q">
            🃏 {Object.keys(matched).length}/{PAIR_COUNT} pairs
          </span>
          <ComboMeter streak={s.streak} />
        </div>
      </div>
      {peek && <p className="mg-peek-banner">👀 Memorise the cards…</p>}
      <div className="mg-memory__grid">
        {deck.map((c) => {
          const up = peek || open.includes(c.uid) || matched[c.pair];
          return (
            <button
              key={c.uid}
              type="button"
              data-card={c.uid}
              className={`mg-mcard${up ? ' mg-mcard--up' : ''}${matched[c.pair] ? ' mg-mcard--matched' : ''}${wrongPair.includes(c.uid) ? ' mg-mcard--wrong' : ''}`}
              onClick={() => flip(c)}
              aria-label={up ? (c.kind === 'pic' ? `Picture card${matched[c.pair] ? `: ${c.p.name}` : ''}` : c.p.name) : 'Hidden card'}
            >
              <span className="mg-mcard__inner">
                <span className="mg-mcard__face mg-mcard__back" aria-hidden="true">
                  <span>?</span>
                </span>
                <span className={`mg-mcard__face mg-mcard__front mg-mcard__front--${c.kind}`}>
                  {c.kind === 'pic' ? <c.p.Art /> : <strong>{c.p.name}</strong>}
                </span>
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
