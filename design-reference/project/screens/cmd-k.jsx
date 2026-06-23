// ============================================================
// CMD+K — Search overlay
// 1440 × 900
// ============================================================

const CmdK = () => (
  <div className="ds ds-light ds-screen" data-screen-label="Overlay · ⌘K search">
    {/* Background page (dimmed) */}
    <div style={{ filter: 'blur(0px)', opacity: 1 }}>
      <DocsHeader />
      <div style={{ display: 'flex', height: 'calc(100% - 56px)' }}>
        <DocsSidebar active="button" />
        <main style={{ flex: 1, padding: 56, opacity: 0.6 }}>
          <h1 style={{ fontSize: 44, fontWeight: 800, letterSpacing: '-0.03em', marginBottom: 16 }}>Button</h1>
          <p style={{ fontSize: 16, color: 'var(--text-secondary)', maxWidth: 720 }}>Triggers an action or event…</p>
        </main>
      </div>
    </div>

    {/* Dim overlay */}
    <div style={{
      position: 'absolute', inset: 0,
      background: 'rgba(26,29,33,0.4)',
    }} />

    {/* The palette */}
    <div style={{
      position: 'absolute', top: 120, left: '50%', transform: 'translateX(-50%)',
      width: 640, background: 'var(--surface)',
      borderRadius: 'var(--r-modal)', overflow: 'hidden',
      boxShadow: 'var(--shadow-pop), 0 0 0 1px var(--border)',
    }}>
      {/* Search input */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 12,
        padding: '14px 18px', borderBottom: '1px solid var(--border)',
      }}>
        <Icons.Search size={18} style={{ color: 'var(--text-tertiary)' }} />
        <input
          defaultValue="butt"
          style={{
            flex: 1, border: 'none', outline: 'none', background: 'transparent',
            fontSize: 16, color: 'var(--text)', fontFamily: 'inherit',
          }}
        />
        <Kbd>esc</Kbd>
      </div>

      {/* Scope tabs */}
      <div style={{
        display: 'flex', gap: 4, padding: '8px 12px',
        borderBottom: '1px solid var(--border)', background: 'var(--bg)',
      }}>
        {[['All', true], ['Components', false], ['Tokens', false], ['Docs', false], ['Settings', false]].map(([n, a], i) => (
          <span key={i} style={{
            padding: '4px 10px', fontSize: 12.5, fontWeight: 600,
            background: a ? 'var(--surface)' : 'transparent',
            color: a ? 'var(--text)' : 'var(--text-secondary)',
            borderRadius: 6, border: a ? '1px solid var(--border)' : '1px solid transparent',
          }}>{n}</span>
        ))}
        <div style={{ flex: 1 }} />
        <span style={{ fontSize: 11.5, color: 'var(--text-tertiary)', alignSelf: 'center', fontFamily: 'var(--f-mono)' }}>4 results</span>
      </div>

      {/* Results */}
      <div style={{ maxHeight: 460, overflow: 'auto' }}>
        <Section title="Components">
          <Result icon={<Icons.Component size={16} />} title="Button" sub="Triggers an action or event" path="Components / Inputs" hl active />
          <Result icon={<Icons.Component size={16} />} title="ButtonGroup" sub="Group of related buttons" path="Components / Inputs" hl />
        </Section>
        <Section title="Tokens">
          <Result icon={<Icons.Palette size={16} />} title="color.button.primary" sub="#FF6B4A · 27 uses" path="Tokens / Color" hl mono />
        </Section>
        <Section title="Docs">
          <Result icon={<Icons.FileText size={16} />} title="Writing for buttons" sub="Updated 2d ago by Jay Patel" path="Guidelines" hl />
        </Section>
        <Section title="Actions">
          <Result icon={<Icons.Plus size={16} />} title="Create new component…" path="Admin shortcut" />
          <Result icon={<Icons.Moon size={16} />} title="Toggle dark theme" path="Preferences" />
        </Section>
      </div>

      {/* Footer hints */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 16,
        padding: '10px 16px', borderTop: '1px solid var(--border)',
        background: 'var(--bg)', fontSize: 11.5, color: 'var(--text-tertiary)',
      }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><Kbd>↑↓</Kbd> navigate</span>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><Kbd>↵</Kbd> open</span>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><Kbd>⌘ ↵</Kbd> open in new tab</span>
        <div style={{ flex: 1 }} />
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>Powered by <Icons.Logo size={11} /> OpenDS</span>
      </div>
    </div>
  </div>
);

const Section = ({ title, children }) => (
  <div>
    <div style={{
      padding: '10px 16px 4px', fontSize: 10.5, fontWeight: 700,
      color: 'var(--text-tertiary)', letterSpacing: '0.08em', textTransform: 'uppercase',
    }}>{title}</div>
    {children}
  </div>
);

const Result = ({ icon, title, sub, path, active, hl, mono }) => {
  // Highlight "butt" within the title
  const render = () => {
    if (!hl) return title;
    const re = /(butt)/i;
    const parts = title.split(re);
    return parts.map((p, i) =>
      re.test(p)
        ? <span key={i} style={{ background: 'var(--secondary-soft)', color: 'var(--warning)', padding: '0 1px', borderRadius: 2, fontWeight: 700 }}>{p}</span>
        : p
    );
  };
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 12,
      padding: '10px 16px', margin: '0 6px', borderRadius: 6,
      background: active ? 'var(--primary-soft)' : 'transparent',
      cursor: 'pointer',
    }}>
      <span style={{
        width: 28, height: 28, borderRadius: 6,
        background: active ? 'var(--primary)' : 'var(--surface-2)',
        color: active ? 'white' : 'var(--text-secondary)',
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      }}>{icon}</span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 14, fontWeight: 600, fontFamily: mono ? 'var(--f-mono)' : 'inherit', color: active ? 'var(--primary)' : 'var(--text)' }}>{render()}</div>
        {sub && <div style={{ fontSize: 12, color: 'var(--text-tertiary)', marginTop: 1 }}>{sub}</div>}
      </div>
      <div style={{ fontSize: 11.5, color: 'var(--text-tertiary)', fontFamily: 'var(--f-mono)' }}>{path}</div>
      {active && <Icons.CornerDownLeft size={14} style={{ color: 'var(--primary)' }} />}
    </div>
  );
};

Object.assign(window, { CmdK, Section, Result });
