// Lucide-style icons, hand-inlined to a consistent stroke/size API.
// Pass `size` (default 20) and any svg props. Stroke is currentColor.

const I = ({ children, size = 20, strokeWidth = 1.75, ...rest }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    {...rest}
  >
    {children}
  </svg>
);

const Icons = {
  Search: (p) => <I {...p}><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></I>,
  Sun: (p) => <I {...p}><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" /></I>,
  Moon: (p) => <I {...p}><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" /></I>,
  ChevronDown: (p) => <I {...p}><path d="m6 9 6 6 6-6" /></I>,
  ChevronRight: (p) => <I {...p}><path d="m9 6 6 6-6 6" /></I>,
  ChevronLeft: (p) => <I {...p}><path d="m15 6-6 6 6 6" /></I>,
  ChevronUp: (p) => <I {...p}><path d="m18 15-6-6-6 6" /></I>,
  ArrowRight: (p) => <I {...p}><path d="M5 12h14M13 5l7 7-7 7" /></I>,
  ArrowUpRight: (p) => <I {...p}><path d="M7 17 17 7M8 7h9v9" /></I>,
  Plus: (p) => <I {...p}><path d="M12 5v14M5 12h14" /></I>,
  Check: (p) => <I {...p}><path d="M20 6 9 17l-5-5" /></I>,
  Copy: (p) => <I {...p}><rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></I>,
  Settings: (p) => <I {...p}><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" /></I>,
  User: (p) => <I {...p}><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></I>,
  Users: (p) => <I {...p}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" /></I>,
  Component: (p) => <I {...p}><path d="m6.5 6.5 11 11M21 12 12 3 3 12l9 9 9-9z M11 11l-4-4M13 13l4 4M11 13l-4 4M13 11l4-4" /></I>,
  Cube: (p) => <I {...p}><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" /><path d="m3.27 6.96 8.73 5.05 8.73-5.05M12 22.08V12" /></I>,
  Palette: (p) => <I {...p}><circle cx="13.5" cy="6.5" r="0.5" fill="currentColor" /><circle cx="17.5" cy="10.5" r="0.5" fill="currentColor" /><circle cx="8.5" cy="7.5" r="0.5" fill="currentColor" /><circle cx="6.5" cy="12.5" r="0.5" fill="currentColor" /><path d="M12 2a10 10 0 1 0 0 20 5 5 0 0 1-5-5 1 1 0 0 1 1-1h2a5 5 0 0 0 0-10 4 4 0 0 0-1 .2" /></I>,
  Book: (p) => <I {...p}><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2zM22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" /></I>,
  Home: (p) => <I {...p}><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2zM9 22V12h6v10" /></I>,
  Layers: (p) => <I {...p}><path d="m12 2 10 6-10 6L2 8z M2 17l10 6 10-6 M2 12l10 6 10-6" /></I>,
  FileText: (p) => <I {...p}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" /></I>,
  Type: (p) => <I {...p}><path d="M4 7V4h16v3M9 20h6M12 4v16" /></I>,
  Ruler: (p) => <I {...p}><path d="M21.3 8.7 8.7 21.3a2.4 2.4 0 0 1-3.4 0L2.7 18.7a2.4 2.4 0 0 1 0-3.4L15.3 2.7a2.4 2.4 0 0 1 3.4 0l2.6 2.6a2.4 2.4 0 0 1 0 3.4M14 4 4 14M16 6l-1 1M18 8l-2 2M14 10l-1 1M10 14l-1 1M6 18l-1 1M20 10l-1 1" /></I>,
  Sliders: (p) => <I {...p}><path d="M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M1 14h6M9 8h6M17 16h6" /></I>,
  Sparkles: (p) => <I {...p}><path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1" /></I>,
  Zap: (p) => <I {...p}><path d="M13 2 3 14h9l-1 8 10-12h-9z" /></I>,
  Download: (p) => <I {...p}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" /></I>,
  Upload: (p) => <I {...p}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" /></I>,
  Edit: (p) => <I {...p}><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4z" /></I>,
  Trash: (p) => <I {...p}><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M10 11v6M14 11v6" /></I>,
  MoreH: (p) => <I {...p}><circle cx="5" cy="12" r="1.4" fill="currentColor" /><circle cx="12" cy="12" r="1.4" fill="currentColor" /><circle cx="19" cy="12" r="1.4" fill="currentColor" /></I>,
  Filter: (p) => <I {...p}><path d="M22 3H2l8 9.5V19l4 2v-8.5z" /></I>,
  Grid: (p) => <I {...p}><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></I>,
  List: (p) => <I {...p}><path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" /></I>,
  Eye: (p) => <I {...p}><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z" /><circle cx="12" cy="12" r="3" /></I>,
  Bell: (p) => <I {...p}><path d="M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9M13.7 21a2 2 0 0 1-3.4 0" /></I>,
  Mail: (p) => <I {...p}><path d="M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" /><path d="m22 6-10 7L2 6" /></I>,
  Lock: (p) => <I {...p}><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></I>,
  Github: (p) => <I {...p}><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.4 13.4 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" /></I>,
  Logo: (p) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={p?.size || 24} height={p?.size || 24} viewBox="0 0 32 32" fill="none" aria-hidden="true" {...p}>
      <rect x="2" y="2" width="28" height="28" rx="7" fill="var(--primary)" />
      <path d="M10 11.5C10 9.567 11.567 8 13.5 8h5C20.433 8 22 9.567 22 11.5v9c0 1.933-1.567 3.5-3.5 3.5h-5A3.5 3.5 0 0 1 10 20.5z" stroke="white" strokeWidth="2.2"/>
      <circle cx="16" cy="16" r="1.7" fill="white"/>
    </svg>
  ),
  Play: (p) => <I {...p}><path d="m5 3 14 9-14 9z" fill="currentColor" /></I>,
  Bold: (p) => <I {...p}><path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6zM6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z" /></I>,
  Italic: (p) => <I {...p}><path d="M19 4h-9M14 20H5M15 4 9 20" /></I>,
  Heading: (p) => <I {...p}><path d="M6 4v16M18 4v16M6 12h12" /></I>,
  Quote: (p) => <I {...p}><path d="M3 21c3 0 7-1 7-8V5H3v8h4M14 21c3 0 7-1 7-8V5h-7v8h4" /></I>,
  Code: (p) => <I {...p}><path d="m16 18 6-6-6-6M8 6l-6 6 6 6" /></I>,
  Link: (p) => <I {...p}><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" /></I>,
  Image: (p) => <I {...p}><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><path d="m21 15-5-5L5 21" /></I>,
  Folder: (p) => <I {...p}><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" /></I>,
  Activity: (p) => <I {...p}><path d="M22 12h-4l-3 9L9 3l-3 9H2" /></I>,
  TrendUp: (p) => <I {...p}><path d="m22 7-8.5 8.5-5-5L2 17M16 7h6v6" /></I>,
  Clock: (p) => <I {...p}><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></I>,
  X: (p) => <I {...p}><path d="M18 6 6 18M6 6l12 12" /></I>,
  Star: (p) => <I {...p}><path d="m12 2 3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z" /></I>,
  Globe: (p) => <I {...p}><circle cx="12" cy="12" r="10" /><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></I>,
  Key: (p) => <I {...p}><circle cx="7.5" cy="15.5" r="5.5" /><path d="m21 2-9.6 9.6M15.5 7.5l3 3L22 7l-3-3" /></I>,
  Building: (p) => <I {...p}><rect x="4" y="2" width="16" height="20" rx="2" /><path d="M9 22v-4h6v4M8 6h.01M16 6h.01M8 10h.01M16 10h.01M8 14h.01M16 14h.01" /></I>,
  Shield: (p) => <I {...p}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></I>,
  Hash: (p) => <I {...p}><path d="M4 9h16M4 15h16M10 3 8 21M16 3l-2 18" /></I>,
  CornerDownLeft: (p) => <I {...p}><path d="m9 10-5 5 5 5M20 4v7a4 4 0 0 1-4 4H4" /></I>,
  CheckCircle: (p) => <I {...p}><circle cx="12" cy="12" r="10" /><path d="m9 12 2 2 4-4" /></I>,
  AlertCircle: (p) => <I {...p}><circle cx="12" cy="12" r="10" /><path d="M12 8v4M12 16h.01" /></I>,
  Tag: (p) => <I {...p}><path d="M20.59 13.41 13.42 20.58a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" /><path d="M7 7h.01" /></I>,
};

window.Icons = Icons;
