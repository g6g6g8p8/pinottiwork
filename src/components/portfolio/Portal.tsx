import { useEffect, useRef, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';

export default function Portal({ children }: { children: ReactNode }) {
  const elRef = useRef<HTMLDivElement | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (typeof document === 'undefined') return;
    if (elRef.current === null) {
      elRef.current = document.createElement('div');
    }
    const el = elRef.current;
    document.body.appendChild(el);
    setMounted(true);
    return () => {
      if (el.parentNode) document.body.removeChild(el);
    };
  }, []);

  if (!mounted || elRef.current === null) return null;
  return createPortal(children, elRef.current);
}
