import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

export default function Home() {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleCreateClick = () => {
    if (user) {
      // logged in → open modal editor for create
      navigate('/editor/create', {
        state: { backgroundLocation: location },
      });
    } else {
      // logged out → send to guided input flow
      navigate('/create-recipe');
    }
  };

  return (
    <section
      className="
        relative isolate
        -mx-6 lg:-mx-8 -mt-8 -mb-8
        min-h-[calc(100vh-3.5rem)]   /* 100vh minus navbar height */
        flex items-center
      "
    >
      {/* Gradient layer */}
      {/* Background stack — restored “strong outline” look */}
      <div className="absolute inset-0 pointer-events-none">
        {/* 1) Gradient — bottom (no transitions) */}
        <div
          className="
      absolute inset-0
      bg-gradient-to-br
      from-rose-300/70 via-amber-200/80 to-yellow-200/70
      dark:from-orange-950/70 dark:via-stone-800/50 dark:to-slate-700/60
    "
        />

        {/* 2) Oven outline image — ABOVE gradient */}
        <div
          className="
      absolute inset-0 bg-center bg-cover bg-no-repeat
      opacity-95 dark:opacity-70
      mix-blend-multiply dark:mix-blend-soft-light
      [filter:contrast(1.22)_brightness(0.88)]
      dark:[filter:contrast(1.10)_brightness(0.95)]
    "
          style={{ backgroundImage: "url('/images/oven-outline-strong.png')" }}
        />

        {/* 3) Veil — top (only this fades) */}
        <div
          className="
      absolute inset-0
      bg-white/5 dark:bg-black/25
      transition-opacity duration-200
      opacity-0 dark:opacity-100
    "
        />
      </div>

      {/* Content */}
      <div className="relative mx-auto w-full max-w-5xl px-6 py-16 text-center">
        <h1
          className="text-4xl md:text-6xl font-extrabold
                     text-stone-900 dark:text-stone-50
                     drop-shadow-sm"
        >
          Biga Pizza
        </h1>
        <p
          className="mt-4 text-lg md:text-xl
                      text-stone-700 dark:text-stone-200
                      drop-shadow"
        >
          Artisan dough planning & recipe management — beautifully simple.
        </p>

        <div className="mt-8 flex justify-center gap-3">
          {/* Create Recipe button with auth-aware navigation */}
          <button
            onClick={handleCreateClick}
            className="rounded-lg px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-medium"
          >
            Create Recipe
          </button>

          <a
            href="/menu"
            className="rounded-lg px-5 py-3 bg-white/80 hover:bg-white text-stone-900 font-medium
                       border border-stone-200 backdrop-blur
                       dark:bg-stone-800/70 dark:hover:bg-stone-800 dark:text-stone-100 dark:border-stone-700"
          >
            Explore Menu
          </a>
        </div>
      </div>
    </section>
  );
}
