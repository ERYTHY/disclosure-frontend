// pages/sign.jsx

import { useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input'; // adjust paths if needed
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

export default function SignPage() {
  const searchParams = useSearchParams();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    propertyAddress: '',
    signature: '',
  });

  useEffect(() => {
    const name = searchParams.get('name') || '';
    const email = searchParams.get('email') || '';
    const phone = searchParams.get('phone') || '';
    const property = searchParams.get('property') || '';

    setFormData({ name, email, phone, propertyAddress: property });
  }, [searchParams]);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSign = async () => {
    const res = await fetch('https://disclosure-backend.onrender.com/api/generate-disclosure', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    const data = await res.json();
    alert(`Signed! You can download it here:\n${data.downloadUrl}`);
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Sign Disclosure</h1>
      <Input name="name" value={formData.name} onChange={handleChange} placeholder="Your Full Name" />
      <Input name="email" value={formData.email} onChange={handleChange} placeholder="Email" />
      <Input name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone" />
      <Input name="propertyAddress" value={formData.propertyAddress} onChange={handleChange} placeholder="Property Address" />
      <Textarea name="signature" onChange={handleChange} placeholder="Type your name as a digital signature" />
      <Button onClick={handleSign} className="mt-4">Sign & Submit</Button>
    </div>
  );
}
