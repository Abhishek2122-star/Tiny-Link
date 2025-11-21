'use client';

import { useEffect, useState } from 'react';

interface Link {
  id: number;
  short_code: string;
  original_url: string;
  created_at: string;
  total_clicks: number;
  last_clicked_at: string | null;
}

export default function Dashboard() {
  const [links, setLinks] = useState<Link[]>([]);
  const [loading, setLoading] = useState(true);
  const [url, setUrl] = useState('');
  const [code, setCode] = useState('');
  const [msg, setMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchLinks();
  }, []);

  const fetchLinks = async () => {
    try {
      const res = await fetch('/api/links');
      if (res.ok) {
        setLinks(await res.json());
      }
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setMsg('');

    try {
      const res = await fetch('/api/links', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ originalUrl: url, customCode: code || undefined }),
      });

      if (res.ok) {
        setUrl('');
        setCode('');
        setMsg('Created!');
        setTimeout(() => setMsg(''), 3000);
        fetchLinks();
      } else {
        const data = await res.json();
        setMsg(data.error || 'Failed');
      }
    } catch (err) {
      setMsg('Error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (c: string) => {
    if (!confirm('Delete?')) return;
    try {
      await fetch(`/api/links/${c}`, { method: 'DELETE' });
      fetchLinks();
    } catch (err) {
      alert('Error');
    }
  };

  return (
    <div className="min-h-screen bg-blue-50">
      <header className="bg-white shadow">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <h1 className="text-4xl font-bold">TinyLink</h1>
          <p className="text-gray-600">URL Shortener</p>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {msg && (
          <div className={`mb-4 p-4 rounded ${msg.includes('Failed') || msg.includes('Error') ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
            {msg}
          </div>
        )}

        <div className="grid md:grid-cols-3 gap-8">
          <form onSubmit={handleSubmit} className="md:col-span-1 bg-white p-6 rounded shadow">
            <h2 className="text-xl font-bold mb-4">Create Link</h2>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="https://..."
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                disabled={submitting}
                className="w-full px-4 py-2 border rounded"
                required
              />
              <input
                type="text"
                placeholder="Code (optional)"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                disabled={submitting}
                maxLength={8}
                className="w-full px-4 py-2 border rounded"
              />
              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
              >
                {submitting ? 'Creating...' : 'Create'}
              </button>
            </div>
          </form>

          <div className="md:col-span-2 bg-white p-6 rounded shadow">
            <h2 className="text-xl font-bold mb-4">Links</h2>
            {loading ? (
              <p>Loading...</p>
            ) : links.length === 0 ? (
              <p className="text-gray-600">No links</p>
            ) : (
              <table className="w-full text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-2 text-left">Code</th>
                    <th className="px-4 py-2 text-left">URL</th>
                    <th className="px-4 py-2 text-center">Clicks</th>
                    <th className="px-4 py-2 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {links.map((link) => (
                    <tr key={link.id} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-2 font-mono">{link.short_code}</td>
                      <td className="px-4 py-2 truncate">{link.original_url}</td>
                      <td className="px-4 py-2 text-center font-bold">{link.total_clicks}</td>
                      <td className="px-4 py-2 text-center">
                        <a href={`/code/${link.short_code}`} className="px-2 py-1 bg-gray-100 rounded text-xs mr-2">
                          Stats
                        </a>
                        <button
                          onClick={() => handleDelete(link.short_code)}
                          className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
