"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function TenantSelector() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [tenant, setTenant] = useState("teamperrone");
  const [generatedLink, setGeneratedLink] = useState("");

  const generateLink = () => {
    const encoded = new URLSearchParams({ name, email, phone, tenant }).toString();
    const url = `https://disclosure-frontend.onrender.com/sign?${encoded}`;
    setGeneratedLink(url);
  };

  return (
    <div className="p-8 max-w-xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Generate Signing Link</h2>
      <Input placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} className="mb-2" />
      <Input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="mb-2" />
      <Input placeholder="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} className="mb-2" />
      <Input placeholder="Tenant (e.g., teamperrone)" value={tenant} onChange={(e) => setTenant(e.target.value)} className="mb-4" />
      <Button onClick={generateLink}>Generate Link</Button>
      {generatedLink && (
        <div className="mt-4">
          <p className="font-semibold">Preview:</p>
          <a href={generatedLink} target="_blank" rel="noreferrer" className="underline text-blue-600">{generatedLink}</a>
        </div>
      )}
    </div>
  );
}
