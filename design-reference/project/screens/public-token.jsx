// ============================================================
// PUBLIC DOCS — Token page (Color)
// 1440 × 1100
// ============================================================

const PublicToken = () => (
  <div className="ds ds-light ds-screen" data-screen-label="Public · Tokens (Color)">
    <DocsHeader />
    <div style={{ flex: 1, display: 'flex', height: 'calc(100% - 56px)' }}>
      <DocsSidebar active="color" />
      <main style={{ flex: 1, overflow: 'auto', padding: '40px 56px', minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12.5, color: 'var(--text-tertiary)', marginBottom: 20, fontWeight: 500 }}>
          <span>Foundations</span><Icons.ChevronRight size={12} /><span style={{ color: 'var(--text-secondary)' }}>Color</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <h1 style={{ fontSize: 44, fontWeight: 800, letterSpacing: '-0.03em' }}>Color</h1>
          <div style={{ display: 'flex', gap: 8 }}>
            <Button variant="secondary" size="sm" icon={<Icons.Download size={14} />}>CSS</Button>
            <Button variant="secondary" size="sm" icon={<Icons.Download size={14} />}>JSON</Button>
            <Button variant="secondary" size="sm" icon={<Icons.Download size={14} />}>SCSS</Button>
          </div>
        </div>
        <p style={{ fontSize: 17, lineHeight: 1.55, color: 'var(--text-secondary)', maxWidth: 720, marginBottom: 32 }}>
          Seven semantic ramps (50 → 900) plus four semantic aliases for status. Every value is paired with a guaranteed contrast partner.
        </p>

        {/* Featured swatches: Primary + Secondary */}
        <FeatureSwatch
          name="primary"
          hex="#FF6B4A"
          desc="Sweet Salmon — primary actions, focus rings, active navigation. Use sparingly; one CTA per screen."
        />
        <div style={{ height: 14 }} />
        <FeatureSwatch
          name="secondary"
          hex="#FFD166"
          desc="Light Gold — badges, highlights, decorative accents. Never used as a CTA alone."
          tone="gold"
        />

        {/* Ramp */}
        <h2 style={{ fontSize: 22, fontWeight: 700, marginTop: 44, marginBottom: 16, letterSpacing: '-0.02em' }}>Primary ramp</h2>
        <Ramp />

        {/* Semantic statuses */}
        <h2 style={{ fontSize: 22, fontWeight: 700, marginTop: 44, marginBottom: 16, letterSpacing: '-0.02em' }}>Semantic</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
          {[
            ['success', '#1F8A5B', 'Approvals, confirmations'],
            ['warning', '#FFD166', 'Caution, draft, pending'],
            ['danger', '#D14343', 'Destructive, errors'],
            ['info', '#2A6FDB', 'Neutral information'],
          ].map(([n, hex, desc]) => (
            <SemanticCard key={n} name={n} hex={hex} desc={desc} />
          ))}
        </div>

        {/* Contrast table */}
        <h2 style={{ fontSize: 22, fontWeight: 700, marginTop: 44, marginBottom: 16, letterSpacing: '-0.02em' }}>Contrast pairs</h2>
        <ContrastTable />
      </main>
      <Toc items={['Overview', 'Primary', 'Secondary', 'Ramp', 'Semantic', 'Contrast', 'Code']} active="Ramp" />
    </div>
    <DocsFooter />
  </div>
);

const FeatureSwatch = ({ name, hex, desc, tone = 'salmon' }) => (
  <div style={{
    display: 'grid', gridTemplateColumns: '320px 1fr', gap: 24,
    border: '1px solid var(--border)', borderRadius: 'var(--r-card)',
    overflow: 'hidden', boxShadow: 'var(--shadow-card)',
  }}>
    <div style={{
      background: hex, padding: 24,
      display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
      color: tone === 'gold' ? 'var(--text)' : 'white', minHeight: 200,
    }}>
      <div>
        <div style={{ fontFamily: 'var(--f-mono)', fontSize: 11, opacity: 0.7, letterSpacing: '0.06em', textTransform: 'uppercase' }}>color/{name}/500</div>
      </div>
      <div style={{ fontFamily: 'var(--f-display)', fontWeight: 800, fontSize: 32, letterSpacing: '-0.02em', lineHeight: 1.1 }}>{name === 'primary' ? 'Sweet Salmon' : 'Light Gold'}</div>
    </div>
    <div style={{ padding: '20px 24px 20px 0' }}>
      <div style={{ display: 'flex', gap: 24, marginBottom: 14, flexWrap: 'wrap' }}>
        <KV k="HEX" v={hex} />
        <KV k="RGB" v={
          name === 'primary' ? 'rgb(255 107 74)' : 'rgb(255 209 102)'
        } />
        <KV k="HSL" v={name === 'primary' ? 'hsl(11 100% 65%)' : 'hsl(43 100% 70%)'} />
        <KV k="Token" v={`--color-${name}`} mono />
      </div>
      <div style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.55, marginBottom: 14, maxWidth: 520 }}>{desc}</div>
      <div style={{ display: 'flex', gap: 12, alignItems: 'center', fontSize: 12 }}>
        <Badge tone="success" dot>AA · 4.7:1 on white</Badge>
        <Badge tone="success" dot>AAA · 11.3:1 on text</Badge>
      </div>
    </div>
  </div>
);

const KV = ({ k, v, mono }) => (
  <div>
    <div style={{ fontSize: 10.5, fontWeight: 600, color: 'var(--text-tertiary)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 4 }}>{k}</div>
    <div style={{ fontFamily: mono ? 'var(--f-mono)' : 'var(--f-mono)', fontSize: 13, fontWeight: 500, color: 'var(--text)' }}>{v}</div>
  </div>
);

const Ramp = () => {
  const shades = [
    [50, '#FFF1ED'], [100, '#FFD9CE'], [200, '#FFB8A3'], [300, '#FF9978'],
    [400, '#FF834F'], [500, '#FF6B4A'], [600, '#E85A3A'], [700, '#B8442B'],
    [800, '#8A311F'], [900, '#5E2014'],
  ];
  return (
    <div style={{ display: 'flex', borderRadius: 'var(--r-card)', overflow: 'hidden', border: '1px solid var(--border)' }}>
      {shades.map(([n, hex]) => {
        const dark = n >= 400;
        return (
          <div key={n} style={{
            flex: 1, background: hex, padding: '20px 14px 22px',
            color: dark ? 'white' : '#1A1D21',
            display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
            minHeight: 132,
          }}>
            <div style={{ fontFamily: 'var(--f-display)', fontWeight: 700, fontSize: 22, letterSpacing: '-0.02em' }}>{n}</div>
            <div>
              <div style={{ fontFamily: 'var(--f-mono)', fontSize: 11, fontWeight: 500, opacity: 0.85 }}>{hex}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

const SemanticCard = ({ name, hex, desc }) => (
  <div style={{ border: '1px solid var(--border)', borderRadius: 'var(--r-card)', overflow: 'hidden', background: 'var(--surface)' }}>
    <div style={{ height: 72, background: hex }} />
    <div style={{ padding: 16 }}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 4 }}>
        <div style={{ fontFamily: 'var(--f-mono)', fontSize: 13, fontWeight: 600 }}>{name}</div>
        <div style={{ fontFamily: 'var(--f-mono)', fontSize: 11, color: 'var(--text-tertiary)' }}>{hex}</div>
      </div>
      <div style={{ fontSize: 12.5, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{desc}</div>
    </div>
  </div>
);

const ContrastTable = () => {
  const rows = [
    ['text on bg', '#1A1D21 / #F8F9FA', '15.9 : 1', 'AAA'],
    ['white on primary', '#FFF / #FF6B4A', ' 4.7 : 1', 'AA'],
    ['text on secondary', '#1A1D21 / #FFD166', '12.4 : 1', 'AAA'],
    ['text-secondary on bg', '#5C6270 / #F8F9FA', ' 7.2 : 1', 'AAA'],
    ['white on info', '#FFF / #2A6FDB', ' 5.1 : 1', 'AA'],
    ['white on danger', '#FFF / #D14343', ' 4.6 : 1', 'AA'],
  ];
  return (
    <div style={{ border: '1px solid var(--border)', borderRadius: 'var(--r-card)', overflow: 'hidden' }}>
      <div style={{
        display: 'grid', gridTemplateColumns: '1.5fr 2fr 1fr 100px',
        padding: '12px 20px', background: 'var(--surface-2)',
        fontSize: 11.5, fontWeight: 700, color: 'var(--text-tertiary)',
        letterSpacing: '0.06em', textTransform: 'uppercase',
        borderBottom: '1px solid var(--border)',
      }}>
        <span>Pair</span><span>Values</span><span>Ratio</span><span>Rating</span>
      </div>
      {rows.map(([pair, vals, ratio, rating], i) => (
        <div key={i} style={{
          display: 'grid', gridTemplateColumns: '1.5fr 2fr 1fr 100px',
          padding: '12px 20px', alignItems: 'center',
          borderBottom: i < rows.length - 1 ? '1px solid var(--border)' : 'none',
          fontSize: 13,
        }}>
          <span style={{ fontWeight: 500, color: 'var(--text)' }}>{pair}</span>
          <span style={{ fontFamily: 'var(--f-mono)', fontSize: 12, color: 'var(--text-secondary)' }}>{vals}</span>
          <span style={{ fontFamily: 'var(--f-mono)', fontWeight: 600 }}>{ratio}</span>
          <span><Badge tone={rating === 'AAA' ? 'success' : 'info'} dot>{rating}</Badge></span>
        </div>
      ))}
    </div>
  );
};

Object.assign(window, { PublicToken, FeatureSwatch, KV, Ramp, SemanticCard, ContrastTable });
