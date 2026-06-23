// ============================================================
// MOBILE — Shared chrome + 7 screens
// 375px wide
// ============================================================

// Phone status bar
const StatusBar = ({ dark }) => (
  <div style={{
    height: 44, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '0 22px', fontSize: 14, fontWeight: 600,
    color: dark ? '#F0F1F5' : '#1A1D21',
    flex: '0 0 auto',
  }}>
    <span style={{ fontVariantNumeric: 'tabular-nums' }}>9:41</span>
    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
      {/* signal */}
      <svg width="16" height="11" viewBox="0 0 16 11" fill="currentColor">
        <rect x="0" y="7" width="3" height="4" rx="1" />
        <rect x="4" y="5" width="3" height="6" rx="1" />
        <rect x="8" y="3" width="3" height="8" rx="1" />
        <rect x="12" y="0" width="3" height="11" rx="1" />
      </svg>
      {/* wifi */}
      <svg width="15" height="11" viewBox="0 0 15 11" fill="currentColor"><path d="M7.5 0a12 12 0 0 1 7.5 2.6L13.3 4.7A9 9 0 0 0 7.5 2.7 9 9 0 0 0 1.7 4.7L0 2.6A12 12 0 0 1 7.5 0zm0 4a8 8 0 0 1 5 1.7L10.8 7.8A5 5 0 0 0 7.5 6.7 5 5 0 0 0 4.2 7.8L2.5 5.7A8 8 0 0 1 7.5 4zm0 4a4 4 0 0 1 2.5.9l-2.5 3-2.5-3a4 4 0 0 1 2.5-.9z"/></svg>
      {/* battery */}
      <svg width="26" height="12" viewBox="0 0 26 12" fill="none">
        <rect x="0.5" y="0.5" width="22" height="11" rx="3" stroke="currentColor" opacity="0.4"/>
        <rect x="2" y="2" width="19" height="8" rx="1.5" fill="currentColor"/>
        <rect x="24" y="4" width="1.5" height="4" rx="0.5" fill="currentColor" opacity="0.4"/>
      </svg>
    </div>
  </div>
);

// Mobile top bar (menu · brand · search · theme)
const MobileTop = ({ team = 'Lumen' }) => (
  <header style={{
    height: 52, display: 'flex', alignItems: 'center', gap: 8,
    padding: '0 12px', borderBottom: '1px solid var(--border)',
    background: 'var(--bg-elevated)', flex: '0 0 auto',
  }}>
    <IconButton size="md" variant="ghost"><MenuIcon /></IconButton>
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1, minWidth: 0 }}>
      <svg width="22" height="22" viewBox="0 0 32 32" aria-hidden="true">
        <rect x="2" y="2" width="28" height="28" rx="7" fill="#1A1D21" />
        <circle cx="16" cy="16" r="7" fill="none" stroke="#FF6B4A" strokeWidth="2.4" />
        <circle cx="16" cy="16" r="2.5" fill="#FF6B4A" />
      </svg>
      <span style={{ fontFamily: 'var(--f-display)', fontWeight: 800, fontSize: 16, letterSpacing: '-0.01em' }}>{team}</span>
      <span style={{ fontFamily: 'var(--f-mono)', fontSize: 10, color: 'var(--text-tertiary)', padding: '1px 5px', background: 'var(--surface-2)', borderRadius: 3 }}>v2.4</span>
    </div>
    <IconButton size="md" variant="ghost"><Icons.Search size={18} /></IconButton>
    <IconButton size="md" variant="ghost"><Icons.Sun size={17} /></IconButton>
  </header>
);

const MenuIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M3 6h18M3 12h12M3 18h18" />
  </svg>
);

// Mobile section breadcrumb-row showing nav state on the public docs
const MobileCrumb = ({ items, trailing }) => (
  <div style={{
    display: 'flex', alignItems: 'center', gap: 4,
    padding: '12px 16px', borderBottom: '1px solid var(--border)',
    fontSize: 12.5, color: 'var(--text-tertiary)', fontWeight: 500,
    background: 'var(--bg)',
  }}>
    {items.map((c, i) => (
      <React.Fragment key={i}>
        <span style={{ color: i === items.length - 1 ? 'var(--text-secondary)' : 'var(--text-tertiary)' }}>{c}</span>
        {i < items.length - 1 && <Icons.ChevronRight size={11} />}
      </React.Fragment>
    ))}
    <div style={{ flex: 1 }} />
    {trailing}
  </div>
);

// ============================================================
// 01 · Mobile Public Home
// ============================================================
const MobilePublicHome = () => (
  <div className="ds ds-light ds-screen" data-screen-label="M01 Home" style={{ display: 'flex', flexDirection: 'column' }}>
    <StatusBar />
    <MobileTop />
    <div style={{ overflow: 'auto', flex: 1 }}>
      {/* Hero */}
      <section style={{
        padding: '32px 22px 36px',
        background: `
          radial-gradient(400px 200px at 100% -20%, rgba(255,209,102,.22), transparent 60%),
          radial-gradient(400px 240px at -10% 90%, rgba(255,107,74,.14), transparent 60%),
          var(--bg)
        `,
        borderBottom: '1px solid var(--border)',
      }}>
        <Badge tone="primary" style={{ marginBottom: 16 }}>
          <Icons.Sparkles size={11} /> v2.4 · 3 days ago
        </Badge>
        <h1 style={{
          fontFamily: 'var(--f-display)', fontWeight: 800,
          fontSize: 38, lineHeight: 1.02, letterSpacing: '-0.03em',
          marginBottom: 14,
        }}>
          The Lumen<br />
          <span style={{ color: 'var(--primary)', position: 'relative', display: 'inline-block' }}>
            Design System
            <svg width="200" height="10" viewBox="0 0 200 10" style={{ position: 'absolute', left: 0, bottom: -6 }}>
              <path d="M2 6 Q 60 1, 110 4 T 198 3" stroke="var(--secondary)" strokeWidth="3" fill="none" strokeLinecap="round" />
            </svg>
          </span>
        </h1>
        <p style={{ fontSize: 15, lineHeight: 1.55, color: 'var(--text-secondary)', marginBottom: 22 }}>
          48 components, 218 tokens, one source of truth. Everything Lumen ships, documented in one place.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <Button size="lg" full trailingIcon={<Icons.ArrowRight size={15} />}>Browse components</Button>
          <Button size="lg" full variant="secondary" icon={<Icons.Book size={15} />}>Read the principles</Button>
        </div>
        <div style={{
          marginTop: 32, padding: 14, background: 'var(--surface)',
          border: '1px solid var(--border)', borderRadius: 'var(--r-card)',
          boxShadow: 'var(--shadow-card)',
          display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6,
        }}>
          {[['48', 'comp'], ['218', 'tok'], ['32', 'docs'], ['9', 'team']].map(([n, l]) => (
            <div key={l} style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: 'var(--f-display)', fontWeight: 800, fontSize: 22, letterSpacing: '-0.02em', lineHeight: 1 }}>{n}</div>
              <div style={{ fontSize: 10, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600, marginTop: 4 }}>{l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Explore */}
      <section style={{ padding: '32px 22px 20px', borderBottom: '1px solid var(--border)' }}>
        <h2 style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 6 }}>Explore the system</h2>
        <p style={{ fontSize: 13.5, color: 'var(--text-secondary)', marginBottom: 18 }}>Start anywhere. Every page links to the components that use it.</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
          {[
            ['Foundations', <Icons.Sparkles size={18} />, '9 pages'],
            ['Components', <Icons.Component size={18} />, '48'],
            ['Tokens', <Icons.Palette size={18} />, '218'],
            ['Guidelines', <Icons.FileText size={18} />, '32'],
          ].map(([t, ic, c]) => (
            <div key={t} style={{
              padding: 14, border: '1px solid var(--border)', borderRadius: 'var(--r-card)',
              background: 'var(--surface)',
            }}>
              <span style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--primary-soft)', color: 'var(--primary)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>{ic}</span>
              <div style={{ fontFamily: 'var(--f-display)', fontWeight: 700, fontSize: 15, marginBottom: 2 }}>{t}</div>
              <div style={{ fontFamily: 'var(--f-mono)', fontSize: 10.5, color: 'var(--text-tertiary)', letterSpacing: '0.04em', textTransform: 'uppercase' }}>{c}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Recently updated */}
      <section style={{ padding: '24px 22px 32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, letterSpacing: '-0.01em' }}>Recently updated</h2>
          <span style={{ fontSize: 12, color: 'var(--primary)', fontWeight: 600 }}>All →</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <MobileRecent title="Button" v="1.4.0" status="updated" desc="Added variant=&quot;soft&quot;" />
          <MobileRecent title="color.primary" v="—" status="added" desc="New gold accent shade-200" kind="token" />
          <MobileRecent title="Toast" v="0.9.0-rc.1" status="draft" desc="Position prop replacing legacy variants" />
        </div>
      </section>

      <DocsFooter />
    </div>
  </div>
);

const MobileRecent = ({ title, v, status, desc, kind = 'component' }) => {
  const tones = { updated: 'info', added: 'success', draft: 'warning' };
  return (
    <div style={{
      padding: 14, border: '1px solid var(--border)', borderRadius: 'var(--r-card)',
      background: 'var(--surface)', display: 'flex', gap: 12, alignItems: 'center',
    }}>
      <span style={{ width: 32, height: 32, borderRadius: 6, background: 'var(--surface-2)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}>
        {kind === 'token' ? <Icons.Palette size={16} /> : <Icons.Component size={16} />}
      </span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
          <span style={{ fontFamily: kind === 'token' ? 'var(--f-mono)' : 'inherit', fontWeight: 600, fontSize: 13.5 }}>{title}</span>
          <span style={{ fontFamily: 'var(--f-mono)', fontSize: 10, color: 'var(--text-tertiary)' }}>{v}</span>
        </div>
        <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2, lineHeight: 1.4, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{desc}</div>
      </div>
      <Badge tone={tones[status]} dot>{status}</Badge>
    </div>
  );
};

// ============================================================
// 02 · Mobile Component (Button)
// ============================================================
const MobileComponent = () => (
  <div className="ds ds-light ds-screen" data-screen-label="M02 Component" style={{ display: 'flex', flexDirection: 'column' }}>
    <StatusBar />
    <MobileTop />
    <MobileCrumb items={['Components', 'Inputs', 'Button']} trailing={<Badge tone="success" dot>Approved</Badge>} />
    <div style={{ overflow: 'auto', flex: 1 }}>
      <section style={{ padding: '22px 22px 14px' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 8 }}>
          <h1 style={{ fontSize: 32, fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.05 }}>Button</h1>
          <Badge tone="neutral" style={{ fontFamily: 'var(--f-mono)' }}>v1.4</Badge>
        </div>
        <p style={{ fontSize: 14.5, lineHeight: 1.55, color: 'var(--text-secondary)', marginBottom: 14 }}>
          Triggers an action or event. OpenDS' most overloaded primitive.
        </p>
        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
          <Badge tone="neutral"><Icons.Tag size={10} />inputs</Badge>
          <Badge tone="neutral"><Icons.Tag size={10} />action</Badge>
          <Badge tone="neutral"><Icons.Tag size={10} />a11y-aa</Badge>
        </div>
      </section>

      {/* Sticky-feel sub-tabs */}
      <div style={{
        display: 'flex', gap: 16, padding: '0 22px',
        borderBottom: '1px solid var(--border)', overflow: 'auto',
      }}>
        {['Preview', 'Variants', 'Props', 'Code', 'A11y'].map((n, i) => (
          <span key={n} style={{
            padding: '12px 0', fontSize: 13, fontWeight: i === 0 ? 600 : 500,
            color: i === 0 ? 'var(--text)' : 'var(--text-secondary)',
            borderBottom: i === 0 ? '2px solid var(--primary)' : '2px solid transparent',
            marginBottom: -1, whiteSpace: 'nowrap',
          }}>{n}</span>
        ))}
      </div>

      {/* Sandbox stage */}
      <div style={{ padding: '16px 22px 0' }}>
        <div style={{
          border: '1px solid var(--border)', borderRadius: 'var(--r-card)', overflow: 'hidden',
          background: 'var(--surface)',
        }}>
          <div style={{
            padding: '60px 16px', display: 'flex', alignItems: 'center', justifyContent: 'center',
            backgroundImage: 'radial-gradient(circle at 1px 1px, var(--border) 1px, transparent 1px)',
            backgroundSize: '14px 14px',
            position: 'relative',
          }}>
            <Button icon={<Icons.Sparkles size={16} />}>Generate</Button>
            <div style={{ position: 'absolute', bottom: 8, right: 12, fontSize: 10, fontFamily: 'var(--f-mono)', color: 'var(--text-tertiary)' }}>
              <Icons.CheckCircle size={10} style={{ verticalAlign: -1, color: 'var(--success)' }} /> AAA · 14.2:1
            </div>
          </div>
          {/* Controls */}
          <div style={{ borderTop: '1px solid var(--border)', padding: 14, background: 'var(--bg-elevated)' }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-tertiary)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 10 }}>Props</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <MobileProp label="variant"><Segmented options={['prim','sec','soft','ghost']} active="prim" /></MobileProp>
              <MobileProp label="size"><Segmented options={['sm','md','lg']} active="md" /></MobileProp>
              <MobileProp label="loading"><SwitchRow value={false} /></MobileProp>
            </div>
          </div>
        </div>
      </div>

      {/* Code block */}
      <section style={{ padding: '20px 22px 0' }}>
        <div style={{ display: 'flex', gap: 6, marginBottom: 10 }}>
          <FrameworkPill on>Vue</FrameworkPill>
          <FrameworkPill>React</FrameworkPill>
          <FrameworkPill>Svelte</FrameworkPill>
        </div>
        <CodeBlock lang="Vue · UButton" style={{ fontSize: 12 }}>
          {<><C.t>&lt;UButton</C.t>{'\n  '}<C.a>icon</C.a>=<C.s>"i-lucide-sparkles"</C.s>{'\n  '}<C.a>size</C.a>=<C.s>"md"</C.s>{'\n'}<C.t>&gt;</C.t>{'\n  '}Generate{'\n'}<C.t>&lt;/UButton&gt;</C.t></>}
        </CodeBlock>
      </section>

      <section style={{ padding: '24px 22px 32px' }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 10, letterSpacing: '-0.01em' }}>Variants · 6</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
          {[
            ['Primary', <Button size="sm">Save</Button>],
            ['Secondary', <Button size="sm" variant="secondary">Cancel</Button>],
            ['Soft', <Button size="sm" variant="soft">Filter</Button>],
            ['Ghost', <Button size="sm" variant="ghost">Skip</Button>],
          ].map(([n, demo]) => (
            <div key={n} style={{ padding: 12, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--r-card)' }}>
              <div style={{ height: 44, background: 'var(--bg)', borderRadius: 6, border: '1px dashed var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 8 }}>{demo}</div>
              <div style={{ fontSize: 12, fontWeight: 600 }}>{n}</div>
            </div>
          ))}
        </div>
      </section>
      <DocsFooter />
    </div>
  </div>
);

const MobileProp = ({ label, children }) => (
  <div>
    <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', fontFamily: 'var(--f-mono)', marginBottom: 4 }}>{label}</div>
    {children}
  </div>
);

const FrameworkPill = ({ on, children }) => (
  <span style={{
    padding: '5px 10px', fontSize: 11, fontWeight: 600,
    background: on ? 'var(--primary)' : 'var(--surface-2)',
    color: on ? 'white' : 'var(--text-secondary)',
    borderRadius: 5,
  }}>{children}</span>
);

const SwitchRowMini = ({ value }) => (
  <span style={{ width: 30, height: 18, background: value ? 'var(--primary)' : 'var(--border)', borderRadius: 999, position: 'relative', display: 'inline-block' }}>
    <span style={{ position: 'absolute', [value ? 'right' : 'left']: 2, top: 2, width: 14, height: 14, borderRadius: 999, background: 'white' }} />
  </span>
);

// ============================================================
// 03 · Mobile Tokens (Color)
// ============================================================
const MobileToken = () => (
  <div className="ds ds-light ds-screen" data-screen-label="M03 Tokens" style={{ display: 'flex', flexDirection: 'column' }}>
    <StatusBar />
    <MobileTop />
    <MobileCrumb items={['Foundations', 'Color']} />
    <div style={{ overflow: 'auto', flex: 1 }}>
      <section style={{ padding: '22px 22px 14px' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 10 }}>
          <h1 style={{ fontSize: 32, fontWeight: 800, letterSpacing: '-0.03em' }}>Color</h1>
          <Button size="sm" variant="secondary" icon={<Icons.Download size={13} />}>Export</Button>
        </div>
        <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.55 }}>Seven semantic ramps and four status aliases. Every value has a guaranteed contrast partner.</p>
      </section>

      {/* Featured swatch */}
      <section style={{ padding: '0 22px' }}>
        <div style={{
          background: '#FF6B4A', color: 'white',
          borderRadius: 'var(--r-card)', padding: 18, marginBottom: 10,
        }}>
          <div style={{ fontFamily: 'var(--f-mono)', fontSize: 10, opacity: 0.7, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 12 }}>color/primary/500</div>
          <div style={{ fontFamily: 'var(--f-display)', fontWeight: 800, fontSize: 28, letterSpacing: '-0.02em', marginBottom: 18 }}>Sweet Salmon</div>
          <div style={{ display: 'flex', gap: 16 }}>
            <div>
              <div style={{ fontSize: 10, opacity: 0.7, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' }}>HEX</div>
              <div style={{ fontFamily: 'var(--f-mono)', fontSize: 13, fontWeight: 600 }}>#FF6B4A</div>
            </div>
            <div>
              <div style={{ fontSize: 10, opacity: 0.7, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Used</div>
              <div style={{ fontFamily: 'var(--f-mono)', fontSize: 13, fontWeight: 600 }}>27 places</div>
            </div>
          </div>
        </div>
      </section>

      {/* Ramp */}
      <section style={{ padding: '12px 22px 0' }}>
        <h2 style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-tertiary)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 10 }}>Primary ramp</h2>
        <div style={{ display: 'flex', flexDirection: 'column', borderRadius: 'var(--r-card)', overflow: 'hidden', border: '1px solid var(--border)' }}>
          {[
            [50, '#FFF1ED'], [200, '#FFB8A3'], [400, '#FF834F'],
            [500, '#FF6B4A'], [600, '#E85A3A'], [800, '#8A311F'],
          ].map(([n, hex]) => {
            const dark = n >= 400;
            return (
              <div key={n} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '14px 16px', background: hex,
                color: dark ? 'white' : '#1A1D21',
              }}>
                <span style={{ fontFamily: 'var(--f-display)', fontWeight: 800, fontSize: 16, letterSpacing: '-0.02em' }}>{n}</span>
                <span style={{ fontFamily: 'var(--f-mono)', fontSize: 12 }}>{hex}</span>
              </div>
            );
          })}
        </div>
      </section>

      {/* Semantic */}
      <section style={{ padding: '20px 22px 32px' }}>
        <h2 style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-tertiary)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 10 }}>Semantic</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
          {[
            ['success', '#1F8A5B'], ['warning', '#FFD166'],
            ['danger', '#D14343'], ['info', '#2A6FDB'],
          ].map(([n, hex]) => (
            <div key={n} style={{ border: '1px solid var(--border)', borderRadius: 'var(--r-card)', overflow: 'hidden', background: 'var(--surface)' }}>
              <div style={{ height: 48, background: hex }} />
              <div style={{ padding: 10 }}>
                <div style={{ fontFamily: 'var(--f-mono)', fontSize: 12, fontWeight: 600 }}>{n}</div>
                <div style={{ fontFamily: 'var(--f-mono)', fontSize: 10.5, color: 'var(--text-tertiary)' }}>{hex}</div>
              </div>
            </div>
          ))}
        </div>
      </section>
      <DocsFooter />
    </div>
  </div>
);

// ============================================================
// 04 · Mobile Docs (Markdown)
// ============================================================
const MobileDocs = () => (
  <div className="ds ds-light ds-screen" data-screen-label="M04 Docs" style={{ display: 'flex', flexDirection: 'column' }}>
    <StatusBar />
    <MobileTop />
    <MobileCrumb items={['Guidelines', 'Writing for buttons']} />
    <div style={{ overflow: 'auto', flex: 1 }}>
      <article style={{ padding: '22px 22px 32px' }}>
        <h1 style={{ fontSize: 32, fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.05, marginBottom: 14 }}>
          Writing for buttons
        </h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20, fontSize: 12.5, color: 'var(--text-tertiary)' }}>
          <Avatar name="Jay Patel" size={24} />
          <div>
            <span style={{ color: 'var(--text)', fontWeight: 600 }}>Jay Patel</span> · 2d ago · 6 min
          </div>
        </div>
        <p style={{ fontSize: 16, lineHeight: 1.6, color: 'var(--text-secondary)', marginBottom: 20 }}>
          Button labels are the most-read words in your product. Treat them as design material—not as a label slot.
        </p>
        <p style={{ fontSize: 15, lineHeight: 1.7, marginBottom: 20 }}>
          Every button is a promise. The label is the contract. When a label is vague, users hesitate, click defensively, or do the wrong thing entirely.
        </p>
        <h2 style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.02em', marginTop: 24, marginBottom: 12 }}>The four rules</h2>
        <Callout tone="primary" icon={<Icons.Sparkles size={15} />} title="Start with the verb">
          Labels start with what happens, not what the button is. "Save" is a verb. "OK" is not.
        </Callout>
        <p style={{ fontSize: 15, lineHeight: 1.7, marginBottom: 16 }}>
          That gives us our first rule: <strong>start with the verb.</strong> Add the object only when it disambiguates:
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
          <DoDont kind="do" items={['Save changes', 'Send invite', 'Delete repo']} />
          <DoDont kind="dont" items={['OK', 'Submit', 'Done']} />
        </div>
        <h2 style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.02em', marginTop: 16, marginBottom: 12 }}>Match the destination</h2>
        <p style={{ fontSize: 15, lineHeight: 1.7 }}>
          If clicking opens a modal, say <code style={{ fontFamily: 'var(--f-mono)', background: 'var(--surface-2)', padding: '2px 6px', borderRadius: 4, fontSize: 13, color: 'var(--primary)' }}>Open settings</code>.
        </p>
      </article>
      <DocsFooter />
    </div>
  </div>
);

// ============================================================
// 05 · Mobile Admin Dashboard
// ============================================================
const MobileAdminDashboard = () => (
  <div className="ds ds-light ds-screen" data-screen-label="M05 Admin Dashboard" style={{ display: 'flex', flexDirection: 'column' }}>
    <StatusBar />
    <header style={{
      height: 52, display: 'flex', alignItems: 'center', gap: 8,
      padding: '0 12px', borderBottom: '1px solid var(--border)',
      background: 'var(--bg-elevated)', flex: '0 0 auto',
    }}>
      <IconButton variant="ghost"><MenuIcon /></IconButton>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1 }}>
        <Icons.Logo size={22} />
        <span style={{ fontFamily: 'var(--f-display)', fontWeight: 800, fontSize: 15 }}>OpenDS</span>
        <span style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>· Lumen</span>
      </div>
      <IconButton variant="ghost"><Icons.Bell size={17} /></IconButton>
      <Avatar name="Mira Quinn" size={28} />
    </header>
    <div style={{ overflow: 'auto', flex: 1, background: 'var(--bg)' }}>
      <section style={{ padding: '20px 16px 12px' }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 4 }}>Welcome back, Mira</h1>
        <div style={{ fontSize: 13, color: 'var(--text-tertiary)' }}>Lumen workspace · 26 changes this week</div>
      </section>

      <section style={{ padding: '0 16px 12px', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
        <MobileStat label="Components" value="48" delta="+3" tone="success" />
        <MobileStat label="Tokens" value="218" delta="+12" tone="success" />
        <MobileStat label="Pages" value="32" delta="2 drafts" tone="warning" />
        <MobileStat label="Active" value="9" delta="3 online" tone="info" />
      </section>

      <section style={{ padding: '12px 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
          <h2 style={{ fontSize: 15, fontWeight: 700 }}>Needs review</h2>
          <Badge tone="warning" dot>3</Badge>
        </div>
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--r-card)', overflow: 'hidden' }}>
          {[
            ['Toast', '0.9.0-rc.1', 'Jay'],
            ['Drawer', '1.1.0', 'Eli'],
            ['color.danger.100', '—', 'Sun'],
          ].map(([n, v, w], i, a) => (
            <div key={n} style={{
              padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 10,
              borderBottom: i < a.length - 1 ? '1px solid var(--border)' : 'none',
            }}>
              <span style={{ width: 30, height: 30, borderRadius: 6, background: 'var(--surface-2)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}>{n.startsWith('color') ? <Icons.Palette size={15} /> : <Icons.Component size={15} />}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 600, fontFamily: n.startsWith('color') ? 'var(--f-mono)' : 'inherit' }}>{n}</div>
                <div style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>{v} · by {w}</div>
              </div>
              <Button size="sm">Review</Button>
            </div>
          ))}
        </div>
      </section>

      <section style={{ padding: '12px 16px 32px' }}>
        <h2 style={{ fontSize: 15, fontWeight: 700, marginBottom: 10 }}>Recent activity</h2>
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--r-card)', overflow: 'hidden' }}>
          {[
            ['Jay Patel', 'updated', 'Button', 'component', '12m'],
            ['Sun Park', 'created', 'color.gold.200', 'token', '44m'],
            ['Eli Wright', 'published', 'Writing for buttons', 'docs', '2h'],
            ['Mira Quinn', 'deprecated', 'OldDropdown', 'component', '1d'],
          ].map(([who, what, target, kind, time], i, a) => (
            <div key={i} style={{
              padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 10,
              borderBottom: i < a.length - 1 ? '1px solid var(--border)' : 'none',
            }}>
              <Avatar name={who} size={26} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 12.5, lineHeight: 1.4 }}>
                  <span style={{ fontWeight: 600 }}>{who.split(' ')[0]}</span>
                  <span style={{ color: 'var(--text-secondary)' }}> {what} </span>
                  <span style={{ fontWeight: 600, color: 'var(--primary)', fontFamily: kind === 'token' ? 'var(--f-mono)' : 'inherit' }}>{target}</span>
                </div>
              </div>
              <span style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>{time}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom nav */}
      <nav style={{
        position: 'sticky', bottom: 0, left: 0, right: 0,
        display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)',
        background: 'var(--bg-elevated)', borderTop: '1px solid var(--border)',
        padding: '6px 0 22px',
      }}>
        <BottomNav icon={<Icons.Home size={20} />} label="Home" active />
        <BottomNav icon={<Icons.Component size={20} />} label="Comp" />
        <BottomNav icon={<Icons.Palette size={20} />} label="Tokens" />
        <BottomNav icon={<Icons.FileText size={20} />} label="Docs" />
        <BottomNav icon={<Icons.User size={20} />} label="More" />
      </nav>
    </div>
  </div>
);

const MobileStat = ({ label, value, delta, tone }) => (
  <Card style={{ padding: 14 }}>
    <div style={{ fontSize: 12, color: 'var(--text-secondary)', fontWeight: 600, marginBottom: 8 }}>{label}</div>
    <div style={{ fontFamily: 'var(--f-display)', fontWeight: 800, fontSize: 26, letterSpacing: '-0.02em', lineHeight: 1, marginBottom: 6 }}>{value}</div>
    <Badge tone={tone} style={{ fontSize: 11, padding: '2px 6px' }}>{delta}</Badge>
  </Card>
);

const BottomNav = ({ icon, label, active }) => (
  <div style={{
    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
    color: active ? 'var(--primary)' : 'var(--text-tertiary)',
    padding: '6px 0',
  }}>
    {icon}
    <span style={{ fontSize: 10.5, fontWeight: 600 }}>{label}</span>
  </div>
);

// ============================================================
// 06 · Mobile Login
// ============================================================
const MobileLogin = () => (
  <div className="ds ds-light ds-screen" data-screen-label="M06 Login" style={{ display: 'flex', flexDirection: 'column' }}>
    <StatusBar />
    <div style={{
      flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
      padding: '20px 24px 40px',
      background: `
        radial-gradient(400px 200px at 100% 10%, rgba(255,209,102,.20), transparent 60%),
        radial-gradient(400px 240px at -20% 100%, rgba(255,107,74,.14), transparent 60%),
        var(--bg-elevated)
      `,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <Icons.Logo size={26} />
        <span style={{ fontFamily: 'var(--f-display)', fontWeight: 800, fontSize: 17, letterSpacing: '-0.01em' }}>OpenDS</span>
      </div>
      <div>
        <h1 style={{ fontSize: 32, fontWeight: 800, letterSpacing: '-0.025em', lineHeight: 1.05, marginBottom: 8 }}>
          Welcome back
        </h1>
        <p style={{ fontSize: 15, color: 'var(--text-secondary)', marginBottom: 24 }}>
          Sign in to your Lumen workspace.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 18 }}>
          <Button variant="secondary" size="lg" full icon={<Icons.Github size={16} />}>Continue with GitHub</Button>
          <Button variant="secondary" size="lg" full icon={
            <svg width="16" height="16" viewBox="0 0 16 16"><path fill="#4285F4" d="M15.5 8.2c0-.5 0-1-.1-1.5H8v2.9h4.2c-.2 1-.7 1.8-1.6 2.4v2h2.6c1.5-1.4 2.3-3.4 2.3-5.8z"/><path fill="#34A853" d="M8 16c2.2 0 4-.7 5.3-2l-2.6-2c-.7.5-1.6.8-2.7.8-2.1 0-3.8-1.4-4.5-3.3H.9v2C2.2 14.1 4.9 16 8 16z"/><path fill="#FBBC04" d="M3.5 9.5c-.2-.5-.3-1-.3-1.5s.1-1 .3-1.5v-2H.9C.3 5.7 0 6.8 0 8s.3 2.3.9 3.5l2.6-2z"/><path fill="#EA4335" d="M8 3.2c1.2 0 2.3.4 3.1 1.2l2.3-2.3C12 .9 10.2 0 8 0 4.9 0 2.2 1.9.9 4.5l2.6 2C4.2 4.6 5.9 3.2 8 3.2z"/></svg>
          }>Continue with Google</Button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '14px 0' }}>
          <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
          <span style={{ fontSize: 11, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>or email</span>
          <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <Input size="lg" placeholder="you@lumen.co" leading={<Icons.Mail size={16} />} value="mira@lumen.co" />
          <Input size="lg" placeholder="Password" leading={<Icons.Lock size={16} />} value="••••••••••" />
          <Button size="lg" full style={{ marginTop: 6 }}>Sign in</Button>
        </div>
      </div>
      <div style={{ textAlign: 'center', fontSize: 13, color: 'var(--text-secondary)' }}>
        New here? <span style={{ color: 'var(--primary)', fontWeight: 600 }}>Request access →</span>
      </div>
    </div>
  </div>
);

// ============================================================
// 07 · Mobile ⌘K (full-screen search)
// ============================================================
const MobileCmdK = () => (
  <div className="ds ds-light ds-screen" data-screen-label="M07 Search" style={{ display: 'flex', flexDirection: 'column' }}>
    <StatusBar />
    {/* Search input header */}
    <div style={{
      display: 'flex', alignItems: 'center', gap: 12,
      padding: '12px 14px', borderBottom: '1px solid var(--border)',
      background: 'var(--bg-elevated)',
    }}>
      <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--primary)' }}>Cancel</span>
      <div style={{ flex: 1, height: 38, padding: '0 12px', display: 'flex', alignItems: 'center', gap: 8, background: 'var(--surface-2)', borderRadius: 8 }}>
        <Icons.Search size={16} style={{ color: 'var(--text-tertiary)' }} />
        <span style={{ fontSize: 14, color: 'var(--text)' }}>butt</span>
        <span style={{ display: 'inline-block', width: 1.5, height: 16, background: 'var(--primary)' }} />
      </div>
    </div>

    {/* Scope */}
    <div style={{ display: 'flex', gap: 4, padding: '10px 14px', overflow: 'auto', borderBottom: '1px solid var(--border)' }}>
      {[['All', true], ['Components', false], ['Tokens', false], ['Docs', false], ['Settings', false]].map(([n, a], i) => (
        <span key={i} style={{
          padding: '5px 12px', fontSize: 12.5, fontWeight: 600,
          background: a ? 'var(--primary-soft)' : 'var(--surface-2)',
          color: a ? 'var(--primary)' : 'var(--text-secondary)',
          borderRadius: 999, whiteSpace: 'nowrap',
        }}>{n}</span>
      ))}
    </div>

    <div style={{ flex: 1, overflow: 'auto', padding: 0 }}>
      <Section title="Components" />
      <MobileResult icon={<Icons.Component size={16} />} title="Button" sub="Triggers an action or event" path="Components / Inputs" />
      <MobileResult icon={<Icons.Component size={16} />} title="ButtonGroup" sub="Group of related buttons" path="Components / Inputs" />
      <Section title="Tokens" />
      <MobileResult icon={<Icons.Palette size={16} />} title="color.button.primary" sub="#FF6B4A · 27 uses" path="Tokens / Color" mono />
      <Section title="Docs" />
      <MobileResult icon={<Icons.FileText size={16} />} title="Writing for buttons" sub="2d ago by Jay Patel" path="Guidelines" />
      <Section title="Actions" />
      <MobileResult icon={<Icons.Plus size={16} />} title="Create new component…" sub="Admin shortcut" />
      <MobileResult icon={<Icons.Moon size={16} />} title="Toggle dark theme" sub="Preferences" />
    </div>
  </div>
);

const MobileResult = ({ icon, title, sub, path, mono }) => {
  const hl = (t) => {
    const re = /(butt)/i;
    return t.split(re).map((p, i) =>
      re.test(p)
        ? <span key={i} style={{ background: 'var(--secondary-soft)', color: 'var(--warning)', padding: '0 1px', borderRadius: 2, fontWeight: 700 }}>{p}</span>
        : p
    );
  };
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 12,
      padding: '12px 16px', borderBottom: '1px solid var(--border)',
    }}>
      <span style={{ width: 32, height: 32, borderRadius: 6, background: 'var(--surface-2)', color: 'var(--text-secondary)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>{icon}</span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 14, fontWeight: 600, fontFamily: mono ? 'var(--f-mono)' : 'inherit' }}>{hl(title)}</div>
        <div style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>{sub}</div>
      </div>
      <Icons.ChevronRight size={14} style={{ color: 'var(--text-tertiary)' }} />
    </div>
  );
};

Object.assign(window, {
  MobilePublicHome, MobileComponent, MobileToken, MobileDocs,
  MobileAdminDashboard, MobileLogin, MobileCmdK,
  MobileRecent, MobileProp, StatusBar, MobileTop, MobileCrumb, BottomNav,
});
