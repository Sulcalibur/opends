// ============================================================
// ADMIN — Component editor (Button)
// 1440 × 900
// ============================================================

const AdminComponentEditor = () => (
  <div className="ds ds-light ds-screen" data-screen-label="Admin · Component editor">
    <div style={{ display: 'flex', height: '100%' }}>
      <AdminSidebar active="components" />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <AdminHeader
          title="Button"
          crumbs={['Components', 'Inputs']}
          search={false}
          actions={<>
            <AudienceChip level="public" size="lg" />
            <Badge tone="warning" dot>Unsaved · 3 changes</Badge>
            <Button variant="secondary" size="sm" icon={<Icons.Eye size={14} />}>Preview</Button>
            <Button variant="secondary" size="sm">Save draft</Button>
            <Button size="sm" icon={<Icons.Check size={14} />}>Publish v1.4.0</Button>
          </>}
        />

        {/* Sub-tabs */}
        <div style={{
          display: 'flex', gap: 0, padding: '0 28px',
          borderBottom: '1px solid var(--border)', background: 'var(--bg-elevated)',
        }}>
          {[
            ['Overview', false], ['Variants', false], ['Props', true],
            ['Code', false], ['Guidelines', false], ['Changelog', false],
          ].map(([n, a]) => (
            <span key={n} style={{
              padding: '12px 14px', fontSize: 13.5, fontWeight: a ? 600 : 500,
              color: a ? 'var(--text)' : 'var(--text-secondary)',
              borderBottom: a ? '2px solid var(--primary)' : '2px solid transparent',
              marginBottom: -1,
            }}>{n}</span>
          ))}
        </div>

        {/* Editor layout: 3 columns */}
        <main style={{ flex: 1, display: 'grid', gridTemplateColumns: '260px 1fr 320px', minHeight: 0 }}>
          {/* Left rail: variants list */}
          <div style={{ borderRight: '1px solid var(--border)', overflow: 'auto', background: 'var(--bg)' }}>
            <div style={{ padding: '14px 14px 8px', fontSize: 11, fontWeight: 700, color: 'var(--text-tertiary)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Variants · 6</div>
            <div style={{ padding: '0 6px' }}>
              {[
                ['primary', true], ['secondary', false], ['soft', false],
                ['ghost', false], ['danger', false], ['link', false],
              ].map(([n, a]) => (
                <div key={n} style={{
                  padding: '8px 10px', borderRadius: 6,
                  background: a ? 'var(--surface)' : 'transparent',
                  border: a ? '1px solid var(--border)' : '1px solid transparent',
                  boxShadow: a ? 'var(--shadow-card)' : 'none',
                  display: 'flex', alignItems: 'center', gap: 8,
                  fontSize: 13, fontWeight: a ? 600 : 500,
                  color: a ? 'var(--text)' : 'var(--text-secondary)',
                  marginBottom: 2,
                }}>
                  <span style={{ width: 16, height: 16, borderRadius: 4, background: n === 'primary' ? 'var(--primary)' : 'var(--surface-2)', border: '1px solid var(--border)' }} />
                  <span style={{ fontFamily: 'var(--f-mono)', fontSize: 12.5 }}>{n}</span>
                </div>
              ))}
            </div>
            <div style={{ padding: '8px 14px 16px' }}>
              <Button variant="ghost" size="sm" icon={<Icons.Plus size={13} />} style={{ color: 'var(--primary)', padding: '6px 8px' }}>Add variant</Button>
            </div>

            <div style={{ padding: '14px 14px 8px', fontSize: 11, fontWeight: 700, color: 'var(--text-tertiary)', letterSpacing: '0.08em', textTransform: 'uppercase', borderTop: '1px solid var(--border)' }}>Props · 8</div>
            <div style={{ padding: '0 6px' }}>
              {['label', 'variant', 'size', 'icon', 'trailing-icon', 'loading', 'disabled', 'block'].map((n, i) => (
                <div key={n} style={{
                  padding: '7px 10px', fontSize: 12.5, fontFamily: 'var(--f-mono)',
                  color: n === 'variant' ? 'var(--primary)' : 'var(--text-secondary)',
                  fontWeight: n === 'variant' ? 600 : 500,
                  background: n === 'variant' ? 'var(--primary-soft)' : 'transparent',
                  borderRadius: 6,
                }}>{n}</div>
              ))}
            </div>
          </div>

          {/* Center: live preview canvas + matrix */}
          <div style={{ overflow: 'auto', padding: 28, background: 'var(--bg)' }}>
            {/* Hero preview */}
            <div style={{
              border: '1px solid var(--border)', borderRadius: 'var(--r-card)',
              background: 'var(--surface)', boxShadow: 'var(--shadow-card)', overflow: 'hidden', marginBottom: 16,
            }}>
              <div style={{
                padding: '10px 16px', borderBottom: '1px solid var(--border)',
                display: 'flex', alignItems: 'center', gap: 12, background: 'var(--bg-elevated)',
              }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-tertiary)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Live preview</span>
                <Badge tone="primary">primary</Badge>
                <div style={{ flex: 1 }} />
                <Segmented options={['sm', 'md', 'lg']} active="lg" />
                <span style={{ width: 1, height: 20, background: 'var(--border)' }} />
                <IconButton size="sm" variant="ghost"><Icons.Sun size={15} /></IconButton>
                <IconButton size="sm" variant="ghost"><Icons.Moon size={15} /></IconButton>
                <IconButton size="sm" variant="ghost"><Icons.ArrowUpRight size={15} /></IconButton>
              </div>
              <div style={{
                padding: '60px 24px', minHeight: 220, display: 'flex',
                alignItems: 'center', justifyContent: 'center',
                backgroundImage: 'radial-gradient(circle at 1px 1px, var(--border) 1px, transparent 1px)',
                backgroundSize: '20px 20px',
              }}>
                <Button size="lg" icon={<Icons.Sparkles size={18} />}>Generate suggestions</Button>
              </div>
            </div>

            {/* States matrix */}
            <div style={{
              border: '1px solid var(--border)', borderRadius: 'var(--r-card)',
              background: 'var(--surface)', overflow: 'hidden',
            }}>
              <div style={{
                padding: '10px 16px', borderBottom: '1px solid var(--border)',
                fontSize: 11, fontWeight: 700, color: 'var(--text-tertiary)',
                letterSpacing: '0.08em', textTransform: 'uppercase',
                background: 'var(--bg-elevated)',
              }}>States matrix · all sizes × default · hover · active · disabled</div>
              <div style={{ padding: 20, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
                {[
                  ['Default', { }],
                  ['Hover', { background: 'var(--primary-hover)', borderColor: 'var(--primary-hover)' }],
                  ['Active', { transform: 'translateY(1px)', boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.1)' }],
                  ['Disabled', { opacity: 0.45, cursor: 'not-allowed' }],
                ].map(([label, extra]) => (
                  <div key={label}>
                    <div style={{ fontSize: 11, color: 'var(--text-tertiary)', marginBottom: 8, letterSpacing: '0.04em', textTransform: 'uppercase', fontWeight: 600 }}>{label}</div>
                    <Button style={extra}>Save changes</Button>
                  </div>
                ))}
                <div style={{ gridColumn: '1 / -1', borderTop: '1px solid var(--border)', marginTop: 4, paddingTop: 18, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
                  <div>
                    <div style={{ fontSize: 11, color: 'var(--text-tertiary)', marginBottom: 8, letterSpacing: '0.04em', textTransform: 'uppercase', fontWeight: 600 }}>Focused</div>
                    <Button style={{ boxShadow: 'var(--focus-ring)' }}>Save changes</Button>
                  </div>
                  <div>
                    <div style={{ fontSize: 11, color: 'var(--text-tertiary)', marginBottom: 8, letterSpacing: '0.04em', textTransform: 'uppercase', fontWeight: 600 }}>Loading</div>
                    <Button icon={<span style={{ width: 12, height: 12, border: '2px solid currentColor', borderRightColor: 'transparent', borderRadius: 999, display: 'inline-block' }} />}>Saving…</Button>
                  </div>
                  <div>
                    <div style={{ fontSize: 11, color: 'var(--text-tertiary)', marginBottom: 8, letterSpacing: '0.04em', textTransform: 'uppercase', fontWeight: 600 }}>Icon-only</div>
                    <IconButton variant="secondary" size="lg" style={{ background: 'var(--primary)', color: 'white', border: '1px solid var(--primary)' }}><Icons.Plus size={18} /></IconButton>
                  </div>
                  <div>
                    <div style={{ fontSize: 11, color: 'var(--text-tertiary)', marginBottom: 8, letterSpacing: '0.04em', textTransform: 'uppercase', fontWeight: 600 }}>Block</div>
                    <Button full>Save changes</Button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right rail: prop editor */}
          <div style={{ borderLeft: '1px solid var(--border)', overflow: 'auto', background: 'var(--bg-elevated)' }}>
            <div style={{ padding: '16px 18px', borderBottom: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ fontFamily: 'var(--f-mono)', fontWeight: 700, fontSize: 14, color: 'var(--text)' }}>variant</span>
                <Badge tone="warning" style={{ fontSize: 10 }}>edited</Badge>
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>Affects visual emphasis. One of 6 enum values.</div>
            </div>
            <div style={{ padding: 18 }}>
              <PropField label="Type">
                <Segmented options={['enum', 'string', 'bool']} active="enum" />
              </PropField>
              <PropField label="Allowed values">
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  {['primary', 'secondary', 'soft', 'ghost', 'danger', 'link'].map(v => (
                    <div key={v} style={{
                      padding: '6px 10px', background: 'var(--surface)', border: '1px solid var(--border)',
                      borderRadius: 6, display: 'flex', alignItems: 'center', gap: 8,
                      fontSize: 12.5, fontFamily: 'var(--f-mono)',
                    }}>
                      <span style={{ flex: 1 }}>{v}</span>
                      <Icons.MoreH size={14} style={{ color: 'var(--text-tertiary)' }} />
                    </div>
                  ))}
                  <Button variant="ghost" size="sm" icon={<Icons.Plus size={13} />} style={{ alignSelf: 'flex-start', marginTop: 4, color: 'var(--primary)' }}>Add value</Button>
                </div>
              </PropField>
              <PropField label="Default">
                <Input size="sm" value="primary" wrapStyle={{ height: 32, background: 'var(--surface)' }} />
              </PropField>
              <PropField label="Required">
                <SwitchRow value={false} />
              </PropField>
              <PropField label="Description">
                <textarea
                  defaultValue="Visual emphasis level. Use primary for the single most important action on a page."
                  style={{
                    width: '100%', minHeight: 72, padding: 10, fontSize: 13, fontFamily: 'inherit',
                    border: '1px solid var(--border)', borderRadius: 6, background: 'var(--surface)',
                    color: 'var(--text)', outline: 'none', resize: 'vertical', lineHeight: 1.5,
                  }} />
              </PropField>
              <PropField label="Show in playground">
                <SwitchRow value={true} />
              </PropField>
            </div>
          </div>
        </main>
      </div>
    </div>
  </div>
);

const PropField = ({ label, children }) => (
  <div style={{ marginBottom: 16 }}>
    <div style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--text-secondary)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 8 }}>{label}</div>
    {children}
  </div>
);

const SwitchRow = ({ value }) => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
    <span style={{ fontSize: 13, color: 'var(--text-secondary)', fontFamily: 'var(--f-mono)' }}>{value ? 'true' : 'false'}</span>
    <span style={{ width: 34, height: 20, background: value ? 'var(--primary)' : 'var(--border)', borderRadius: 999, position: 'relative', cursor: 'pointer' }}>
      <span style={{ position: 'absolute', [value ? 'right' : 'left']: 2, top: 2, width: 16, height: 16, borderRadius: 999, background: 'white', boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }} />
    </span>
  </div>
);

Object.assign(window, { AdminComponentEditor, PropField, SwitchRow });
