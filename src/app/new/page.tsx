'use client';

import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import Topbar from '@/components/Topbar';
import Link from 'next/link';

function InfoIcon({ text }: { text: string }) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative inline-block">
      <button
        type="button"
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
        className="ml-2 text-[var(--muted)] hover:text-[var(--foreground-soft)] transition-colors text-xs font-mono w-4 h-4 rounded-full bg-[var(--muted-bg)] inline-flex items-center justify-center"
      >
        ?
      </button>
      {show && (
        <div className="absolute left-0 top-6 w-56 bg-[var(--surface)] text-[var(--foreground-soft)] text-xs rounded-lg shadow-lg p-3 z-10 font-mono leading-relaxed" style={{ border: '1px solid var(--border)' }}>
          {text}
        </div>
      )}
    </div>
  );
}

export default function NewModel() {
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [actions, setActions] = useState(['']);
  const [context, setContext] = useState('');
  const [files, setFiles] = useState<File[]>([]);

  const addAction = () => setActions([...actions, '']);
  const removeAction = (i: number) => setActions(actions.filter((_, idx) => idx !== i));
  const updateAction = (i: number, v: string) => {
    const a = [...actions]; a[i] = v; setActions(a);
  };
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const allowed = ['.pdf', '.txt', '.md', '.json', '.csv', '.doc', '.docx'];
    setFiles([...files, ...Array.from(e.target.files).filter((f) => allowed.some((ext) => f.name.endsWith(ext)))]);
  };
  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); console.log({ name, url, actions, context, files }); };

  const inputClass = 'w-full px-4 py-3 text-sm font-mono rounded-lg bg-[var(--muted-bg)] text-[var(--foreground)] placeholder-[var(--muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/30 transition-all';
  const labelClass = 'flex items-center text-xs font-mono font-medium text-[var(--muted)] uppercase tracking-wider mb-2.5';

  return (
    <div className="flex h-screen bg-[var(--background)]">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar />

        <main className="flex-1 overflow-y-auto">
          <div className="max-w-3xl mx-auto px-10 py-12">

            <div className="mb-10">
              <p className="text-xs font-mono text-[var(--muted)] uppercase tracking-widest mb-2">Models</p>
              <h1 className="text-2xl font-semibold text-[var(--foreground)] tracking-tight">New Model</h1>
              <p className="text-sm text-[var(--muted)] font-mono mt-1.5">Configure a new AI model with actions and context</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Name */}
              <div>
                <label className={labelClass}>
                  Name <InfoIcon text="A unique identifier for your model, shown in the model list." />
                </label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="my-model" className={inputClass} required />
              </div>

              {/* URL */}
              <div>
                <label className={labelClass}>
                  URL <InfoIcon text="The endpoint your model will use to interact with external services." />
                </label>
                <input type="url" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://example.com" className={inputClass} required />
              </div>

              {/* Actions */}
              <div>
                <label className={labelClass}>
                  Actions <InfoIcon text="Define actions your model can perform. Be direct and concise." />
                </label>
                <div className="space-y-3">
                  {actions.map((action, i) => (
                    <div key={i} className="flex gap-3">
                      <input
                        type="text"
                        value={action}
                        onChange={(e) => updateAction(i, e.target.value)}
                        placeholder={i === 0 ? 'What should the agent do?' : `Action ${i + 1}`}
                        className={inputClass}
                      />
                      {actions.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeAction(i)}
                          className="px-4 py-3 text-sm font-mono text-rose-500 hover:bg-rose-500/10 rounded-lg transition-colors"
                        >
                          rm
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                <button type="button" onClick={addAction} className="mt-3 text-sm font-mono text-[var(--accent)] hover:opacity-80 transition-opacity">
                  + add action
                </button>
              </div>

              {/* Context */}
              <div>
                <label className={labelClass}>
                  Context <InfoIcon text="Instructions and guidelines that guide the model's behavior." />
                </label>
                <textarea
                  value={context}
                  onChange={(e) => setContext(e.target.value)}
                  placeholder="Add context and instructions for the model..."
                  rows={8}
                  className={`${inputClass} resize-none leading-relaxed`}
                />
              </div>

              {/* File Upload */}
              <div>
                <label className={labelClass}>
                  Files <InfoIcon text="Upload PDFs, markdown, or CSVs for the model to reference." />
                </label>
                <div className="relative rounded-lg p-8 hover:bg-[var(--muted-bg)] transition-colors cursor-pointer text-center" style={{ border: '1.5px dashed var(--border)' }}>
                  <input
                    type="file" multiple accept=".pdf,.txt,.md,.json,.csv,.doc,.docx"
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <p className="text-sm font-mono text-[var(--muted)]">click or drag files here</p>
                  <p className="text-xs font-mono text-[var(--muted)] mt-1 opacity-60">pdf · txt · md · json · csv · doc</p>
                </div>

                {files.length > 0 && (
                  <div className="mt-3 space-y-2">
                    {files.map((file, i) => (
                      <div key={i} className="flex items-center justify-between px-4 py-3 rounded-lg bg-[var(--muted-bg)]">
                        <span className="text-sm font-mono text-[var(--foreground-soft)]">{file.name}</span>
                        <div className="flex items-center gap-4">
                          <span className="text-xs font-mono text-[var(--muted)]">{(file.size / 1024).toFixed(1)} kb</span>
                          <button type="button" onClick={() => setFiles(files.filter((_, idx) => idx !== i))} className="text-xs font-mono text-rose-500 hover:opacity-70 transition-opacity">rm</button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Submit */}
              <div className="flex gap-3 pt-4">
                <button type="submit" className="px-6 py-3 text-sm font-mono bg-[var(--accent)] text-white rounded-lg hover:opacity-90 transition-opacity">
                  create model
                </button>
                <Link href="/" className="px-6 py-3 text-sm font-mono text-[var(--muted)] hover:text-[var(--foreground-soft)] hover:bg-[var(--muted-bg)] rounded-lg transition-all">
                  cancel
                </Link>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}
