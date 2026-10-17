// Demo "main website" showing how the games module plugs into an existing React Router app.
// Only the <Route path="/games/*"> line and the import are needed in the real site.
import { Link, NavLink, Route, Routes } from 'react-router-dom';
import { MuscleGames } from './muscle-games';

function saveRun(run) {
  // GAME-7: replace with a call to your API, e.g. fetch('/api/game-runs', { method: 'POST', body: JSON.stringify(run) })
  console.info('[demo] game finished', run);
}

function Home() {
  return (
    <section className="host-page">
      <h1>Histology Course</h1>
      <p>This page stands in for the main website. Open the Games menu to try the module.</p>
      <Link className="host-cta" to="/games">
        Go to Games →
      </Link>
    </section>
  );
}

export default function App() {
  return (
    <>
      <header className="host-nav">
        <strong>MedEd</strong>
        <nav>
          <NavLink to="/" end>
            Home
          </NavLink>
          <NavLink to="/games">Games</NavLink>
        </nav>
      </header>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/games/*" element={<MuscleGames onGameFinish={saveRun} />} />
      </Routes>
    </>
  );
}
