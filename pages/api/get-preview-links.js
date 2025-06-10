import tenants from '../../../tenants.json';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { name, email, phone, tenant } = req.body;
  const tenantConfig = tenants.tenants[tenant];
  if (!tenantConfig) return res.status(400).json({ error: 'Invalid tenant' });

  // Construct Drive preview links for 4 disclosure files
  const fileBase = `${name.replace(/\s+/g, '_')}`;
  const fileNames = [
    `${fileBase}_FairHousingPreview.pdf`,
    `${fileBase}_AgencyPreview.pdf`,
    `${fileBase}_SOPPreview.pdf`,
    `${fileBase}_PCDSPreview.pdf`
  ];
  const links = fileNames.map(name =>
    `https://drive.google.com/file/d/${tenantConfig.previewFileIds[name]}/preview`
  );

  res.status(200).json({ links });
}
