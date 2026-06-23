// ============================================================
// PUBLIC DOCS — Homepage / Landing for a deployed OpenDS instance
// 1440 × 900
// ============================================================
const PublicHome = () => (
  <div className="ds ds-light ds-screen" data-screen-label="Public · Home">
    <DocsHeader />

    {/* HERO */}
    <section style={{
      padding: '80px 80px 56px',
      borderBottom: '1px solid var(--border)',
      background: `
        radial-gradient(900px 380px at 90% -80%, rgba(255,209,102,.18), transparent 60%),
        radial-gradient(800px 380px at -10% 110%, rgba(255,107,74,.10), transparent 60%),
        var(--bg)
      `,
      position: 'relative',
    }}>
      <div style={{ display: 'flex', gap: 80, alignItems: 'flex-start' }}>
        <div style={{ flex: '0 0 660px' }}>
          <Badge tone="primary" style={{ marginBottom: 24 }}>
            <Icons.Sparkles size={12} /> v2.4 released · 3 days ago
          </Badge>
          <h1 style={{
            fontFamily: 'var(--f-display)', fontWeight: 800,
            fontSize: 68, lineHeight: 1.02, letterSpacing: '-0.035em',
            color: 'var(--text)', marginBottom: 24,
          }}>
            The Lumen<br />
            <span style={{ color: 'var(--primary)', position: 'relative', display: 'inline-block' }}>
              Design System
              <svg width="380" height="14" viewBox="0 0 380 14" style={{ position: 'absolute', left: 0, bottom: -8 }}>
                <path d="M2 8 Q 100 2, 200 6 T 378 5" stroke="var(--secondary)" strokeWidth="4" fill="none" strokeLinecap="round" />
              </svg>
            </span>
          </h1>
          <p style={{ fontSize: 19, lineHeight: 1.55, color: 'var(--text-secondary)', maxWidth: 560, marginBottom: 36 }}>
            48 components, 218 tokens, one source of truth. Everything our product, marketing and platform teams ship at Lumen — documented in one place.
          </p>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <Button size="lg" trailingIcon={<Icons.ArrowRight size={16} />}>Browse components</Button>
            <Button size="lg" variant="secondary" icon={<Icons.Book size={16} />}>Read the principles</Button>
          </div>
          <div style={{ marginTop: 56, display: 'flex', gap: 40, fontSize: 13, color: 'var(--text-tertiary)' }}>
            <Stat n="48" l="Components" />
            <Stat n="218" l="Tokens" />
            <Stat n="32" l="Guidelines" />
            <Stat n="9" l="Contributors" />
          </div>
        </div>

        {/* Decorative grid of cards */}
        <div style={{ flex: 1, position: 'relative', height: 420 }}>
          <div style={{
            position: 'absolute', inset: 0,
            display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14,
            transform: 'perspective(1400px) rotateX(8deg) rotateY(-10deg) rotateZ(2deg)',
            transformOrigin: 'center',
          }}>
            <MiniCard kind="color" />
            <MiniCard kind="button" />
            <MiniCard kind="badge" />
            <MiniCard kind="type" />
            <MiniCard kind="input" />
            <MiniCard kind="radius" />
            <MiniCard kind="avatar" />
            <MiniCard kind="toggle" />
            <MiniCard kind="space" />
          </div>
        </div>
      </div>
    </section>

    {/* EXPLORE STRIP */}
    <section style={{ padding: '56px 80px', borderBottom: '1px solid var(--border)' }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 28 }}>
        <div>
          <h2 style={{ fontSize: 28, fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 6 }}>Explore the system</h2>
          <p style={{ fontSize: 15, color: 'var(--text-secondary)' }}>Start anywhere. Every page links to the components that use it.</p>
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
        <ExploreCard icon={<Icons.Sparkles size={20} />} title="Foundations" count="9 pages" body="Color, type, spacing, motion — the rules that hold everything together." />
        <ExploreCard icon={<Icons.Component size={20} />} title="Components" count="48 components" body="Buttons, inputs, modals, tables. Each with live preview, props, code." />
        <ExploreCard icon={<Icons.Palette size={20} />} title="Tokens" count="218 tokens" body="The exact values powering every component. Export to CSS, JSON or SCSS." />
        <ExploreCard icon={<Icons.FileText size={20} />} title="Guidelines" count="32 articles" body="Writing for buttons, empty states, accessibility, contribution flow." />
      </div>
    </section>

    {/* RECENT UPDATES */}
    <section style={{ padding: '40px 80px 64px' }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 20 }}>
        <h2 style={{ fontSize: 24, fontWeight: 700 }}>Recently updated</h2>
        <span style={{ fontSize: 13, color: 'var(--primary)', fontWeight: 600 }}>
          View changelog <Icons.ArrowRight size={13} style={{ verticalAlign: -2 }} />
        </span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
        <RecentCard title="Button" status="updated" v="1.4.0" desc="Added <code>variant=&quot;soft&quot;</code> and refined focus ring." />
        <RecentCard title="color.primary" status="added" v="—" desc="New gold accent shade-200 across light/dark." kind="token" />
        <RecentCard title="Toast" status="draft" v="0.9.0-rc.1" desc="Drafting position prop, replacing legacy variants." />
      </div>
    </section>

    <DocsFooter />
  </div>
);

const ExploreCard = ({ icon, title, count, body }) => (
  <a style={{
    display: 'block',
    border: '1px solid var(--border)', borderRadius: 'var(--r-card)',
    padding: 24, background: 'var(--surface)',
    boxShadow: 'var(--shadow-card)', color: 'inherit',
    transition: 'transform .15s, box-shadow .15s', cursor: 'pointer',
  }}>
    <div style={{
      width: 40, height: 40, borderRadius: 10,
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      background: 'var(--primary-soft)', color: 'var(--primary)',
      marginBottom: 16,
    }}>{icon}</div>
    <div style={{ fontFamily: 'var(--f-display)', fontWeight: 700, fontSize: 19, marginBottom: 2 }}>{title}</div>
    <div style={{ fontFamily: 'var(--f-mono)', fontSize: 11.5, color: 'var(--text-tertiary)', marginBottom: 10, letterSpacing: '0.04em' }}>{count.toUpperCase()}</div>
    <div style={{ fontSize: 13.5, color: 'var(--text-secondary)', lineHeight: 1.55 }}>{body}</div>
    <div style={{ marginTop: 16, fontSize: 13, color: 'var(--primary)', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
      Open <Icons.ArrowRight size={13} />
    </div>
  </a>
);

const Stat = ({ n, l }) => (
  <div>
    <div style={{ fontFamily: 'var(--f-display)', fontSize: 28, fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.02em', lineHeight: 1 }}>{n}</div>
    <div style={{ fontSize: 12, color: 'var(--text-tertiary)', marginTop: 4, textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>{l}</div>
  </div>
);

const Feat = ({ icon, title, body }) => (
  <div>
    <div style={{
      width: 40, height: 40, borderRadius: 10,
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      background: 'var(--primary-soft)', color: 'var(--primary)',
      marginBottom: 14,
    }}>{icon}</div>
    <div style={{ fontFamily: 'var(--f-display)', fontWeight: 700, fontSize: 18, marginBottom: 6 }}>{title}</div>
    <div style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.55 }}>{body}</div>
  </div>
);

const RecentCard = ({ title, status, v, desc, kind = 'component' }) => {
  const tones = { updated: 'info', added: 'success', draft: 'warning' };
  return (
    <Card style={{ padding: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
        <div style={{
          width: 36, height: 36, borderRadius: 'var(--r-input)',
          background: 'var(--surface-2)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          color: 'var(--text-secondary)',
        }}>
          {kind === 'component' ? <Icons.Component size={18} /> : <Icons.Palette size={18} />}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: kind === 'token' ? 'var(--f-mono)' : 'inherit', fontWeight: 600, fontSize: 14 }}>{title}</div>
          <div style={{ fontFamily: 'var(--f-mono)', fontSize: 11, color: 'var(--text-tertiary)' }}>{v}</div>
        </div>
        <Badge tone={tones[status]} dot>{status}</Badge>
      </div>
      <div style={{ fontSize: 13.5, color: 'var(--text-secondary)', lineHeight: 1.55 }}
        dangerouslySetInnerHTML={{ __html: desc }} />
    </Card>
  );
};

// Tiny decorative cards (no real content) for the hero grid
const MiniCard = ({ kind }) => {
  const base = {
    background: 'var(--surface)', border: '1px solid var(--border)',
    borderRadius: 10, padding: 14, height: 130,
    boxShadow: 'var(--shadow-card)',
    display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
  };
  const label = (t) => <div style={{ fontFamily: 'var(--f-mono)', fontSize: 9.5, color: 'var(--text-tertiary)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>{t}</div>;
  if (kind === 'color') return (<div style={base}>{label('color')}<div style={{ display: 'flex', gap: 4 }}>
    {['#FF6B4A','#FFD166','#1F8A5B','#2A6FDB','#1A1D21'].map((c,i)=><div key={i} style={{flex:1, height:24, borderRadius:4, background:c}}/>)}
  </div><div style={{ fontSize: 11, color: 'var(--text-secondary)', fontWeight: 500 }}>5 ramps · 50 shades</div></div>);
  if (kind === 'button') return (<div style={base}>{label('button')}<Button size="sm">Continue</Button><div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>4 variants</div></div>);
  if (kind === 'badge') return (<div style={base}>{label('badge')}<div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
    <Badge tone="success" dot>live</Badge><Badge tone="primary">v2</Badge><Badge tone="warning">beta</Badge></div><div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>6 tones</div></div>);
  if (kind === 'type') return (<div style={base}>{label('type')}<div style={{ fontFamily: 'var(--f-display)', fontWeight: 800, fontSize: 26, letterSpacing: '-0.02em', lineHeight: 1 }}>Aa</div><div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>Outfit + Inter</div></div>);
  if (kind === 'input') return (<div style={base}>{label('input')}<div style={{ height: 28, borderRadius: 6, border: '1px solid var(--border)', background: 'var(--bg)', display: 'flex', alignItems: 'center', padding: '0 8px', fontSize: 11, color: 'var(--text-tertiary)' }}>name@team.com</div><div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>3 sizes</div></div>);
  if (kind === 'radius') return (<div style={base}>{label('radius')}<div style={{ display: 'flex', gap: 4, alignItems: 'flex-end' }}>
    {[4,6,8,12].map((r,i)=><div key={i} style={{ width: 22, height: 22, background: 'var(--primary-soft)', border: '1px solid var(--primary)', borderRadius: r }}/>)}
  </div><div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>4 steps</div></div>);
  if (kind === 'avatar') return (<div style={base}>{label('avatar')}<div style={{ display: 'flex' }}>{['Mira','Jay','Sun','Eli'].map((n,i)=><div key={i} style={{ marginLeft: i?-6:0 }}><Avatar name={n} size={26} style={{ border: '2px solid var(--surface)' }}/></div>)}</div><div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>group · stacked</div></div>);
  if (kind === 'toggle') return (<div style={base}>{label('switch')}<div style={{ width: 36, height: 20, background: 'var(--primary)', borderRadius: 999, position: 'relative' }}><div style={{ position: 'absolute', right: 2, top: 2, width: 16, height: 16, borderRadius: 999, background: 'white' }}/></div><div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>on / off</div></div>);
  if (kind === 'space') return (<div style={base}>{label('spacing')}<div style={{ display: 'flex', gap: 3, alignItems: 'flex-end' }}>
    {[4,8,12,16,24,32].map((s,i)=><div key={i} style={{ width: 6, height: s/1.2, background: 'var(--text-secondary)', borderRadius: 1 }}/>)}
  </div><div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>4px base</div></div>);
  return <div style={base}/>;
};

window.PublicHome = PublicHome;
