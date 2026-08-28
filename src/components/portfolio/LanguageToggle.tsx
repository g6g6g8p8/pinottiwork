import { useLocale } from '../../context/LocaleContext';

export default function LanguageToggle({ className }: { className?: string }) {
  const { locale, setLocale } = useLocale();
  const other = locale === 'en' ? 'pt' : 'en';
  const label = locale === 'en' ? 'PT' : 'EN';

  return (
    <button
      type="button"
      onClick={() => setLocale(other)}
      aria-label={locale === 'en' ? 'Switch to Portuguese' : 'Mudar para inglês'}
      className={`inline-flex items-center justify-center w-8 h-8 rounded-full
        text-[11px] font-semibold tracking-wide
        text-foreground/60 hover:text-foreground
        bg-foreground/5 hover:bg-foreground/10
        transition-colors ${className || ''}`}
    >
      {label}
    </button>
  );
}
