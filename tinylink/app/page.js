"use client";

import { useEffect, useState } from "react";

export default function DashboardPage() {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [error, setError] = useState(null);

  const [targetUrl, setTargetUrl] = useState("");
  const [code, setCode] = useState("");
  const [filter, setFilter] = useState("");

  useEffect(() => {
    fetchLinks();
  }, []);

  async function fetchLinks() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/links");
      if (!res.ok) throw new Error("Failed to load links");
      const data = await res.json();
      setLinks(data);
    } catch (err) {
      setError(err.message || "Error loading links");
    } finally {
      setLoading(false);
    }
  }

  function validateForm() {
    try {
      const u = new URL(targetUrl);
      if (!["http:", "https:"].includes(u.protocol)) {
        return "URL must start with http or https";
      }
    } catch {
      return "Please enter a valid URL";
    }

    if (code && !/^[A-Za-z0-9]{6,8}$/.test(code)) {
      return "Custom code must match [A-Za-z0-9]{6,8}";
    }

    return null;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setFormLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/links", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          targetUrl,
          code: code || undefined,
        }),
      });

      if (res.status === 409) {
        const body = await res.json();
        setError(body.error || "Code already exists");
        return;
      }

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setError(body.error || "Failed to create link");
        return;
      }

      setTargetUrl("");
      setCode("");
      await fetchLinks();
    } finally {
      setFormLoading(false);
    }
  }

  async function handleDelete(code) {
    if (!confirm(`Delete link ${code}?`)) return;
    const res = await fetch(`/api/links/${code}`, { method: "DELETE" });
    if (res.ok) {
      setLinks((prev) => prev.filter((l) => l.code !== code));
    }
  }

  function filteredLinks() {
    const q = filter.toLowerCase();
    return links.filter(
      (l) =>
        l.code.toLowerCase().includes(q) ||
        l.targetUrl.toLowerCase().includes(q)
    );
  }

  function copyToClipboard(text) {
    navigator.clipboard.writeText(text);
    alert("Copied!");
  }

  const baseUrl =
    typeof window !== "undefined"
      ? window.location.origin
      : process.env.NEXT_PUBLIC_BASE_URL || "";

  return (
    <main className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-semibold">TinyLink Dashboard</h1>
          <a
            href="/healthz"
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            Healthcheck
          </a>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
        {/* Form */}
        <section className="bg-white rounded-xl shadow p-4 space-y-4">
          <h2 className="font-semibold">Create Short Link</h2>
          {error && (
            <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded p-2">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="space-y-1">
              <label className="block text-sm font-medium">Target URL</label>
              <input
                type="url"
                className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring focus:ring-blue-200"
                placeholder="https://example.com/very/long/url"
                value={targetUrl}
                onChange={(e) => setTargetUrl(e.target.value)}
                required
              />
            </div>
            <div className="space-y-1">
              <label className="block text-sm font-medium">
                Custom short code (optional)
              </label>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">
                  {baseUrl || "https://your-domain"}/
                </span>
                <input
                  type="text"
                  className="border rounded px-3 py-2 text-sm flex-1 focus:outline-none focus:ring focus:ring-blue-200"
                  placeholder="abc123"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                />
              </div>
              <p className="text-xs text-gray-500">
                Must be 6–8 characters, letters or digits; must be unique.
              </p>
            </div>
            <button
              type="submit"
              disabled={formLoading}
              className="inline-flex items-center px-4 py-2 rounded bg-blue-600 text-white text-sm font-medium disabled:opacity-60"
            >
              {formLoading ? "Creating..." : "Create"}
            </button>
          </form>
        </section>

        {/* Table */}
        <section className="bg-white rounded-xl shadow p-4">
          <div className="flex items-center justify-between mb-3 gap-2">
            <h2 className="font-semibold">All Links</h2>
            <input
              type="text"
              placeholder="Filter by code or URL..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="border rounded px-3 py-1.5 text-sm focus:outline-none focus:ring focus:ring-blue-200"
            />
          </div>

          {loading ? (
            <p className="text-sm text-gray-500">Loading links…</p>
          ) : filteredLinks().length === 0 ? (
            <p className="text-sm text-gray-500">
              No links yet. Create your first short link above.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="border-b text-left">
                    <th className="py-2 pr-4">Code</th>
                    <th className="py-2 pr-4">Target URL</th>
                    <th className="py-2 pr-4">Clicks</th>
                    <th className="py-2 pr-4">Last clicked</th>
                    <th className="py-2 pr-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLinks().map((link) => {
                    const shortUrl = `${baseUrl}/${link.code}`;
                    return (
                      <tr key={link.code} className="border-b last:border-0">
                        <td className="py-2 pr-4 whitespace-nowrap">
                          <a
                            href={`/code/${link.code}`}
                            className="text-blue-600 hover:underline"
                          >
                            {link.code}
                          </a>
                        </td>
                        <td className="py-2 pr-4 max-w-xs">
                          <div className="flex items-center gap-2">
                            <span className="truncate" title={link.targetUrl}>
                              {link.targetUrl}
                            </span>
                            <button
                              type="button"
                              onClick={() => copyToClipboard(link.targetUrl)}
                              className="text-xs px-2 py-1 border rounded"
                            >
                              Copy
                            </button>
                          </div>
                        </td>
                        <td className="py-2 pr-4">{link.totalClicks}</td>
                        <td className="py-2 pr-4 whitespace-nowrap text-xs text-gray-500">
                          {link.lastClickedAt
                            ? new Date(link.lastClickedAt).toLocaleString()
                            : "Never"}
                        </td>
                        <td className="py-2 pr-4 space-x-2 whitespace-nowrap">
                          <button
                            type="button"
                            onClick={() => copyToClipboard(shortUrl)}
                            className="text-xs px-2 py-1 border rounded"
                          >
                            Copy Short
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(link.code)}
                            className="text-xs px-2 py-1 rounded bg-red-100 text-red-700"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
