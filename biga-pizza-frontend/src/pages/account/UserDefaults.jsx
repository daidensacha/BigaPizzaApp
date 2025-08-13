import PageHeader from '@/components/dashboard/PageHeader';

export default function UserDefaults() {
  return (
    <>
      <PageHeader
        title="My Defaults"
        actions={
          <button className="px-3 py-1 rounded bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900">
            Apply These Now
          </button>
        }
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="p-4 rounded-lg border border-zinc-200 dark:border-zinc-800">
          <h3 className="font-semibold mb-2">Dough Defaults</h3>
          <p className="text-sm text-zinc-500">
            Edit and save your dough defaults.
          </p>
        </div>
        <div className="p-4 rounded-lg border border-zinc-200 dark:border-zinc-800">
          <h3 className="font-semibold mb-2">Schedule Defaults</h3>
          <p className="text-sm text-zinc-500">
            Edit and save your schedule defaults.
          </p>
        </div>
      </div>
    </>
  );
}
