import { useState } from "react";

export default function InfoIcon({ text }: { text: string }) {
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
                <div className="absolute left-0 top-6 w-56 bg-[var(--surface)] text-[var(--foreground-soft)] text-xs rounded-lg shadow-lg p-3 z-10 font-mono leading-relaxed normal-case" style={{ border: '1px solid var(--border)' }}>
                    {text}
                </div>
            )}
        </div>
    );
}