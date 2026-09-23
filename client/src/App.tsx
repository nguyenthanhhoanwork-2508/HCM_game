import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { AdminPage } from './pages/AdminPage';
import { PlayerPage } from './pages/PlayerPage';
import { DEFAULT_TEAM_NAMES } from './teamConfig';

function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <h1 className="text-3xl font-bold text-yellow-300">Chiếc Nón Kì Quặc</h1>
      <Link to="/admin" className="bg-yellow-500 text-slate-900 font-bold px-6 py-3 rounded-lg">
        Vào màn Admin
      </Link>
      <div className="flex gap-3">
        {[1, 2, 3, 4, 5].map((id) => (
          <Link key={id} to={`/player/${id}`} className="bg-blue-600 font-bold px-4 py-2 rounded-lg">
            {DEFAULT_TEAM_NAMES[id]}
          </Link>
        ))}
      </div>
    </div>
  );
}

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/player/:teamId" element={<PlayerPage />} />
      </Routes>
    </BrowserRouter>
  );
}
