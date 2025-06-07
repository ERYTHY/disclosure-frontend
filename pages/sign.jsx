"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// Default fallback tenant if none specified
const DEFAULT_TENANT = "teamperrone";

export default function SignPage() {
  const searchParams = useSearchParams();
  const name = searchParams.get("name") || "";
  const email = searchParams.get("email") || "";
  const phone = searchParams.get("phone") || "";
  const tenant = searchParams.get("tenant") || DEFAULT_TENANT;

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
          body: JSON.stringify({ name, email, phone, tenant })
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

    if (name && email && phone) {
      fetchPreview();
    } else {
      setError("Missing required contact parameters.");
    }
  }, [name, email, phone, tenant]);

  const handleSign = async () => {
    try {
      setLoading(true);
      const response = await fetch("https://disclosure-backend.onrender.com/api/generate-disclosure", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, tenant })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Signing failed");
      setSignedLink(data.downloadUrl);

      // Notify tenant's Make webhook (optional)
      await fetch("https://hook.us2.make.com/7bvx5myhbwl1mantowangr6utibpmobw", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, downloadUrl: data.downloadUrl })
      });

    } catch (err) {
      setError(err.message || "Signing failed.");
      console.error("❌ Signing error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="max-w-3xl mx-auto mt-10 p-4 border rounded-xl shadow">
      <h1 className="text-2xl font-bold mb-4">Disclosure Review & Signing</h1>

      {loading && <p className="text-gray-600">Loading...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {!signedLink && previewUrl && (
        <>
          <iframe
            src={previewUrl}
            title="Disclosure Preview"
            width="100%"
            height="600px"
            style={{ border: "1px solid #ccc", marginBottom: "20px" }}
          />
          <div className="space-y-4">
            <Input value={name} readOnly />
            <Input value={email} readOnly />
            <Input value={phone} readOnly />
            <Input value={tenant} readOnly />

            <Button onClick={handleSign} disabled={loading}>
              {loading ? "Generating..." : "Tap to Sign and Confirm"}
            </Button>
          </div>
        </>
      )}

      {signedLink && (
        <div className="space-y-4">
          <p className="text-green-700 font-semibold">
            ✅ Signed disclosures ready:{" "}
            <a className="underline" href={signedLink} target="_blank" rel="noreferrer">
              {signedLink}
            </a>
          </p>
          <p>Thank you! – Team Perrone</p>
        </div>
      )}
    </main>
  );
}
