// pages/sign.jsx

"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export default function SignPage() {
  const searchParams = useSearchParams();
  const name = searchParams.get("name") || "";
  const email = searchParams.get("email") || "";
  const phone = searchParams.get("phone") || "";

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
          body: JSON.stringify({ name, email, phone, })
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

    if (name && email && phone) fetchPreview();
    else setError("Missing required query parameters.");
  }, [name, email, phone]);

  const handleSign = async () => {
    try {
      setLoading(true);
      const response = await fetch("https://disclosure-backend.onrender.com/api/generate-disclosure", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Signing failed");
      setSignedLink(data.downloadUrl);

      await fetch("https://hooks.zapier.com/hooks/catch/YOUR_ZAPIER_HOOK_ID", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, signedUrl: data.downloadUrl })
      });

      await fetch("https://hooks.zapier.com/hooks/catch/YOUR_TWILIO_HOOK_ID", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, message: `Hi ${name}, your signed disclosures are ready: ${data.downloadUrl}` })
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

            <Button onClick={handleSign} disabled={loading}>
              {loading ? "Generating..." : "Tap to Sign and Confirm"}
            </Button>
          </div>
        </>
      )}

      {signedLink && (
        <div className="space-y-4">
          <p className="text-green-700 font-semibold">
            ✅ Signed disclosures ready: <a className="underline" href={signedLink} target="_blank">{signedLink}</a>
          </p>
          <p>Thank you! - Team Perrone</p>
        </div>
      )}
    </main>
  );
}
