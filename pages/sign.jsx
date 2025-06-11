"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from 'next/router';



export default function SignPage() {
  const searchParams = useSearchParams();
  const name = searchParams.get("name") || "";
  const email = searchParams.get("email") || "";
  const phone = searchParams.get("phone") || "";
  const tenantId = searchParams.get("tenant") || "team-perrone";
  const agentPhone = searchParams.get("agentPhone") || "";
  const fubContactId = searchParams.get("fubContactId") || "";
  const transactionAgentName = searchParams.get("transactionAgentName") || "";

  const [tenant, setTenant] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [signedLink, setSignedLink] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Determine effective agent name
  const effectiveAgentName = transactionAgentName || tenant?.agentName || "Your Agent";

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
        console.log("Backend response for preview-disclosure:", JSON.stringify(data, null, 2));
        if (!response.ok) throw new Error(data.message || "Failed to fetch preview");
        if (!data.previewUrl) throw new Error("No preview URL returned.");
        console.log("Attempting to set previewUrl with:", data.previewUrl);
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

  useEffect(() => {
    const fetchTenantData = async () => {
      if (tenantId) {
        setLoading(true);
        setError(null); // Clear previous errors
        try {
          const res = await fetch(`/api/admin/tenants`);
          if (!res.ok) {
            throw new Error(`Failed to fetch tenants: ${res.status}`);
          }
          const tenantsData = await res.json();
          const allTenants = Array.isArray(tenantsData) ? tenantsData : tenantsData.tenants || [];
          const currentTenantRaw = allTenants.find(t => t.id === tenantId || t.key === tenantId);

          if (currentTenantRaw) {
            const adaptedTenant = {
              id: currentTenantRaw.id || currentTenantRaw.key,
              label: currentTenantRaw.config?.name || currentTenantRaw.name || "Tenant",
              branding: {
                logoUrl: currentTenantRaw.config?.branding?.logoUrl || currentTenantRaw.branding?.logoUrl,
                primaryColor: currentTenantRaw.config?.branding?.primaryColor || currentTenantRaw.branding?.primaryColor,
              },
              fubWebhookUrl: currentTenantRaw.config?.fubWebhookUrl || currentTenantRaw.config?.makeWebhookUrl || currentTenantRaw.fubWebhookUrl || currentTenantRaw.makeWebhookUrl,
              twilioWebhookUrl: currentTenantRaw.config?.twilioWebhookUrl || currentTenantRaw.twilioWebhookUrl,
              agentName: currentTenantRaw.config?.agentName || currentTenantRaw.agentName,
            };
            setTenant(adaptedTenant);
          } else {
            setError(`Tenant with ID "${tenantId}" not found.`);
            console.error(`Tenant with ID "${tenantId}" not found.`);
          }
        } catch (error) {
          setError("Failed to load tenant information.");
          console.error("❌ Fetch tenant error:", error);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchTenantData();
  }, [tenantId]);

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
      if (tenant?.fubWebhookUrl) {
        await fetch(tenant.fubWebhookUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, phone, signedUrl: data.downloadUrl })
        });
      }

      if (tenant?.twilioWebhookUrl) {
        await fetch(tenant.twilioWebhookUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, phone, signedUrl: data.downloadUrl })
        });
      }

      // await fetch('/api/signed-disclosure', {
      // }); // Removed empty call

      await fetch('/api/signed-disclosure', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          phone,
          tenantId,
          signedUrl: data.downloadUrl,
          agentPhone,
          fubContactId,
          agentName: effectiveAgentName,
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
          <img src={tenant.branding.logoUrl} alt={tenant.label || "Tenant"} className="h-12" />
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
          <p>Thank you! — {effectiveAgentName}</p>
        </div>
      )}
    </main>
  );
}
