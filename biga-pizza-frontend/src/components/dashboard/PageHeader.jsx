export default function PageHeader({ title, actions }) {
  return (
    <div className="sticky top-0 z-10 -mt-2 mb-4 pb-3 bg-gradient-to-b from-white/80 dark:from-zinc-950/80 to-transparent backdrop-blur">
      <div className="flex items-center justify-between">
        <h1 className="text-xl sm:text-2xl font-semibold">{title}</h1>
        <div className="flex gap-2">{actions}</div>
      </div>
    </div>
  );
}
