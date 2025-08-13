import PageHeader from '@/components/dashboard/PageHeader';

export default function UserDashboard() {
  return (
    <>
      <PageHeader title="Overview" />
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="p-4 rounded-lg border border-zinc-200 dark:border-zinc-800">
          <h3 className="font-semibold mb-1">Quick Start</h3>
          <p className="text-sm text-zinc-500">
            Create a new recipe or apply your defaults.
          </p>
        </div>
        <div className="p-4 rounded-lg border border-zinc-200 dark:border-zinc-800">
          <h3 className="font-semibold mb-1">Recent Recipes</h3>
          <p className="text-sm text-zinc-500">
            Your last few saved bakes appear here.
          </p>
        </div>
      </div>
    </>
  );
}
