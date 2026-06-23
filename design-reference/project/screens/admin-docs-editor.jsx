// ============================================================
// ADMIN — Docs WYSIWYG editor (Milkdown-style)
// 1440 × 900
// ============================================================

const AdminDocsEditor = () => (
  <div className="ds ds-light ds-screen" data-screen-label="Admin · Docs editor">
    <div style={{ display: 'flex', height: '100%' }}>
      <AdminSidebar active="docs" />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <AdminHeader
          title="Writing for buttons"
          crumbs={['Docs', 'Guidelines']}
          search={false}
          actions={<>
            <AudienceChip level="team" size="lg" />
            <Badge tone="warning" dot>Draft · auto-saved 4s ago</Badge>
            <Button variant="secondary" size="sm" icon={<Icons.Eye size={14} />}>Preview</Button>
            <Button size="sm" icon={<Icons.Check size={14} />}>Publish</Button>
          </>}
        />

        <main style={{ flex: 1, display: 'grid', gridTemplateColumns: '260px 1fr 260px', minHeight: 0 }}>
          {/* Page tree */}
          <div style={{ borderRight: '1px solid var(--border)', overflow: 'auto', background: 'var(--bg)' }}>
            <div style={{ padding: 12, borderBottom: '1px solid var(--border)' }}>
              <Input size="sm" leading={<Icons.Search size={14} />} placeholder="Find page…" />
            </div>
            <div style={{ padding: 8 }}>
              <DocTreeItem icon={<Icons.Folder size={14} />} name="Getting started" count={4} open />
              <DocTreeItem name="Introduction" indent={1} />
              <DocTreeItem name="Installation" indent={1} />
              <DocTreeItem name="Theming" indent={1} draft />
              <DocTreeItem name="Contributing" indent={1} />
              <DocTreeItem icon={<Icons.Folder size={14} />} name="Foundations" count={5} open />
              <DocTreeItem name="Color" indent={1} />
              <DocTreeItem name="Typography" indent={1} />
              <DocTreeItem name="Spacing" indent={1} />
              <DocTreeItem name="Radius & Shadow" indent={1} />
              <DocTreeItem name="Motion" indent={1} draft />
              <DocTreeItem icon={<Icons.Folder size={14} />} name="Guidelines" count={6} open />
              <DocTreeItem name="Writing for inputs" indent={1} />
              <DocTreeItem name="Writing for buttons" indent={1} active />
              <DocTreeItem name="Tone & voice" indent={1} />
              <DocTreeItem name="Empty states" indent={1} />
              <DocTreeItem name="Loading & errors" indent={1} draft />
              <DocTreeItem name="Accessibility" indent={1} />
              <DocTreeItem icon={<Icons.Folder size={14} />} name="Changelog" count={12} />
            </div>
            <div style={{ padding: '0 12px 12px' }}>
              <Button variant="ghost" size="sm" full icon={<Icons.Plus size={13} />} style={{ justifyContent: 'flex-start', color: 'var(--primary)' }}>New page</Button>
            </div>
          </div>

          {/* Editor surface */}
          <div style={{ overflow: 'auto', background: 'var(--bg-elevated)' }}>
            <Toolbar />
            <div style={{ padding: '40px 64px 80px', maxWidth: 760, margin: '0 auto' }}>
              <div style={{ fontSize: 12, color: 'var(--text-tertiary)', fontFamily: 'var(--f-mono)', marginBottom: 16 }}>guidelines/writing-for-buttons.md</div>
              <input
                defaultValue="Writing for buttons"
                style={{
                  width: '100%', border: 'none', outline: 'none', background: 'transparent',
                  fontFamily: 'var(--f-display)', fontWeight: 800, fontSize: 44,
                  letterSpacing: '-0.025em', color: 'var(--text)', padding: 0, marginBottom: 12,
                }}
              />
              <p style={{ fontSize: 18, lineHeight: 1.6, color: 'var(--text-secondary)', marginBottom: 32 }}>
                Button labels are the most-read words in your product. Treat them as design material—not as a label slot.
              </p>

              <p style={{ fontSize: 16, lineHeight: 1.75, color: 'var(--text)', marginBottom: 18 }}>
                Every button is a promise. The label is the contract. When a label is vague, users hesitate, click defensively, or do the wrong thing entirely. The team that wins is the team that writes button labels with the same care as they pick colors.
              </p>

              <h2 style={{ fontSize: 28, fontWeight: 700, marginTop: 36, marginBottom: 14, letterSpacing: '-0.02em' }}>The four rules</h2>

              {/* Slash command menu (open) on a fresh line — designed to look "live" */}
              <SlashMenu />

              <h2 style={{ fontSize: 28, fontWeight: 700, marginTop: 36, marginBottom: 14, letterSpacing: '-0.02em', color: 'var(--text-tertiary)' }}>Match the destination</h2>
              <p style={{ fontSize: 16, color: 'var(--text-tertiary)', lineHeight: 1.7 }}>If clicking opens a modal, say "Open settings"…</p>
            </div>
          </div>

          {/* Outline + page settings */}
          <div style={{ borderLeft: '1px solid var(--border)', background: 'var(--bg)', overflow: 'auto' }}>
            <div style={{ padding: 18 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-tertiary)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 12 }}>Page</div>
              <PropField label="Slug">
                <Input size="sm" value="writing-for-buttons" wrapStyle={{ height: 30, background: 'var(--surface)' }} style={{ fontFamily: 'var(--f-mono)', fontSize: 12 }} />
              </PropField>
              <PropField label="Category">
                <Select value="Guidelines" />
              </PropField>
              <PropField label="Author">
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '4px 8px', border: '1px solid var(--border)', borderRadius: 6, background: 'var(--surface)' }}>
                  <Avatar name="Jay Patel" size={22} />
                  <span style={{ fontSize: 13, flex: 1 }}>Jay Patel</span>
                  <Icons.ChevronDown size={13} style={{ color: 'var(--text-tertiary)' }} />
                </div>
              </PropField>
              <PropField label="Tags">
                <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                  <Badge tone="neutral">writing</Badge>
                  <Badge tone="neutral">buttons</Badge>
                  <span style={{ fontSize: 12, color: 'var(--text-tertiary)', alignSelf: 'center' }}>+ add</span>
                </div>
              </PropField>
            </div>
            <div style={{ borderTop: '1px solid var(--border)', padding: 18 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-tertiary)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 12 }}>Outline</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2, fontSize: 13 }}>
                <OutlineItem level={1} text="Writing for buttons" active />
                <OutlineItem level={2} text="The four rules" />
                <OutlineItem level={2} text="Match the destination" />
                <OutlineItem level={2} text="Don't ask permission" />
                <OutlineItem level={2} text="Action weight" />
                <OutlineItem level={2} text="Quick reference" />
              </div>
            </div>
            <div style={{ borderTop: '1px solid var(--border)', padding: 18 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-tertiary)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 12 }}>Audience &amp; comments</div>
              <PropField label="Who can read">
                <AudiencePicker value="team" dense />
              </PropField>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 4 }}>
                <CommentMiniRow level="public" on={false} />
                <CommentMiniRow level="team" on={true} />
                <CommentMiniRow level="admin" on={true} />
              </div>
              <div style={{ fontSize: 11.5, color: 'var(--text-tertiary)', marginTop: 10, lineHeight: 1.45 }}>
                Overrides the workspace default (<span style={{ fontFamily: 'var(--f-mono)' }}>public/all</span>).
              </div>
            </div>
            <div style={{ borderTop: '1px solid var(--border)', padding: 18 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-tertiary)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 12 }}>Status</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6, fontSize: 13 }}>
                <span style={{ width: 8, height: 8, borderRadius: 999, background: 'var(--warning)' }} />
                <span style={{ flex: 1, fontWeight: 500 }}>Draft</span>
                <span style={{ color: 'var(--text-tertiary)' }}>v0.3</span>
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-tertiary)', lineHeight: 1.55 }}>Last published 2 weeks ago by Jay. 14 edits since.</div>
            </div>
          </div>
        </main>
      </div>
    </div>
  </div>
);

const Toolbar = () => (
  <div style={{
    position: 'sticky', top: 0, zIndex: 1,
    display: 'flex', alignItems: 'center', gap: 2,
    padding: '8px 16px', borderBottom: '1px solid var(--border)',
    background: 'var(--bg-elevated)',
  }}>
    <TbBtn><span style={{ fontWeight: 600, fontSize: 13, padding: '0 4px' }}>Paragraph</span><Icons.ChevronDown size={12} /></TbBtn>
    <span style={{ width: 1, height: 16, background: 'var(--border)', margin: '0 4px' }} />
    <TbBtn active><Icons.Bold size={16} /></TbBtn>
    <TbBtn><Icons.Italic size={16} /></TbBtn>
    <TbBtn><Icons.Code size={16} /></TbBtn>
    <TbBtn><Icons.Link size={16} /></TbBtn>
    <span style={{ width: 1, height: 16, background: 'var(--border)', margin: '0 4px' }} />
    <TbBtn><Icons.Heading size={16} /></TbBtn>
    <TbBtn><Icons.Quote size={16} /></TbBtn>
    <TbBtn><Icons.List size={16} /></TbBtn>
    <TbBtn><Icons.Image size={16} /></TbBtn>
    <span style={{ width: 1, height: 16, background: 'var(--border)', margin: '0 4px' }} />
    <TbBtn><Icons.Component size={16} /><span style={{ fontWeight: 600, fontSize: 12.5, marginLeft: 4 }}>Component</span></TbBtn>
    <TbBtn><Icons.Palette size={16} /><span style={{ fontWeight: 600, fontSize: 12.5, marginLeft: 4 }}>Token</span></TbBtn>
    <div style={{ flex: 1 }} />
    <span style={{ fontSize: 12, color: 'var(--text-tertiary)', fontFamily: 'var(--f-mono)', marginRight: 8 }}>234 words · 6 min</span>
    <IconButton size="sm" variant="ghost"><Icons.MoreH size={16} /></IconButton>
  </div>
);

const TbBtn = ({ children, active }) => (
  <span style={{
    display: 'inline-flex', alignItems: 'center', gap: 2,
    padding: '6px 8px', borderRadius: 6, fontSize: 13,
    color: active ? 'var(--text)' : 'var(--text-secondary)',
    background: active ? 'var(--surface-2)' : 'transparent',
    fontWeight: 500, cursor: 'pointer',
  }}>{children}</span>
);

const SlashMenu = () => (
  <div style={{ position: 'relative', margin: '20px 0' }}>
    <div style={{
      padding: 10, fontSize: 16, color: 'var(--text-tertiary)',
      fontFamily: 'inherit', borderLeft: '2px solid var(--primary)',
      paddingLeft: 12, lineHeight: 1.7,
    }}>
      /<span style={{ color: 'var(--text)' }}>callout</span>
      <span style={{ display: 'inline-block', width: 1.5, height: 18, background: 'var(--primary)', verticalAlign: -3, marginLeft: 2, animation: 'none' }} />
    </div>
    <div style={{
      position: 'absolute', top: 'calc(100% + 4px)', left: 12,
      width: 280, background: 'var(--surface)', border: '1px solid var(--border)',
      borderRadius: 8, boxShadow: 'var(--shadow-pop)', overflow: 'hidden', zIndex: 2,
    }}>
      <div style={{ padding: '8px 12px', fontSize: 11, fontWeight: 700, color: 'var(--text-tertiary)', letterSpacing: '0.06em', textTransform: 'uppercase', borderBottom: '1px solid var(--border)' }}>Insert</div>
      {[
        ['Callout', 'Note, warning, or tip block', <Icons.AlertCircle size={16} />, true],
        ['Code', 'Highlighted multi-line snippet', <Icons.Code size={16} />, false],
        ['Component preview', 'Embed live component', <Icons.Component size={16} />, false],
        ['Token swatch', 'Embed token visualization', <Icons.Palette size={16} />, false],
        ['Do / Don\u2019t', 'Side-by-side examples', <Icons.CheckCircle size={16} />, false],
      ].map(([n, sub, ic, sel], i) => (
        <div key={i} style={{
          padding: '8px 12px', display: 'flex', alignItems: 'center', gap: 12,
          background: sel ? 'var(--primary-soft)' : 'transparent',
          color: sel ? 'var(--primary)' : 'var(--text)',
        }}>
          <span style={{ color: sel ? 'var(--primary)' : 'var(--text-tertiary)' }}>{ic}</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 600 }}>{n}</div>
            <div style={{ fontSize: 11.5, color: 'var(--text-tertiary)' }}>{sub}</div>
          </div>
          {sel && <Kbd>↵</Kbd>}
        </div>
      ))}
    </div>
  </div>
);

const DocTreeItem = ({ icon, name, count, open, indent = 0, active, draft }) => (
  <div style={{
    display: 'flex', alignItems: 'center', gap: 4,
    padding: `6px 8px 6px ${10 + indent * 16}px`,
    borderRadius: 6, fontSize: 13,
    color: active ? 'var(--primary)' : 'var(--text-secondary)',
    fontWeight: active ? 600 : 500,
    background: active ? 'var(--primary-soft)' : 'transparent',
  }}>
    {indent === 0 && <Icons.ChevronDown size={12} style={{ color: 'var(--text-tertiary)', transform: open ? 'none' : 'rotate(-90deg)' }} />}
    {icon}
    <span style={{ flex: 1 }}>{name}</span>
    {draft && <span style={{ width: 6, height: 6, borderRadius: 999, background: 'var(--warning)' }} />}
    {count != null && <span style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>{count}</span>}
  </div>
);

const OutlineItem = ({ level, text, active }) => (
  <div style={{
    padding: `4px 8px 4px ${(level - 1) * 12 + 8}px`,
    borderLeft: `2px solid ${active ? 'var(--primary)' : 'transparent'}`,
    marginLeft: -2,
    color: active ? 'var(--primary)' : 'var(--text-secondary)',
    fontWeight: active ? 600 : 500,
  }}>{text}</div>
);

const Select = ({ value }) => (
  <div style={{ display: 'flex', alignItems: 'center', padding: '0 10px', height: 32, border: '1px solid var(--border)', borderRadius: 6, background: 'var(--surface)', fontSize: 13 }}>
    <span style={{ flex: 1 }}>{value}</span>
    <Icons.ChevronDown size={13} style={{ color: 'var(--text-tertiary)' }} />
  </div>
);

window.AdminDocsEditor = AdminDocsEditor;
