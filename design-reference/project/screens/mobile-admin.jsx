// ============================================================
// MOBILE ADMIN — 6 screens
// 375px wide
// Reuses StatusBar, MenuIcon, BottomNav, MobileProp from mobile.jsx
// ============================================================

// Admin top bar (workspace · title · avatar). Slightly different from public top.
const MobileAdminTop = ({ title, sub, back, action }) => (
  <header style={{
    height: 56, display: 'flex', alignItems: 'center', gap: 8,
    padding: '0 10px', borderBottom: '1px solid var(--border)',
    background: 'var(--bg-elevated)', flex: '0 0 auto',
  }}>
    <IconButton size="md" variant="ghost">
      {back
        ? <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
        : <MenuIcon />
      }
    </IconButton>
    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={{ fontSize: 10.5, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600, lineHeight: 1 }}>{sub || 'Lumen · Admin'}</div>
      <div style={{ fontFamily: 'var(--f-display)', fontWeight: 700, fontSize: 16, letterSpacing: '-0.01em', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginTop: 2 }}>{title}</div>
    </div>
    {action || <IconButton size="md" variant="ghost"><Icons.Search size={17} /></IconButton>}
  </header>
);

// Standard bottom nav used across mobile admin
const AdminBottomNav = ({ active }) => (
  <nav style={{
    position: 'sticky', bottom: 0, left: 0, right: 0,
    display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)',
    background: 'var(--bg-elevated)', borderTop: '1px solid var(--border)',
    padding: '6px 0 22px', flex: '0 0 auto',
  }}>
    <BottomNav icon={<Icons.Home size={20} />} label="Home" active={active === 'home'} />
    <BottomNav icon={<Icons.Component size={20} />} label="Comp" active={active === 'comp'} />
    <BottomNav icon={<Icons.Palette size={20} />} label="Tokens" active={active === 'tokens'} />
    <BottomNav icon={<Icons.FileText size={20} />} label="Docs" active={active === 'docs'} />
    <BottomNav icon={<Icons.User size={20} />} label="More" active={active === 'more'} />
  </nav>
);

// ============================================================
// M08 · Components list (grid)
// ============================================================
const MobileAdminComponents = () => (
  <div className="ds ds-light ds-screen" data-screen-label="M08 Admin Components" style={{ display: 'flex', flexDirection: 'column' }}>
    <StatusBar />
    <MobileAdminTop
      title="Components"
      action={<IconButton size="md" variant="ghost"><Icons.Plus size={18} /></IconButton>}
    />
    <div style={{ overflow: 'auto', flex: 1, background: 'var(--bg)' }}>
      {/* Search + filter */}
      <div style={{ padding: '12px 14px 8px', position: 'sticky', top: 0, background: 'var(--bg)', zIndex: 1 }}>
        <Input size="md" leading={<Icons.Search size={15} />} placeholder="Search 48 components…" />
        <div style={{ display: 'flex', gap: 6, marginTop: 10, overflow: 'auto', paddingBottom: 2 }}>
          {[['Status', 'All'], ['Tag', 'Any'], ['Owner', 'Anyone'], ['Updated', '30d']].map(([k, v], i) => (
            <span key={i} style={{
              display: 'inline-flex', alignItems: 'center', gap: 5,
              padding: '6px 10px', background: 'var(--surface)',
              border: '1px solid var(--border)', borderRadius: 999,
              fontSize: 11.5, fontWeight: 500, whiteSpace: 'nowrap', flex: '0 0 auto',
            }}>
              <span style={{ color: 'var(--text-tertiary)' }}>{k}:</span>
              <span style={{ color: 'var(--text)', fontWeight: 600 }}>{v}</span>
              <Icons.ChevronDown size={11} style={{ color: 'var(--text-tertiary)' }} />
            </span>
          ))}
        </div>
      </div>

      {/* Status tabs */}
      <div style={{
        display: 'flex', gap: 14, padding: '6px 16px 0',
        borderBottom: '1px solid var(--border)', overflow: 'auto',
      }}>
        {[['All', 48, true], ['Approved', 34, false], ['Draft', 12, false], ['Deprecated', 2, false]].map(([n, c, a], i) => (
          <span key={i} style={{
            padding: '10px 0', fontSize: 12.5, fontWeight: a ? 600 : 500,
            color: a ? 'var(--text)' : 'var(--text-secondary)',
            borderBottom: a ? '2px solid var(--primary)' : '2px solid transparent',
            marginBottom: -1, whiteSpace: 'nowrap', display: 'inline-flex', alignItems: 'center', gap: 5,
          }}>
            {n}<span style={{ fontSize: 10.5, color: 'var(--text-tertiary)' }}>{c}</span>
          </span>
        ))}
      </div>

      {/* Grid 2-col */}
      <div style={{ padding: '14px 14px 8px', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
        {COMPONENTS.slice(0, 8).map(c => <MobileCompCard key={c.name} {...c} />)}
      </div>

      {/* Recently edited (rows) */}
      <section style={{ padding: '6px 14px 24px' }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-tertiary)', letterSpacing: '0.08em', textTransform: 'uppercase', padding: '14px 2px 8px' }}>
          Recently edited
        </div>
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--r-card)', overflow: 'hidden' }}>
          {COMPONENTS.slice(10, 14).map((c, i, a) => (
            <div key={c.name} style={{
              padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 12,
              borderBottom: i < a.length - 1 ? '1px solid var(--border)' : 'none',
            }}>
              <span style={{ width: 32, height: 32, borderRadius: 6, background: 'var(--surface-2)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}>
                <Icons.Component size={15} />
              </span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                  <span style={{ fontWeight: 600, fontSize: 13.5 }}>{c.name}</span>
                  <span style={{ fontFamily: 'var(--f-mono)', fontSize: 10, color: 'var(--text-tertiary)' }}>{c.v}</span>
                </div>
                <div style={{ fontSize: 11.5, color: 'var(--text-tertiary)' }}>{c.who} · {c.updated}</div>
              </div>
              <Badge tone={tones[c.status]} dot>{c.status}</Badge>
            </div>
          ))}
        </div>
      </section>
    </div>
    <AdminBottomNav active="comp" />
  </div>
);

const MobileCompCard = ({ name, status, v, who, glyph }) => (
  <div style={{
    background: 'var(--surface)', border: '1px solid var(--border)',
    borderRadius: 'var(--r-card)', overflow: 'hidden',
  }}>
    <div style={{
      height: 86, position: 'relative',
      background: status === 'deprecated' ? 'var(--surface-2)' : 'var(--bg)',
      backgroundImage: 'radial-gradient(circle at 1px 1px, var(--border) 1px, transparent 1px)',
      backgroundSize: '12px 12px',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      opacity: status === 'deprecated' ? 0.6 : 1,
    }}>
      <div style={{ transform: 'scale(0.78)' }}><Glyph kind={glyph} /></div>
      <Badge tone={tones[status]} dot style={{ position: 'absolute', top: 7, right: 7, fontSize: 10, padding: '1px 5px' }} />
    </div>
    <div style={{ padding: '10px 12px' }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
        <span style={{ fontSize: 13, fontWeight: 600, flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{name}</span>
        <span style={{ fontFamily: 'var(--f-mono)', fontSize: 10, color: 'var(--text-tertiary)' }}>{v}</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 5 }}>
        <Avatar name={who} size={16} />
        <span style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>{who}</span>
      </div>
    </div>
  </div>
);

// ============================================================
// M09 · Component editor (Button)
// ============================================================
const MobileAdminComponentEditor = () => (
  <div className="ds ds-light ds-screen" data-screen-label="M09 Admin Editor" style={{ display: 'flex', flexDirection: 'column' }}>
    <StatusBar />
    <MobileAdminTop
      back title="Button"
      sub="Components / Inputs"
      action={<IconButton size="md" variant="ghost"><Icons.MoreH size={18} /></IconButton>}
    />

    {/* Unsaved banner */}
    <div style={{
      display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px',
      background: '#FFF7DA', borderBottom: '1px solid var(--border)',
      color: '#7A5C0A', fontSize: 12.5, fontWeight: 500,
    }}>
      <span style={{ width: 6, height: 6, borderRadius: 999, background: 'var(--warning)' }} />
      <span style={{ flex: 1 }}>Unsaved · 3 changes</span>
      <span style={{ fontWeight: 700, color: 'var(--primary)' }}>Discard</span>
    </div>

    {/* Sub-tabs */}
    <div style={{
      display: 'flex', gap: 14, padding: '0 16px',
      borderBottom: '1px solid var(--border)', overflow: 'auto', flex: '0 0 auto',
      background: 'var(--bg-elevated)',
    }}>
      {[['Overview', false], ['Variants', false], ['Props', true], ['Code', false], ['Guidelines', false], ['Changelog', false]].map(([n, a], i) => (
        <span key={i} style={{
          padding: '11px 0', fontSize: 12.5, fontWeight: a ? 600 : 500,
          color: a ? 'var(--text)' : 'var(--text-secondary)',
          borderBottom: a ? '2px solid var(--primary)' : '2px solid transparent',
          marginBottom: -1, whiteSpace: 'nowrap',
        }}>{n}</span>
      ))}
    </div>

    <div style={{ flex: 1, overflow: 'auto', background: 'var(--bg)' }}>
      {/* Live preview */}
      <section style={{ padding: '14px 14px 0' }}>
        <div style={{ border: '1px solid var(--border)', borderRadius: 'var(--r-card)', overflow: 'hidden', background: 'var(--surface)', boxShadow: 'var(--shadow-card)' }}>
          <div style={{
            padding: '8px 12px', borderBottom: '1px solid var(--border)',
            display: 'flex', alignItems: 'center', gap: 8, background: 'var(--bg-elevated)',
          }}>
            <span style={{ fontSize: 10.5, fontWeight: 700, color: 'var(--text-tertiary)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Preview</span>
            <Badge tone="primary" style={{ fontSize: 10, padding: '1px 5px' }}>primary</Badge>
            <div style={{ flex: 1 }} />
            <IconButton size="sm" variant="ghost"><Icons.Sun size={13} /></IconButton>
            <IconButton size="sm" variant="ghost"><Icons.Moon size={13} /></IconButton>
          </div>
          <div style={{
            padding: '40px 16px', display: 'flex', alignItems: 'center', justifyContent: 'center',
            backgroundImage: 'radial-gradient(circle at 1px 1px, var(--border) 1px, transparent 1px)',
            backgroundSize: '14px 14px',
          }}>
            <Button size="lg" icon={<Icons.Sparkles size={16} />}>Generate</Button>
          </div>
        </div>
      </section>

      {/* Prop editor card (single prop, in focus) */}
      <section style={{ padding: '14px 14px 0' }}>
        <div style={{ border: '1px solid var(--border)', borderRadius: 'var(--r-card)', background: 'var(--surface)', overflow: 'hidden' }}>
          <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: 'var(--f-mono)', fontWeight: 700, fontSize: 14 }}>variant</div>
              <div style={{ fontSize: 11.5, color: 'var(--text-tertiary)', marginTop: 2 }}>Visual emphasis · enum · 6 values</div>
            </div>
            <Badge tone="warning" style={{ fontSize: 10 }}>edited</Badge>
            <IconButton size="sm" variant="ghost"><Icons.ChevronRight size={14} /></IconButton>
          </div>
          <div style={{ padding: 14 }}>
            <div style={{ fontSize: 10.5, fontWeight: 700, color: 'var(--text-tertiary)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 8 }}>Allowed values</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {['primary', 'secondary', 'soft', 'ghost', 'danger', 'link'].map(v => (
                <div key={v} style={{
                  padding: '8px 10px', background: 'var(--bg-elevated)',
                  border: '1px solid var(--border)', borderRadius: 6,
                  display: 'flex', alignItems: 'center', gap: 8,
                }}>
                  <span style={{ width: 12, height: 12, borderRadius: 3, background: v === 'primary' ? 'var(--primary)' : 'var(--surface-2)', border: '1px solid var(--border)' }} />
                  <span style={{ fontFamily: 'var(--f-mono)', fontSize: 12.5, flex: 1 }}>{v}</span>
                  {v === 'primary' && <span style={{ fontSize: 10.5, color: 'var(--text-tertiary)', fontFamily: 'var(--f-mono)' }}>default</span>}
                  <Icons.MoreH size={13} style={{ color: 'var(--text-tertiary)' }} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Other props list (collapsed rows) */}
      <section style={{ padding: '14px 14px 0' }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-tertiary)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8, padding: '0 2px' }}>Other props · 7</div>
        <div style={{ border: '1px solid var(--border)', borderRadius: 'var(--r-card)', background: 'var(--surface)', overflow: 'hidden' }}>
          {[
            ['label', 'string', 'required'],
            ['size', 'enum', 'sm · md · lg'],
            ['icon', 'string', '—'],
            ['trailingIcon', 'string', '—'],
            ['loading', 'bool', 'false'],
            ['disabled', 'bool', 'false'],
            ['block', 'bool', 'false'],
          ].map(([n, t, d], i, a) => (
            <div key={n} style={{
              padding: '11px 14px', display: 'flex', alignItems: 'center', gap: 10,
              borderBottom: i < a.length - 1 ? '1px solid var(--border)' : 'none',
            }}>
              <span style={{ fontFamily: 'var(--f-mono)', fontSize: 13, fontWeight: 600, flex: '0 0 auto' }}>{n}</span>
              <span style={{ fontFamily: 'var(--f-mono)', fontSize: 10.5, color: 'var(--text-tertiary)', background: 'var(--surface-2)', padding: '2px 6px', borderRadius: 4 }}>{t}</span>
              <span style={{ flex: 1, fontSize: 11.5, color: 'var(--text-secondary)', fontFamily: 'var(--f-mono)', textAlign: 'right', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{d}</span>
              <Icons.ChevronRight size={13} style={{ color: 'var(--text-tertiary)' }} />
            </div>
          ))}
        </div>
      </section>

      {/* States quick preview */}
      <section style={{ padding: '14px 14px 24px' }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-tertiary)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8, padding: '0 2px' }}>States</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
          {[
            ['Default', {}],
            ['Hover', { background: 'var(--primary-hover)' }],
            ['Focused', { boxShadow: 'var(--focus-ring)' }],
            ['Disabled', { opacity: 0.45 }],
          ].map(([label, extra]) => (
            <div key={label} style={{ padding: 14, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--r-card)' }}>
              <div style={{ fontSize: 10.5, color: 'var(--text-tertiary)', marginBottom: 8, letterSpacing: '0.04em', textTransform: 'uppercase', fontWeight: 600 }}>{label}</div>
              <Button size="sm" style={extra}>Save</Button>
            </div>
          ))}
        </div>
      </section>
    </div>

    {/* Bottom action bar */}
    <div style={{
      flex: '0 0 auto', display: 'flex', gap: 8,
      padding: '10px 14px 28px', borderTop: '1px solid var(--border)',
      background: 'var(--bg-elevated)',
    }}>
      <Button variant="secondary" size="lg" style={{ flex: 1 }}>Save draft</Button>
      <Button size="lg" icon={<Icons.Check size={14} />} style={{ flex: 1.4 }}>Publish v1.4</Button>
    </div>
  </div>
);

// ============================================================
// M10 · Tokens editor (Color → primary)
// ============================================================
const MobileAdminTokens = () => (
  <div className="ds ds-light ds-screen" data-screen-label="M10 Admin Tokens" style={{ display: 'flex', flexDirection: 'column' }}>
    <StatusBar />
    <MobileAdminTop
      back title="color.primary"
      sub="Tokens / Color"
      action={<IconButton size="md" variant="ghost"><Icons.Plus size={18} /></IconButton>}
    />

    <div style={{ flex: 1, overflow: 'auto', background: 'var(--bg)' }}>
      {/* Big swatch + facts */}
      <section style={{ padding: 14 }}>
        <div style={{
          background: '#FF6B4A', color: 'white',
          borderRadius: 'var(--r-card)', padding: 18,
          boxShadow: 'var(--shadow-card)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
            <span style={{ fontFamily: 'var(--f-mono)', fontSize: 10.5, opacity: 0.8, letterSpacing: '0.06em', textTransform: 'uppercase' }}>color.primary.500</span>
            <span style={{ fontSize: 10.5, padding: '2px 6px', background: 'rgba(255,255,255,0.18)', borderRadius: 4, fontWeight: 600 }}>SELECTED</span>
          </div>
          <div style={{ fontFamily: 'var(--f-display)', fontWeight: 800, fontSize: 26, letterSpacing: '-0.02em', marginBottom: 14 }}>Sweet Salmon</div>
          <div style={{ display: 'flex', gap: 18 }}>
            <div>
              <div style={{ fontSize: 9.5, opacity: 0.75, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }}>HEX</div>
              <div style={{ fontFamily: 'var(--f-mono)', fontSize: 13.5, fontWeight: 600 }}>#FF6B4A</div>
            </div>
            <div>
              <div style={{ fontSize: 9.5, opacity: 0.75, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }}>HSL</div>
              <div style={{ fontFamily: 'var(--f-mono)', fontSize: 13.5, fontWeight: 600 }}>11 · 100 · 65</div>
            </div>
            <div>
              <div style={{ fontSize: 9.5, opacity: 0.75, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Uses</div>
              <div style={{ fontFamily: 'var(--f-mono)', fontSize: 13.5, fontWeight: 600 }}>27</div>
            </div>
          </div>
        </div>
      </section>

      {/* Aliases */}
      <section style={{ padding: '0 14px' }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-tertiary)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8, padding: '0 2px' }}>Aliases · 2</div>
        <div style={{ display: 'flex', gap: 6, padding: 10, border: '1px solid var(--border)', borderRadius: 'var(--r-card)', background: 'var(--surface)', flexWrap: 'wrap' }}>
          <AliasChip text="--primary" />
          <AliasChip text="--cta" />
          <span style={{ fontSize: 12, color: 'var(--text-tertiary)', alignSelf: 'center', padding: '2px 4px' }}>+ add</span>
        </div>
      </section>

      {/* Ramp browser */}
      <section style={{ padding: '16px 14px 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8, padding: '0 2px' }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-tertiary)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Ramp · 10 shades</div>
          <span style={{ fontSize: 11, color: 'var(--primary)', fontWeight: 600 }}>Edit ramp →</span>
        </div>
        <div style={{ border: '1px solid var(--border)', borderRadius: 'var(--r-card)', overflow: 'hidden', background: 'var(--surface)' }}>
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
          ].map(([n, hex, aliases, used, selected], i, a) => (
            <div key={n} style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '10px 12px',
              borderBottom: i < a.length - 1 ? '1px solid var(--border)' : 'none',
              background: selected ? 'var(--primary-soft)' : 'transparent',
            }}>
              <div style={{ width: 32, height: 32, borderRadius: 6, background: hex, border: '1px solid rgba(0,0,0,0.08)', flex: '0 0 auto' }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: 'var(--f-mono)', fontSize: 12.5, fontWeight: selected ? 600 : 500 }}>
                  <span style={{ color: 'var(--text-tertiary)' }}>color.primary.</span>
                  <span style={{ color: selected ? 'var(--primary)' : 'var(--text)' }}>{n}</span>
                </div>
                <div style={{ fontFamily: 'var(--f-mono)', fontSize: 10.5, color: 'var(--text-tertiary)', marginTop: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {hex}{aliases.length ? ' · ' + aliases.join(', ') : ''}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontFamily: 'var(--f-mono)', fontSize: 11.5, fontVariantNumeric: 'tabular-nums', color: used ? 'var(--text)' : 'var(--text-tertiary)', fontWeight: used ? 600 : 500 }}>{used}</div>
                <div style={{ fontSize: 9, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>uses</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Description */}
      <section style={{ padding: '16px 14px' }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-tertiary)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8, padding: '0 2px' }}>Description</div>
        <div style={{
          padding: 14, border: '1px solid var(--border)', borderRadius: 'var(--r-card)',
          background: 'var(--surface)', fontSize: 13.5, lineHeight: 1.55, color: 'var(--text-secondary)',
        }}>
          Sweet Salmon — primary CTAs, focus rings, active navigation. Use sparingly; one CTA per screen.
        </div>
      </section>

      {/* Other groups */}
      <section style={{ padding: '4px 14px 24px' }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-tertiary)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8, padding: '0 2px' }}>Jump to group</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
          {[
            ['color', 88], ['space', 12], ['radius', 6], ['shadow', 4],
            ['font', 38], ['motion', 8],
          ].map(([n, c]) => (
            <div key={n} style={{
              padding: 12, background: 'var(--surface)',
              border: '1px solid var(--border)', borderRadius: 'var(--r-card)',
              display: 'flex', alignItems: 'center', gap: 10,
            }}>
              <Icons.Folder size={15} style={{ color: 'var(--text-tertiary)' }} />
              <span style={{ fontFamily: 'var(--f-mono)', fontSize: 13, fontWeight: 600, flex: 1 }}>{n}</span>
              <span style={{ fontSize: 11, color: 'var(--text-tertiary)', fontVariantNumeric: 'tabular-nums' }}>{c}</span>
            </div>
          ))}
        </div>
      </section>
    </div>

    {/* Sticky action bar */}
    <div style={{
      flex: '0 0 auto', display: 'flex', gap: 8,
      padding: '10px 14px 28px', borderTop: '1px solid var(--border)',
      background: 'var(--bg-elevated)',
    }}>
      <Button variant="secondary" size="lg" style={{ flex: 1 }} icon={<Icons.Download size={14} />}>Export</Button>
      <Button size="lg" style={{ flex: 1 }}>Apply</Button>
    </div>
  </div>
);

// ============================================================
// M11 · Docs editor (markdown WYSIWYG, mobile)
// ============================================================
const MobileAdminDocsEditor = () => (
  <div className="ds ds-light ds-screen" data-screen-label="M11 Admin Docs" style={{ display: 'flex', flexDirection: 'column' }}>
    <StatusBar />
    <MobileAdminTop
      back title="Writing for buttons"
      sub="Docs / Guidelines"
      action={<IconButton size="md" variant="ghost"><Icons.Eye size={17} /></IconButton>}
    />

    {/* Autosave strip */}
    <div style={{
      padding: '8px 14px', display: 'flex', alignItems: 'center', gap: 8,
      borderBottom: '1px solid var(--border)', background: 'var(--bg-elevated)',
      fontSize: 11.5, color: 'var(--text-tertiary)',
    }}>
      <Badge tone="warning" dot>Draft · v0.3</Badge>
      <span style={{ flex: 1 }}>Auto-saved 4s ago</span>
      <span style={{ fontFamily: 'var(--f-mono)' }}>234 w · 6 min</span>
    </div>

    {/* Editor area */}
    <div style={{ flex: 1, overflow: 'auto', background: 'var(--bg-elevated)' }}>
      <article style={{ padding: '20px 20px 100px' }}>
        <div style={{ fontFamily: 'var(--f-mono)', fontSize: 11, color: 'var(--text-tertiary)', marginBottom: 12 }}>
          guidelines/writing-for-buttons.md
        </div>

        <div
          style={{
            fontFamily: 'var(--f-display)', fontWeight: 800, fontSize: 30,
            letterSpacing: '-0.025em', lineHeight: 1.05, color: 'var(--text)', marginBottom: 12,
            outline: 'none',
          }}
        >Writing for buttons</div>

        <p style={{ fontSize: 16, lineHeight: 1.6, color: 'var(--text-secondary)', marginBottom: 22 }}>
          Button labels are the most-read words in your product. Treat them as design material—not as a label slot.
        </p>

        <p style={{ fontSize: 15, lineHeight: 1.7, color: 'var(--text)', marginBottom: 22 }}>
          Every button is a promise. The label is the contract. When a label is vague, users hesitate, click defensively, or do the wrong thing entirely.
        </p>

        <h2 style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.02em', marginTop: 12, marginBottom: 14 }}>
          The four rules
        </h2>

        {/* Slash menu open inline */}
        <div style={{ position: 'relative', margin: '16px 0' }}>
          <div style={{
            padding: '6px 0 6px 12px', borderLeft: '2px solid var(--primary)',
            fontSize: 15.5, color: 'var(--text-tertiary)', lineHeight: 1.6,
          }}>
            /<span style={{ color: 'var(--text)' }}>callout</span>
            <span style={{ display: 'inline-block', width: 1.5, height: 16, background: 'var(--primary)', verticalAlign: -2, marginLeft: 2 }} />
          </div>
          <div style={{
            position: 'absolute', top: 'calc(100% + 6px)', left: 0, right: 0,
            background: 'var(--surface)', border: '1px solid var(--border)',
            borderRadius: 8, boxShadow: 'var(--shadow-pop)', overflow: 'hidden', zIndex: 2,
          }}>
            <div style={{
              padding: '8px 12px', fontSize: 10.5, fontWeight: 700,
              color: 'var(--text-tertiary)', letterSpacing: '0.06em', textTransform: 'uppercase',
              borderBottom: '1px solid var(--border)',
            }}>Insert</div>
            {[
              ['Callout', 'Note, warning, tip', <Icons.AlertCircle size={15} />, true],
              ['Code', 'Multi-line snippet', <Icons.Code size={15} />, false],
              ['Component preview', 'Embed live', <Icons.Component size={15} />, false],
              ['Token swatch', 'Visualize a token', <Icons.Palette size={15} />, false],
            ].map(([n, sub, ic, sel], i) => (
              <div key={i} style={{
                padding: '10px 12px', display: 'flex', alignItems: 'center', gap: 12,
                background: sel ? 'var(--primary-soft)' : 'transparent',
                color: sel ? 'var(--primary)' : 'var(--text)',
              }}>
                <span style={{ color: sel ? 'var(--primary)' : 'var(--text-tertiary)' }}>{ic}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{n}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>{sub}</div>
                </div>
                {sel && <Kbd>↵</Kbd>}
              </div>
            ))}
          </div>
        </div>

        <h2 style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.02em', marginTop: 220, marginBottom: 14, color: 'var(--text-tertiary)' }}>
          Match the destination
        </h2>
        <p style={{ fontSize: 15, lineHeight: 1.7, color: 'var(--text-tertiary)' }}>
          If clicking opens a modal, say "Open settings"…
        </p>
      </article>
    </div>

    {/* Sticky format toolbar */}
    <div style={{
      flex: '0 0 auto',
      borderTop: '1px solid var(--border)', background: 'var(--bg-elevated)',
    }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 2, padding: '6px 8px',
        overflow: 'auto',
      }}>
        <TbBtnMobile><span style={{ fontWeight: 600, fontSize: 12, padding: '0 4px' }}>¶</span><Icons.ChevronDown size={11} /></TbBtnMobile>
        <span style={{ width: 1, height: 16, background: 'var(--border)', margin: '0 4px' }} />
        <TbBtnMobile active><Icons.Bold size={15} /></TbBtnMobile>
        <TbBtnMobile><Icons.Italic size={15} /></TbBtnMobile>
        <TbBtnMobile><Icons.Code size={15} /></TbBtnMobile>
        <TbBtnMobile><Icons.Link size={15} /></TbBtnMobile>
        <span style={{ width: 1, height: 16, background: 'var(--border)', margin: '0 4px' }} />
        <TbBtnMobile><Icons.Heading size={15} /></TbBtnMobile>
        <TbBtnMobile><Icons.List size={15} /></TbBtnMobile>
        <TbBtnMobile><Icons.Quote size={15} /></TbBtnMobile>
        <TbBtnMobile><Icons.Image size={15} /></TbBtnMobile>
        <span style={{ width: 1, height: 16, background: 'var(--border)', margin: '0 4px' }} />
        <TbBtnMobile><Icons.Component size={15} /></TbBtnMobile>
        <TbBtnMobile><Icons.Palette size={15} /></TbBtnMobile>
        <div style={{ flex: 1 }} />
        <TbBtnMobile><Icons.MoreH size={15} /></TbBtnMobile>
      </div>
      <div style={{ display: 'flex', gap: 8, padding: '8px 14px 28px', borderTop: '1px solid var(--border)' }}>
        <Button variant="secondary" size="lg" style={{ flex: 1 }} icon={<Icons.Eye size={14} />}>Preview</Button>
        <Button size="lg" style={{ flex: 1 }} icon={<Icons.Check size={14} />}>Publish</Button>
      </div>
    </div>
  </div>
);

const TbBtnMobile = ({ children, active }) => (
  <span style={{
    display: 'inline-flex', alignItems: 'center', gap: 2,
    padding: '8px 9px', borderRadius: 6, fontSize: 13,
    color: active ? 'var(--text)' : 'var(--text-secondary)',
    background: active ? 'var(--surface-2)' : 'transparent',
    fontWeight: 500, flex: '0 0 auto',
  }}>{children}</span>
);

// ============================================================
// M12 · Users & Roles
// ============================================================
const MobileAdminUsers = () => (
  <div className="ds ds-light ds-screen" data-screen-label="M12 Admin Users" style={{ display: 'flex', flexDirection: 'column' }}>
    <StatusBar />
    <MobileAdminTop
      title="Users & Roles"
      action={<IconButton size="md" variant="ghost"><Icons.Plus size={18} /></IconButton>}
    />

    <div style={{ flex: 1, overflow: 'auto', background: 'var(--bg)' }}>
      {/* Role summary chips */}
      <section style={{ padding: '14px 14px 0' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
          {[
            ['Admin', 2, 'primary', <Icons.Shield size={14} />],
            ['Editor', 5, 'info', <Icons.Edit size={14} />],
            ['Viewer', 2, 'neutral', <Icons.Eye size={14} />],
          ].map(([n, c, tone, ic]) => (
            <div key={n} style={{
              padding: 12, background: 'var(--surface)', border: '1px solid var(--border)',
              borderRadius: 'var(--r-card)',
            }}>
              <span style={{
                width: 24, height: 24, borderRadius: 6, marginBottom: 8,
                background: tone === 'primary' ? 'var(--primary-soft)' : tone === 'info' ? 'var(--info-soft)' : 'var(--surface-2)',
                color: tone === 'primary' ? 'var(--primary)' : tone === 'info' ? 'var(--info)' : 'var(--text-secondary)',
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              }}>{ic}</span>
              <div style={{ fontFamily: 'var(--f-display)', fontWeight: 700, fontSize: 13 }}>{n}</div>
              <div style={{ fontFamily: 'var(--f-mono)', fontSize: 11, color: 'var(--text-tertiary)', marginTop: 2 }}>{c} member{c === 1 ? '' : 's'}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Search + filter */}
      <section style={{ padding: '14px 14px 8px' }}>
        <Input size="md" leading={<Icons.Search size={15} />} placeholder="Search 9 members…" />
        <div style={{ display: 'flex', gap: 6, marginTop: 10, overflow: 'auto' }}>
          {[['Role', 'All', true], ['Status', 'Active', true], ['Sort', 'Last active', false]].map(([k, v, b], i) => (
            <span key={i} style={{
              display: 'inline-flex', alignItems: 'center', gap: 5,
              padding: '6px 10px', background: 'var(--surface)',
              border: '1px solid var(--border)', borderRadius: 999,
              fontSize: 11.5, whiteSpace: 'nowrap', flex: '0 0 auto',
            }}>
              <span style={{ color: 'var(--text-tertiary)' }}>{k}:</span>
              <span style={{ color: 'var(--text)', fontWeight: 600 }}>{v}</span>
              <Icons.ChevronDown size={11} style={{ color: 'var(--text-tertiary)' }} />
            </span>
          ))}
        </div>
      </section>

      {/* Member list — full-width rows */}
      <section style={{ padding: '6px 14px 24px' }}>
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--r-card)', overflow: 'hidden' }}>
          {[
            ['Mira Quinn', 'mira@lumen.co', 'Admin', 'active', '5m', true],
            ['Jay Patel', 'jay@lumen.co', 'Admin', 'active', '12m'],
            ['Sun Park', 'sun@lumen.co', 'Editor', 'active', '1h'],
            ['Eli Wright', 'eli@lumen.co', 'Editor', 'active', '2h'],
            ['Avery Lin', 'avery@lumen.co', 'Editor', 'active', '1d'],
            ['Reza Khan', 'reza@lumen.co', 'Editor', 'active', '3d'],
            ['Cameron Sato', 'cam@lumen.co', 'Editor', 'invited', '—'],
            ['Tomas Vega', 'tomas@lumen.co', 'Viewer', 'active', '1w'],
            ['Hana Lee', 'hana@lumen.co', 'Viewer', 'active', '2w'],
          ].map(([name, email, role, status, last, isMe], i, a) => (
            <div key={email} style={{
              padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 12,
              borderBottom: i < a.length - 1 ? '1px solid var(--border)' : 'none',
            }}>
              <Avatar name={name} size={36} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                  <span style={{ fontSize: 14, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', minWidth: 0 }}>{name}</span>
                  {isMe && <span style={{ fontSize: 10.5, color: 'var(--text-tertiary)', fontWeight: 500 }}>(you)</span>}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 3, fontSize: 11.5, color: 'var(--text-tertiary)' }}>
                  <span style={{
                    padding: '1px 6px', borderRadius: 3, fontWeight: 600, fontSize: 10.5,
                    background: role === 'Admin' ? 'var(--primary-soft)' : role === 'Editor' ? 'var(--info-soft)' : 'var(--surface-2)',
                    color: role === 'Admin' ? 'var(--primary)' : role === 'Editor' ? 'var(--info)' : 'var(--text-secondary)',
                  }}>{role}</span>
                  <span>·</span>
                  <span>{status === 'invited' ? 'invited' : `active ${last}`}</span>
                </div>
              </div>
              {status === 'invited'
                ? <span style={{ fontSize: 11, color: 'var(--warning)', fontWeight: 600 }}>Resend</span>
                : <IconButton size="sm" variant="ghost"><Icons.MoreH size={15} /></IconButton>
              }
            </div>
          ))}
        </div>
      </section>

      {/* Invite link card */}
      <section style={{ padding: '0 14px 24px' }}>
        <div style={{
          padding: 14, border: '1px dashed var(--border-strong)',
          borderRadius: 'var(--r-card)', background: 'var(--surface)',
          display: 'flex', alignItems: 'center', gap: 12,
        }}>
          <span style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--primary-soft)', color: 'var(--primary)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flex: '0 0 auto' }}>
            <Icons.Mail size={15} />
          </span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 600 }}>Invitation link</div>
            <div style={{ fontFamily: 'var(--f-mono)', fontSize: 10.5, color: 'var(--text-tertiary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>opends.dev/i/lumen-J9k…</div>
          </div>
          <Button size="sm" variant="secondary" icon={<Icons.Copy size={13} />}>Copy</Button>
        </div>
      </section>
    </div>
    <AdminBottomNav active="more" />
  </div>
);

// ============================================================
// M13 · Settings
// ============================================================
const MobileAdminSettings = () => (
  <div className="ds ds-light ds-screen" data-screen-label="M13 Admin Settings" style={{ display: 'flex', flexDirection: 'column' }}>
    <StatusBar />
    <MobileAdminTop
      title="Settings"
      action={<IconButton size="md" variant="ghost"><Icons.Search size={17} /></IconButton>}
    />

    {/* Unsaved banner */}
    <div style={{
      display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px',
      background: '#FFF7DA', borderBottom: '1px solid var(--border)',
      color: '#7A5C0A', fontSize: 12.5, fontWeight: 500,
    }}>
      <span style={{ width: 6, height: 6, borderRadius: 999, background: 'var(--warning)' }} />
      <span style={{ flex: 1 }}>3 unsaved changes</span>
      <span style={{ fontWeight: 700, color: 'var(--primary)' }}>Save</span>
    </div>

    <div style={{ flex: 1, overflow: 'auto', background: 'var(--bg)' }}>
      {/* Section nav */}
      <section style={{ padding: '14px 14px 0' }}>
        <div style={{ display: 'flex', gap: 6, overflow: 'auto', paddingBottom: 2 }}>
          {[['General', true], ['Branding', false], ['Domain', false], ['Auth', false], ['API keys', false], ['Webhooks', false]].map(([n, a], i) => (
            <span key={i} style={{
              padding: '6px 12px', fontSize: 12, fontWeight: 600,
              background: a ? 'var(--primary)' : 'var(--surface)',
              color: a ? 'white' : 'var(--text-secondary)',
              border: a ? '1px solid var(--primary)' : '1px solid var(--border)',
              borderRadius: 999, whiteSpace: 'nowrap', flex: '0 0 auto',
            }}>{n}</span>
          ))}
        </div>
      </section>

      <section style={{ padding: '14px 14px 0' }}>
        <h2 style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 4 }}>General</h2>
        <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 16, lineHeight: 1.5 }}>
          Workspace identity. Visible to everyone with access.
        </p>
      </section>

      {/* Identity */}
      <MobileSettingsCard title="Identity" desc="Name & logo across docs and admin.">
        <MobileFormRow label="Workspace name">
          <Input value="Lumen Design System" />
        </MobileFormRow>
        <MobileFormRow label="URL slug" hint="Public URL prefix.">
          <Input
            value="lumen"
            trailing={<span style={{ fontFamily: 'var(--f-mono)', fontSize: 11.5, color: 'var(--text-tertiary)', padding: '0 10px', whiteSpace: 'nowrap' }}>.opends.dev</span>}
          />
        </MobileFormRow>
        <MobileFormRow label="Logo">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 48, height: 48, borderRadius: 10, background: '#1A1D21',
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flex: '0 0 auto',
            }}>
              <svg width="30" height="30" viewBox="0 0 32 32">
                <circle cx="16" cy="16" r="9" fill="none" stroke="#FF6B4A" strokeWidth="2.6" />
                <circle cx="16" cy="16" r="3" fill="#FF6B4A" />
              </svg>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <Button size="sm" variant="secondary" icon={<Icons.Upload size={13} />}>Upload</Button>
              <div style={{ fontSize: 11, color: 'var(--text-tertiary)', marginTop: 5 }}>SVG, PNG · max 512KB</div>
            </div>
          </div>
        </MobileFormRow>
      </MobileSettingsCard>

      {/* Public access */}
      <MobileSettingsCard title="Public access" desc="Who can read this design system.">
        <MobileToggleRow on title="Public read access" body="Anyone with the URL can browse." />
        <MobileToggleRow on={false} title="Open registration" body="Visitors sign up as Viewers without invite." />
        <MobileToggleRow on title="Comments on pages" body="Members can leave inline comments." />
      </MobileSettingsCard>

      {/* API keys */}
      <MobileSettingsCard title="API keys" desc="Read tokens & components from your apps." action={<Button size="sm" icon={<Icons.Plus size={12} />}>New</Button>}>
        <MobileApiKey name="Production build" key1="opds_prod_********fa2b" lastUsed="12m ago" scopes={['read:tokens', 'read:components']} />
        <MobileApiKey name="Storybook sync" key1="opds_sb_********e91c" lastUsed="2h ago" scopes={['read:components']} />
        <MobileApiKey name="Figma plugin" key1="opds_fg_********7d31" lastUsed="—" scopes={['read:tokens']} warn />
      </MobileSettingsCard>

      {/* Danger zone */}
      <section style={{ padding: '4px 14px 28px' }}>
        <div style={{
          border: '1px solid #F1C8C8', background: '#FDF4F4',
          borderRadius: 'var(--r-card)', padding: 16,
          display: 'flex', alignItems: 'flex-start', gap: 12,
        }}>
          <span style={{ width: 32, height: 32, borderRadius: 8, background: '#F8DADA', color: 'var(--danger)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flex: '0 0 auto' }}>
            <Icons.Trash size={15} />
          </span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--danger)', marginBottom: 2 }}>Delete workspace</div>
            <div style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              Permanently remove Lumen, its components, tokens and docs. This cannot be undone.
            </div>
          </div>
        </div>
      </section>
    </div>
    <AdminBottomNav active="more" />
  </div>
);

const MobileSettingsCard = ({ title, desc, children, action }) => (
  <section style={{ padding: '14px 14px 0' }}>
    <div style={{
      border: '1px solid var(--border)', borderRadius: 'var(--r-card)',
      background: 'var(--surface)', overflow: 'hidden',
    }}>
      <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: 'var(--f-display)', fontWeight: 700, fontSize: 15, marginBottom: 2 }}>{title}</div>
          <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{desc}</div>
        </div>
        {action}
      </div>
      <div style={{ padding: 14, display: 'flex', flexDirection: 'column', gap: 14 }}>
        {children}
      </div>
    </div>
  </section>
);

const MobileFormRow = ({ label, hint, children }) => (
  <div>
    <div style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--text-secondary)', letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: 6 }}>{label}</div>
    {children}
    {hint && <div style={{ fontSize: 11.5, color: 'var(--text-tertiary)', marginTop: 6 }}>{hint}</div>}
  </div>
);

const MobileToggleRow = ({ on, title, body }) => (
  <div style={{
    display: 'flex', alignItems: 'flex-start', gap: 12,
    padding: 12, background: 'var(--surface-2)',
    border: '1px solid var(--border)', borderRadius: 'var(--r-input)',
  }}>
    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={{ fontSize: 13.5, fontWeight: 600 }}>{title}</div>
      <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 3, lineHeight: 1.45 }}>{body}</div>
    </div>
    <span style={{ width: 38, height: 22, background: on ? 'var(--primary)' : 'var(--border-strong)', borderRadius: 999, position: 'relative', flex: '0 0 auto' }}>
      <span style={{ position: 'absolute', [on ? 'right' : 'left']: 2, top: 2, width: 18, height: 18, borderRadius: 999, background: 'white', boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }} />
    </span>
  </div>
);

const MobileApiKey = ({ name, key1, lastUsed, scopes, warn }) => (
  <div style={{
    padding: 12, background: 'var(--surface-2)',
    border: '1px solid var(--border)', borderRadius: 'var(--r-input)',
  }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <span style={{ width: 28, height: 28, borderRadius: 6, background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text-secondary)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flex: '0 0 auto' }}>
        <Icons.Key size={13} />
      </span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13.5, fontWeight: 600 }}>{name}</div>
        <div style={{ fontFamily: 'var(--f-mono)', fontSize: 10.5, color: 'var(--text-tertiary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{key1}</div>
      </div>
      <IconButton size="sm" variant="ghost"><Icons.MoreH size={14} /></IconButton>
    </div>
    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 10, flexWrap: 'wrap' }}>
      {scopes.map(s => <Badge key={s} tone="neutral" style={{ fontFamily: 'var(--f-mono)', fontSize: 10 }}>{s}</Badge>)}
      <span style={{ flex: 1 }} />
      <span style={{ fontSize: 11, color: warn ? 'var(--warning)' : 'var(--text-tertiary)', fontWeight: warn ? 600 : 500 }}>
        {warn ? 'never used' : `used ${lastUsed}`}
      </span>
    </div>
  </div>
);

Object.assign(window, {
  MobileAdminTop, AdminBottomNav,
  MobileAdminComponents, MobileAdminComponentEditor, MobileAdminTokens,
  MobileAdminDocsEditor, MobileAdminUsers, MobileAdminSettings,
  MobileSettingsCard, MobileFormRow, MobileToggleRow, MobileApiKey,
  MobileCompCard, TbBtnMobile,
});
