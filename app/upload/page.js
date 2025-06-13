"use client";
import { useState } from "react";
import axios from "axios";

export default function UploadPage() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", agentName: "", agentPhone: "" });
  const [files, setFiles] = useState([]);
  const [message, setMessage] = useState("");

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });
  const handleFiles = e => setFiles(e.target.files);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    for (const file of files) data.append("documents", file);
    for (const key in form) data.append(key, form[key]);

    const res = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/disclosure/upload`, data);
    setMessage(res.data.message);
  };

  return (
    <div className="max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Upload Disclosure Documents</h1>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input name="name" placeholder="Client Name" onChange={handleChange} className="w-full p-2 border" />
        <input name="email" placeholder="Client Email" onChange={handleChange} className="w-full p-2 border" />
        <input name="phone" placeholder="Client Phone" onChange={handleChange} className="w-full p-2 border" />
        <input name="agentName" placeholder="Agent Name" onChange={handleChange} className="w-full p-2 border" />
        <input name="agentPhone" placeholder="Agent Phone" onChange={handleChange} className="w-full p-2 border" />
        <input type="file" multiple onChange={handleFiles} className="w-full" />
        <button className="bg-blue-600 text-white px-4 py-2">Send Disclosure Link</button>
      </form>
      {message && <p className="mt-4 text-green-700">{message}</p>}
    </div>
  );
}