import { useEffect, useRef, type ReactNode } from 'react';
import { createPortal } from 'react-dom';

export default function Portal({ children }: { children: ReactNode }) {
  const elRef = useRef<HTMLDivElement | null>(null);
  if (typeof document !== 'undefined' && elRef.current === null) {
    elRef.current = document.createElement('div');
  }

  useEffect(() => {
    if (typeof document === 'undefined') return;
    const el = elRef.current!;
    document.body.appendChild(el);
    return () => {
      if (el.parentNode) document.body.removeChild(el);
    };
  }, []);

  if (typeof document === 'undefined' || !elRef.current) return null;
  return createPortal(children, elRef.current);
}
