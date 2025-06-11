// pages/start.jsx

"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";

export default function StartForm() {
  const [tenantOptions, setTenantOptions] = useState([]);
  const [tenant, setTenant] = useState(""); // Selected tenant ID
  const [loadingTenants, setLoadingTenants] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchTenantList = async () => {
      setLoadingTenants(true);
      try {
        const response = await fetch('/api/admin/tenants');
        if (!response.ok) {
          throw new Error(`Failed to fetch tenants: ${response.status}`);
        }
        const data = await response.json();
        // Assuming data is { default: "...", tenants: [{ key: "...", config: { name: "..." }, ... }] }
        const mappedTenants = (data.tenants || []).map(t => ({
          id: t.key, // Assuming key is the ID
          label: t.config?.name || t.key, // Use key as fallback label
        }));
        setTenantOptions(mappedTenants);
        if (mappedTenants.length > 0) {
          setTenant(mappedTenants[0].id); // Set default selected tenant
        }
      } catch (error) {
        console.error("Error fetching tenant list:", error);
        // Optionally set an error state here to display to the user
      } finally {
        setLoadingTenants(false);
      }
    };
    fetchTenantList();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams({
      tenant,
      name,
      email,
      phone,
    });
    router.push(`/sign?${params.toString()}`);
  };

  return (
    <main className="max-w-xl mx-auto mt-10 p-6 border rounded-lg shadow bg-white">
      <h1 className="text-2xl font-bold mb-4">Start Your Disclosure</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium mb-1">Choose Agent</label>
          <select
            className="w-full border p-2 rounded"
            value={tenant}
            onChange={(e) => setTenant(e.target.value)}
            disabled={loadingTenants || tenantOptions.length === 0}
          >
            {loadingTenants ? (
              <option>Loading tenants...</option>
            ) : tenantOptions.length === 0 ? (
              <option>No tenants available</option>
            ) : (
              tenantOptions.map((opt) => (
                <option key={opt.id} value={opt.id}>
                  {opt.label}
                </option>
              ))
            )}
          </select>
        </div>
        <div>
          <label className="block font-medium mb-1">Your Name</label>
          <input
            type="text"
            className="w-full border p-2 rounded"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Email</label>
          <input
            type="email"
            className="w-full border p-2 rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Phone</label>
          <input
            type="tel"
            className="w-full border p-2 rounded"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Continue to Sign
        </button>
      </form>
    </main>
  );
}
