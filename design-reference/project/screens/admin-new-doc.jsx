// ============================================================
// ADMIN — New documentation page
// Two variants of the markdown editor side-by-side:
//   A · Split pane (raw markdown + live preview)
//   B · Hybrid (single-pane inline rendering, "show-don't-tell")
// 1440 × 900
// ============================================================

// ----- Shared chrome ------------------------------------------------
const NewDocHeader = ({ title = 'Untitled page', audience = 'team' }) => (
  <AdminHeader
    title={title}
    crumbs={['Docs', 'Guidelines']}
    search={false}
    actions={<>
      <AudienceChip level={audience} size="lg" />
      <Badge tone="warning" dot>Draft · v0.1</Badge>
      <Button variant="ghost" size="sm" icon={<Icons.Clock size={13} />}>History</Button>
      <Button variant="secondary" size="sm" icon={<Icons.Eye size={13} />}>Preview</Button>
      <Button size="sm" icon={<Icons.Check size={13} />}>Publish</Button>
    </>}
  />
);

// Page metadata strip — shared
const PageMeta = ({ slug = 'guidelines/empty-states.md' }) => (
  <div style={{
    display: 'flex', alignItems: 'center', gap: 14, padding: '10px 24px',
    borderBottom: '1px solid var(--border)', background: 'var(--bg)',
    fontSize: 12.5, color: 'var(--text-tertiary)',
  }}>
    <span style={{ fontFamily: 'var(--f-mono)' }}>{slug}</span>
    <span style={{ width: 3, height: 3, borderRadius: 999, background: 'var(--border-strong)' }} />
    <span>Guidelines</span>
    <span style={{ width: 3, height: 3, borderRadius: 999, background: 'var(--border-strong)' }} />
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
      <Avatar name="Jay Patel" size={18} /> Jay Patel
    </span>
    <span style={{ flex: 1 }} />
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
      <span style={{ width: 6, height: 6, borderRadius: 999, background: 'var(--success)' }} />
      Auto-saved 2s ago
    </span>
    <span style={{ fontFamily: 'var(--f-mono)' }}>142 words · 4 min</span>
  </div>
);

// Full formatting toolbar — shared between both variants
const FullToolbar = ({ trailing }) => (
  <div style={{
    display: 'flex', alignItems: 'center', gap: 2,
    padding: '8px 16px', borderBottom: '1px solid var(--border)',
    background: 'var(--bg-elevated)', flex: '0 0 auto', overflow: 'auto',
  }}>
    {/* Block type */}
    <TbBtn>
      <span style={{ fontWeight: 600, fontSize: 13, padding: '0 4px' }}>Paragraph</span>
      <Icons.ChevronDown size={12} />
    </TbBtn>
    <TbSep />
    {/* Inline */}
    <TbBtn active title="Bold"><Icons.Bold size={15} /></TbBtn>
    <TbBtn title="Italic"><Icons.Italic size={15} /></TbBtn>
    <TbBtn title="Inline code"><Icons.Code size={15} /></TbBtn>
    <TbBtn title="Link"><Icons.Link size={15} /></TbBtn>
    <TbBtn title="Strikethrough">
      <span style={{ fontSize: 13.5, fontWeight: 600, textDecoration: 'line-through', padding: '0 2px' }}>S</span>
    </TbBtn>
    <TbSep />
    {/* Blocks */}
    <TbBtn title="Heading"><Icons.Heading size={15} /></TbBtn>
    <TbBtn title="Bulleted list"><Icons.List size={15} /></TbBtn>
    <TbBtn title="Numbered list">
      <span style={{ fontFamily: 'var(--f-mono)', fontSize: 11, fontWeight: 700 }}>1.</span>
    </TbBtn>
    <TbBtn title="Quote"><Icons.Quote size={15} /></TbBtn>
    <TbBtn title="Code block">
      <span style={{ fontFamily: 'var(--f-mono)', fontSize: 11, fontWeight: 700, letterSpacing: '-0.05em' }}>{'</>'}</span>
    </TbBtn>
    <TbBtn title="Table">
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 9h18M3 15h18M9 3v18M15 3v18" /></svg>
    </TbBtn>
    <TbSep />
    {/* Media */}
    <TbBtn title="Image"><Icons.Image size={15} /></TbBtn>
    <TbBtn title="Embed (YouTube, Figma…)"><Icons.Link size={15} /></TbBtn>
    <TbSep />
    {/* DS specials */}
    <TbBtn title="Embed a component">
      <Icons.Component size={15} />
      <span style={{ fontSize: 12.5, marginLeft: 4, fontWeight: 600 }}>Component</span>
    </TbBtn>
    <TbBtn title="Embed a token">
      <Icons.Palette size={15} />
      <span style={{ fontSize: 12.5, marginLeft: 4, fontWeight: 600 }}>Token</span>
    </TbBtn>
    <TbBtn title="Do / Don't block">
      <Icons.CheckCircle size={15} />
      <span style={{ fontSize: 12.5, marginLeft: 4, fontWeight: 600 }}>Do/Don't</span>
    </TbBtn>
    <TbBtn title="Callout">
      <Icons.AlertCircle size={15} />
      <span style={{ fontSize: 12.5, marginLeft: 4, fontWeight: 600 }}>Callout</span>
    </TbBtn>
    <div style={{ flex: 1 }} />
    {trailing}
  </div>
);

const TbSep = () => (
  <span style={{ width: 1, height: 18, background: 'var(--border)', margin: '0 6px', flex: '0 0 auto' }} />
);

// ============================================================
// VARIANT A — Split pane (raw markdown + live preview)
// ============================================================
const AdminNewDocSplit = () => (
  <div className="ds ds-light ds-screen" data-screen-label="Admin · New doc (split)">
    <div style={{ display: 'flex', height: '100%' }}>
      <AdminSidebar active="docs" />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <NewDocHeader title="Empty states" />
        <PageMeta />
        <FullToolbar
          trailing={
            <div style={{ display: 'inline-flex', background: 'var(--surface-2)', borderRadius: 6, padding: 2, gap: 2 }}>
              {['Write', 'Split', 'Preview'].map((m, i) => (
                <span key={m} style={{
                  padding: '4px 10px', fontSize: 12, fontWeight: 600,
                  borderRadius: 4,
                  background: m === 'Split' ? 'var(--surface)' : 'transparent',
                  color: m === 'Split' ? 'var(--text)' : 'var(--text-secondary)',
                  boxShadow: m === 'Split' ? 'var(--shadow-card)' : 'none',
                  display: 'inline-flex', alignItems: 'center', gap: 5,
                }}>
                  {i === 0 && <Icons.Code size={12} />}
                  {i === 1 && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M12 3v18"/></svg>}
                  {i === 2 && <Icons.Eye size={12} />}
                  {m}
                </span>
              ))}
            </div>
          }
        />

        <main style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr 280px', minHeight: 0 }}>
          {/* Raw markdown */}
          <div style={{ borderRight: '1px solid var(--border)', overflow: 'auto', background: 'var(--bg-elevated)', position: 'relative' }}>
            <div style={{
              position: 'sticky', top: 0, zIndex: 1,
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '8px 18px', borderBottom: '1px solid var(--border)',
              background: 'var(--bg-elevated)',
              fontSize: 11, color: 'var(--text-tertiary)', fontWeight: 700,
              letterSpacing: '0.08em', textTransform: 'uppercase',
            }}>
              <Icons.Code size={11} /> Markdown
              <div style={{ flex: 1 }} />
              <span style={{ fontFamily: 'var(--f-mono)', fontSize: 10.5, textTransform: 'none', letterSpacing: 0, fontWeight: 500, color: 'var(--text-tertiary)' }}>UTF-8 · LF</span>
            </div>
            <pre style={{
              margin: 0, padding: '22px 24px 60px',
              fontFamily: 'var(--f-mono)', fontSize: 13.5, lineHeight: 1.75,
              color: 'var(--text)', whiteSpace: 'pre-wrap',
              counterReset: 'line',
            }}>
              <MdSyntax />
            </pre>
          </div>

          {/* Live preview */}
          <div style={{ overflow: 'auto', background: 'var(--bg)' }}>
            <div style={{
              position: 'sticky', top: 0, zIndex: 1,
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '8px 18px', borderBottom: '1px solid var(--border)',
              background: 'var(--bg)',
              fontSize: 11, color: 'var(--text-tertiary)', fontWeight: 700,
              letterSpacing: '0.08em', textTransform: 'uppercase',
            }}>
              <Icons.Eye size={11} /> Live preview
              <div style={{ flex: 1 }} />
              <span style={{ fontFamily: 'var(--f-mono)', fontSize: 10.5, textTransform: 'none', letterSpacing: 0, fontWeight: 500, color: 'var(--text-tertiary)' }}>scroll-synced</span>
            </div>
            <article style={{ padding: '22px 30px 60px', maxWidth: 620 }}>
              <h1 style={{ fontFamily: 'var(--f-display)', fontWeight: 800, fontSize: 36, letterSpacing: '-0.025em', lineHeight: 1.05, marginBottom: 12 }}>Empty states</h1>
              <p style={{ fontSize: 16, lineHeight: 1.6, color: 'var(--text-secondary)', marginBottom: 22 }}>
                Empty states are first impressions. Treat them as onboarding, not as error messages.
              </p>
              <p style={{ fontSize: 15, lineHeight: 1.75, marginBottom: 18 }}>
                An empty state appears whenever there's no data to show — a fresh project, a filtered list with no matches, a missing search result. Every one of those is a teaching moment.
              </p>
              <h2 style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.02em', marginTop: 28, marginBottom: 12 }}>The three jobs</h2>

              {/* Embedded callout */}
              <div style={{
                display: 'flex', gap: 12, padding: '14px 16px', marginBottom: 18,
                background: 'var(--primary-soft)', border: '1px solid #FBD5C8',
                borderRadius: 'var(--r-card)',
              }}>
                <Icons.Sparkles size={18} style={{ color: 'var(--primary)', flex: '0 0 auto' }} />
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--primary)', marginBottom: 4, letterSpacing: '0.04em', textTransform: 'uppercase' }}>Principle</div>
                  <div style={{ fontSize: 14, lineHeight: 1.5, color: '#7A3015' }}>
                    Every empty state should explain <strong>what this is</strong>, <strong>what to do next</strong>, and ideally <strong>what success looks like</strong>.
                  </div>
                </div>
              </div>

              <p style={{ fontSize: 15, lineHeight: 1.75, marginBottom: 12 }}>
                Use the <code style={{ fontFamily: 'var(--f-mono)', background: 'var(--surface-2)', padding: '1px 6px', borderRadius: 4, fontSize: 13, color: 'var(--primary)' }}>EmptyState</code> component as your container — it handles the layout and spacing for you.
              </p>

              {/* Embedded component preview */}
              <div style={{
                border: '1px solid var(--border)', borderRadius: 'var(--r-card)',
                background: 'var(--surface)', overflow: 'hidden', marginBottom: 22,
              }}>
                <div style={{ padding: '5px 14px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 8, fontSize: 10.5, color: 'var(--text-tertiary)', letterSpacing: '0.06em', textTransform: 'uppercase', fontWeight: 700 }}>
                  <Icons.Component size={11} /> Live · EmptyState
                  <div style={{ flex: 1 }} />
                  <span style={{ fontFamily: 'var(--f-mono)', textTransform: 'none', letterSpacing: 0 }}>variant="empty"</span>
                </div>
                <div style={{ padding: '40px 24px', textAlign: 'center', backgroundImage: 'radial-gradient(circle at 1px 1px, var(--border) 1px, transparent 1px)', backgroundSize: '14px 14px' }}>
                  <div style={{ width: 48, height: 48, margin: '0 auto 14px', borderRadius: 12, background: 'var(--surface-2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-tertiary)' }}>
                    <Icons.FileText size={22} />
                  </div>
                  <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>No reports yet</div>
                  <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 14, maxWidth: 280, margin: '0 auto 14px' }}>Reports collect activity across your design system. Create one to get started.</div>
                  <Button size="sm" icon={<Icons.Plus size={13} />}>New report</Button>
                </div>
              </div>

              <h2 style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.02em', marginTop: 8, marginBottom: 12 }}>Don't apologize</h2>
              <p style={{ fontSize: 15, lineHeight: 1.75, color: 'var(--text)' }}>
                Lines like <em>"Sorry, nothing here yet"</em> shift blame onto the user. Write as if it's the most natural place in the world to start.
              </p>
            </article>
          </div>

          {/* Right rail: page settings + outline */}
          <DocSideRail />
        </main>

        <DocFootBar />
      </div>
    </div>
  </div>
);

// Coloured markdown source (no actual highlighter — hand-coloured)
const MdSyntax = () => (
  <>
    <MdLine n={1}><MdH>#</MdH> Empty states</MdLine>
    <MdLine n={2}>{''}</MdLine>
    <MdLine n={3}>Empty states are first impressions. Treat them as onboarding, not as error messages.</MdLine>
    <MdLine n={4}>{''}</MdLine>
    <MdLine n={5}>An empty state appears whenever there's no data to show — a fresh project,</MdLine>
    <MdLine n={6}>a filtered list with no matches, a missing search result.</MdLine>
    <MdLine n={7}>{''}</MdLine>
    <MdLine n={8}><MdH>##</MdH> The three jobs</MdLine>
    <MdLine n={9}>{''}</MdLine>
    <MdLine n={10}><MdSel>{':::callout primary "Principle"'}</MdSel></MdLine>
    <MdLine n={11}><MdSel>{'Every empty state should explain **what this is**,'}</MdSel></MdLine>
    <MdLine n={12}><MdSel>{'**what to do next**, and ideally **what success looks like**.'}</MdSel></MdLine>
    <MdLine n={13}><MdSel>:::</MdSel></MdLine>
    <MdLine n={14}>{''}</MdLine>
    <MdLine n={15}>Use the <MdCode>`EmptyState`</MdCode> component as your container.</MdLine>
    <MdLine n={16}>{''}</MdLine>
    <MdLine n={17}><MdEmbed>{'<Component name="EmptyState" variant="empty" />'}</MdEmbed></MdLine>
    <MdLine n={18}>{''}</MdLine>
    <MdLine n={19}><MdH>##</MdH> Don't apologize</MdLine>
    <MdLine n={20}>{''}</MdLine>
    <MdLine n={21}>Lines like <MdEm>*"Sorry, nothing here yet"*</MdEm> shift blame onto the user.</MdLine>
  </>
);

const MdLine = ({ n, children }) => (
  <div style={{ display: 'flex', gap: 16, minHeight: '1.75em' }}>
    <span style={{ width: 26, textAlign: 'right', color: 'var(--text-tertiary)', opacity: 0.5, fontSize: 11.5, userSelect: 'none', flex: '0 0 auto' }}>{n}</span>
    <span style={{ flex: 1, minWidth: 0, wordBreak: 'break-word' }}>{children}</span>
  </div>
);
const MdH = ({ children }) => <span style={{ color: 'var(--primary)', fontWeight: 600 }}>{children}</span>;
const MdCode = ({ children }) => <span style={{ color: 'var(--success)' }}>{children}</span>;
const MdEm = ({ children }) => <span style={{ color: 'var(--info)' }}>{children}</span>;
const MdSel = ({ children }) => (
  <span style={{
    background: 'var(--primary-soft)', padding: '1px 4px', borderRadius: 3,
    boxShadow: '-2px 0 0 var(--primary)', marginLeft: -2,
  }}>{children}</span>
);
const MdEmbed = ({ children }) => (
  <span style={{
    background: '#EAF4FF', color: 'var(--info)', padding: '2px 6px', borderRadius: 4, fontWeight: 500,
  }}>{children}</span>
);

// ============================================================
// VARIANT B — Hybrid inline editor (CommonMark on type)
// ============================================================
const AdminNewDocHybrid = () => (
  <div className="ds ds-light ds-screen" data-screen-label="Admin · New doc (hybrid)">
    <div style={{ display: 'flex', height: '100%' }}>
      <AdminSidebar active="docs" />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <NewDocHeader title="Loading & errors" audience="public" />
        <PageMeta slug="guidelines/loading-and-errors.md" />
        <FullToolbar
          trailing={
            <div style={{ display: 'inline-flex', background: 'var(--surface-2)', borderRadius: 6, padding: 2, gap: 2 }}>
              {['Write', 'Split', 'Preview'].map(m => (
                <span key={m} style={{
                  padding: '4px 10px', fontSize: 12, fontWeight: 600,
                  borderRadius: 4,
                  background: m === 'Write' ? 'var(--surface)' : 'transparent',
                  color: m === 'Write' ? 'var(--text)' : 'var(--text-secondary)',
                  boxShadow: m === 'Write' ? 'var(--shadow-card)' : 'none',
                }}>{m}</span>
              ))}
            </div>
          }
        />

        <main style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 280px', minHeight: 0 }}>
          {/* Editor surface — full width */}
          <div style={{ overflow: 'auto', background: 'var(--bg-elevated)' }}>
            <article style={{ padding: '40px 64px 80px', maxWidth: 760, margin: '0 auto' }}>
              <input
                defaultValue="Loading & errors"
                style={{
                  width: '100%', border: 'none', outline: 'none', background: 'transparent',
                  fontFamily: 'var(--f-display)', fontWeight: 800, fontSize: 44,
                  letterSpacing: '-0.025em', color: 'var(--text)', padding: 0, marginBottom: 12,
                }}
              />
              <p style={{ fontSize: 17, lineHeight: 1.6, color: 'var(--text-secondary)', marginBottom: 28 }}>
                Skeletons, spinners, and the difference between "we're working on it" and "something broke."
              </p>

              <p style={{ fontSize: 16, lineHeight: 1.75, color: 'var(--text)', marginBottom: 18 }}>
                Loading is the unloved cousin of empty states. Spinners are honest but lazy; skeletons are dishonest but kind. Errors are neither.
              </p>

              {/* Inline floating selection bubble — design fiction */}
              <div style={{ position: 'relative', marginBottom: 18 }}>
                <p style={{ fontSize: 16, lineHeight: 1.75 }}>
                  Choose <span style={{ background: '#D7E7F8' }}>skeletons over spinners</span> whenever you can describe the eventual shape of the content.
                </p>
                <div style={{
                  position: 'absolute', top: -42, left: 64,
                  display: 'inline-flex', alignItems: 'center', gap: 0, padding: 2,
                  background: 'var(--text)', color: 'white',
                  borderRadius: 8, boxShadow: 'var(--shadow-pop)',
                }}>
                  <BubBtn><Icons.Bold size={13} /></BubBtn>
                  <BubBtn active><Icons.Italic size={13} /></BubBtn>
                  <BubBtn><Icons.Code size={13} /></BubBtn>
                  <BubBtn><Icons.Link size={13} /></BubBtn>
                  <span style={{ width: 1, height: 14, background: 'rgba(255,255,255,0.2)', margin: '0 4px' }} />
                  <BubBtn><Icons.Quote size={13} /></BubBtn>
                  <BubBtn><Icons.Heading size={13} /></BubBtn>
                  <div style={{
                    position: 'absolute', bottom: -5, left: 64, width: 10, height: 10,
                    background: 'var(--text)', transform: 'rotate(45deg)',
                  }} />
                </div>
              </div>

              <h2 style={{ fontSize: 28, fontWeight: 700, letterSpacing: '-0.02em', marginTop: 36, marginBottom: 14 }}>Spinners are an apology</h2>

              {/* Live token swatch embed */}
              <div style={{
                display: 'flex', alignItems: 'center', gap: 14, padding: 14,
                marginBottom: 22, background: 'var(--surface)',
                border: '1px solid var(--border)', borderRadius: 'var(--r-card)',
              }}>
                <div style={{ width: 56, height: 56, borderRadius: 10, background: '#FFD166', flex: '0 0 auto' }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: 'var(--f-mono)', fontSize: 13, fontWeight: 600 }}>color.warning.500</div>
                  <div style={{ fontSize: 12, color: 'var(--text-tertiary)', marginTop: 2 }}>Use for in-progress loading after 800ms, or unresolved errors.</div>
                </div>
                <Badge tone="neutral" style={{ fontFamily: 'var(--f-mono)' }}>#FFD166</Badge>
                <IconButton size="sm" variant="ghost"><Icons.MoreH size={14} /></IconButton>
              </div>

              {/* Slash menu currently open below this line */}
              <p style={{ fontSize: 16, lineHeight: 1.75, marginBottom: 8 }}>
                When something fails, name what failed and what the user can do about it:
              </p>

              <div style={{ position: 'relative', margin: '6px 0 28px' }}>
                <div style={{
                  padding: '4px 0 4px 14px', borderLeft: '2px solid var(--primary)',
                  fontSize: 16, lineHeight: 1.75, color: 'var(--text-tertiary)',
                }}>
                  /<span style={{ color: 'var(--text)' }}>dod</span>
                  <span style={{ display: 'inline-block', width: 2, height: 18, background: 'var(--primary)', verticalAlign: -3, marginLeft: 2 }} />
                </div>
                <div style={{
                  position: 'absolute', top: 'calc(100% + 6px)', left: 14,
                  width: 360, background: 'var(--surface)', border: '1px solid var(--border)',
                  borderRadius: 8, boxShadow: 'var(--shadow-pop)', overflow: 'hidden', zIndex: 2,
                }}>
                  <div style={{ padding: '8px 12px', fontSize: 10.5, fontWeight: 700, color: 'var(--text-tertiary)', letterSpacing: '0.06em', textTransform: 'uppercase', borderBottom: '1px solid var(--border)', display: 'flex' }}>
                    <span>Insert · matches</span>
                    <span style={{ marginLeft: 'auto', color: 'var(--text-tertiary)' }}>↑↓ navigate</span>
                  </div>
                  {[
                    ['Do / Don\'t block', 'Side-by-side examples', <Icons.CheckCircle size={16} />, true],
                    ['Doc cross-link', 'Link to another page', <Icons.FileText size={16} />, false],
                    ['Documentation cover', 'Page hero with image', <Icons.Image size={16} />, false],
                  ].map(([n, sub, ic, sel], i) => (
                    <div key={i} style={{
                      padding: '10px 12px', display: 'flex', alignItems: 'center', gap: 12,
                      background: sel ? 'var(--primary-soft)' : 'transparent',
                      color: sel ? 'var(--primary)' : 'var(--text)',
                    }}>
                      <span style={{ color: sel ? 'var(--primary)' : 'var(--text-tertiary)' }}>{ic}</span>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 13.5, fontWeight: 600 }}>{n}</div>
                        <div style={{ fontSize: 11.5, color: 'var(--text-tertiary)' }}>{sub}</div>
                      </div>
                      {sel && <Kbd>↵</Kbd>}
                    </div>
                  ))}
                  <div style={{ padding: '8px 12px', borderTop: '1px solid var(--border)', fontSize: 11, color: 'var(--text-tertiary)', display: 'flex', gap: 14 }}>
                    <span><Kbd>↵</Kbd> insert</span>
                    <span><Kbd>esc</Kbd> dismiss</span>
                    <span style={{ marginLeft: 'auto', fontFamily: 'var(--f-mono)' }}>3 of 312 blocks</span>
                  </div>
                </div>
              </div>

              <div style={{ height: 120 }} />
            </article>
          </div>

          {/* Right rail */}
          <DocSideRail audience="public" />
        </main>

        <DocFootBar />
      </div>
    </div>
  </div>
);

const BubBtn = ({ children, active }) => (
  <span style={{
    width: 30, height: 28, borderRadius: 6,
    background: active ? 'rgba(255,255,255,0.2)' : 'transparent',
    color: 'white', display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
  }}>{children}</span>
);

// Shared right rail
const DocSideRail = ({ audience = 'team' }) => (
  <aside style={{ borderLeft: '1px solid var(--border)', background: 'var(--bg)', overflow: 'auto' }}>
    <div style={{ padding: 18 }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-tertiary)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 12 }}>Audience &amp; comments</div>
      <DocField label="Who can read">
        <AudiencePicker value={audience} dense />
      </DocField>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 4, marginBottom: 4 }}>
        <CommentMiniRow level="public" on={audience === 'public'} />
        <CommentMiniRow level="team" on={true} />
        <CommentMiniRow level="admin" on={true} />
      </div>
      <div style={{ fontSize: 11.5, color: 'var(--text-tertiary)', marginTop: 4, marginBottom: 14, lineHeight: 1.45 }}>
        Workspace default: <span style={{ fontFamily: 'var(--f-mono)' }}>team / all-on</span>
      </div>
    </div>
    <div style={{ borderTop: '1px solid var(--border)', padding: 18 }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-tertiary)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 12 }}>Page</div>
      <DocField label="Slug">
        <Input size="sm" value="empty-states" style={{ fontFamily: 'var(--f-mono)', fontSize: 12 }} wrapStyle={{ background: 'var(--surface)' }} />
      </DocField>
      <DocField label="Category">
        <Select value="Guidelines" />
      </DocField>
      <DocField label="Cover">
        <div style={{
          padding: 16, border: '1px dashed var(--border-strong)', borderRadius: 6,
          background: 'var(--surface)', textAlign: 'center', fontSize: 12, color: 'var(--text-tertiary)',
        }}>
          <Icons.Image size={16} style={{ marginBottom: 4 }} /><br/>
          Drop image, or pick from library
        </div>
      </DocField>
      <DocField label="Tags">
        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
          <Badge tone="neutral">guidelines</Badge>
          <Badge tone="neutral">empty-states</Badge>
          <span style={{ fontSize: 12, color: 'var(--text-tertiary)', alignSelf: 'center' }}>+ add</span>
        </div>
      </DocField>
    </div>
    <div style={{ borderTop: '1px solid var(--border)', padding: 18 }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-tertiary)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 10 }}>Outline</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2, fontSize: 13 }}>
        <OutlineItem level={1} text="Empty states" active />
        <OutlineItem level={2} text="The three jobs" />
        <OutlineItem level={2} text="Don't apologize" />
        <OutlineItem level={2} text="Patterns" />
      </div>
    </div>
    <div style={{ borderTop: '1px solid var(--border)', padding: 18 }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-tertiary)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 10 }}>Linked</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <LinkRow icon={<Icons.Component size={13} />} name="EmptyState" />
        <LinkRow icon={<Icons.Palette size={13} />} name="color.warning.500" mono />
        <LinkRow icon={<Icons.FileText size={13} />} name="Writing for buttons" />
      </div>
    </div>
  </aside>
);

const DocField = ({ label, children }) => (
  <div style={{ marginBottom: 14 }}>
    <div style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--text-secondary)', letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: 6 }}>{label}</div>
    {children}
  </div>
);

const LinkRow = ({ icon, name, mono }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 8px', borderRadius: 6, background: 'var(--surface)', border: '1px solid var(--border)' }}>
    <span style={{ color: 'var(--text-tertiary)' }}>{icon}</span>
    <span style={{ fontSize: 12.5, fontWeight: 600, fontFamily: mono ? 'var(--f-mono)' : 'inherit', flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{name}</span>
    <Icons.ArrowUpRight size={11} style={{ color: 'var(--text-tertiary)' }} />
  </div>
);

// Bottom status bar
const DocFootBar = () => (
  <footer style={{
    height: 28, padding: '0 18px', flex: '0 0 auto',
    borderTop: '1px solid var(--border)', background: 'var(--bg-elevated)',
    display: 'flex', alignItems: 'center', gap: 16,
    fontSize: 11, fontFamily: 'var(--f-mono)', color: 'var(--text-tertiary)',
  }}>
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
      <Icons.Github size={11} /> main · draft branch
    </span>
    <span>Ln 14, Col 22</span>
    <span>UTF-8</span>
    <span>Markdown</span>
    <div style={{ flex: 1 }} />
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
      <span style={{ width: 6, height: 6, borderRadius: 999, background: 'var(--success)' }} />
      Synced
    </span>
    <span><Kbd>⌘</Kbd> <Kbd>K</Kbd> commands</span>
  </footer>
);

Object.assign(window, {
  AdminNewDocSplit, AdminNewDocHybrid,
  NewDocHeader, PageMeta, FullToolbar, DocSideRail, DocFootBar,
  TbSep, BubBtn, DocField, LinkRow,
});
