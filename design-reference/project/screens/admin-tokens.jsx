// ============================================================
// ADMIN — Token editor
// 1440 × 900
// ============================================================

const AdminTokens = () => (
  <div className="ds ds-light ds-screen" data-screen-label="Admin · Token editor">
    <div style={{ display: 'flex', height: '100%' }}>
      <AdminSidebar active="tokens" />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <AdminHeader
          title="Tokens"
          crumbs={['Workspace']}
          search={false}
          actions={<>
            <Button variant="secondary" size="sm" icon={<Icons.Upload size={14} />}>Import</Button>
            <ExportMenu />
            <Button size="sm" icon={<Icons.Plus size={14} />}>New token</Button>
          </>}
        />
        <main style={{ flex: 1, display: 'grid', gridTemplateColumns: '320px 1fr 380px', minHeight: 0 }}>
          {/* Tree */}
          <div style={{ borderRight: '1px solid var(--border)', overflow: 'auto', background: 'var(--bg)' }}>
            <div style={{ padding: 12 }}>
              <Input size="sm" leading={<Icons.Search size={14} />} placeholder="Filter 218 tokens…" />
            </div>
            <Tree />
          </div>

          {/* List for selected group */}
          <div style={{ overflow: 'auto', padding: 28, background: 'var(--bg)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12.5, color: 'var(--text-tertiary)', marginBottom: 12, fontWeight: 500, fontFamily: 'var(--f-mono)' }}>
              <span>color</span><Icons.ChevronRight size={12} /><span>primary</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 6 }}>
              <h2 style={{ fontSize: 28, fontWeight: 700, letterSpacing: '-0.02em' }}>color.primary</h2>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <Badge tone="success" dot>11 tokens</Badge>
                <span style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>· edited 2d ago by Sun</span>
              </div>
            </div>
            <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 24, maxWidth: 520, lineHeight: 1.55 }}>
              Sweet Salmon ramp. Used for primary CTAs, focus rings, and active navigation. Aliased to <code style={{ fontFamily: 'var(--f-mono)', background: 'var(--surface-2)', padding: '2px 5px', borderRadius: 4, fontSize: 12.5 }}>--primary</code> in the runtime stylesheet.
            </p>

            {/* Token rows */}
            <div style={{ border: '1px solid var(--border)', borderRadius: 'var(--r-card)', background: 'var(--surface)', overflow: 'hidden' }}>
              <div style={{
                display: 'grid', gridTemplateColumns: '60px 1.4fr 120px 1fr 90px 36px',
                padding: '10px 16px', background: 'var(--surface-2)',
                fontSize: 11, fontWeight: 700, color: 'var(--text-tertiary)',
                letterSpacing: '0.06em', textTransform: 'uppercase',
                borderBottom: '1px solid var(--border)',
              }}>
                <span></span><span>Name</span><span>Value</span><span>Aliases</span><span>Used</span><span></span>
              </div>
              {[
                [50, '#FFF1ED', ['--bg-primary-soft'], 4, false],
                [100, '#FFD9CE', ['--surface-primary-100'], 2, false],
                [200, '#FFB8A3', [], 0, false],
                [300, '#FF9978', [], 0, false],
                [400, '#FF834F', [], 1, false],
                [500, '#FF6B4A', ['--primary', '--cta'], 27, true],
                [600, '#E85A3A', ['--primary-hover'], 12, false],
                [700, '#B8442B', ['--primary-active'], 5, false],
                [800, '#8A311F', [], 0, false],
                [900, '#5E2014', [], 0, false],
              ].map(([n, hex, aliases, used, selected]) => (
                <div key={n} style={{
                  display: 'grid', gridTemplateColumns: '60px 1.4fr 120px 1fr 90px 36px',
                  padding: '12px 16px', alignItems: 'center',
                  borderBottom: '1px solid var(--border)',
                  background: selected ? 'var(--primary-soft)' : 'transparent',
                }}>
                  <div style={{ width: 36, height: 36, borderRadius: 6, background: hex, border: '1px solid rgba(0,0,0,0.08)' }} />
                  <span style={{ fontFamily: 'var(--f-mono)', fontSize: 13, fontWeight: selected ? 600 : 500, color: 'var(--text)' }}>
                    color.primary.<span style={{ color: 'var(--primary)' }}>{n}</span>
                  </span>
                  <span style={{ fontFamily: 'var(--f-mono)', fontSize: 13, color: 'var(--text-secondary)' }}>{hex}</span>
                  <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                    {aliases.map(a => (
                      <span key={a} style={{ fontFamily: 'var(--f-mono)', fontSize: 11, padding: '2px 6px', background: 'var(--surface-2)', borderRadius: 4, color: 'var(--text-secondary)' }}>{a}</span>
                    ))}
                  </div>
                  <span style={{ fontFamily: 'var(--f-mono)', fontSize: 12, fontVariantNumeric: 'tabular-nums', color: used ? 'var(--text)' : 'var(--text-tertiary)' }}>{used} place{used === 1 ? '' : 's'}</span>
                  <Icons.MoreH size={16} style={{ color: 'var(--text-tertiary)' }} />
                </div>
              ))}
            </div>
          </div>

          {/* Right rail: token detail editor */}
          <div style={{ borderLeft: '1px solid var(--border)', background: 'var(--bg-elevated)', overflow: 'auto' }}>
            <div style={{ padding: 24, borderBottom: '1px solid var(--border)' }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-tertiary)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }}>Editing</div>
              <div style={{ fontFamily: 'var(--f-mono)', fontSize: 15, fontWeight: 600, color: 'var(--text)' }}>color.primary.500</div>
              <div style={{ fontSize: 12, color: 'var(--text-tertiary)', marginTop: 4 }}>Aliased as --primary · --cta</div>
            </div>
            {/* Color picker */}
            <div style={{ padding: 24 }}>
              <div style={{
                height: 180, borderRadius: 8, marginBottom: 14, position: 'relative',
                background: 'linear-gradient(to top, #000, transparent), linear-gradient(to right, #fff, #FF6B4A)',
                overflow: 'hidden',
              }}>
                <div style={{ position: 'absolute', top: 28, right: 24, width: 14, height: 14, borderRadius: 999, border: '2px solid white', boxShadow: '0 0 0 1px rgba(0,0,0,0.4)' }} />
              </div>
              <div style={{
                height: 14, borderRadius: 999, marginBottom: 16, position: 'relative',
                background: 'linear-gradient(to right, #f00, #ff0, #0f0, #0ff, #00f, #f0f, #f00)',
              }}>
                <div style={{ position: 'absolute', left: '4%', top: -3, width: 14, height: 20, borderRadius: 4, border: '2px solid white', background: '#FF6B4A', boxShadow: '0 0 0 1px rgba(0,0,0,0.4)' }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 16 }}>
                <SmallInput label="HEX" v="FF6B4A" />
                <SmallInput label="HSL" v="11, 100, 65" />
                <SmallInput label="α" v="100" />
              </div>
              <PropField label="Name">
                <Input size="sm" value="color.primary.500" wrapStyle={{ height: 32, background: 'var(--surface)' }} style={{ fontFamily: 'var(--f-mono)' }} />
              </PropField>
              <PropField label="Aliases">
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', padding: 8, border: '1px solid var(--border)', borderRadius: 6, background: 'var(--surface)' }}>
                  <AliasChip text="--primary" />
                  <AliasChip text="--cta" />
                  <span style={{ fontSize: 12.5, color: 'var(--text-tertiary)', padding: '2px 4px' }}>+ add</span>
                </div>
              </PropField>
              <PropField label="Description">
                <textarea
                  defaultValue="Sweet Salmon — primary CTAs, focus rings, active navigation. Use sparingly; one CTA per screen."
                  style={{
                    width: '100%', minHeight: 80, padding: 10, fontSize: 13, fontFamily: 'inherit',
                    border: '1px solid var(--border)', borderRadius: 6, background: 'var(--surface)',
                    outline: 'none', resize: 'vertical', lineHeight: 1.5,
                  }} />
              </PropField>
              <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                <Button variant="secondary" size="sm" full>Cancel</Button>
                <Button size="sm" full>Apply</Button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  </div>
);

const ExportMenu = () => (
  <span style={{
    display: 'inline-flex', alignItems: 'center', gap: 6,
    height: 32, padding: '0 12px', borderRadius: 'var(--r-btn)',
    background: 'var(--surface)', border: '1px solid var(--border)',
    fontSize: 13, fontWeight: 600, color: 'var(--text)',
  }}>
    <Icons.Download size={14} /> Export
    <span style={{ width: 1, height: 16, background: 'var(--border)', margin: '0 4px' }} />
    <span style={{ fontFamily: 'var(--f-mono)', fontSize: 11.5, color: 'var(--text-secondary)' }}>CSS</span>
    <Icons.ChevronDown size={12} style={{ color: 'var(--text-tertiary)' }} />
  </span>
);

const Tree = () => {
  const data = [
    { name: 'color', open: true, count: 88, children: [
      { name: 'primary', open: true, count: 11, active: true },
      { name: 'secondary', count: 11 },
      { name: 'neutral', count: 22 },
      { name: 'success', count: 11 },
      { name: 'warning', count: 11 },
      { name: 'danger', count: 11 },
      { name: 'info', count: 11 },
    ]},
    { name: 'space', count: 12 },
    { name: 'radius', count: 6 },
    { name: 'shadow', count: 4 },
    { name: 'font', open: true, count: 38, children: [
      { name: 'family', count: 3 },
      { name: 'size', count: 10 },
      { name: 'weight', count: 6 },
      { name: 'line-height', count: 5 },
      { name: 'letter-spacing', count: 4 },
    ]},
    { name: 'motion', count: 8 },
    { name: 'z-index', count: 6 },
  ];
  return (
    <div style={{ padding: '0 4px 24px' }}>
      {data.map(g => (
        <React.Fragment key={g.name}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '6px 8px', borderRadius: 6, fontWeight: 600, fontSize: 13, color: 'var(--text)' }}>
            <Icons.ChevronDown size={14} style={{ color: 'var(--text-tertiary)', visibility: g.children ? 'visible' : 'hidden', transform: g.open === false ? 'rotate(-90deg)' : 'none' }} />
            <Icons.Folder size={14} style={{ color: 'var(--text-tertiary)' }} />
            <span style={{ flex: 1, fontFamily: 'var(--f-mono)' }}>{g.name}</span>
            <span style={{ fontSize: 11, color: 'var(--text-tertiary)', fontVariantNumeric: 'tabular-nums' }}>{g.count}</span>
          </div>
          {g.open && g.children && g.children.map(c => (
            <div key={c.name} style={{
              display: 'flex', alignItems: 'center', gap: 4, padding: '5px 8px 5px 30px',
              borderRadius: 6, fontFamily: 'var(--f-mono)', fontSize: 12.5,
              color: c.active ? 'var(--primary)' : 'var(--text-secondary)',
              fontWeight: c.active ? 600 : 500,
              background: c.active ? 'var(--primary-soft)' : 'transparent',
            }}>
              <span style={{ flex: 1 }}>{c.name}</span>
              <span style={{ fontSize: 11, color: c.active ? 'var(--primary)' : 'var(--text-tertiary)', fontVariantNumeric: 'tabular-nums', opacity: 0.7 }}>{c.count}</span>
            </div>
          ))}
        </React.Fragment>
      ))}
    </div>
  );
};

const SmallInput = ({ label, v }) => (
  <div>
    <div style={{ fontSize: 10.5, fontWeight: 600, color: 'var(--text-tertiary)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 4 }}>{label}</div>
    <div style={{ height: 30, padding: '0 8px', display: 'flex', alignItems: 'center', border: '1px solid var(--border)', borderRadius: 6, background: 'var(--surface)', fontSize: 12, fontFamily: 'var(--f-mono)' }}>{v}</div>
  </div>
);

const AliasChip = ({ text }) => (
  <span style={{
    display: 'inline-flex', alignItems: 'center', gap: 4,
    padding: '3px 8px', background: 'var(--surface-2)', borderRadius: 4,
    fontFamily: 'var(--f-mono)', fontSize: 12, fontWeight: 500,
  }}>
    {text}
    <Icons.X size={11} style={{ color: 'var(--text-tertiary)' }} />
  </span>
);

window.AdminTokens = AdminTokens;
