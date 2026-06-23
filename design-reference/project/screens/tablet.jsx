// ============================================================
// TABLET — 834px (iPad portrait-ish)
// 5 screens: Public Home, Component, Tokens, Admin Dashboard, Components list
// ============================================================

// Tablet docs sidebar — condensed (icon + label, narrower)
const TabletDocsSidebar = ({ active }) => (
  <aside style={{
    width: 220, flex: '0 0 auto',
    borderRight: '1px solid var(--border)',
    background: 'var(--bg)', overflow: 'auto', padding: '10px 6px 24px',
  }}>
    <SidebarSection style={{ paddingTop: 8 }}>Foundations</SidebarSection>
    <NavItem icon={<Icons.Palette size={15} />} active={active === 'color'}>Color</NavItem>
    <NavItem icon={<Icons.Type size={15} />}>Typography</NavItem>
    <NavItem icon={<Icons.Ruler size={15} />}>Spacing</NavItem>
    <NavItem icon={<Icons.Cube size={15} />}>Radius &amp; Shadow</NavItem>

    <SidebarSection>Components</SidebarSection>
    <NavItem indent={0} active={active === 'button'}>Button</NavItem>
    <NavItem indent={0}>Checkbox</NavItem>
    <NavItem indent={0}>Input</NavItem>
    <NavItem indent={0}>Select</NavItem>
    <NavItem indent={0}>Card</NavItem>
    <NavItem indent={0}>Badge</NavItem>
    <NavItem indent={0}>Modal</NavItem>
    <NavItem indent={0}>Tabs</NavItem>
    <NavItem indent={0}>Toast</NavItem>
    <SidebarSection>Patterns</SidebarSection>
    <NavItem icon={<Icons.FileText size={15} />}>Forms</NavItem>
    <NavItem icon={<Icons.FileText size={15} />}>Empty states</NavItem>
  </aside>
);

const TabletDocsHeader = () => (
  <header style={{
    display: 'flex', alignItems: 'center', gap: 12,
    height: 52, padding: '0 18px',
    borderBottom: '1px solid var(--border)',
    background: 'var(--bg-elevated)', flex: '0 0 auto',
  }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <svg width="24" height="24" viewBox="0 0 32 32" aria-hidden="true">
        <rect x="2" y="2" width="28" height="28" rx="7" fill="#1A1D21" />
        <circle cx="16" cy="16" r="7" fill="none" stroke="#FF6B4A" strokeWidth="2.4" />
        <circle cx="16" cy="16" r="2.5" fill="#FF6B4A" />
      </svg>
      <span style={{ fontFamily: 'var(--f-display)', fontWeight: 800, fontSize: 17, letterSpacing: '-0.01em' }}>Lumen</span>
      <Badge tone="neutral" style={{ fontSize: 10, padding: '1px 5px' }}>v2.4</Badge>
    </div>
    <div style={{ flex: 1, maxWidth: 360 }}>
      <Input leading={<Icons.Search size={14} />} placeholder="Search…" kbd="⌘K" size="sm" />
    </div>
    <div style={{ flex: 1 }} />
    <nav style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 13, color: 'var(--text-secondary)' }}>
      <span style={{ padding: '6px 8px' }}>Components</span>
      <span style={{ padding: '6px 8px' }}>Tokens</span>
      <span style={{ padding: '6px 8px' }}>Guidelines</span>
    </nav>
    <IconButton variant="ghost"><Icons.Sun size={16} /></IconButton>
    <IconButton variant="ghost"><Icons.Github size={16} /></IconButton>
  </header>
);

// ============================================================
// T01 · Tablet Public Home
// ============================================================
const TabletPublicHome = () => (
  <div className="ds ds-light ds-screen" data-screen-label="T01 Home" style={{ display: 'flex', flexDirection: 'column' }}>
    <TabletDocsHeader />
    <div style={{ overflow: 'auto', flex: 1 }}>
      {/* HERO */}
      <section style={{
        padding: '56px 40px 44px',
        background: `
          radial-gradient(600px 280px at 100% -50%, rgba(255,209,102,.18), transparent 60%),
          radial-gradient(500px 280px at -10% 110%, rgba(255,107,74,.10), transparent 60%),
          var(--bg)
        `,
        borderBottom: '1px solid var(--border)',
      }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 32, alignItems: 'start' }}>
          <div>
            <Badge tone="primary" style={{ marginBottom: 20 }}>
              <Icons.Sparkles size={12} /> v2.4 · 3 days ago
            </Badge>
            <h1 style={{
              fontFamily: 'var(--f-display)', fontWeight: 800,
              fontSize: 52, lineHeight: 1.02, letterSpacing: '-0.035em',
              marginBottom: 18,
            }}>
              The Lumen<br />
              <span style={{ color: 'var(--primary)', position: 'relative', display: 'inline-block' }}>
                Design System
                <svg width="280" height="12" viewBox="0 0 280 12" style={{ position: 'absolute', left: 0, bottom: -7 }}>
                  <path d="M2 7 Q 90 1, 150 5 T 278 4" stroke="var(--secondary)" strokeWidth="3.5" fill="none" strokeLinecap="round" />
                </svg>
              </span>
            </h1>
            <p style={{ fontSize: 17, lineHeight: 1.55, color: 'var(--text-secondary)', maxWidth: 480, marginBottom: 28 }}>
              48 components, 218 tokens, one source of truth. Everything Lumen ships, documented in one place.
            </p>
            <div style={{ display: 'flex', gap: 10 }}>
              <Button size="lg" trailingIcon={<Icons.ArrowRight size={15} />}>Browse components</Button>
              <Button size="lg" variant="secondary" icon={<Icons.Book size={15} />}>Principles</Button>
            </div>
            <div style={{ marginTop: 36, display: 'flex', gap: 28 }}>
              {[['48', 'COMPONENTS'], ['218', 'TOKENS'], ['32', 'GUIDELINES'], ['9', 'TEAM']].map(([n, l]) => (
                <div key={l}>
                  <div style={{ fontFamily: 'var(--f-display)', fontSize: 24, fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1 }}>{n}</div>
                  <div style={{ fontSize: 10.5, color: 'var(--text-tertiary)', marginTop: 4, fontWeight: 600, letterSpacing: '0.06em' }}>{l}</div>
                </div>
              ))}
            </div>
          </div>
          {/* Mini sample stack */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--r-card)', padding: 14, boxShadow: 'var(--shadow-card)' }}>
              <div style={{ fontFamily: 'var(--f-mono)', fontSize: 9.5, color: 'var(--text-tertiary)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 10 }}>color</div>
              <div style={{ display: 'flex', gap: 4 }}>
                {['#FF6B4A','#FFD166','#1F8A5B','#2A6FDB','#1A1D21'].map((c, i) => <div key={i} style={{ flex: 1, height: 28, borderRadius: 5, background: c }} />)}
              </div>
            </div>
            <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--r-card)', padding: 14, boxShadow: 'var(--shadow-card)' }}>
              <div style={{ fontFamily: 'var(--f-mono)', fontSize: 9.5, color: 'var(--text-tertiary)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 10 }}>button</div>
              <Button>Continue</Button>
            </div>
            <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--r-card)', padding: 14, boxShadow: 'var(--shadow-card)' }}>
              <div style={{ fontFamily: 'var(--f-mono)', fontSize: 9.5, color: 'var(--text-tertiary)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 10 }}>type</div>
              <div style={{ fontFamily: 'var(--f-display)', fontWeight: 800, fontSize: 30, letterSpacing: '-0.02em', lineHeight: 1 }}>Aa</div>
              <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 6 }}>Outfit + Inter</div>
            </div>
          </div>
        </div>
      </section>

      {/* Explore (2 cols) */}
      <section style={{ padding: '36px 40px 24px', borderBottom: '1px solid var(--border)' }}>
        <h2 style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 14 }}>Explore the system</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
          {[
            ['Foundations', <Icons.Sparkles size={18} />, '9 pages', 'Color, type, spacing, motion — the rules that hold everything together.'],
            ['Components', <Icons.Component size={18} />, '48', 'Live preview, props, code. Multi-framework output.'],
            ['Tokens', <Icons.Palette size={18} />, '218', 'CSS, JSON, SCSS export. The exact values everywhere.'],
            ['Guidelines', <Icons.FileText size={18} />, '32', 'Writing, empty states, accessibility, contribution.'],
          ].map(([t, ic, c, body]) => (
            <div key={t} style={{ padding: 18, border: '1px solid var(--border)', borderRadius: 'var(--r-card)', background: 'var(--surface)' }}>
              <span style={{ width: 34, height: 34, borderRadius: 8, background: 'var(--primary-soft)', color: 'var(--primary)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: 10 }}>{ic}</span>
              <div style={{ fontFamily: 'var(--f-display)', fontWeight: 700, fontSize: 16 }}>{t}</div>
              <div style={{ fontFamily: 'var(--f-mono)', fontSize: 10.5, color: 'var(--text-tertiary)', letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: 8 }}>{c}</div>
              <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{body}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Recent */}
      <section style={{ padding: '28px 40px 40px' }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 14 }}>Recently updated</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
          <MobileRecent title="Button" v="1.4.0" status="updated" desc="Added variant=&quot;soft&quot;" />
          <MobileRecent title="color.primary" v="—" status="added" desc="New gold accent shade-200" kind="token" />
          <MobileRecent title="Toast" v="0.9.0-rc.1" status="draft" desc="Position prop replacing legacy" />
        </div>
      </section>
      <DocsFooter />
    </div>
  </div>
);

// ============================================================
// T02 · Tablet Component (Button)
// ============================================================
const TabletComponent = () => (
  <div className="ds ds-light ds-screen" data-screen-label="T02 Component" style={{ display: 'flex', flexDirection: 'column' }}>
    <TabletDocsHeader />
    <div style={{ flex: 1, display: 'flex', minHeight: 0 }}>
      <TabletDocsSidebar active="button" />
      <main style={{ flex: 1, overflow: 'auto', padding: '28px 32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--text-tertiary)', marginBottom: 14, fontWeight: 500 }}>
          <span>Components</span><Icons.ChevronRight size={11} /><span>Inputs</span><Icons.ChevronRight size={11} /><span style={{ color: 'var(--text-secondary)' }}>Button</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 10 }}>
          <h1 style={{ fontSize: 34, fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.05, flex: 1 }}>Button</h1>
          <Badge tone="success" dot>Approved</Badge>
          <Badge tone="neutral" style={{ fontFamily: 'var(--f-mono)' }}>v1.4.0</Badge>
        </div>
        <p style={{ fontSize: 15.5, lineHeight: 1.55, color: 'var(--text-secondary)', marginBottom: 20 }}>
          Triggers an action or event. The most overloaded primitive in the system.
        </p>

        {/* Sandbox (stacked) */}
        <div style={{
          border: '1px solid var(--border)', borderRadius: 'var(--r-card)',
          overflow: 'hidden', background: 'var(--surface)',
          boxShadow: 'var(--shadow-card)',
        }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 4,
            padding: '0 12px', borderBottom: '1px solid var(--border)',
            background: 'var(--bg)',
          }}>
            <span style={{ padding: '11px 10px', fontSize: 13, fontWeight: 600, borderBottom: '2px solid var(--primary)', marginBottom: -1 }}>Preview</span>
            <span style={{ padding: '11px 10px', fontSize: 13, color: 'var(--text-secondary)' }}>Code</span>
            <div style={{ flex: 1 }} />
            <FrameworkSwitchTablet />
            <IconButton size="sm" variant="ghost"><Icons.Moon size={14} /></IconButton>
            <IconButton size="sm" variant="ghost"><Icons.ArrowUpRight size={14} /></IconButton>
          </div>

          <div style={{
            padding: '56px 24px', minHeight: 200,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            backgroundImage: 'radial-gradient(circle at 1px 1px, var(--border) 1px, transparent 1px)',
            backgroundSize: '18px 18px',
            position: 'relative',
          }}>
            <Button size="lg" icon={<Icons.Sparkles size={18} />}>Generate suggestions</Button>
            <div style={{ position: 'absolute', bottom: 10, right: 14, fontSize: 11, fontFamily: 'var(--f-mono)', color: 'var(--text-tertiary)' }}>
              <Icons.CheckCircle size={11} style={{ verticalAlign: -1, color: 'var(--success)' }} /> AAA · 14.2:1
            </div>
          </div>

          {/* Controls panel BELOW (instead of right) on tablet */}
          <div style={{ borderTop: '1px solid var(--border)', padding: 16, background: 'var(--bg-elevated)' }}>
            <div style={{ fontSize: 10.5, fontWeight: 700, color: 'var(--text-tertiary)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 10 }}>Props</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
              <MobileProp label="variant"><Segmented options={['prim', 'sec', 'soft', 'ghost']} active="prim" /></MobileProp>
              <MobileProp label="size"><Segmented options={['sm', 'md', 'lg']} active="lg" /></MobileProp>
              <MobileProp label="icon"><SwitchRow value={true} /></MobileProp>
              <MobileProp label="loading"><SwitchRow value={false} /></MobileProp>
            </div>
          </div>

          {/* Code preview */}
          <div style={{ borderTop: '1px solid var(--border)', padding: 16, background: 'var(--bg)' }}>
            <CodeBlock lang="Vue · UButton">
              {<><C.t>&lt;UButton</C.t>{' '}<C.a>icon</C.a>=<C.s>"i-lucide-sparkles"</C.s>{' '}<C.a>size</C.a>=<C.s>"lg"</C.s><C.t>&gt;</C.t>{'\n  '}Generate suggestions{'\n'}<C.t>&lt;/UButton&gt;</C.t></>}
            </CodeBlock>
          </div>
        </div>

        {/* Variants 2-col */}
        <h2 style={{ fontSize: 20, fontWeight: 700, marginTop: 36, marginBottom: 14, letterSpacing: '-0.02em' }}>Variants</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 0, border: '1px solid var(--border)', borderRadius: 'var(--r-card)', overflow: 'hidden' }}>
          {[
            ['Primary', <Button>Save changes</Button>],
            ['Secondary', <Button variant="secondary">Cancel</Button>],
            ['Soft', <Button variant="soft">Filter</Button>],
            ['Ghost', <Button variant="ghost">Skip</Button>],
            ['Danger', <Button variant="danger" icon={<Icons.Trash size={14} />}>Delete</Button>],
            ['Link', <Button variant="link" trailingIcon={<Icons.ArrowUpRight size={14} />}>Open docs</Button>],
          ].map(([n, demo], i, a) => (
            <div key={n} style={{
              padding: '20px 18px 16px',
              borderRight: i % 2 === 0 ? '1px solid var(--border)' : 'none',
              borderBottom: i < a.length - 2 ? '1px solid var(--border)' : 'none',
              background: 'var(--surface)',
            }}>
              <div style={{ height: 60, background: 'repeating-linear-gradient(45deg, var(--bg), var(--bg) 6px, transparent 6px, transparent 12px)', borderRadius: 6, border: '1px dashed var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 10 }}>{demo}</div>
              <div style={{ fontSize: 13, fontWeight: 600 }}>{n}</div>
            </div>
          ))}
        </div>
      </main>
    </div>
  </div>
);

const FrameworkSwitchTablet = () => (
  <div style={{ display: 'flex', alignItems: 'center', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 5, padding: 2, gap: 2, marginRight: 6 }}>
    {[['Vue', true], ['React', false], ['Svelte', false]].map(([n, on], i) => (
      <span key={i} style={{
        padding: '3px 8px', fontSize: 11, fontWeight: 600,
        background: on ? 'var(--primary)' : 'transparent',
        color: on ? 'white' : 'var(--text-secondary)',
        borderRadius: 3,
      }}>{n}</span>
    ))}
  </div>
);

// ============================================================
// T03 · Tablet Tokens (Color)
// ============================================================
const TabletToken = () => (
  <div className="ds ds-light ds-screen" data-screen-label="T03 Tokens" style={{ display: 'flex', flexDirection: 'column' }}>
    <TabletDocsHeader />
    <div style={{ flex: 1, display: 'flex', minHeight: 0 }}>
      <TabletDocsSidebar active="color" />
      <main style={{ flex: 1, overflow: 'auto', padding: '28px 32px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 10 }}>
          <h1 style={{ fontSize: 34, fontWeight: 800, letterSpacing: '-0.03em' }}>Color</h1>
          <div style={{ display: 'flex', gap: 6 }}>
            <Button variant="secondary" size="sm" icon={<Icons.Download size={13} />}>CSS</Button>
            <Button variant="secondary" size="sm" icon={<Icons.Download size={13} />}>JSON</Button>
          </div>
        </div>
        <p style={{ fontSize: 14.5, color: 'var(--text-secondary)', marginBottom: 24 }}>
          Seven semantic ramps (50 → 900) plus four status aliases.
        </p>

        {/* Featured (Primary + Secondary stacked vertically) */}
        <div style={{
          border: '1px solid var(--border)', borderRadius: 'var(--r-card)',
          overflow: 'hidden', marginBottom: 16, boxShadow: 'var(--shadow-card)',
          display: 'grid', gridTemplateColumns: '240px 1fr',
        }}>
          <div style={{ background: '#FF6B4A', color: 'white', padding: 18, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: 150 }}>
            <div style={{ fontFamily: 'var(--f-mono)', fontSize: 10.5, opacity: 0.75, letterSpacing: '0.06em', textTransform: 'uppercase' }}>color/primary/500</div>
            <div style={{ fontFamily: 'var(--f-display)', fontWeight: 800, fontSize: 26, letterSpacing: '-0.02em', lineHeight: 1.05 }}>Sweet Salmon</div>
          </div>
          <div style={{ padding: 20 }}>
            <div style={{ display: 'flex', gap: 22, marginBottom: 12, flexWrap: 'wrap' }}>
              <KV k="HEX" v="#FF6B4A" />
              <KV k="HSL" v="11 100% 65%" />
              <KV k="Token" v="--primary" />
            </div>
            <p style={{ fontSize: 13.5, color: 'var(--text-secondary)', lineHeight: 1.55, marginBottom: 10 }}>
              Primary CTAs, focus rings, active navigation. One per screen.
            </p>
            <div style={{ display: 'flex', gap: 6 }}>
              <Badge tone="success" dot>AA · 4.7:1</Badge>
              <Badge tone="success" dot>AAA · 11.3:1</Badge>
            </div>
          </div>
        </div>

        {/* Ramp */}
        <h2 style={{ fontSize: 18, fontWeight: 700, marginTop: 28, marginBottom: 12, letterSpacing: '-0.02em' }}>Primary ramp</h2>
        <div style={{ display: 'flex', borderRadius: 'var(--r-card)', overflow: 'hidden', border: '1px solid var(--border)' }}>
          {[
            [50, '#FFF1ED'], [100, '#FFD9CE'], [200, '#FFB8A3'], [300, '#FF9978'],
            [400, '#FF834F'], [500, '#FF6B4A'], [600, '#E85A3A'], [700, '#B8442B'],
            [800, '#8A311F'], [900, '#5E2014'],
          ].map(([n, hex]) => {
            const dark = n >= 400;
            return (
              <div key={n} style={{
                flex: 1, background: hex, padding: '16px 10px 18px',
                color: dark ? 'white' : '#1A1D21',
                display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: 108,
              }}>
                <div style={{ fontFamily: 'var(--f-display)', fontWeight: 700, fontSize: 18, letterSpacing: '-0.02em' }}>{n}</div>
                <div style={{ fontFamily: 'var(--f-mono)', fontSize: 10.5, opacity: 0.85 }}>{hex}</div>
              </div>
            );
          })}
        </div>

        {/* Semantic 2 cols */}
        <h2 style={{ fontSize: 18, fontWeight: 700, marginTop: 28, marginBottom: 12, letterSpacing: '-0.02em' }}>Semantic</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
          {[
            ['success', '#1F8A5B', 'Approvals, confirmations'],
            ['warning', '#FFD166', 'Caution, draft, pending'],
            ['danger', '#D14343', 'Destructive, errors'],
            ['info', '#2A6FDB', 'Neutral information'],
          ].map(([n, hex, d]) => (
            <div key={n} style={{ border: '1px solid var(--border)', borderRadius: 'var(--r-card)', overflow: 'hidden', background: 'var(--surface)', display: 'flex', alignItems: 'stretch' }}>
              <div style={{ width: 78, background: hex }} />
              <div style={{ padding: 14, flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
                  <div style={{ fontFamily: 'var(--f-mono)', fontSize: 13, fontWeight: 600 }}>{n}</div>
                  <div style={{ fontFamily: 'var(--f-mono)', fontSize: 11, color: 'var(--text-tertiary)' }}>{hex}</div>
                </div>
                <div style={{ fontSize: 12.5, color: 'var(--text-secondary)', marginTop: 4 }}>{d}</div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  </div>
);

// ============================================================
// T04 · Tablet Admin Dashboard
// ============================================================
const TabletAdminDashboard = () => (
  <div className="ds ds-light ds-screen" data-screen-label="T04 Admin Dashboard" style={{ display: 'flex', flexDirection: 'column' }}>
    <div style={{ display: 'flex', height: '100%' }}>
      {/* Icon-only sidebar */}
      <aside style={{
        width: 64, flex: '0 0 auto',
        borderRight: '1px solid var(--border)', background: 'var(--bg)',
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        padding: '14px 0 14px',
      }}>
        <Icons.Logo size={28} />
        <div style={{ height: 24 }} />
        <RailIcon icon={<Icons.Home size={18} />} active />
        <RailIcon icon={<Icons.Component size={18} />} />
        <RailIcon icon={<Icons.Palette size={18} />} />
        <RailIcon icon={<Icons.FileText size={18} />} />
        <RailIcon icon={<Icons.Users size={18} />} />
        <RailIcon icon={<Icons.Settings size={18} />} />
        <div style={{ flex: 1 }} />
        <Avatar name="Mira Quinn" size={32} />
      </aside>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <header style={{
          height: 56, padding: '0 22px', display: 'flex', alignItems: 'center', gap: 12,
          borderBottom: '1px solid var(--border)', background: 'var(--bg-elevated)',
        }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>Workspace</div>
            <div style={{ fontFamily: 'var(--f-display)', fontWeight: 700, fontSize: 17, letterSpacing: '-0.01em' }}>Welcome back, Mira</div>
          </div>
          <div style={{ width: 220 }}><Input size="sm" leading={<Icons.Search size={14} />} placeholder="Search…" kbd="⌘K" /></div>
          <Button size="sm" icon={<Icons.Plus size={14} />}>New</Button>
        </header>

        <main style={{ flex: 1, overflow: 'auto', padding: 22, background: 'var(--bg)' }}>
          {/* 2-col stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12, marginBottom: 16 }}>
            <StatCardCompact label="Components" value="48" delta="+3" tone="success" icon={<Icons.Component size={16} />} />
            <StatCardCompact label="Tokens" value="218" delta="+12" tone="success" icon={<Icons.Palette size={16} />} />
            <StatCardCompact label="Pages" value="32" delta="2 drafts" tone="warning" icon={<Icons.FileText size={16} />} />
            <StatCardCompact label="Active contributors" value="9" delta="3 online" tone="info" icon={<Icons.Users size={16} />} />
          </div>

          {/* 1-col activity + adoption stacked */}
          <Card padded={false} style={{ marginBottom: 12 }}>
            <CardHeader title="Recent activity" sub="Last 7 days · 26 changes" />
            <Activity who="Jay Patel" what="updated" target="Button" kind="component" time="12m" detail="Added variant=&quot;soft&quot;" status="approved" />
            <Activity who="Sun Park" what="created" target="color.gold.200" kind="token" time="44m" detail="New warning shade" status="draft" />
            <Activity who="Eli Wright" what="published" target="Writing for buttons" kind="docs" time="2h" detail="6 min · 4 do/don't examples" status="approved" />
          </Card>

          <Card padded={false}>
            <CardHeader title="Component adoption" sub="Pageviews · last 30 days" />
            <div style={{ padding: 18 }}>
              <BarList items={[
                ['Button', 1342, 1, 'approved'],
                ['Input', 982, 0.73, 'approved'],
                ['Card', 712, 0.53, 'approved'],
                ['Badge', 504, 0.38, 'approved'],
                ['Modal', 401, 0.30, 'approved'],
              ]} />
            </div>
          </Card>
        </main>
      </div>
    </div>
  </div>
);

const RailIcon = ({ icon, active }) => (
  <div style={{
    width: 40, height: 40, borderRadius: 8, marginBottom: 4,
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    color: active ? 'var(--primary)' : 'var(--text-secondary)',
    background: active ? 'var(--primary-soft)' : 'transparent',
  }}>{icon}</div>
);

const StatCardCompact = ({ label, value, delta, tone, icon }) => (
  <Card style={{ padding: 16 }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
      <span style={{ width: 28, height: 28, borderRadius: 6, background: 'var(--surface-2)', color: 'var(--text-secondary)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>{icon}</span>
      <span style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--text-secondary)' }}>{label}</span>
    </div>
    <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
      <div style={{ fontFamily: 'var(--f-display)', fontWeight: 800, fontSize: 26, letterSpacing: '-0.02em', lineHeight: 1 }}>{value}</div>
      <Badge tone={tone} style={{ fontSize: 11, padding: '2px 6px' }}>{delta}</Badge>
    </div>
  </Card>
);

// ============================================================
// T05 · Tablet Components list (grid)
// ============================================================
const TabletAdminComponents = () => (
  <div className="ds ds-light ds-screen" data-screen-label="T05 Components" style={{ display: 'flex', flexDirection: 'column' }}>
    <div style={{ display: 'flex', height: '100%' }}>
      <aside style={{
        width: 64, flex: '0 0 auto',
        borderRight: '1px solid var(--border)', background: 'var(--bg)',
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        padding: '14px 0',
      }}>
        <Icons.Logo size={28} />
        <div style={{ height: 24 }} />
        <RailIcon icon={<Icons.Home size={18} />} />
        <RailIcon icon={<Icons.Component size={18} />} active />
        <RailIcon icon={<Icons.Palette size={18} />} />
        <RailIcon icon={<Icons.FileText size={18} />} />
        <RailIcon icon={<Icons.Users size={18} />} />
        <RailIcon icon={<Icons.Settings size={18} />} />
        <div style={{ flex: 1 }} />
        <Avatar name="Mira Quinn" size={32} />
      </aside>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <header style={{
          height: 56, padding: '0 22px', display: 'flex', alignItems: 'center', gap: 12,
          borderBottom: '1px solid var(--border)', background: 'var(--bg-elevated)',
        }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>Workspace</div>
            <div style={{ fontFamily: 'var(--f-display)', fontWeight: 700, fontSize: 17, letterSpacing: '-0.01em' }}>Components</div>
          </div>
          <Button variant="secondary" size="sm" icon={<Icons.Upload size={14} />}>Import</Button>
          <Button size="sm" icon={<Icons.Plus size={14} />}>New</Button>
        </header>

        <main style={{ flex: 1, overflow: 'auto', padding: 22, background: 'var(--bg)' }}>
          {/* Filter toolbar */}
          <div style={{
            display: 'flex', gap: 8, alignItems: 'center', padding: 10,
            background: 'var(--surface)', border: '1px solid var(--border)',
            borderRadius: 'var(--r-card)', marginBottom: 14, boxShadow: 'var(--shadow-card)',
            flexWrap: 'wrap',
          }}>
            <div style={{ flex: '1 1 220px', minWidth: 200 }}>
              <Input size="sm" leading={<Icons.Search size={14} />} placeholder="Search 48 components…" />
            </div>
            <FilterChip label="Status" value="All" />
            <FilterChip label="Tag" value="Any" />
            <Segmented2 options={['Grid', 'List']} active="Grid" />
          </div>

          {/* Status tabs */}
          <div style={{ display: 'flex', gap: 18, borderBottom: '1px solid var(--border)', marginBottom: 14 }}>
            {[['All', 48, true], ['Approved', 34, false], ['Draft', 12, false], ['Deprecated', 2, false]].map(([n, c, a], i) => (
              <span key={i} style={{ padding: '10px 0', fontSize: 13, fontWeight: a ? 600 : 500, color: a ? 'var(--text)' : 'var(--text-secondary)', borderBottom: a ? '2px solid var(--primary)' : '2px solid transparent', marginBottom: -1, display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                {n}<span style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>{c}</span>
              </span>
            ))}
          </div>

          {/* 3-col grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
            {COMPONENTS.slice(0, 12).map(c => <ComponentCard key={c.name} {...c} />)}
          </div>
        </main>
      </div>
    </div>
  </div>
);

Object.assign(window, {
  TabletPublicHome, TabletComponent, TabletToken,
  TabletAdminDashboard, TabletAdminComponents,
});
