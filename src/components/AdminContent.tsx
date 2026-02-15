"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";

interface SenseField {
  type: string;
  brand: string;
  description: string;
  storyReference: string;
  link: string;
}

interface EpisodeForm {
  id: number;
  slug: string;
  title: string;
  subtitle: string;
  date: string;
  headerImage: string;
  excerpt: string;
  senses: SenseField[];
  foodForThought: string;
  content: string;
}

interface EpisodeListItem {
  id: number;
  slug: string;
  title: string;
  subtitle: string;
  date: string;
}

const emptySense: SenseField = {
  type: "taste",
  brand: "",
  description: "",
  storyReference: "",
  link: "",
};

const emptyForm: EpisodeForm = {
  id: 0,
  slug: "",
  title: "",
  subtitle: "",
  date: "",
  headerImage: "",
  excerpt: "",
  senses: [{ ...emptySense }],
  foodForThought: "",
  content: "",
};

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/['']/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

// Shared input classes
const inputClass =
  "w-full bg-white/5 border border-burgundy/30 rounded px-3 py-2 text-burgundy placeholder:text-burgundy/40 focus:outline-none focus:border-hot-pink/60 focus:ring-1 focus:ring-hot-pink/30 transition-colors";
const labelClass = "block text-sm font-medium text-burgundy/70 mb-1";
const btnPrimary =
  "bg-hot-pink text-white font-medium px-6 py-2 rounded hover:bg-hot-pink/80 transition-colors disabled:opacity-40 disabled:cursor-not-allowed";
const btnSecondary =
  "border border-burgundy/30 text-burgundy px-4 py-2 rounded hover:bg-burgundy/10 transition-colors";

export default function AdminContent() {
  const [token, setToken] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  const [mode, setMode] = useState<"new" | "edit">("new");
  const [form, setForm] = useState<EpisodeForm>({ ...emptyForm });
  const [episodes, setEpisodes] = useState<EpisodeListItem[]>([]);
  const [selectedSlug, setSelectedSlug] = useState("");
  const [loadingEpisode, setLoadingEpisode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  // Restore token from sessionStorage on mount
  useEffect(() => {
    const stored = sessionStorage.getItem("admin_token");
    if (stored) setToken(stored);
  }, []);

  const authHeaders = useCallback(
    () => ({ Authorization: `Bearer ${token}`, "Content-Type": "application/json" }),
    [token]
  );

  // Login handler
  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoginError("");
    setLoginLoading(true);
    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) {
        setLoginError("Incorrect password");
        return;
      }
      const { token: t } = await res.json();
      sessionStorage.setItem("admin_token", t);
      setToken(t);
    } catch {
      setLoginError("Connection error");
    } finally {
      setLoginLoading(false);
    }
  }

  // Fetch episode list when entering edit mode
  useEffect(() => {
    if (mode === "edit" && token) {
      fetch("/api/episodes", { headers: authHeaders() })
        .then((r) => r.json())
        .then((data) => {
          if (Array.isArray(data)) setEpisodes(data);
        });
    }
  }, [mode, token, authHeaders]);

  // Load selected episode
  async function loadEpisode(slug: string) {
    setSelectedSlug(slug);
    if (!slug) return;
    setLoadingEpisode(true);
    try {
      const res = await fetch(`/api/episodes/${slug}`, {
        headers: authHeaders(),
      });
      if (!res.ok) throw new Error("Failed to load");
      const { frontmatter, content } = await res.json();
      setForm({
        id: frontmatter.id || 0,
        slug: frontmatter.slug || slug,
        title: frontmatter.title || "",
        subtitle: frontmatter.subtitle || "",
        date: frontmatter.date || "",
        headerImage: frontmatter.headerImage || "",
        excerpt: frontmatter.excerpt || "",
        senses: (frontmatter.senses || []).map(
          (s: Partial<SenseField>) => ({
            type: s.type || "taste",
            brand: s.brand || "",
            description: s.description || "",
            storyReference: s.storyReference || "",
            link: s.link || "",
          })
        ),
        foodForThought: frontmatter.foodForThought || "",
        content: content || "",
      });
    } catch {
      setFeedback({ type: "error", message: "Failed to load episode" });
    } finally {
      setLoadingEpisode(false);
    }
  }

  // Save handler
  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setFeedback(null);
    try {
      // Strip empty optional fields from senses
      const cleanSenses = form.senses.map((s) => {
        const sense: Record<string, string> = {
          type: s.type,
          brand: s.brand,
          description: s.description,
        };
        if (s.storyReference) sense.storyReference = s.storyReference;
        if (s.link) sense.link = s.link;
        return sense;
      });

      const payload = {
        ...form,
        senses: cleanSenses,
        foodForThought: form.foodForThought || undefined,
      };

      const res = await fetch("/api/episodes/save", {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Save failed");
      setFeedback({
        type: "success",
        message: data.message || "Saved! Vercel will auto-deploy shortly.",
      });
    } catch (err) {
      setFeedback({
        type: "error",
        message: err instanceof Error ? err.message : "Save failed",
      });
    } finally {
      setSaving(false);
    }
  }

  // Field updaters
  function updateField(field: keyof EpisodeForm, value: string | number) {
    setForm((prev) => {
      const updated = { ...prev, [field]: value };
      // Auto-generate slug from title (only in new mode and if slug hasn't been manually edited)
      if (field === "title" && mode === "new") {
        updated.slug = slugify(value as string);
      }
      return updated;
    });
  }

  function updateSense(
    index: number,
    field: keyof SenseField,
    value: string
  ) {
    setForm((prev) => {
      const senses = [...prev.senses];
      senses[index] = { ...senses[index], [field]: value };
      return { ...prev, senses };
    });
  }

  function addSense() {
    setForm((prev) => ({
      ...prev,
      senses: [...prev.senses, { ...emptySense }],
    }));
  }

  function removeSense(index: number) {
    setForm((prev) => ({
      ...prev,
      senses: prev.senses.filter((_, i) => i !== index),
    }));
  }

  // ---------- LOGIN GATE ----------
  if (!token) {
    return (
      <div className="min-h-screen -mt-20 pt-20 bg-cream flex items-center justify-center p-4">
        <form
          onSubmit={handleLogin}
          className="w-full max-w-sm bg-white/5 border border-burgundy/20 rounded-xl p-8 backdrop-blur-sm"
        >
          <h1 className="font-serif text-2xl text-burgundy mb-6 text-center tracking-wider">
            SMOKY<span className="text-hot-pink">.</span>
          </h1>
          <label className={labelClass}>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={`${inputClass} mb-4`}
            autoFocus
          />
          {loginError && (
            <p className="text-hot-pink text-sm mb-3">{loginError}</p>
          )}
          <button
            type="submit"
            disabled={loginLoading || !password}
            className={`${btnPrimary} w-full`}
          >
            {loginLoading ? "..." : "Enter"}
          </button>
        </form>
      </div>
    );
  }

  // ---------- DASHBOARD ----------
  return (
    <div className="min-h-screen bg-cream p-4 md:p-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link href="/" className="font-serif text-xl text-burgundy tracking-wider hover:opacity-70 transition-opacity">
            SMOKY<span className="text-hot-pink">.</span>
          </Link>
          <div className="flex gap-2">
            <button
              onClick={() => {
                setMode("new");
                setForm({ ...emptyForm });
                setSelectedSlug("");
                setFeedback(null);
              }}
              className={mode === "new" ? btnPrimary : btnSecondary}
            >
              New
            </button>
            <button
              onClick={() => {
                setMode("edit");
                setFeedback(null);
              }}
              className={mode === "edit" ? btnPrimary : btnSecondary}
            >
              Edit
            </button>
            <button
              onClick={() => {
                sessionStorage.removeItem("admin_token");
                setToken(null);
              }}
              className={`${btnSecondary} text-sm`}
            >
              Logout
            </button>
          </div>
        </div>

        {/* Feedback banner */}
        {feedback && (
          <div
            className={`mb-6 px-4 py-3 rounded border ${
              feedback.type === "success"
                ? "border-green-500/40 bg-green-500/10 text-green-300"
                : "border-hot-pink/40 bg-hot-pink/10 text-hot-pink"
            }`}
          >
            {feedback.message}
          </div>
        )}

        {/* Edit mode: episode picker */}
        {mode === "edit" && (
          <div className="mb-6">
            <label className={labelClass}>Select episode</label>
            <select
              value={selectedSlug}
              onChange={(e) => loadEpisode(e.target.value)}
              className={inputClass}
            >
              <option value="">— Choose —</option>
              {episodes.map((ep) => (
                <option key={ep.slug} value={ep.slug}>
                  #{ep.id} — {ep.title}
                </option>
              ))}
            </select>
            {loadingEpisode && (
              <p className="text-burgundy/50 text-sm mt-2">Loading...</p>
            )}
          </div>
        )}

        {/* Episode form */}
        {(mode === "new" || selectedSlug) && (
          <form onSubmit={handleSave} className="space-y-5">
            {/* ID + Slug row */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>ID (number)</label>
                <input
                  type="number"
                  value={form.id || ""}
                  onChange={(e) => updateField("id", Number(e.target.value))}
                  className={inputClass}
                  required
                />
              </div>
              <div>
                <label className={labelClass}>Slug</label>
                <input
                  type="text"
                  value={form.slug}
                  onChange={(e) => updateField("slug", e.target.value)}
                  className={inputClass}
                  required
                />
              </div>
            </div>

            {/* Title */}
            <div>
              <label className={labelClass}>Title</label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => updateField("title", e.target.value)}
                className={inputClass}
                required
              />
            </div>

            {/* Subtitle */}
            <div>
              <label className={labelClass}>Subtitle</label>
              <input
                type="text"
                value={form.subtitle}
                onChange={(e) => updateField("subtitle", e.target.value)}
                className={inputClass}
                required
              />
            </div>

            {/* Date + Header Image row */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Date</label>
                <input
                  type="text"
                  value={form.date}
                  onChange={(e) => updateField("date", e.target.value)}
                  className={inputClass}
                  placeholder="e.g. 19th December 2025"
                  required
                />
              </div>
              <div>
                <label className={labelClass}>Header image path</label>
                <input
                  type="text"
                  value={form.headerImage}
                  onChange={(e) => updateField("headerImage", e.target.value)}
                  className={inputClass}
                  placeholder="/content/imgs/..."
                  required
                />
              </div>
            </div>

            {/* Excerpt */}
            <div>
              <label className={labelClass}>Excerpt</label>
              <textarea
                value={form.excerpt}
                onChange={(e) => updateField("excerpt", e.target.value)}
                className={`${inputClass} h-20 resize-y`}
                required
              />
            </div>

            {/* Senses */}
            <fieldset className="border border-burgundy/20 rounded-lg p-4 space-y-4">
              <legend className="text-burgundy/70 text-sm font-medium px-2">
                Senses
              </legend>
              {form.senses.map((sense, i) => (
                <div
                  key={i}
                  className="bg-white/[0.03] border border-burgundy/10 rounded-lg p-4 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-burgundy/50 text-xs uppercase tracking-wider">
                      Sense #{i + 1}
                    </span>
                    {form.senses.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeSense(i)}
                        className="text-hot-pink/60 hover:text-hot-pink text-sm"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className={labelClass}>Type</label>
                      <select
                        value={sense.type}
                        onChange={(e) =>
                          updateSense(i, "type", e.target.value)
                        }
                        className={inputClass}
                      >
                        <option value="taste">taste</option>
                        <option value="hear">hear</option>
                        <option value="see">see</option>
                        <option value="grab">grab</option>
                      </select>
                    </div>
                    <div>
                      <label className={labelClass}>Brand</label>
                      <input
                        type="text"
                        value={sense.brand}
                        onChange={(e) =>
                          updateSense(i, "brand", e.target.value)
                        }
                        className={inputClass}
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className={labelClass}>Description</label>
                    <textarea
                      value={sense.description}
                      onChange={(e) =>
                        updateSense(i, "description", e.target.value)
                      }
                      className={`${inputClass} h-16 resize-y`}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className={labelClass}>
                        Story reference (optional)
                      </label>
                      <input
                        type="text"
                        value={sense.storyReference}
                        onChange={(e) =>
                          updateSense(i, "storyReference", e.target.value)
                        }
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Link (optional)</label>
                      <input
                        type="text"
                        value={sense.link}
                        onChange={(e) =>
                          updateSense(i, "link", e.target.value)
                        }
                        className={inputClass}
                      />
                    </div>
                  </div>
                </div>
              ))}
              <button type="button" onClick={addSense} className={btnSecondary}>
                + Add sense
              </button>
            </fieldset>

            {/* Food for Thought */}
            <div>
              <label className={labelClass}>Food for Thought (optional)</label>
              <textarea
                value={form.foodForThought}
                onChange={(e) => updateField("foodForThought", e.target.value)}
                className={`${inputClass} h-20 resize-y`}
              />
            </div>

            {/* Content */}
            <div>
              <label className={labelClass}>
                Content (paragraphs separated by blank lines)
              </label>
              <textarea
                value={form.content}
                onChange={(e) => updateField("content", e.target.value)}
                className={`${inputClass} h-64 resize-y font-mono text-sm`}
                required
              />
            </div>

            {/* Submit */}
            <button type="submit" disabled={saving} className={btnPrimary}>
              {saving
                ? "Publishing..."
                : mode === "edit"
                  ? "Update Episode"
                  : "Publish Episode"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
