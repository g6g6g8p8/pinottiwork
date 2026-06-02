import { useEffect } from 'react';
import Portal from './Portal';

interface ToastProps {
  message: string;
  onDone: () => void;
}

export default function Toast({ message, onDone }: ToastProps) {
  useEffect(() => {
    const t = setTimeout(onDone, 2200);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <Portal>
      <div
        className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[200]
          px-5 py-3 rounded-full
          bg-foreground/90
          text-background
          text-[14px] font-medium
          backdrop-blur-sm shadow-lg
          animate-fade-in pointer-events-none"
      >
        {message}
      </div>
    </Portal>
  );
}
