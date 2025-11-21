'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

interface LinkStats {
  id: number;
  short_code: string;
  original_url: string;
  created_at: string;
  total_clicks: number;
  last_clicked_at: string | null;
}

export default function StatsPage({ params }: { params: Promise<{ code: string }> }) {
  const [link, setLink] = useState<LinkStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    params.then((p) => {
      fetch(`/api/links/${p.code}`)
        .then((res) => (res.ok ? res.json() : Promise.reject('Not found')))
        .then(setLink)
        .catch(() => setError('Link not found'))
        .finally(() => setLoading(false));
    });
  }, [params]);

  if (loading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4 text-red-600">{error}</div>;
  if (!link) return null;

  return (
    <div className="min-h-screen bg-blue-50">
      <header className="bg-white shadow">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <Link href="/" className="text-blue-600 font-medium">← Back</Link>
          <h1 className="text-3xl font-bold text-gray-900 mt-2">Stats</h1>
        </div>
      </header>
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white p-8 rounded shadow">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Code</h3>
              <code className="text-2xl font-bold text-blue-600">{link.short_code}</code>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Clicks</h3>
              <div className="text-5xl font-bold text-blue-600">{link.total_clicks}</div>
            </div>
          </div>
          <div className="mt-8">
            <h3 className="text-sm font-medium text-gray-700 mb-2">URL</h3>
            <a href={link.original_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline break-all">
              {link.original_url}
            </a>
          </div>
          <div className="grid md:grid-cols-2 gap-8 mt-8 pt-8 border-t">
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Created</h3>
              <p>{new Date(link.created_at).toLocaleString()}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Last Click</h3>
              <p>{link.last_clicked_at ? new Date(link.last_clicked_at).toLocaleString() : 'Never'}</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
