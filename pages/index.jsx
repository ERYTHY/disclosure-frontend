import Link from 'next/link';
import Image from 'next/image';

export default function Home({ tenants }) {
  return (
    <main className="max-w-xl mx-auto mt-10 p-4">
      <h1 className="text-2xl font-bold mb-6">Choose Tenant</h1>
      <ul className="space-y-4">
        {tenants.map((tenant) => (
          <li key={tenant.id} className="p-4 border rounded shadow">
            {tenant.logoUrl && (
              <img
                src={tenant.logoUrl}
                alt={`${tenant.label} logo`}
                className="h-10 object-contain mb-2"
              />
            )}
            <h2 className="text-lg font-semibold">{tenant.label}</h2>
            <p className="mt-2">
              <Link
                href={`/sign?tenant=${tenant.id}&name=John%20Doe&email=john@example.com&phone=6311234567`}
                className="text-blue-600 underline"
              >
                Preview Disclosure for {tenant.label}
              </Link>
            </p>
            <p className="mt-1">
              <Link
                href={`/start?tenant=${tenant.id}`}
                className="text-green-600 underline"
              >
                Start Disclosure
              </Link>
            </p>
          </li>
        ))}
      </ul>
    </main>
  );
}

// ✅ This loads tenants from the backend on page load
export async function getServerSideProps() {
  try {
    const res = await fetch(`https://disclosure-backend.onrender.com/api/get-all-tenants`);
    const tenants = await res.json();

    return { props: { tenants } };
  } catch (error) {
    console.error('❌ Failed to fetch tenants:', error);
    return { props: { tenants: [] } };
  }
}
