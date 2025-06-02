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
  const property = searchParams.get("property") || "";

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [signedLink, setSignedLink] = useState(null);
  const [error, setError] = useState(null);

  async function handleSign() {
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch("https://disclosure-backend.onrender.com/api/generate-disclosure", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, property })
      });

      if (!response.ok) throw new Error("Failed to generate disclosures");
      const data = await response.json();
      setSignedLink(data.downloadUrl);

      // Send to Google Sheets
      await fetch("https://hooks.zapier.com/hooks/catch/YOUR_ZAPIER_HOOK_ID", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, property, signedUrl: data.downloadUrl })
      });

      // Twilio webhook
      await fetch("https://hooks.zapier.com/hooks/catch/YOUR_TWILIO_HOOK_ID", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, message: `Hi ${name}, your signed disclosures are ready: ${data.downloadUrl}` })
      });

    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="max-w-xl mx-auto mt-10 p-4 border rounded-xl shadow">
      <h1 className="text-2xl font-bold mb-4">Disclosure Confirmation</h1>

      {signedLink ? (
        <div className="space-y-4">
          <p className="text-green-700 font-semibold">
            Here is your link to your signed disclosures: <a className="underline" href={signedLink} target="_blank">{signedLink}</a>
          </p>
          <p className="text-lg">Thank you, from Team Perrone - Realty Connect USA.</p>
        </div>
      ) : (
        <div className="space-y-4">
          <Input value={name} readOnly placeholder="Name" />
          <Input value={email} readOnly placeholder="Email" />
          <Input value={phone} readOnly placeholder="Phone" />
          <Textarea value={property} readOnly placeholder="Property Address" />

          <Button onClick={handleSign} disabled={isSubmitting}>
            {isSubmitting ? "Generating..." : "Tap to Sign and Confirm"}
          </Button>

          {error && <p className="text-red-600">{error}</p>}
        </div>
      )}
    </main>
  );
}
