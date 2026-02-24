'use client';

import { useState, useRef, useEffect } from 'react';

interface DropdownOption {
    value: string;
    label: string;
}

interface DropdownProps {
    options: DropdownOption[];
    value: string;
    onChange?: (value: string) => void;
    onCreate?: () => void;
    lastUsedValue?: string;
    placeholder?: string;
}

export default function Dropdown({
    options,
    value,
    onChange,
    onCreate,
    lastUsedValue,
    placeholder,
}: DropdownProps) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const selectedOption = options.find((opt) => opt.value === value);

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelect = (optionValue: string) => {
        onChange?.(optionValue);
        setIsOpen(false);
    };

    return (
        <div>
            <div className="relative" ref={dropdownRef}>
                {/* Dropdown Trigger Button */}
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="w-full p-3 rounded-lg border border-[var(--border-subtle)] bg-[var(--background)] text-[var(--foreground)] font-mono text-sm transition-all focus:outline-none focus:border-[var(--accent)] cursor-pointer hover:border-[var(--muted)] flex items-center justify-between"
                >
                    <span>{selectedOption?.label || placeholder}</span>
                    <img src={'/expand.svg'} className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown Menu */}
                {isOpen && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-[var(--background)] border border-[var(--border-subtle)] rounded-lg overflow-hidden shadow-lg z-50">
                        <div className="space-y-1 p-2">
                            {options.map((option) => (
                                <button
                                    key={option.value}
                                    onClick={() => handleSelect(option.value)}
                                    className={`w-full px-3 py-2 text-left text-sm font-mono rounded transition-colors ${value === option.value
                                        ? 'bg-[var(--muted-bg)] text-white'
                                        : 'text-[var(--foreground)] hover:bg-[var(--muted-bg)]'
                                        }`}
                                >
                                    <div className="flex items-center justify-between">
                                        <span>{option.label}</span>
                                        {lastUsedValue === option.value && (
                                            <span className="text-xs ml-2 px-2 py-0.5 bg-blue-500/20 text-blue-400 rounded">
                                                last used
                                            </span>
                                        )}
                                    </div>
                                </button>
                            ))}
                            <button
                                onClick={onCreate}
                                className={`w-full px-3 py-2 text-left text-sm font-mono rounded transition-colors ${value === ''
                                    ? 'bg-[var(--muted-bg)] text-white'
                                    : 'text-[var(--foreground)] hover:bg-[var(--muted-bg)]'
                                    }`}
                            >
                                + Create New
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
