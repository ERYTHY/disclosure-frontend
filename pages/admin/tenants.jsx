import { useEffect, useState } from 'react';

export default function TenantDashboard() {
  const [tenants, setTenants] = useState([]);
  const [defaultTenant, setDefaultTenant] = useState('');

  useEffect(() => {
    async function fetchTenants() {
      const res = await fetch('/api/admin/tenants');
      const data = await res.json();
      setTenants(data.tenants || []);
      setDefaultTenant(data.default || '');
    }
    fetchTenants();
  }, []);

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Tenant Configuration Dashboard</h1>
      {tenants.map(({ key, config, issues }) => (
        <div key={key} style={{ margin: '1rem 0', border: '1px solid #ccc', padding: '1rem', backgroundColor: issues.length ? '#fff3f3' : '#f9fff9' }}>
          <h2>{config.name || 'Unnamed Tenant'} {key === defaultTenant && <span style={{ color: 'green' }}>(default)</span>}</h2>
          <p><strong>Email:</strong> {config.email || '❌ Missing'}</p>
          <p><strong>Drive Folder:</strong> {config.googleDriveFolderId || '❌ Missing'}</p>
          <p><strong>Twilio Webhook:</strong> {config.twilioWebhookUrl || '❌ Missing'}</p>
          <p><strong>Agent Webhook:</strong> {config.agentTwilioWebhookUrl || '❌ Missing'}</p>
          <p><strong>Make Webhook:</strong> {config.makeWebhookUrl || '❌ Missing'}</p>
          <p><strong>Email Webhook:</strong> {config.emailWebhookUrl || '❌ Missing'}</p>

          {issues.length > 0 && (
            <div style={{ color: 'red' }}>
              <strong>Issues:</strong>
              <ul>{issues.map((i, idx) => <li key={idx}>⚠️ {i}</li>)}</ul>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
