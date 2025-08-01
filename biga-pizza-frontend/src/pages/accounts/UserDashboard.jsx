import { useAuth } from '@/context/AuthContext';

export default function UserDashboard() {
  const { user } = useAuth();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Welcome, {user?.name}</h1>
      <p className="text-gray-600  dark:text-gray-300 mb-6">
        Your account dashboard.
      </p>

      {/* Saved Recipes Section */}
      <section>
        <h2 className="text-xl font-semibold mb-2">Your Recipes</h2>
        {/* We'll create this next */}
      </section>
    </div>
  );
}
