import { useState } from 'react';

const languages = [
  { code: 'en', name: 'English' },
  { code: 'hi', name: 'Hindi' },
  { code: 'ml', name: 'Malayalam' },
  { code: 'ta', name: 'Tamil' },
  { code: 'te', name: 'Telugu' },
];

export default function LanguageSelector({ selected, onChange }) {
  return (
    <div className="language-selector-modern">
      <i className="fas fa-globe"></i>
      <select value={selected} onChange={e => onChange(e.target.value)}>
        {languages.map(lang => (
          <option key={lang.code} value={lang.code}>{lang.name}</option>
        ))}
      </select>
    </div>
  );
}
