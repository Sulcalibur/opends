// ============================================================
// PUBLIC DOCS — Component page (Button)
// 1440 × 1100 — generous so we can see Live preview + Props + Code
// ============================================================

const PublicComponent = () => (
  <div className="ds ds-light ds-screen" data-screen-label="Public · Component (Button)">
    <DocsHeader />
    <div style={{ flex: 1, display: 'flex', height: 'calc(100% - 56px)' }}>
      <DocsSidebar active="button" />
      <main style={{ flex: 1, overflow: 'auto', padding: '40px 56px', minWidth: 0 }}>
        {/* Breadcrumbs */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12.5, color: 'var(--text-tertiary)', marginBottom: 20, fontWeight: 500 }}>
          <span>Components</span>
          <Icons.ChevronRight size={12} />
          <span>Inputs</span>
          <Icons.ChevronRight size={12} />
          <span style={{ color: 'var(--text-secondary)' }}>Button</span>
        </div>

        {/* Title */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, marginBottom: 12 }}>
          <h1 style={{ fontSize: 44, fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.05, flex: 1 }}>Button</h1>
          <Badge tone="success" dot>Approved</Badge>
          <Badge tone="neutral" style={{ fontFamily: 'var(--f-mono)' }}>v1.4.0</Badge>
        </div>
        <p style={{ fontSize: 17, lineHeight: 1.55, color: 'var(--text-secondary)', maxWidth: 720, marginBottom: 28 }}>
          Triggers an action or event. The button is OpenDS' most overloaded primitive—every variant maps to a specific role in the action hierarchy.
        </p>

        <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 36, flexWrap: 'wrap' }}>
          <Badge tone="neutral"><Icons.Tag size={11} />inputs</Badge>
          <Badge tone="neutral"><Icons.Tag size={11} />action</Badge>
          <Badge tone="neutral"><Icons.Tag size={11} />a11y-aa</Badge>
          <span style={{ width: 1, height: 16, background: 'var(--border)', margin: '0 6px' }} />
          <span style={{ fontSize: 12.5, color: 'var(--text-tertiary)' }}>Source: <code style={{ fontSize: 12, color: 'var(--text-secondary)' }}>app/components/UButton.vue</code></span>
        </div>

        {/* === LIVE PREVIEW SANDBOX === */}
        <Sandbox />

        {/* === VARIANTS GRID === */}
        <h2 id="variants" style={{ fontSize: 26, fontWeight: 700, marginTop: 56, marginBottom: 8, letterSpacing: '-0.02em' }}>Variants</h2>
        <p style={{ fontSize: 14.5, color: 'var(--text-secondary)', marginBottom: 20, lineHeight: 1.55, maxWidth: 720 }}>
          Six variants cover the action hierarchy from primary CTA down to inline link. Use one per area.
        </p>
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 0,
          border: '1px solid var(--border)', borderRadius: 'var(--r-card)', overflow: 'hidden',
        }}>
          {[
            ['Primary', <Button>Save changes</Button>, 'The single most important action on a page.'],
            ['Secondary', <Button variant="secondary">Cancel</Button>, 'Lower-emphasis action paired with primary.'],
            ['Soft', <Button variant="soft">Filter</Button>, 'Tinted action for repeat actions in toolbars.'],
            ['Ghost', <Button variant="ghost">Skip</Button>, 'Minimal weight, no chrome.'],
            ['Danger', <Button variant="danger" icon={<Icons.Trash size={14} />}>Delete</Button>, 'Destructive action, always paired with a confirm.'],
            ['Link', <Button variant="link" trailingIcon={<Icons.ArrowUpRight size={14} />}>Open docs</Button>, 'Inline navigation that looks like a link.'],
          ].map(([name, demo, body], i) => (
            <div key={i} style={{
              padding: '28px 24px 22px',
              borderRight: i % 3 !== 2 ? '1px solid var(--border)' : 'none',
              borderBottom: i < 3 ? '1px solid var(--border)' : 'none',
              background: 'var(--surface)',
            }}>
              <div style={{
                height: 76, background: `repeating-linear-gradient(45deg, var(--bg), var(--bg) 6px, transparent 6px, transparent 12px)`,
                borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center',
                border: '1px dashed var(--border)', marginBottom: 16,
              }}>
                {demo}
              </div>
              <div style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--text)', marginBottom: 4 }}>{name}</div>
              <div style={{ fontSize: 12.5, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{body}</div>
            </div>
          ))}
        </div>

        {/* === PROPS TABLE === */}
        <h2 id="props" style={{ fontSize: 26, fontWeight: 700, marginTop: 56, marginBottom: 16, letterSpacing: '-0.02em' }}>Props</h2>
        <PropsTable />

        {/* === ACCESSIBILITY === */}
        <h2 id="a11y" style={{ fontSize: 26, fontWeight: 700, marginTop: 56, marginBottom: 16, letterSpacing: '-0.02em' }}>Accessibility</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
          <A11yItem ok title="WCAG 2.2 AA — 5.4:1 contrast" body="Primary on white passes for both 14px and 12px text." />
          <A11yItem ok title="Visible focus ring" body="3px primary halo with 30% opacity, never relies on color alone." />
          <A11yItem ok title="Keyboard support" body="Enter and Space activate. Disabled buttons are removed from tab order via aria-disabled." />
          <A11yItem ok title="Reduced motion respected" body="Transitions collapse to 0ms when prefers-reduced-motion is set." />
        </div>
      </main>
      <Toc active="Variants" />
    </div>
    <DocsFooter />
  </div>
);

// === Live preview sandbox with framework toggle + props panel ===
const Sandbox = () => (
  <div style={{
    border: '1px solid var(--border)', borderRadius: 'var(--r-card)',
    overflow: 'hidden', background: 'var(--surface)',
    boxShadow: 'var(--shadow-card)',
  }}>
    {/* Tab bar */}
    <div style={{
      display: 'flex', alignItems: 'center', gap: 4,
      padding: '0 12px', borderBottom: '1px solid var(--border)',
      background: 'var(--bg)',
    }}>
      <Tab active>Preview</Tab>
      <Tab>Code</Tab>
      <Tab>Anatomy</Tab>
      <div style={{ flex: 1 }} />
      <FrameworkSwitch />
      <span style={{ width: 1, height: 20, background: 'var(--border)', margin: '0 8px' }} />
      <IconButton size="sm" variant="ghost" title="Light/Dark"><Icons.Moon size={15} /></IconButton>
      <IconButton size="sm" variant="ghost" title="Reset"><Icons.Sliders size={15} /></IconButton>
      <IconButton size="sm" variant="ghost" title="Open in new"><Icons.ArrowUpRight size={15} /></IconButton>
    </div>

    <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px' }}>
      {/* Stage */}
      <div style={{
        padding: '64px 32px', minHeight: 280,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: `
          radial-gradient(circle at 1px 1px, var(--border) 1px, transparent 1px)
        `, backgroundSize: '20px 20px',
        borderRight: '1px solid var(--border)',
        position: 'relative',
      }}>
        <Button size="lg" icon={<Icons.Sparkles size={18} />}>Generate suggestions</Button>
        {/* Corner labels */}
        <div style={{ position: 'absolute', bottom: 12, left: 14, fontSize: 11, fontFamily: 'var(--f-mono)', color: 'var(--text-tertiary)' }}>1440 × 320</div>
        <div style={{ position: 'absolute', bottom: 12, right: 14, fontSize: 11, fontFamily: 'var(--f-mono)', color: 'var(--text-tertiary)' }}>
          <Icons.CheckCircle size={11} style={{ verticalAlign: -1, color: 'var(--success)' }} /> AAA · 14.2:1
        </div>
      </div>

      {/* Controls panel */}
      <div style={{ padding: 18, background: 'var(--bg-elevated)' }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-tertiary)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 14 }}>Props</div>
        <Control label="variant">
          <Segmented options={['primary', 'secondary', 'soft', 'ghost', 'danger']} active="primary" />
        </Control>
        <Control label="size">
          <Segmented options={['sm', 'md', 'lg']} active="lg" />
        </Control>
        <Control label="icon">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 13, fontFamily: 'var(--f-mono)', color: 'var(--text-secondary)' }}>Sparkles</span>
            <span style={{ width: 30, height: 18, background: 'var(--primary)', borderRadius: 999, position: 'relative' }}>
              <span style={{ position: 'absolute', right: 2, top: 2, width: 14, height: 14, borderRadius: 999, background: 'white' }} />
            </span>
          </div>
        </Control>
        <Control label="loading">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 13, color: 'var(--text-tertiary)' }}>false</span>
            <span style={{ width: 30, height: 18, background: 'var(--border)', borderRadius: 999, position: 'relative' }}>
              <span style={{ position: 'absolute', left: 2, top: 2, width: 14, height: 14, borderRadius: 999, background: 'white' }} />
            </span>
          </div>
        </Control>
        <Control label="label">
          <Input size="sm" value="Generate suggestions" wrapStyle={{ height: 32, background: 'var(--surface)' }} />
        </Control>
      </div>
    </div>

    {/* Code panel (always visible underneath, like Linear's product) */}
    <div style={{ borderTop: '1px solid var(--border)', background: 'var(--bg)', padding: 20 }}>
      <CodeBlock lang="Vue · UButton">
        {<><C.t>&lt;UButton</C.t>{'\n  '}<C.a>icon</C.a>=<C.s>"i-lucide-sparkles"</C.s>{'\n  '}<C.a>size</C.a>=<C.s>"lg"</C.s>{'\n  '}<C.a>variant</C.a>=<C.s>"primary"</C.s>{'\n  '}<C.a>@click</C.a>=<C.s>"generate"</C.s>{'\n'}<C.t>&gt;</C.t>{'\n  '}Generate suggestions{'\n'}<C.t>&lt;/UButton&gt;</C.t></>}
      </CodeBlock>
    </div>
  </div>
);

const Tab = ({ active, children }) => (
  <span style={{
    padding: '12px 12px', fontSize: 13, fontWeight: active ? 600 : 500,
    color: active ? 'var(--text)' : 'var(--text-secondary)',
    borderBottom: active ? '2px solid var(--primary)' : '2px solid transparent',
    marginBottom: -1, cursor: 'pointer',
  }}>{children}</span>
);

const FrameworkSwitch = () => (
  <div style={{ display: 'flex', alignItems: 'center', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 6, padding: 2, gap: 2 }}>
    {[['Vue', true], ['React', false], ['Svelte', false]].map(([n, on], i) => (
      <span key={i} style={{
        padding: '4px 10px', fontSize: 12, fontWeight: 600,
        background: on ? 'var(--primary)' : 'transparent',
        color: on ? 'white' : 'var(--text-secondary)',
        borderRadius: 4,
      }}>{n}</span>
    ))}
  </div>
);

const Control = ({ label, children }) => (
  <div style={{ marginBottom: 14 }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
      <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', fontFamily: 'var(--f-mono)' }}>{label}</span>
    </div>
    {children}
  </div>
);

const Segmented = ({ options, active }) => (
  <div style={{
    display: 'flex', flexWrap: 'wrap', gap: 4,
    background: 'var(--surface-2)', padding: 3, borderRadius: 6,
  }}>
    {options.map(o => (
      <span key={o} style={{
        flex: '1 1 auto', textAlign: 'center', minWidth: 0,
        padding: '4px 8px', fontSize: 11.5, fontWeight: 600,
        background: o === active ? 'var(--surface)' : 'transparent',
        color: o === active ? 'var(--text)' : 'var(--text-secondary)',
        borderRadius: 4,
        boxShadow: o === active ? 'var(--shadow-card)' : 'none',
        whiteSpace: 'nowrap',
      }}>{o}</span>
    ))}
  </div>
);

const PropsTable = () => {
  const rows = [
    ['label', 'string', '—', 'Visible text. Required if no icon-only.'],
    ['variant', '"primary" | "secondary" | "soft" | "ghost" | "danger" | "link"', '"primary"', 'Visual emphasis level.'],
    ['size', '"sm" | "md" | "lg"', '"md"', 'Affects height, padding, font size.'],
    ['icon', 'string | Component', '—', 'Lucide name or icon component.'],
    ['trailing-icon', 'string | Component', '—', 'Icon on the right side.'],
    ['loading', 'boolean', 'false', 'Shows spinner, disables interaction.'],
    ['disabled', 'boolean', 'false', 'Fully disables and removes from tab order.'],
    ['block', 'boolean', 'false', 'Fills available width.'],
  ];
  return (
    <div style={{ border: '1px solid var(--border)', borderRadius: 'var(--r-card)', overflow: 'hidden' }}>
      <div style={{
        display: 'grid', gridTemplateColumns: '180px 1fr 140px 1.4fr',
        padding: '12px 20px', background: 'var(--surface-2)',
        fontSize: 11.5, fontWeight: 700, color: 'var(--text-tertiary)',
        letterSpacing: '0.06em', textTransform: 'uppercase',
        borderBottom: '1px solid var(--border)',
      }}>
        <span>Name</span><span>Type</span><span>Default</span><span>Description</span>
      </div>
      {rows.map(([n, t, d, desc], i) => (
        <div key={i} style={{
          display: 'grid', gridTemplateColumns: '180px 1fr 140px 1.4fr',
          padding: '14px 20px', alignItems: 'center',
          borderBottom: i < rows.length - 1 ? '1px solid var(--border)' : 'none',
          fontSize: 13,
        }}>
          <span style={{ fontFamily: 'var(--f-mono)', fontWeight: 600, color: 'var(--text)' }}>{n}</span>
          <span style={{ fontFamily: 'var(--f-mono)', color: 'var(--info)', fontSize: 12 }}>{t}</span>
          <span style={{ fontFamily: 'var(--f-mono)', color: 'var(--text-secondary)' }}>{d}</span>
          <span style={{ color: 'var(--text-secondary)' }}>{desc}</span>
        </div>
      ))}
    </div>
  );
};

const A11yItem = ({ ok, title, body }) => (
  <div style={{
    border: '1px solid var(--border)', borderRadius: 'var(--r-card)',
    padding: 18, display: 'flex', gap: 12, alignItems: 'flex-start',
    background: 'var(--surface)',
  }}>
    <span style={{
      width: 28, height: 28, borderRadius: 999, flex: '0 0 auto',
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      background: ok ? 'var(--success-soft)' : 'var(--danger-soft)',
      color: ok ? 'var(--success)' : 'var(--danger)',
    }}>
      <Icons.Check size={15} />
    </span>
    <div>
      <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 4 }}>{title}</div>
      <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.55 }}>{body}</div>
    </div>
  </div>
);

Object.assign(window, { PublicComponent, Sandbox, Tab, FrameworkSwitch, Control, Segmented, PropsTable, A11yItem });
