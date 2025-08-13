import PageHeader from '@/components/dashboard/PageHeader';

export default function UserProfile() {
  return (
    <>
      <PageHeader title="Profile" />
      <p className="text-sm text-zinc-500">Name, email, password, etc.</p>
    </>
  );
}
