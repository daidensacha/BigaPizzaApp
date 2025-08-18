import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { API_BASE } from '@/config';
import { useAuth } from '@/context/AuthContext';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';

export default function UserDashboard() {
  const { user } = useAuth();
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancel = false;
    (async () => {
      try {
        const { data } = await axios.get(`${API_BASE}/api/recipes/mine`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        if (!cancel) setRecipes(data || []);
      } catch (e) {
        console.error(e);
      } finally {
        if (!cancel) setLoading(false);
      }
    })();
    return () => {
      cancel = true;
    };
  }, [user?.token]);

  const total = recipes.length;
  const avgRating = useMemo(() => {
    const rated = recipes.filter((r) => typeof r.rating === 'number');
    if (!rated.length) return '—';
    const sum = rated.reduce((s, r) => s + r.rating, 0);
    return (sum / rated.length).toFixed(1);
  }, [recipes]);

  const favorites = recipes.filter((r) => (r.rating ?? 0) >= 4);
  const lastBaked = useMemo(() => {
    if (!recipes.length) return '—';
    const latest = [...recipes].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    )[0];
    return dayjs(latest.createdAt).format('MMM D, YYYY');
  }, [recipes]);

  const recent = [...recipes]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  const topRated = [...recipes]
    .filter((r) => typeof r.rating === 'number')
    .sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Recipes" value={loading ? '…' : total} />
        <StatCard label="Avg Rating" value={loading ? '…' : avgRating} />
        <StatCard
          label="Favorites (≥4★)"
          value={loading ? '…' : favorites.length}
        />
        <StatCard label="Last Baked" value={loading ? '…' : lastBaked} />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <ListCard
          title="Recently Added"
          items={recent}
          empty="No recipes yet."
        />
        <ListCard title="Top Rated" items={topRated} empty="No ratings yet." />
      </div>
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="rounded-xl border border-stone-200/70 dark:border-stone-700 bg-white/80 dark:bg-stone-900 p-4">
      <div className="text-xs uppercase tracking-wide text-stone-500 dark:text-stone-400">
        {label}
      </div>
      <div className="mt-1 text-2xl font-semibold text-stone-900 dark:text-stone-100">
        {value}
      </div>
    </div>
  );
}

function ListCard({ title, items, empty }) {
  return (
    <div className="rounded-xl border border-stone-200/70 dark:border-stone-700 bg-white/80 dark:bg-stone-900 p-4">
      <h3 className="text-base font-semibold mb-3">{title}</h3>
      {!items?.length ? (
        <p className="text-sm text-stone-500">{empty}</p>
      ) : (
        <ul className="space-y-2">
          {items.map((r) => (
            <li key={r._id} className="flex items-center justify-between gap-3">
              <Link
                to={`/account/recipes/${r._id}`}
                className="underline hover:text-emerald-600"
              >
                {r.title || 'Untitled Recipe'}
              </Link>
              <span className="text-sm text-stone-500">
                {typeof r.rating === 'number' ? `★ ${r.rating}` : ''}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
