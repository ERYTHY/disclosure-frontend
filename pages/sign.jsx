"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import tenants from "../tenants.json";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
const res = await fetch(`https://disclosure-backend.onrender.com/api/get-tenant-config?tenant=${tenantId}`);
const tenant = await res.json();

export default function SignPage() {
  const searchParams = useSearchParams();
  const name = searchParams.get("name") || "";
  const email = searchParams.get("email") || "";
  const phone = searchParams.get("phone") || "";
  const tenantId = searchParams.get("tenant") || "team-perrone";
  const tenant = tenants.find((t) => t.id === tenantId);

  const [previewUrl, setPreviewUrl] = useState(null);
  const [signedLink, setSignedLink] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPreview = async () => {
      try {
        setLoading(true);
        const response = await fetch("https://disclosure-backend.onrender.com/api/preview-disclosure", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, phone, tenant: tenantId })
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Failed to fetch preview");
        if (!data.previewUrl) throw new Error("No preview URL returned.");
        setPreviewUrl(data.previewUrl);
      } catch (err) {
        setError("Error generating preview.");
        console.error("❌ Preview error:", err);
      } finally {
        setLoading(false);
      }
    };

    if (name && email && phone && tenantId) fetchPreview();
    else setError("Missing information. Please return to the form.");
  }, [name, email, phone, tenantId]);

  const handleSign = async () => {
    try {
      setLoading(true);
      const response = await fetch("https://disclosure-backend.onrender.com/api/generate-disclosure", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, tenant: tenantId })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Signing failed");
      setSignedLink(data.downloadUrl);

      // Send signed URL to Make webhook (Twilio + FUB logic)
      await fetch(tenant.fubWebhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, signedUrl: data.downloadUrl })
      });

      await fetch(tenant.twilioWebhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, signedUrl: data.downloadUrl })
      });

      await fetch('/api/signed-disclosure', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name,
    email,
    phone,
    agentPhone,
    pdfUrl,
    tenantId,
    contactId // pulled earlier from the FUB webhook
  }),
});


    } catch (err) {
      setError(err.message || "Signing failed.");
      console.error("❌ Signing error:", err);
    } finally {
      setLoading(false);
    }
  };

  const brandColor = tenant?.branding?.primaryColor || "#003366";

  return (
    <main className="max-w-3xl mx-auto mt-10 p-4 border rounded-xl shadow bg-white">
      {tenant?.branding?.logoUrl && (
        <div className="flex justify-center mb-6">
          <img src={tenant.branding.logoUrl} alt={tenant.label} className="h-12" />
        </div>
      )}

      <h1 className="text-2xl font-bold mb-4" style={{ color: brandColor }}>
        Review and Sign Your Disclosures
      </h1>

      {loading && <p className="text-gray-600">Loading...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {!signedLink && previewUrl && (
        <>
          <div className="border-4 border-blue-400 rounded-md p-2 mb-4 shadow-md bg-white">
            <iframe
              src={previewUrl}
              title="Disclosure Preview"
              width="100%"
              height="600px"
              className="rounded border border-gray-300"
            />
            <p className="text-xs text-gray-600 text-center mt-2">
              📄 Scroll <strong>outside this box</strong> to see the “Sign and Confirm” button below.
            </p>
          </div>

          <div className="space-y-4">
            <Input value={name} readOnly />
            <Input value={email} readOnly />
            <Input value={phone} readOnly />

            <Button onClick={handleSign} disabled={loading}>
              {loading ? "Generating..." : "✅ Tap to Sign and Confirm"}
            </Button>
          </div>
        </>
      )}

      {signedLink && (
        <div className="space-y-4 mt-4">
          <p className="text-green-700 font-semibold">
            ✅ Your disclosures have been signed! <br />
            <a className="underline" href={signedLink} target="_blank">
              View Signed PDF
            </a>
          </p>
          <p>Thank you! — {tenant?.agentName || "Your Agent"}</p>
        </div>
      )}
    </main>
  );
}
