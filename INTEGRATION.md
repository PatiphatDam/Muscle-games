# Muscle Games — คู่มือนำเกมไปใส่เว็บหลัก (React)

โมดูลเกม 3 เกม (Balloon Pop · Group Sort · Diameter) สำหรับบท *Muscular Tissues I*
เขียนด้วย React + HTML5 + CSS3 รองรับ Responsive บนสมาร์ตโฟน (≥360px), แท็บเล็ต และคอมพิวเตอร์

ทุกอย่างอยู่ในโฟลเดอร์เดียว: **`src/muscle-games/`**

---

## 1. สิ่งที่เว็บหลักต้องมี

| แพ็กเกจ | เวอร์ชัน |
|---|---|
| `react`, `react-dom` | 18 ขึ้นไป |
| `react-router-dom` | 6.7 ขึ้นไป (ใช้ `<Routes>` แบบซ้อน) |

ใช้ได้ทั้งโปรเจกต์ **Vite** และ **Create React App** ไม่ต้องติดตั้งไลบรารีอื่นเพิ่ม

```bash
npm install react-router-dom@6
```

## 2. ติดตั้ง (3 ขั้นตอน)

**① คัดลอกโฟลเดอร์** `src/muscle-games/` ไปไว้ใน `src/` ของเว็บหลัก

**② เพิ่ม Route** ในไฟล์ที่มี `<Routes>` ของเว็บหลัก (ต้องลงท้าย `/*`)

```jsx
import { MuscleGames } from './muscle-games';

<Routes>
  {/* ...route เดิมของเว็บ... */}
  <Route path="/games/*" element={<MuscleGames onGameFinish={saveRun} />} />
</Routes>
```

**③ ใส่ลิงก์ในเมนู** เช่น `<Link to="/games">Games</Link>` เท่านี้ก็ใช้งานได้

> ลิงก์ภายในเกมเป็นแบบ relative ทั้งหมด จะเปลี่ยน path เป็น `/learning/muscle/games/*` ก็ได้ ไม่ต้องแก้โค้ดเกม
> เกมใช้ Router ของเว็บหลัก (ห้ามครอบ `<BrowserRouter>` ซ้อนอีกชั้น)

URL ที่ได้:

| URL | หน้า |
|---|---|
| `/games` | หน้ารวมเกม (Game cards) |
| `/games/balloon-pop` | Balloon Pop (OL1) |
| `/games/group-sort` | Group Sort (OL2) |
| `/games/diameter` | Diameter (OL3) |

## 3. Props

| Prop | ชนิด | ความหมาย |
|---|---|---|
| `onGameFinish` | `(run) => void` | เรียกทุกครั้งที่เล่นจบ 1 รอบ ใช้บันทึกคะแนนลงฐานข้อมูล (GAME-7) |
| `className` | `string` | class เพิ่มเติมที่ตัวครอบ `.mg-root` |

ข้อมูลที่ส่งมาใน `run`:

```js
{
  runId: '3f0c…',                // id ของรอบที่เล่น — ส่งซ้ำได้ (เช่น Diameter ที่ออกแล้วกลับมาเล่นต่อ) ให้ฐานข้อมูล upsert ด้วย runId
  gameId: 'group-sort',          // 'balloon-pop' | 'group-sort' | 'diameter'
  mode: 'memory',                // เฉพาะ group-sort: 'memory' | 'conveyor', เกมอื่นเป็น null
  scoreKey: 'group-sort:memory',
  score: 413,
  stars: 3,                      // 0–3
  completed: true,               // false = ผู้เล่นกดออก (← Games / ↻) ก่อนจบ แต่มีความคืบหน้าแล้ว (Diameter) — บันทึกคะแนนเท่าที่เล่นได้
  isNewBest: true,               // ดีที่สุดใน session นี้หรือไม่
  achievements: ['mem_fast', 'stars3'],
  newAchievements: ['stars3'],
  mistakes: [{ prompt, yours, answer, why }],   // ข้อที่พลาด (ใช้วิเคราะห์ผลการเรียนได้)
  summary: '6/6 pairs · time bonus +170',
  finishedAt: '2026-10-17T09:30:00.000Z'
}
```

ตัวอย่างบันทึกลง API:

```jsx
async function saveRun(run) {
  await fetch('/api/game-runs', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(run),
  });
}
```

ถ้า `onGameFinish` เกิด error (หรือคืน Promise ที่ reject) เกมจะไม่ค้าง (จับ error และ log ไว้ใน console)

## 4. การแยก CSS ไม่ให้ชนกับเว็บหลัก

- ทุก class ขึ้นต้นด้วย `mg-` และทุกกฎ CSS อยู่ภายใต้ `.mg-root`
- ไม่มีกฎ CSS ที่แตะ `body`, `html`, `h1`, `button` ของเว็บหลัก
- ฟอนต์ **Prompt** โหลดเองจาก Google Fonts (`@import` ในไฟล์ `styles.css`)
- แอปตัวอย่าง (`src/demo-host.css`) ใส่สไตล์ที่ตั้งใจให้ชน เช่น `h1` สีแดงตัวพิมพ์ใหญ่ `.btn` สีส้ม และทดสอบแล้วว่าไม่ทะลุเข้ามาในเกม

เปลี่ยนสีธีมได้โดย override ตัวแปร CSS ที่ `.mg-root` เช่น

```css
.mg-root { --violet-600: #0e7490; --violet-700: #155e75; }
```

## 5. แก้ไขเนื้อหา / คำถาม

| เกม | ไฟล์ |
|---|---|
| Balloon Pop — คำใบ้ ตัวเลือก | `games/BalloonPop.jsx` (`CLUES`, `PROPERTIES`, `FUNCTIONS`) |
| Group Sort — การ์ดคัดแยก / คู่การ์ด | `games/sort/data.js` |
| Diameter — ทั้ง 6 ด่าน | `games/diameter/levels.js` |
| ชื่อเกม, OL, เวลาเล่น, เหรียญรางวัล, เกณฑ์ดาว | `games/meta.js` |

## 6. พฤติกรรมที่ควรรู้

- **Diameter** จำด่านที่ผ่านแล้วไว้ใน `sessionStorage` — กด ← Games แล้วกลับมาจะเล่นต่อจากด่านถัดไปได้ (กด ↻ เพื่อเริ่มใหม่)
- **คะแนนสูงสุดและเหรียญ** เก็บใน `sessionStorage` ของแท็บนั้นเท่านั้น (ปิดแท็บแล้วหาย) การบันทึกถาวรให้ทำผ่าน `onGameFinish`
- **เสียง** สร้างด้วย Web Audio (ไม่มีไฟล์เสียง) ผู้เล่นปิดเสียงได้ที่ปุ่ม 🔊 ค่านี้จำไว้ใน `localStorage`
- **การลากวาง** ใช้ Pointer Events ใช้ได้ทั้งเมาส์และนิ้ว และมีโหมด "แตะชิ้น → แตะช่อง" สำหรับคนที่ลากไม่ถนัดหรือใช้คีย์บอร์ด
- **ปุ่ม/เป้าแตะ** ขนาด ≥ 44px, เคารพ `prefers-reduced-motion`
- **Responsive**: หน้ารวมเกม 1 คอลัมน์บนมือถือ, 2 คอลัมน์บนแท็บเล็ต, 3 คอลัมน์ที่ ≥1024px
- เกมทุกเกมเปิดให้เล่นได้เสมอ ไม่มีล็อก Pretest
- เบราว์เซอร์ที่รองรับ: Chrome, Edge, Safari, Firefox รุ่นปัจจุบัน (iOS Safari 15+)

## 7. ลองรันแอปตัวอย่างในโปรเจกต์นี้

```bash
npm install
npm run dev
```

เปิด `http://localhost:5173` → เมนู Games (ไฟล์ `src/App.jsx` คือตัวอย่างการต่อเข้าเว็บหลัก)
เมื่อเล่นจบจะเห็นข้อมูล `run` ใน console

## 8. โครงสร้างไฟล์

```
src/muscle-games/
├── index.js              ← import จากตรงนี้
├── MuscleGames.jsx       ← คอมโพเนนต์หลัก (Routes + providers + error boundary)
├── styles.css            ← CSS ทั้งหมด (prefix mg-)
├── GamesHub.jsx          ← หน้ารวมเกม
├── covers.jsx, art.jsx   ← ภาพปกและภาพประกอบ (SVG)
├── scores.jsx, config.js
├── components/           ← GamePage (กรอบเกม/หน้าผลลัพธ์), Hud (เวลา คอมโบ ดาว)
├── fx/                   ← เสียง พลุ มาสคอต Myo ระบบลากวาง จิ๊กซอว์
└── games/                ← BalloonPop, GroupSort (+sort/), diameter/, meta.js
```
