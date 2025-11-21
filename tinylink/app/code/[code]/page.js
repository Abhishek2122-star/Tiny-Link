"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function CodeStatsPage() {
  const params = useParams();
  const code = params.code;

  const [link, setLink] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/links/${code}`);
        if (res.status === 404) {
          setError("Link not found");
          setLink(null);
          return;
        }
        if (!res.ok) {
          setError("Error loading stats");
          return;
        }
        const data = await res.json();
        setLink(data);
      } catch {
        setError("Error loading stats");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [code]);

  if (loading) {
    return <p className="p-4 text-sm text-gray-500">Loading stats…</p>;
  }

  if (error) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white rounded-xl shadow p-6 max-w-md w-full">
          <p className="text-sm text-red-600">{error}</p>
          <a href="/" className="text-sm text-blue-600 mt-2 inline-block">
            Back to dashboard
          </a>
        </div>
      </main>
    );
  }

  if (!link) return null;

  const baseUrl =
    typeof window !== "undefined"
      ? window.location.origin
      : process.env.NEXT_PUBLIC_BASE_URL || "";

  const shortUrl = `${baseUrl}/${link.code}`;

  return (
    <main className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-3xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-lg font-semibold">Link Stats</h1>
          <a href="/" className="text-sm text-blue-600 hover:underline">
            Back to dashboard
          </a>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 py-6">
        <div className="bg-white rounded-xl shadow p-6 space-y-4">
          <div>
            <h2 className="text-sm font-medium text-gray-500">Short URL</h2>
            <p className="text-base font-mono">{shortUrl}</p>
          </div>
          <div>
            <h2 className="text-sm font-medium text-gray-500">Target URL</h2>
            <a
              href={link.targetUrl}
              target="_blank"
              className="text-sm text-blue-600 break-all"
            >
              {link.targetUrl}
            </a>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="border rounded-lg p-3">
              <div className="text-xs text-gray-500">Total clicks</div>
              <div className="text-xl font-semibold">{link.totalClicks}</div>
            </div>
            <div className="border rounded-lg p-3">
              <div className="text-xs text-gray-500">Last clicked</div>
              <div className="text-sm">
                {link.lastClickedAt
                  ? new Date(link.lastClickedAt).toLocaleString()
                  : "Never"}
              </div>
            </div>
          </div>
          <div>
            <div className="text-xs text-gray-500">Created at</div>
            <div className="text-sm">
              {new Date(link.createdAt).toLocaleString()}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
