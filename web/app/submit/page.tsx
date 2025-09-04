"use client";
import { useRef, useState } from "react";

export default function SubmitPage() {
  const [form, setForm] = useState({
    xHandle: "",
    title: "",
    description: "",
    tags: "",
    llm: "",
    llmOther: "",
    prompt: "",
    file: null as File | null,
  });
  const [status, setStatus] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string>("");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus(null);
    const fd = new FormData();
    for (const key of ["xHandle", "title", "description", "tags", "llm", "prompt"]) {
      // @ts-ignore
      fd.append(key, form[key]);
    }
    if (form.llm === "other") {
      if (!form.llmOther || form.llmOther.trim().length === 0 || form.llmOther.trim().length > 16) {
        return setStatus("Please provide a custom model name (1–16 chars).");
      }
      fd.append("llmOther", form.llmOther.trim());
    }
    if (!form.file) return setStatus("Please attach a single HTML file.");
    if (!form.xHandle || !form.title || !form.description || !form.tags || !form.llm || !form.prompt) {
      return setStatus("All fields are required.");
    }
    fd.append("file", form.file);
    const res = await fetch("/api/upload", { method: "POST", body: fd });
    const data = await res.json();
    if (!res.ok) {
      setStatus(data.error || "Submission failed");
    } else {
      setStatus("Submitted! Your oneshot is pending review.");
    }
  };

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Submit a OneShot</h1>
        <p className="text-neutral-300 mt-1">Single HTML file only, with inline CSS/JS. No external resources.</p>
      </div>
      <div className="card p-4 text-sm text-neutral-700">
        <h2 className="font-medium text-neutral-900">Submission guidelines</h2>
        <ul className="mt-2 list-disc pl-5 space-y-1">
          <li>Provide your X handle (for credit on Explore and Play pages).</li>
          <li>Submit exactly one HTML file (no folders, no assets).</li>
          <li>Inline all CSS and JS. Do not reference external URLs.</li>
          <li>Max file size: 600KB.</li>
          <li>Disallowed: <code>link</code>, <code>iframe</code>, <code>object</code>, <code>embed</code>, <code>base</code>, or meta refresh.</li>
          <li>Select which LLM you used (ChatGPT, Claude, or Grok) and include the exact prompt.</li>
          <li>After review, approved submissions appear on Explore and the featured slot may rotate.</li>
        </ul>
      </div>
      <form onSubmit={onSubmit} className="space-y-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium">X handle (required)</label>
            <div className="flex items-center gap-2">
              <span className="text-sm text-neutral-500">@</span>
              <input className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm" placeholder="yourhandle" value={form.xHandle} onChange={(e) => setForm({ ...form, xHandle: e.target.value })} />
            </div>
            <p className="text-xs text-neutral-500 mt-1">Used for credit and linking (letters, numbers, underscore; max 15).</p>
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium">Title</label>
            <input className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium">Description</label>
            <textarea className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm" rows={3} required value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium">Tags (comma-separated)</label>
            <input className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm" placeholder="e.g. puzzle, arcade" required value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm font-medium">LLM used</label>
            <select required className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm" value={form.llm} onChange={(e) => setForm({ ...form, llm: e.target.value })}>
              <option value="">Select one…</option>
              <option value="chatgpt">ChatGPT (OpenAI)</option>
              <option value="claude">Claude (Anthropic)</option>
              <option value="gemini">Gemini (Google)</option>
              <option value="llama">Llama (Meta)</option>
              <option value="mistral">Mistral</option>
              <option value="deepseek">DeepSeek</option>
              <option value="cohere">Cohere (Command)</option>
              <option value="perplexity">Perplexity (Sonar)</option>
              <option value="grok">Grok (xAI)</option>
              <option value="other">Not listed</option>
            </select>
          </div>
          {form.llm === "other" && (
            <div>
              <label className="block text-sm font-medium">Model name (max 16 chars)</label>
              <input
                required
                maxLength={16}
                className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm"
                placeholder="e.g. my-custom-llm"
                value={form.llmOther}
                onChange={(e) => setForm({ ...form, llmOther: e.target.value })}
              />
            </div>
          )}
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium">Prompt used</label>
            <textarea required className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm" rows={6} placeholder="Paste the exact prompt you used" value={form.prompt} onChange={(e) => setForm({ ...form, prompt: e.target.value })} />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium">HTML file</label>
            <input
              ref={fileRef}
              type="file"
              accept=".html,text/html"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0] || null;
                setForm({ ...form, file: f });
                setFileName(f ? f.name : "");
              }}
            />
            <div className="mt-2 flex items-center gap-3">
              <button type="button" className="btn-secondary" onClick={() => fileRef.current?.click()}>
                Select HTML file
              </button>
              <span className="text-xs text-neutral-400 truncate max-w-[60%]">
                {fileName || "No file selected"}
              </span>
            </div>
            <p className="text-xs text-neutral-500 mt-1">Max 600KB. Single HTML with inline CSS/JS only.</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button type="submit" className="btn-primary">Submit for review</button>
          <a href="/explore" className="btn-secondary">Explore</a>
        </div>
      </form>
      {status && <div className="rounded-lg border border-neutral-200 bg-white p-3 text-sm">{status}</div>}
    </div>
  );
}
