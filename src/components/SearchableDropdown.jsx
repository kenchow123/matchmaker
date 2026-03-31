import { useState, useRef, useEffect } from 'react';
import { getProfileEmoji } from '../utils/helpers';

const MAX_VISIBLE = 20;

export default function SearchableDropdown({ profiles, value, onChange }) {
  const [search, setSearch] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    if (value) {
      const match = profiles.find((p) => p.id === value);
      if (match) setSearch(match.label);
    } else {
      setSearch('');
    }
  }, [value, profiles]);

  useEffect(() => {
    const handler = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) setIsOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const filtered = profiles.filter((p) =>
    p.label.toLowerCase().includes(search.toLowerCase()),
  );

  const handleSelect = (profile) => {
    onChange(profile.id);
    setSearch(profile.label);
    setIsOpen(false);
  };

  return (
    <div ref={wrapperRef} className="relative">
      <input
        type="text"
        className={`w-full px-3.5 py-2.5 pr-9 rounded-lg border text-sm focus:outline-none focus:border-brand-pink transition-colors ${
          value ? 'bg-pink-50 border-brand-pink' : 'bg-gray-50 border-gray-300'
        }`}
        placeholder="搜尋名字（例：A小姐）..."
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setIsOpen(true);
          if (!e.target.value && value) onChange(null);
        }}
        onFocus={() => setIsOpen(true)}
      />
      {value && (
        <button
          onClick={() => { onChange(null); setSearch(''); }}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
        >
          ✕
        </button>
      )}
      {isOpen && !value && filtered.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto z-10">
          {filtered.slice(0, MAX_VISIBLE).map((p) => (
            <div
              key={p.id}
              onClick={() => handleSelect(p)}
              className="px-3.5 py-2.5 text-sm cursor-pointer border-b border-gray-100 last:border-0 hover:bg-pink-50 transition-colors"
            >
              <span className="mr-2">{getProfileEmoji(p.label)}</span>
              {p.label}
            </div>
          ))}
          {filtered.length > MAX_VISIBLE && (
            <div className="px-3.5 py-2 text-xs text-gray-400 text-center">
              仲有 {filtered.length - MAX_VISIBLE} 個，請輸入更多字
            </div>
          )}
        </div>
      )}
      {isOpen && !value && search && filtered.length === 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
          <div className="px-3.5 py-3 text-sm text-gray-400 text-center">搵唔到「{search}」</div>
        </div>
      )}
    </div>
  );
}
