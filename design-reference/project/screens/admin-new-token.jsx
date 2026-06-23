// ============================================================
// ADMIN — New token + Import tokens
// 1440 × 1100
// Single page, tabbed: Single · Ramp · Import
// ============================================================

const AdminNewToken = () => (
  <div className="ds ds-light ds-screen" data-screen-label="Admin · New token">
    <div style={{ display: 'flex', height: '100%' }}>
      <AdminSidebar active="tokens" />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <AdminHeader
          title="New token"
          crumbs={['Tokens']}
          search={false}
          actions={<>
            <Badge tone="warning" dot>Unsaved</Badge>
            <Button variant="ghost" size="sm">Cancel</Button>
            <Button variant="secondary" size="sm">Save draft</Button>
            <Button size="sm" icon={<Icons.Check size={14} />}>Add to system</Button>
          </>}
        />

        {/* Mode tabs */}
        <div style={{
          display: 'flex', gap: 4, padding: '12px 28px 0',
          borderBottom: '1px solid var(--border)', background: 'var(--bg)', flex: '0 0 auto',
        }}>
          {[
            ['Single token', <Icons.Plus size={13} />, false],
            ['New ramp', <Icons.Palette size={13} />, true],
            ['Import', <Icons.Upload size={13} />, false],
          ].map(([n, ic, a], i) => (
            <span key={i} style={{
              padding: '10px 14px', fontSize: 13.5, fontWeight: a ? 600 : 500,
              display: 'inline-flex', alignItems: 'center', gap: 6,
              color: a ? 'var(--text)' : 'var(--text-secondary)',
              borderBottom: a ? '2px solid var(--primary)' : '2px solid transparent',
              marginBottom: -1,
            }}>{ic}{n}</span>
          ))}
        </div>

        <main style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 380px', minHeight: 0 }}>
          {/* === LEFT: ramp builder + paste import === */}
          <div style={{ overflow: 'auto', padding: '28px 40px 60px', background: 'var(--bg)' }}>
            <div style={{ maxWidth: 760 }}>
              <div style={{ marginBottom: 28 }}>
                <h2 style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 4 }}>Build a new ramp</h2>
                <p style={{ fontSize: 13.5, color: 'var(--text-secondary)', marginBottom: 0, lineHeight: 1.55 }}>
                  A ramp is a family of shades around one anchor color. We'll generate the others; you can tune each one after.
                </p>
              </div>

              {/* Anchor row */}
              <Section heading="Anchor" sub="Start with one color. The rest derive from this.">
                <div style={{
                  display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16,
                  padding: 18, background: 'var(--surface)',
                  border: '1px solid var(--border)', borderRadius: 'var(--r-card)',
                  marginBottom: 16,
                }}>
                  <div>
                    <Label>Name</Label>
                    <Input value="color.gold" style={{ fontFamily: 'var(--f-mono)' }} />
                    <Hint>Lowercase, dot.separated. e.g. color.brand.warm</Hint>
                  </div>
                  <div>
                    <Label>Anchor value</Label>
                    <Input value="#FFD166" style={{ fontFamily: 'var(--f-mono)' }}
                      leading={<span style={{ width: 18, height: 18, borderRadius: 4, background: '#FFD166', border: '1px solid var(--border-strong)' }} />}
                    />
                    <Hint>Picker, hex, hsl, oklch — paste anything.</Hint>
                  </div>
                  <div>
                    <Label>Anchor shade</Label>
                    <Segmented options={['200', '400', '500', '600', '800']} active="500" />
                    <Hint>Where in the ramp this color sits.</Hint>
                  </div>
                </div>
              </Section>

              {/* Generated ramp preview */}
              <Section
                heading="Generated ramp"
                sub="10 shades, OKLCH-balanced for consistent perceived lightness."
                trailing={
                  <div style={{ display: 'flex', gap: 6 }}>
                    <Segmented2 options={['Linear', 'OKLCH', 'Hand-tuned']} active="OKLCH" />
                    <Button variant="ghost" size="sm" icon={<Icons.Sliders size={13} />}>Adjust</Button>
                  </div>
                }
              >
                <div style={{
                  border: '1px solid var(--border)', borderRadius: 'var(--r-card)',
                  overflow: 'hidden', background: 'var(--surface)',
                }}>
                  <div style={{ display: 'flex' }}>
                    {[
                      [50, '#FFFAEC'], [100, '#FFF3CC'], [200, '#FFE7A3'], [300, '#FFDA7A'],
                      [400, '#FFD66E'], [500, '#FFD166'], [600, '#E0AE39'], [700, '#A37A20'],
                      [800, '#6E5012'], [900, '#3E2C08'],
                    ].map(([n, hex]) => {
                      const dark = n >= 600;
                      const anchor = n === 500;
                      return (
                        <div key={n} style={{
                          flex: 1, background: hex,
                          color: dark ? 'white' : '#1A1D21',
                          padding: '14px 6px 16px', minHeight: 110,
                          display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
                          position: 'relative',
                          outline: anchor ? '3px solid var(--primary)' : 'none',
                          outlineOffset: -3,
                          zIndex: anchor ? 1 : 0,
                        }}>
                          <div style={{ fontFamily: 'var(--f-display)', fontWeight: 700, fontSize: 16, letterSpacing: '-0.02em', textAlign: 'center' }}>{n}</div>
                          <div style={{ fontFamily: 'var(--f-mono)', fontSize: 10, opacity: 0.85, textAlign: 'center' }}>{hex}</div>
                          {anchor && (
                            <span style={{
                              position: 'absolute', top: -10, left: '50%', transform: 'translateX(-50%)',
                              fontSize: 9.5, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase',
                              background: 'var(--primary)', color: 'white', padding: '2px 6px', borderRadius: 3,
                            }}>anchor</span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                  {/* Contrast hint row */}
                  <div style={{
                    display: 'flex', padding: '10px 0', background: 'var(--bg-elevated)',
                    borderTop: '1px solid var(--border)', alignItems: 'center', gap: 0,
                    fontSize: 10.5, fontFamily: 'var(--f-mono)', color: 'var(--text-tertiary)',
                  }}>
                    {[
                      ['1.04:1', false], ['1.12', false], ['1.45', false], ['2.10', false],
                      ['3.20', true], ['4.72', true], ['7.10', true], ['11.4', true],
                      ['15.2', true], ['19.1', true],
                    ].map(([v, ok], i) => (
                      <div key={i} style={{ flex: 1, textAlign: 'center', color: ok ? 'var(--success)' : 'var(--text-tertiary)' }}>
                        {ok && <Icons.Check size={9} style={{ verticalAlign: -1, marginRight: 2 }} />}{v}
                      </div>
                    ))}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 16, marginTop: 12, fontSize: 12, color: 'var(--text-tertiary)' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                    <Icons.CheckCircle size={12} style={{ color: 'var(--success)' }} />
                    6 of 10 shades meet AA contrast on white background
                  </span>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                    <Icons.AlertCircle size={12} style={{ color: 'var(--warning)' }} />
                    400 fails on white — flag as "decorative only"
                  </span>
                </div>
              </Section>

              {/* Aliases */}
              <Section heading="Aliases" sub="Friendly names that point at one of the shades. These are what most code references.">
                <div style={{
                  padding: 16, background: 'var(--surface)',
                  border: '1px solid var(--border)', borderRadius: 'var(--r-card)',
                }}>
                  <AliasMapRow alias="--warning" target="color.gold.500" suggested />
                  <AliasMapRow alias="--warning-hover" target="color.gold.600" suggested />
                  <AliasMapRow alias="--warning-soft" target="color.gold.100" suggested />
                  <AliasMapRow alias="--warning-strong" target="color.gold.800" />
                  <Button variant="ghost" size="sm" icon={<Icons.Plus size={13} />} style={{ color: 'var(--primary)', marginTop: 6 }}>Add alias</Button>
                </div>
              </Section>

              {/* Description */}
              <Section heading="Description" sub="Required. Tell teammates when to reach for this ramp.">
                <textarea
                  defaultValue="Warm gold ramp. Use for warnings, in-progress states, beta badges. Pair with text.warning for legible labels."
                  style={{
                    width: '100%', minHeight: 90, padding: 14, fontSize: 14, fontFamily: 'inherit',
                    border: '1px solid var(--border)', borderRadius: 'var(--r-card)', background: 'var(--surface)',
                    outline: 'none', resize: 'vertical', lineHeight: 1.55, color: 'var(--text)',
                  }} />
              </Section>

              {/* Import box (alternate flow, collapsed by default) */}
              <Section heading="Or paste tokens" sub="Bring in an existing CSS, JSON, or Tokens Studio export. We'll show you a diff before anything is saved.">
                <PasteImport />
              </Section>
            </div>
          </div>

          {/* === RIGHT: live preview + impact === */}
          <aside style={{
            borderLeft: '1px solid var(--border)', background: 'var(--bg-elevated)',
            overflow: 'auto', padding: '28px 22px',
          }}>
            {/* Sample preview */}
            <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-tertiary)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 10, padding: '0 4px' }}>
              How it looks in components
            </div>
            <div style={{
              padding: 16, background: 'var(--surface)',
              border: '1px solid var(--border)', borderRadius: 'var(--r-card)',
              marginBottom: 18, display: 'flex', flexDirection: 'column', gap: 12,
            }}>
              {/* Badge */}
              <div>
                <SwatchLabel>Badge / warning</SwatchLabel>
                <span style={{
                  display: 'inline-flex', alignItems: 'center', gap: 5,
                  padding: '2px 8px', background: '#FFF3CC', color: '#6E5012',
                  borderRadius: 'var(--r-input)', fontSize: 12.5, fontWeight: 600,
                }}>
                  <span style={{ width: 5, height: 5, borderRadius: 999, background: '#FFD166' }} />
                  in review
                </span>
              </div>
              {/* Banner */}
              <div>
                <SwatchLabel>Banner</SwatchLabel>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  padding: '8px 12px', background: '#FFF3CC',
                  border: '1px solid #FFE7A3', borderRadius: 'var(--r-card)',
                  fontSize: 12.5, color: '#6E5012',
                }}>
                  <Icons.AlertCircle size={14} />
                  <span style={{ flex: 1 }}>5 components still using deprecated tokens.</span>
                </div>
              </div>
              {/* Button */}
              <div>
                <SwatchLabel>Button / soft</SwatchLabel>
                <Button size="sm" variant="soft" style={{ background: '#FFF3CC', color: '#6E5012' }} icon={<Icons.AlertCircle size={13} />}>Review now</Button>
              </div>
            </div>

            {/* Impact analysis */}
            <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-tertiary)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 10, padding: '0 4px' }}>
              Impact
            </div>
            <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--r-card)', overflow: 'hidden', marginBottom: 18 }}>
              <ImpactRow label="New tokens" value="10" tone="success" />
              <ImpactRow label="New aliases" value="4" tone="success" />
              <ImpactRow label="Replaces (deprecate)" value="color.warning.legacy" tone="warning" mono />
              <ImpactRow label="Affects components" value="11" tone="info" />
              <ImpactRow label="Pages referencing" value="3" tone="info" last />
            </div>

            {/* Naming check */}
            <div style={{
              padding: 14, borderRadius: 'var(--r-card)',
              background: '#EDF7F1', border: '1px solid #C8E5D4',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                <Icons.CheckCircle size={14} style={{ color: 'var(--success)' }} />
                <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--success)', letterSpacing: '0.04em', textTransform: 'uppercase' }}>Naming OK</span>
              </div>
              <p style={{ fontSize: 12.5, color: '#1F5A40', lineHeight: 1.5, margin: 0 }}>
                <code style={{ fontFamily: 'var(--f-mono)' }}>color.gold</code> doesn't collide with existing ramps. Suggested aliases pass our pattern check.
              </p>
            </div>
          </aside>
        </main>
      </div>
    </div>
  </div>
);

const Label = ({ children }) => (
  <div style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--text-secondary)', letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: 6 }}>{children}</div>
);
const Hint = ({ children }) => (
  <div style={{ fontSize: 11.5, color: 'var(--text-tertiary)', marginTop: 6, lineHeight: 1.45 }}>{children}</div>
);

const Section = ({ heading, sub, trailing, children }) => (
  <section style={{ marginBottom: 28 }}>
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 12, marginBottom: 12 }}>
      <div style={{ flex: 1 }}>
        <h3 style={{ fontSize: 15, fontWeight: 700, margin: 0, marginBottom: 2 }}>{heading}</h3>
        {sub && <p style={{ fontSize: 12.5, color: 'var(--text-tertiary)', margin: 0, lineHeight: 1.45 }}>{sub}</p>}
      </div>
      {trailing}
    </div>
    {children}
  </section>
);

const AliasMapRow = ({ alias, target, suggested }) => (
  <div style={{
    display: 'grid', gridTemplateColumns: '1fr 24px 1fr 90px 28px',
    alignItems: 'center', gap: 10, padding: '8px 0',
    borderTop: '1px solid var(--border)',
  }}>
    <span style={{ fontFamily: 'var(--f-mono)', fontSize: 13, fontWeight: 600 }}>{alias}</span>
    <Icons.ArrowRight size={13} style={{ color: 'var(--text-tertiary)' }} />
    <span style={{ fontFamily: 'var(--f-mono)', fontSize: 13, color: 'var(--text-secondary)' }}>{target}</span>
    {suggested
      ? <Badge tone="info" style={{ fontSize: 10 }}>auto</Badge>
      : <Badge tone="neutral" style={{ fontSize: 10 }}>manual</Badge>}
    <Icons.MoreH size={14} style={{ color: 'var(--text-tertiary)', justifySelf: 'flex-end' }} />
  </div>
);

const SwatchLabel = ({ children }) => (
  <div style={{ fontSize: 10.5, fontWeight: 700, color: 'var(--text-tertiary)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 6 }}>{children}</div>
);

const ImpactRow = ({ label, value, tone, mono, last }) => (
  <div style={{
    display: 'flex', alignItems: 'center', padding: '10px 14px',
    borderBottom: last ? 'none' : '1px solid var(--border)',
    fontSize: 12.5,
  }}>
    <span style={{ flex: 1, color: 'var(--text-secondary)' }}>{label}</span>
    <span style={{
      fontFamily: mono ? 'var(--f-mono)' : 'inherit',
      fontWeight: 600, fontVariantNumeric: 'tabular-nums',
      color: tone === 'warning' ? 'var(--warning)' : tone === 'success' ? 'var(--success)' : 'var(--info)',
    }}>{value}</span>
  </div>
);

// === Paste-import surface ===
const PasteImport = () => (
  <div style={{
    border: '1px solid var(--border)', borderRadius: 'var(--r-card)',
    background: 'var(--surface)', overflow: 'hidden',
  }}>
    <div style={{ display: 'flex', gap: 0, padding: '0 0 0 4px', borderBottom: '1px solid var(--border)', background: 'var(--bg-elevated)' }}>
      {[['CSS variables', true], ['JSON', false], ['Tokens Studio', false], ['Figma vars', false]].map(([n, a], i) => (
        <span key={i} style={{
          padding: '10px 14px', fontSize: 12.5, fontWeight: a ? 600 : 500,
          color: a ? 'var(--text)' : 'var(--text-secondary)',
          borderBottom: a ? '2px solid var(--primary)' : '2px solid transparent',
          marginBottom: -1,
        }}>{n}</span>
      ))}
    </div>
    <div style={{
      padding: 0, background: 'var(--bg-elevated)',
      borderBottom: '1px solid var(--border)',
    }}>
      <pre style={{
        margin: 0, padding: '14px 18px', fontFamily: 'var(--f-mono)', fontSize: 12.5,
        lineHeight: 1.7, whiteSpace: 'pre-wrap', color: 'var(--text)',
      }}>
        <CssLine n={1}>:root {'{'}</CssLine>
        <CssLine n={2} indent={2}><CssVar>--gold-50</CssVar>: <CssVal new>#FFFAEC</CssVal>;</CssLine>
        <CssLine n={3} indent={2}><CssVar>--gold-100</CssVar>: <CssVal new>#FFF3CC</CssVal>;</CssLine>
        <CssLine n={4} indent={2}><CssVar>--gold-500</CssVar>: <CssVal changed>#FFD166</CssVal>; <CssComment>{'/* was #F4C04A */'}</CssComment></CssLine>
        <CssLine n={5} indent={2}><CssVar>--gold-700</CssVar>: <CssVal new>#A37A20</CssVal>;</CssLine>
        <CssLine n={6} indent={2}><CssVar>--gold-900</CssVar>: <CssVal new>#3E2C08</CssVal>;</CssLine>
        <CssLine n={7}>{'}'}</CssLine>
      </pre>
    </div>
    <div style={{
      display: 'flex', alignItems: 'center', padding: '10px 16px',
      fontSize: 12, color: 'var(--text-secondary)',
    }}>
      <Badge tone="success" style={{ fontSize: 10 }}>5 new</Badge>
      <Badge tone="warning" style={{ fontSize: 10, marginLeft: 6 }}>1 changed</Badge>
      <Badge tone="neutral" style={{ fontSize: 10, marginLeft: 6 }}>0 removed</Badge>
      <div style={{ flex: 1 }} />
      <Button variant="ghost" size="sm">Clear</Button>
      <Button size="sm" icon={<Icons.ArrowRight size={13} />}>Review diff</Button>
    </div>
  </div>
);

const CssLine = ({ n, indent = 0, children }) => (
  <div style={{ display: 'flex', gap: 14 }}>
    <span style={{ width: 18, textAlign: 'right', color: 'var(--text-tertiary)', opacity: 0.5, fontSize: 11, userSelect: 'none', flex: '0 0 auto' }}>{n}</span>
    <span style={{ paddingLeft: indent * 8 }}>{children}</span>
  </div>
);
const CssVar = ({ children }) => <span style={{ color: 'var(--info)' }}>{children}</span>;
const CssVal = ({ children, new: isNew, changed }) => (
  <span style={{
    color: changed ? 'var(--warning)' : 'var(--text)',
    background: isNew ? 'rgba(31,138,91,0.12)' : changed ? 'rgba(255,209,102,0.25)' : 'transparent',
    padding: isNew || changed ? '0 3px' : 0,
    borderRadius: 3,
  }}>{children}</span>
);
const CssComment = ({ children }) => <span style={{ color: 'var(--text-tertiary)', fontStyle: 'italic' }}>{children}</span>;

Object.assign(window, {
  AdminNewToken, AliasMapRow, ImpactRow, PasteImport,
  Section, Label, Hint, SwatchLabel,
  CssLine, CssVar, CssVal, CssComment,
});
