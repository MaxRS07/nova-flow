'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

interface WorkflowMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onRun?: () => void;
  onEdit?: () => void;
  onDuplicate?: () => void;
  onShare?: () => void;
  onDelete?: () => void;
  anchorRef?: React.RefObject<HTMLElement>;
}

export default function WorkflowMenu({
  isOpen,
  onClose,
  onRun = () => {},
  onEdit = () => {},
  onDuplicate = () => {},
  onShare = () => {},
  onDelete = () => {},
  anchorRef,
}: WorkflowMenuProps) {
  const [mounted, setMounted] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (isOpen && anchorRef?.current) {
      const rect = anchorRef.current.getBoundingClientRect();
      setPosition({
        top: rect.bottom + window.scrollY + 4,
        left: rect.left + window.scrollX - 112,
      });
    }
  }, [isOpen, anchorRef]);

  if (!mounted || !isOpen) return null;

  const items = [
    { label: 'run', action: onRun, color: 'text-green-500' },
    { label: 'edit', action: onEdit, color: 'text-[var(--foreground)]' },
    { label: 'duplicate', action: onDuplicate, color: 'text-[var(--foreground)]' },
    { label: 'share', action: onShare, color: 'text-[var(--foreground)]' },
    { label: 'delete', action: onDelete, color: 'text-red-500' },
  ];

  return createPortal(
    <div
      className="fixed w-32 bg-[var(--background)] border border-[var(--border)] rounded shadow-lg z-50"
      style={{ top: position.top, left: position.left }}
    >
      {items.map((item, i) => (
        <button
          key={item.label}
          onClick={() => { item.action(); onClose(); }}
          className={`block w-full text-left px-3 py-1.5 text-xs font-mono hover:bg-[var(--muted-bg)] transition-colors ${item.color} ${
            i === 0 ? 'rounded-t' : ''
          } ${i === items.length - 1 ? 'rounded-b' : 'border-b border-[var(--border)]'}`}
        >
          {item.label}
        </button>
      ))}
    </div>,
    document.body
  );
}
