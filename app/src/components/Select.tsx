import { useEffect, useRef, useState, type CSSProperties, type KeyboardEvent } from 'react';
import { ImgIcon } from './Icon';

export interface SelectOption { label: string; value: string; disabled?: boolean; meta?: string }

interface SelectProps {
  value: string;
  options: SelectOption[];
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  /** small = 40px dashboard filter, medium = 48px form field */
  size?: 'small' | 'medium';
  ariaLabel: string;
  id?: string;
  style?: CSSProperties;
}

/** Listbox dropdown from the design (Select.dc.html). */
export function Select({ value, options, onChange, placeholder = 'Select', disabled = false, size = 'medium', ariaLabel, id, style }: SelectProps) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => { if (root.current && !root.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [open]);

  const sel = options.find(o => o.value === value);
  const small = size === 'small';
  const pick = (o: SelectOption) => { if (o.disabled) return; setOpen(false); onChange(o.value); };

  const onKey = (e: KeyboardEvent) => {
    if (e.key === 'Escape') { setOpen(false); return; }
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      const dir = e.key === 'ArrowDown' ? 1 : -1;
      let i = open ? active : options.findIndex(o => o.value === value);
      for (let n = 0; n < options.length; n++) { i = (i + dir + options.length) % options.length; if (!options[i].disabled) break; }
      setOpen(true);
      setActive(i);
    }
    if ((e.key === 'Enter' || e.key === ' ') && open && active >= 0) { e.preventDefault(); pick(options[active]); }
  };

  const border = disabled ? '1px solid #C2C1C0' : open ? '1px solid #4B4B49' : sel && !small ? '1.5px solid #1F1E1E' : '1px solid #7D7C7C';
  const chev = small ? 16 : 24;

  return (
    <div ref={root} style={{ position: 'relative', width: '100%', fontFamily: "'Nunito Sans', sans-serif", ...style }}>
      <button
        type="button"
        id={id}
        className="sk-select__trigger"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={ariaLabel}
        disabled={disabled}
        onClick={() => { if (!disabled) { setOpen(o => !o); setActive(options.findIndex(o => o.value === value)); } }}
        onKeyDown={onKey}
        style={{
          height: small ? 40 : 48, border, borderRadius: small ? 8 : 10,
          cursor: disabled ? 'not-allowed' : 'pointer',
          color: disabled ? '#A3A2A2' : sel ? '#1F1E1E' : small ? '#000000' : '#4B4B49',
        }}
      >
        <span style={{ flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', textAlign: 'left' }}>{sel ? sel.label : placeholder}</span>
        <ImgIcon src="c/chevron_down_outlined_24-dark.svg" size={chev} style={{ opacity: disabled ? 0.4 : 1, transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 150ms ease' }} />
      </button>
      {open && (
        <ul role="listbox" aria-label={ariaLabel} className="sk-select__list">
          {options.map((o, i) => {
            const selected = o.value === value;
            return (
              <li
                key={o.value}
                role="option"
                aria-selected={selected}
                aria-disabled={o.disabled || undefined}
                onClick={() => pick(o)}
                onMouseEnter={() => setActive(i)}
                style={{
                  cursor: o.disabled ? 'not-allowed' : 'pointer',
                  color: o.disabled ? '#A3A2A2' : '#1F1E1E',
                  fontWeight: selected ? 700 : 400,
                  background: i === active && !o.disabled ? '#EBF3F9' : 'transparent',
                }}
              >
                <span style={{ flex: 1, whiteSpace: 'nowrap' }}>{o.label}</span>
                {o.meta && <span style={{ fontSize: 12, color: '#6E6E6D', whiteSpace: 'nowrap' }}>{o.meta}</span>}
                {selected && <ImgIcon src="c/checkmark_outlined_24-blue.svg" size={16} />}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
