// pages/start.jsx

"use client";
import { useState } from "react";
const res = await fetch(`https://disclosure-backend.onrender.com/api/get-tenant-config?tenant=${tenantId}`);
const tenant = await res.json();
import { useRouter } from "next/router";

export default function StartForm() {
  const [tenant, setTenant] = useState(tenants[0].id);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const router = useRouter();

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
          >
            {tenants.map((t) => (
              <option key={t.id} value={t.id}>
                {t.label}
              </option>
            ))}
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
