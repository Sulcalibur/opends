// OpenDS — UI primitives used across all screens.
// Each component matches the NuxtUI naming / API where possible (UButton, UInput, etc.)

const Button = ({ variant = 'primary', size = 'md', icon, trailingIcon, children, full, style, ...rest }) => {
  const sizes = {
    sm: { h: 32, px: 12, fs: 13, gap: 6, ic: 16 },
    md: { h: 38, px: 14, fs: 14, gap: 8, ic: 16 },
    lg: { h: 44, px: 18, fs: 15, gap: 8, ic: 18 },
  }[size];
  const variants = {
    primary: { background: 'var(--primary)', color: 'var(--text-on-primary)', border: '1px solid var(--primary)' },
    secondary: { background: 'var(--surface)', color: 'var(--text)', border: '1px solid var(--border)' },
    ghost: { background: 'transparent', color: 'var(--text)', border: '1px solid transparent' },
    soft: { background: 'var(--primary-soft)', color: 'var(--primary)', border: '1px solid transparent' },
    danger: { background: 'var(--surface)', color: 'var(--danger)', border: '1px solid var(--border)' },
    link: { background: 'transparent', color: 'var(--primary)', border: '1px solid transparent' },
  }[variant];
  return (
    <button
      style={{
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: sizes.gap,
        height: sizes.h, padding: `0 ${sizes.px}px`,
        borderRadius: 'var(--r-btn)', fontWeight: 600, fontSize: sizes.fs,
        lineHeight: 1, cursor: 'pointer', transition: 'all .15s',
        width: full ? '100%' : 'auto', whiteSpace: 'nowrap',
        ...variants, ...style,
      }}
      {...rest}
    >
      {icon}
      {children}
      {trailingIcon}
    </button>
  );
};

const IconButton = ({ size = 'md', variant = 'ghost', children, style, ...rest }) => {
  const dim = { sm: 28, md: 32, lg: 36 }[size];
  const variants = {
    ghost: { background: 'transparent', color: 'var(--text-secondary)', border: '1px solid transparent' },
    secondary: { background: 'var(--surface)', color: 'var(--text)', border: '1px solid var(--border)' },
    soft: { background: 'var(--surface-2)', color: 'var(--text)', border: '1px solid transparent' },
  }[variant];
  return (
    <button
      style={{
        width: dim, height: dim, display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        borderRadius: 'var(--r-input)', cursor: 'pointer', transition: 'all .15s', ...variants, ...style,
      }}
      {...rest}
    >{children}</button>
  );
};

const Input = ({ leading, trailing, kbd, placeholder, value, size = 'md', style, wrapStyle, ...rest }) => {
  const h = { sm: 32, md: 38, lg: 44 }[size];
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 8,
      height: h, padding: '0 12px',
      background: 'var(--surface)', border: '1px solid var(--border)',
      borderRadius: 'var(--r-input)', color: 'var(--text-secondary)',
      ...wrapStyle,
    }}>
      {leading && <span style={{ display: 'flex', color: 'var(--text-tertiary)' }}>{leading}</span>}
      <input
        placeholder={placeholder}
        defaultValue={value}
        style={{
          flex: 1, minWidth: 0, border: 'none', outline: 'none', background: 'transparent',
          fontSize: 14, color: 'var(--text)', fontFamily: 'inherit', ...style,
        }}
        {...rest}
      />
      {kbd && <Kbd>{kbd}</Kbd>}
      {trailing && <span style={{ display: 'flex', color: 'var(--text-tertiary)' }}>{trailing}</span>}
    </div>
  );
};

const Kbd = ({ children, style }) => (
  <span style={{
    fontFamily: 'var(--f-mono)', fontSize: 11, fontWeight: 500,
    padding: '2px 6px', borderRadius: 4,
    background: 'var(--surface-2)', color: 'var(--text-secondary)',
    border: '1px solid var(--border)', lineHeight: 1.3,
    ...style,
  }}>{children}</span>
);

const Badge = ({ tone = 'neutral', children, dot, style }) => {
  const tones = {
    neutral: { bg: 'var(--surface-2)', color: 'var(--text-secondary)', dot: 'var(--text-tertiary)' },
    primary: { bg: 'var(--primary-soft)', color: 'var(--primary)', dot: 'var(--primary)' },
    success: { bg: 'var(--success-soft)', color: 'var(--success)', dot: 'var(--success)' },
    warning: { bg: 'var(--warning-soft)', color: 'var(--warning)', dot: 'var(--warning)' },
    danger: { bg: 'var(--danger-soft)', color: 'var(--danger)', dot: 'var(--danger)' },
    info: { bg: 'var(--info-soft)', color: 'var(--info)', dot: 'var(--info)' },
    gold: { bg: 'var(--secondary-soft)', color: 'var(--warning)', dot: 'var(--secondary)' },
  }[tone];
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      padding: '3px 8px', borderRadius: 'var(--r-input)',
      fontSize: 12, fontWeight: 600, lineHeight: 1.3,
      background: tones.bg, color: tones.color, ...style,
    }}>
      {dot && <span style={{ width: 6, height: 6, borderRadius: 999, background: tones.dot }} />}
      {children}
    </span>
  );
};

const Card = ({ children, style, padded = true, ...rest }) => (
  <div style={{
    background: 'var(--surface)', border: '1px solid var(--border)',
    borderRadius: 'var(--r-card)', boxShadow: 'var(--shadow-card)',
    padding: padded ? 24 : 0, ...style,
  }} {...rest}>{children}</div>
);

// Compact monospace code box
const CodeBlock = ({ children, lang = 'tsx', style }) => (
  <div style={{
    background: 'var(--surface-2)', borderRadius: 'var(--r-card)',
    border: '1px solid var(--border)', overflow: 'hidden', ...style,
  }}>
    <div style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      padding: '8px 14px', borderBottom: '1px solid var(--border)',
      fontFamily: 'var(--f-mono)', fontSize: 11, color: 'var(--text-tertiary)',
      letterSpacing: '0.04em', textTransform: 'uppercase',
    }}>
      <span>{lang}</span>
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--text-secondary)', textTransform: 'none', letterSpacing: 0 }}>
        <Icons.Copy size={12} /> Copy
      </span>
    </div>
    <pre style={{
      margin: 0, padding: 16, fontFamily: 'var(--f-mono)',
      fontSize: 12.5, lineHeight: 1.7, color: 'var(--text)',
      overflow: 'auto', whiteSpace: 'pre',
    }}>{children}</pre>
  </div>
);

// Syntax-highlighted code line helpers (simple, deterministic)
const C = {
  k: ({ children }) => <span style={{ color: 'var(--primary)' }}>{children}</span>, // keyword
  s: ({ children }) => <span style={{ color: 'var(--success)' }}>{children}</span>, // string
  t: ({ children }) => <span style={{ color: 'var(--info)' }}>{children}</span>, // tag
  a: ({ children }) => <span style={{ color: 'var(--warning)' }}>{children}</span>, // attr
  c: ({ children }) => <span style={{ color: 'var(--text-tertiary)' }}>{children}</span>, // comment
  n: ({ children }) => <span style={{ color: 'var(--text)' }}>{children}</span>,
};

// Avatar — initials, deterministic color from string
const Avatar = ({ name = 'A', size = 28, src, style }) => {
  const initials = name.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase();
  const palette = ['#FF6B4A', '#FFD166', '#2A6FDB', '#1F8A5B', '#9B59B6', '#E84393', '#16A085'];
  const idx = [...name].reduce((a, c) => a + c.charCodeAt(0), 0) % palette.length;
  return (
    <div style={{
      width: size, height: size, borderRadius: 999,
      background: src ? `center/cover url(${src})` : palette[idx],
      color: 'white', display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      fontWeight: 700, fontSize: size * 0.4, flex: '0 0 auto',
      letterSpacing: '-0.02em',
      ...style,
    }}>
      {!src && initials}
    </div>
  );
};

// Sidebar nav item
const NavItem = ({ icon, children, active, count, indent = 0, style, faint, dotColor, ...rest }) => (
  <div
    style={{
      display: 'flex', alignItems: 'center', gap: 10,
      padding: `7px ${10}px 7px ${10 + indent * 12}px`,
      borderRadius: 6, cursor: 'pointer',
      fontSize: 13.5, fontWeight: active ? 600 : 500,
      color: active ? 'var(--primary)' : faint ? 'var(--text-tertiary)' : 'var(--text-secondary)',
      background: active ? 'var(--primary-soft)' : 'transparent',
      transition: 'background .12s, color .12s',
      ...style,
    }}
    {...rest}
  >
    {icon && <span style={{ display: 'flex', color: active ? 'var(--primary)' : 'var(--text-tertiary)' }}>{icon}</span>}
    {dotColor && <span style={{ width: 8, height: 8, borderRadius: 2, background: dotColor, flex: '0 0 auto' }} />}
    <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{children}</span>
    {count != null && <span style={{ fontSize: 11, color: 'var(--text-tertiary)', fontVariantNumeric: 'tabular-nums', fontWeight: 500 }}>{count}</span>}
  </div>
);

const Divider = ({ vertical, style }) => (
  <div style={{
    background: 'var(--border)',
    ...(vertical
      ? { width: 1, alignSelf: 'stretch' }
      : { height: 1, width: '100%' }),
    ...style,
  }} />
);

// Section heading inside sidebar
const SidebarSection = ({ children, style }) => (
  <div style={{
    padding: '14px 14px 6px',
    fontSize: 11, fontWeight: 600, letterSpacing: '0.08em',
    color: 'var(--text-tertiary)', textTransform: 'uppercase',
    ...style,
  }}>{children}</div>
);

Object.assign(window, {
  Button, IconButton, Input, Kbd, Badge, Card, CodeBlock, C, Avatar, NavItem, Divider, SidebarSection,
});
