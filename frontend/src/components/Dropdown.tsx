import { useEffect, useRef, useState } from 'react';

interface DropdownProps {
  id: string;
  value: string;
  options: readonly string[];
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

// Native <select> hands full control of its options popup to the browser -
// with lists as long as 77 items (the USA rock grade scale), that popup can
// take over most of the screen and, depending on where the trigger sits in
// the viewport, open upward instead of down. This renders its own panel
// instead, so it always opens below the trigger with a capped, scrollable
// height regardless of list length or viewport position.
export function Dropdown({ id, value, options, onChange, placeholder, className }: DropdownProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    function handlePointerDown(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setOpen(false);
        containerRef.current?.querySelector('button')?.focus();
      }
    }

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open]);

  function handleSelect(option: string) {
    onChange(option);
    setOpen(false);
  }

  return (
    <div className={className ? `dropdown ${className}` : 'dropdown'} ref={containerRef}>
      <button
        type="button"
        id={id}
        className="dropdown-trigger"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className={value ? undefined : 'dropdown-placeholder'}>{value || placeholder || ''}</span>
        <i className={`fa-solid fa-chevron-${open ? 'up' : 'down'} dropdown-chevron`} />
      </button>
      {open && (
        <div className="dropdown-panel" role="listbox" aria-labelledby={id}>
          {options.map((option) => (
            <button
              key={option}
              type="button"
              role="option"
              aria-selected={option === value}
              className={option === value ? 'dropdown-option selected' : 'dropdown-option'}
              onClick={() => handleSelect(option)}
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
