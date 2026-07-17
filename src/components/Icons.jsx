export function DashboardIcon({ size = 18, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M3 13.5L12 4l9 9.5V20a1 1 0 0 1-1 1h-5v-5H9v5H4a1 1 0 0 1-1-1v-6.5Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    </svg>
  );
}

export function InventoryIcon({ size = 18, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M4 7.5h16l-1 12H5l-1-12Zm3-3h10l1 2H6l1-2Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    </svg>
  );
}

export function OccurrenceIcon({ size = 18, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M12 4v10m0 0 4-4m-4 4-4-4M5 19h14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function DocumentIcon({ size = 18, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M7 3h7l4 4v14H7V3Zm7 0v4h4" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    </svg>
  );
}

export function PresenceIcon({ size = 18, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M8 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm8 0a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm-8 2c-3.3 0-6 2.2-6 5v1h12v-1c0-2.8-2.7-5-6-5Zm8 0c-1.3 0-2.5.3-3.5.9 2 1.1 3.5 3.1 3.5 5.1v1h5v-1c0-2.8-2.7-5-5-5Z" fill="currentColor" />
    </svg>
  );
}

export function ProfileIcon({ size = 18, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.8" />
      <path d="M5 19c1.2-3 3.7-4.5 7-4.5s5.8 1.5 7 4.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export function MoonIcon({ size = 18, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M20 14.5A8.5 8.5 0 0 1 9.5 4 8.5 8.5 0 1 0 20 14.5Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    </svg>
  );
}

export function SunIcon({ size = 18, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.8" />
      <path d="M12 2v2.5M12 19.5V22M4.9 4.9l1.8 1.8M17.3 17.3l1.8 1.8M2 12h2.5M19.5 12H22M4.9 19.1l1.8-1.8M17.3 6.7l1.8-1.8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}