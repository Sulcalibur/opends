// ============================================================
// ADMIN — New component (creation flow, single long page)
// 1440 × 1200
// Empty state on the right (no preview yet) → builds itself as user fills in.
// ============================================================

const AdminNewComponent = () => (
  <div className="ds ds-light ds-screen" data-screen-label="Admin · New component">
    <div style={{ display: 'flex', height: '100%' }}>
      <AdminSidebar active="components" />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <AdminHeader
          title="New component"
          crumbs={['Components', 'Inputs']}
          search={false}
          actions={<>
            <Badge tone="neutral" style={{ fontFamily: 'var(--f-mono)', fontSize: 11 }}>untitled-1</Badge>
            <Button variant="ghost" size="sm">Cancel</Button>
            <Button variant="secondary" size="sm">Save draft</Button>
            <Button size="sm" icon={<Icons.ArrowRight size={14} />}>Publish &amp; request review</Button>
          </>}
        />

        {/* Progress strip */}
        <NewProgress steps={[
          ['Basics', true, true],
          ['Code source', true, false],
          ['Preview & props', false, false],
          ['Documentation', false, false],
          ['Review', false, false],
        ]} />

        <main style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 380px', minHeight: 0 }}>
          {/* Form column */}
          <div style={{ overflow: 'auto', padding: '28px 40px 60px', background: 'var(--bg)' }}>
            <div style={{ maxWidth: 720 }}>

              {/* === 1 · Basics === */}
              <NewSection number="1" title="Basics" hint="Start with a one-line summary. Everything else can change later.">
                <NewRow label="Name" required hint="PascalCase. Used as the React/Vue component identifier.">
                  <Input placeholder="e.g. Avatar, ButtonGroup, EmptyState" value="ButtonGroup"
                    trailing={<span style={{ fontFamily: 'var(--f-mono)', fontSize: 11, color: 'var(--success)', padding: '0 12px', display: 'inline-flex', alignItems: 'center', gap: 4 }}><Icons.Check size={12} /> available</span>}
                  />
                </NewRow>
                <NewRow label="One-liner" required hint="Shown in search, the components grid, and the index. Lead with the verb.">
                  <Input placeholder="A row of related buttons that act as one control." value="A row of related buttons that act as one control." />
                </NewRow>
                <NewRow label="Category" required>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    {[['Inputs', true], ['Display', false], ['Overlay', false], ['Navigation', false], ['Feedback', false], ['Layout', false], ['Data', false]].map(([n, a]) => (
                      <span key={n} style={{
                        padding: '6px 12px', fontSize: 12.5, fontWeight: 600,
                        background: a ? 'var(--primary)' : 'var(--surface)',
                        color: a ? 'white' : 'var(--text-secondary)',
                        border: a ? '1px solid var(--primary)' : '1px solid var(--border)',
                        borderRadius: 999,
                      }}>{n}</span>
                    ))}
                    <span style={{ padding: '6px 10px', fontSize: 12, color: 'var(--text-tertiary)', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                      <Icons.Plus size={11} /> custom
                    </span>
                  </div>
                </NewRow>
                <NewRow label="Tags" hint="Up to 6 tags. Helps people find it via filters.">
                  <div style={{
                    display: 'flex', gap: 4, flexWrap: 'wrap', padding: 8,
                    border: '1px solid var(--border)', borderRadius: 'var(--r-input)',
                    background: 'var(--surface)',
                  }}>
                    <Badge tone="neutral">action</Badge>
                    <Badge tone="neutral">group</Badge>
                    <Badge tone="neutral">toolbar</Badge>
                    <span style={{ fontSize: 13, color: 'var(--text-tertiary)', padding: '2px 4px' }}>type to add…</span>
                  </div>
                </NewRow>
                <NewRow label="Audience" hint="Who can read this once published. Author always sees it.">
                  <AudiencePicker value="team" />
                </NewRow>
              </NewSection>

              {/* === 2 · Code source === */}
              <NewSection number="2" title="Code source" hint="Where does the implementation live? You can change this after creating.">
                <SourceTabs />
                <div style={{
                  border: '1px solid var(--border)', borderRadius: 'var(--r-card)',
                  background: 'var(--surface)', overflow: 'hidden', marginTop: -1,
                  borderTopLeftRadius: 0, borderTopRightRadius: 'var(--r-card)',
                }}>
                  <div style={{
                    padding: '10px 16px', borderBottom: '1px solid var(--border)',
                    background: 'var(--bg-elevated)', display: 'flex', alignItems: 'center', gap: 10,
                  }}>
                    <Icons.Github size={14} style={{ color: 'var(--text-secondary)' }} />
                    <span style={{ fontFamily: 'var(--f-mono)', fontSize: 12, color: 'var(--text-secondary)' }}>
                      lumen/design-system <Icons.ChevronRight size={11} style={{ verticalAlign: -1, opacity: 0.5 }} /> packages/ui/src/<span style={{ color: 'var(--primary)' }}>ButtonGroup.vue</span>
                    </span>
                    <Badge tone="success" dot style={{ marginLeft: 'auto' }}>connected</Badge>
                  </div>
                  <CodeBlock lang="Vue · auto-synced" style={{ fontSize: 12, border: 'none', borderRadius: 0, background: 'var(--bg)' }}>
                    {<><C.t>&lt;template&gt;</C.t>{'\n  '}<C.t>&lt;div</C.t>{' '}<C.a>:class</C.a>=<C.s>"['u-button-group', $props.size]"</C.s><C.t>&gt;</C.t>{'\n    '}<C.t>&lt;slot</C.t> /<C.t>&gt;</C.t>{'\n  '}<C.t>&lt;/div&gt;</C.t>{'\n'}<C.t>&lt;/template&gt;</C.t></>}
                  </CodeBlock>
                  <div style={{
                    padding: '10px 16px', borderTop: '1px solid var(--border)',
                    display: 'flex', alignItems: 'center', gap: 12,
                    fontSize: 11.5, color: 'var(--text-tertiary)',
                  }}>
                    <Icons.Clock size={11} /> Last sync 2 minutes ago
                    <span style={{ flex: 1 }} />
                    <span style={{ fontFamily: 'var(--f-mono)' }}>main@a8f3c1d</span>
                    <Button variant="ghost" size="sm" icon={<Icons.Settings size={12} />}>Sync settings</Button>
                  </div>
                </div>
              </NewSection>

              {/* === 3 · Preview === */}
              <NewSection number="3" title="Preview & props" hint="We detected 3 props from your source. Confirm or edit them below.">
                <div style={{
                  border: '1px solid var(--border)', borderRadius: 'var(--r-card)',
                  background: 'var(--surface)', overflow: 'hidden',
                }}>
                  <div style={{
                    padding: '50px 24px', minHeight: 160, display: 'flex',
                    alignItems: 'center', justifyContent: 'center',
                    backgroundImage: 'radial-gradient(circle at 1px 1px, var(--border) 1px, transparent 1px)',
                    backgroundSize: '16px 16px',
                  }}>
                    <FakeButtonGroup />
                  </div>
                  <div style={{ borderTop: '1px solid var(--border)', padding: 16, background: 'var(--bg-elevated)' }}>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 12 }}>
                      <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-tertiary)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Detected props · 3</span>
                      <span style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>from source</span>
                      <div style={{ flex: 1 }} />
                      <Button variant="ghost" size="sm" icon={<Icons.Plus size={13} />} style={{ color: 'var(--primary)' }}>Add prop</Button>
                    </div>
                    <PropRow name="size" type="enum" values="sm · md · lg" def="md" required />
                    <PropRow name="orientation" type="enum" values="horizontal · vertical" def="horizontal" />
                    <PropRow name="attached" type="bool" values="—" def="true" />
                  </div>
                </div>
              </NewSection>

              {/* === 4 · Documentation === */}
              <NewSection number="4" title="Documentation" hint="The team's main reading surface. Markdown supported. Use / for embeds and components.">
                <MdMiniEditor />
              </NewSection>

              {/* === 5 · Review === */}
              <NewSection number="5" title="Reviewers & release" hint="Whose sign-off do you want, and how should this ship?">
                <NewRow label="Reviewers" hint="They'll be notified. At least one approval is required to publish.">
                  <div style={{
                    display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap',
                    padding: 8, border: '1px solid var(--border)',
                    background: 'var(--surface)', borderRadius: 'var(--r-input)',
                  }}>
                    <ReviewerChip name="Mira Quinn" role="Admin" />
                    <ReviewerChip name="Jay Patel" role="Admin" />
                    <span style={{ fontSize: 12.5, color: 'var(--text-tertiary)', padding: '2px 4px' }}>+ add reviewer</span>
                  </div>
                </NewRow>
                <NewRow label="Initial version" hint="Semver. Defaults to 0.1.0 for new components.">
                  <Input value="0.1.0" wrapStyle={{ width: 160 }} style={{ fontFamily: 'var(--f-mono)' }} />
                </NewRow>
                <NewRow label="On publish">
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <CheckboxRow checked label="Notify #design-system on Slack" />
                    <CheckboxRow checked label="Append to changelog under v2.5" />
                    <CheckboxRow label="Auto-open PR in lumen/design-system" />
                  </div>
                </NewRow>
              </NewSection>
            </div>
          </div>

          {/* Right — live status / outline / tips */}
          <aside style={{
            borderLeft: '1px solid var(--border)', background: 'var(--bg-elevated)',
            overflow: 'auto', padding: '28px 20px',
          }}>
            {/* Status */}
            <div style={{
              border: '1px solid var(--border)', borderRadius: 'var(--r-card)',
              background: 'var(--surface)', padding: 16, marginBottom: 18,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <span style={{ width: 8, height: 8, borderRadius: 999, background: 'var(--warning)' }} />
                <span style={{ fontSize: 13, fontWeight: 600 }}>Draft · auto-saved 3s ago</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <Readiness check label="Name &amp; one-liner" />
                <Readiness check label="Category set" />
                <Readiness check label="Source connected" />
                <Readiness check label="Props detected" />
                <Readiness label="Documentation (recommended)" partial />
                <Readiness label="At least 1 reviewer" />
              </div>
            </div>

            {/* Outline / jump */}
            <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-tertiary)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 10, padding: '0 4px' }}>Jump to section</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2, marginBottom: 24 }}>
              <OutlineRow num="1" text="Basics" done active />
              <OutlineRow num="2" text="Code source" done />
              <OutlineRow num="3" text="Preview & props" done />
              <OutlineRow num="4" text="Documentation" partial />
              <OutlineRow num="5" text="Reviewers & release" />
            </div>

            {/* Tip card */}
            <div style={{
              padding: 14, borderRadius: 'var(--r-card)',
              background: 'var(--primary-soft)', border: '1px solid #FBD5C8',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                <Icons.Sparkles size={14} style={{ color: 'var(--primary)' }} />
                <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--primary)', letterSpacing: '0.04em', textTransform: 'uppercase' }}>Tip</span>
              </div>
              <p style={{ fontSize: 12.5, color: '#7A3015', lineHeight: 1.55, margin: 0 }}>
                Components with at least 3 do/don't examples in docs get adopted <strong>2.4×</strong> faster across product teams. Use <code style={{ fontFamily: 'var(--f-mono)', background: 'rgba(255,255,255,0.5)', padding: '1px 4px', borderRadius: 3, fontSize: 11.5 }}>/do</code> in the editor.
              </p>
            </div>
          </aside>
        </main>
      </div>
    </div>
  </div>
);

// === Progress strip ===
const NewProgress = ({ steps }) => (
  <div style={{
    display: 'flex', alignItems: 'center', gap: 0,
    padding: '0 28px', height: 44, borderBottom: '1px solid var(--border)',
    background: 'var(--bg)', flex: '0 0 auto',
  }}>
    {steps.map(([name, done, active], i, a) => (
      <React.Fragment key={i}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
          <span style={{
            width: 22, height: 22, borderRadius: 999,
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            background: active ? 'var(--primary)' : done ? 'var(--success-soft, #E1F3EA)' : 'var(--surface-2)',
            color: active ? 'white' : done ? 'var(--success)' : 'var(--text-tertiary)',
            border: active ? '1px solid var(--primary)' : done ? '1px solid var(--success)' : '1px solid var(--border)',
            fontSize: 11, fontWeight: 700, fontFamily: 'var(--f-mono)',
          }}>{done && !active ? <Icons.Check size={12} /> : i + 1}</span>
          <span style={{
            fontSize: 12.5, fontWeight: active ? 700 : done ? 600 : 500,
            color: active ? 'var(--text)' : done ? 'var(--text-secondary)' : 'var(--text-tertiary)',
          }}>{name}</span>
        </div>
        {i < a.length - 1 && (
          <div style={{ flex: 1, height: 1, background: done ? 'var(--success)' : 'var(--border)', margin: '0 14px', opacity: done ? 0.4 : 1 }} />
        )}
      </React.Fragment>
    ))}
  </div>
);

// === New section wrapper ===
const NewSection = ({ number, title, hint, children }) => (
  <section style={{ marginBottom: 36 }}>
    <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 4 }}>
      <span style={{ fontFamily: 'var(--f-mono)', fontSize: 12, color: 'var(--text-tertiary)', fontWeight: 600 }}>{number}</span>
      <h2 style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.02em', margin: 0 }}>{title}</h2>
    </div>
    {hint && <p style={{ fontSize: 13.5, color: 'var(--text-secondary)', marginLeft: 22, marginTop: 0, marginBottom: 18, lineHeight: 1.55 }}>{hint}</p>}
    <div style={{ marginLeft: 22 }}>{children}</div>
  </section>
);

const NewRow = ({ label, required, hint, children }) => (
  <div style={{ marginBottom: 16 }}>
    <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 6 }}>
      <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>{label}</label>
      {required && <span style={{ fontSize: 10, color: 'var(--danger)', fontWeight: 700 }}>·</span>}
      {required && <span style={{ fontSize: 10.5, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>required</span>}
      {hint && <span style={{ fontSize: 12, color: 'var(--text-tertiary)', marginLeft: 'auto' }}>{hint}</span>}
    </div>
    {children}
  </div>
);

// Tabbed source picker
const SourceTabs = () => (
  <div style={{ display: 'flex', gap: 4, marginBottom: 0 }}>
    {[
      ['Connect Git repo', <Icons.Github size={13} />, true],
      ['Paste code', <Icons.Code size={13} />, false],
      ['From Storybook', <Icons.Book size={13} />, false],
      ['Empty', null, false],
    ].map(([n, ic, a], i) => (
      <span key={i} style={{
        padding: '8px 14px', fontSize: 12.5, fontWeight: a ? 600 : 500,
        display: 'inline-flex', alignItems: 'center', gap: 6,
        background: a ? 'var(--surface)' : 'transparent',
        color: a ? 'var(--text)' : 'var(--text-secondary)',
        border: '1px solid var(--border)',
        borderBottomColor: a ? 'var(--surface)' : 'var(--border)',
        borderRadius: '8px 8px 0 0',
        marginBottom: -1, position: 'relative', zIndex: a ? 1 : 0,
      }}>{ic}{n}</span>
    ))}
  </div>
);

// Faux preview — a "ButtonGroup"
const FakeButtonGroup = () => (
  <div style={{ display: 'inline-flex', borderRadius: 8, overflow: 'hidden', border: '1px solid var(--border-strong)', boxShadow: 'var(--shadow-card)' }}>
    {['Day', 'Week', 'Month'].map((n, i) => (
      <span key={n} style={{
        padding: '8px 14px', fontSize: 13.5, fontWeight: 600,
        background: i === 1 ? 'var(--primary)' : 'var(--surface)',
        color: i === 1 ? 'white' : 'var(--text)',
        borderRight: i < 2 ? '1px solid var(--border-strong)' : 'none',
      }}>{n}</span>
    ))}
  </div>
);

const PropRow = ({ name, type, values, def, required }) => (
  <div style={{
    display: 'grid', gridTemplateColumns: '120px 90px 1fr 110px 70px 28px',
    alignItems: 'center', gap: 12, padding: '10px 0',
    borderTop: '1px solid var(--border)',
    fontSize: 12.5,
  }}>
    <span style={{ fontFamily: 'var(--f-mono)', fontWeight: 600 }}>{name}</span>
    <span style={{ fontFamily: 'var(--f-mono)', fontSize: 11, color: 'var(--text-secondary)', background: 'var(--surface-2)', padding: '2px 6px', borderRadius: 4, justifySelf: 'flex-start' }}>{type}</span>
    <span style={{ fontFamily: 'var(--f-mono)', color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{values}</span>
    <span style={{ fontFamily: 'var(--f-mono)', color: 'var(--text)', fontWeight: 600 }}>= {def}</span>
    {required ? <Badge tone="warning" style={{ fontSize: 10 }}>required</Badge> : <span />}
    <Icons.MoreH size={14} style={{ color: 'var(--text-tertiary)' }} />
  </div>
);

// Mini markdown editor (preview of what's in §4) — single-pane, with toolbar
const MdMiniEditor = () => (
  <div style={{
    border: '1px solid var(--border)', borderRadius: 'var(--r-card)',
    background: 'var(--surface)', overflow: 'hidden',
  }}>
    {/* Toolbar */}
    <div style={{ display: 'flex', alignItems: 'center', gap: 2, padding: '6px 10px', borderBottom: '1px solid var(--border)', background: 'var(--bg-elevated)' }}>
      <TbBtn><span style={{ fontWeight: 600, fontSize: 12.5, padding: '0 4px' }}>Paragraph</span><Icons.ChevronDown size={11} /></TbBtn>
      <span style={{ width: 1, height: 16, background: 'var(--border)', margin: '0 4px' }} />
      <TbBtn><Icons.Bold size={15} /></TbBtn>
      <TbBtn><Icons.Italic size={15} /></TbBtn>
      <TbBtn><Icons.Code size={15} /></TbBtn>
      <TbBtn><Icons.Link size={15} /></TbBtn>
      <span style={{ width: 1, height: 16, background: 'var(--border)', margin: '0 4px' }} />
      <TbBtn><Icons.List size={15} /></TbBtn>
      <TbBtn><Icons.Quote size={15} /></TbBtn>
      <TbBtn><Icons.Image size={15} /></TbBtn>
      <span style={{ width: 1, height: 16, background: 'var(--border)', margin: '0 4px' }} />
      <TbBtn active><Icons.Component size={15} /><span style={{ fontSize: 12, marginLeft: 4, fontWeight: 600 }}>Component</span></TbBtn>
      <TbBtn><Icons.Palette size={15} /><span style={{ fontSize: 12, marginLeft: 4, fontWeight: 600 }}>Token</span></TbBtn>
      <div style={{ flex: 1 }} />
      <span style={{ fontSize: 11, color: 'var(--text-tertiary)', fontFamily: 'var(--f-mono)' }}>0 words</span>
    </div>
    {/* Body */}
    <div style={{ padding: '24px 26px', minHeight: 200 }}>
      <div style={{ fontSize: 15.5, lineHeight: 1.7, color: 'var(--text-tertiary)' }}>
        Start typing. Press <Kbd>/</Kbd> for blocks, components, and tokens. The first line becomes the page summary.
      </div>
      <div style={{ display: 'inline-block', width: 2, height: 18, background: 'var(--primary)', verticalAlign: -3, marginTop: 8, marginLeft: 2 }} />
    </div>
  </div>
);

const ReviewerChip = ({ name, role }) => (
  <span style={{
    display: 'inline-flex', alignItems: 'center', gap: 6,
    padding: '4px 10px 4px 4px', background: 'var(--surface-2)',
    borderRadius: 999, fontSize: 12.5, fontWeight: 500,
  }}>
    <Avatar name={name} size={20} />
    <span style={{ fontWeight: 600 }}>{name}</span>
    <span style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>· {role}</span>
    <Icons.X size={11} style={{ color: 'var(--text-tertiary)', marginLeft: 2 }} />
  </span>
);

const CheckboxRow = ({ checked, label }) => (
  <label style={{ display: 'inline-flex', alignItems: 'center', gap: 10, fontSize: 13.5, cursor: 'pointer' }}>
    <span style={{
      width: 18, height: 18, borderRadius: 4,
      background: checked ? 'var(--primary)' : 'var(--surface)',
      border: checked ? '1px solid var(--primary)' : '1px solid var(--border-strong)',
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      color: 'white',
    }}>{checked && <Icons.Check size={12} />}</span>
    {label}
  </label>
);

// Readiness indicator
const Readiness = ({ label, check, partial }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12.5 }}>
    <span style={{
      width: 16, height: 16, borderRadius: 4,
      background: check ? 'var(--success)' : partial ? 'var(--warning)' : 'var(--surface-2)',
      border: check ? 'none' : partial ? 'none' : '1px solid var(--border)',
      color: 'white', display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    }}>{check ? <Icons.Check size={10} /> : partial ? <span style={{ width: 4, height: 4, borderRadius: 999, background: 'white' }} /> : null}</span>
    <span style={{ color: check ? 'var(--text)' : 'var(--text-secondary)', fontWeight: check ? 600 : 500 }}>{label}</span>
  </div>
);

const OutlineRow = ({ num, text, done, partial, active }) => (
  <div style={{
    display: 'flex', alignItems: 'center', gap: 8, padding: '6px 8px',
    borderLeft: `2px solid ${active ? 'var(--primary)' : 'transparent'}`,
    marginLeft: -2, fontSize: 13,
    color: active ? 'var(--primary)' : 'var(--text-secondary)',
    fontWeight: active ? 600 : 500,
  }}>
    <span style={{ fontFamily: 'var(--f-mono)', fontSize: 11, color: 'var(--text-tertiary)', minWidth: 12 }}>{num}</span>
    <span style={{ flex: 1 }}>{text}</span>
    {done && <Icons.Check size={12} style={{ color: 'var(--success)' }} />}
    {partial && <span style={{ width: 6, height: 6, borderRadius: 999, background: 'var(--warning)' }} />}
  </div>
);

Object.assign(window, {
  AdminNewComponent,
  NewProgress, NewSection, NewRow, SourceTabs, PropRow, MdMiniEditor,
  ReviewerChip, CheckboxRow, Readiness, OutlineRow, FakeButtonGroup,
});
