// ============================================================
// ADMIN — Components list/grid
// ============================================================

const AdminComponents = () => (
  <div className="ds ds-light ds-screen" data-screen-label="Admin · Components">
    <div style={{ display: 'flex', height: '100%' }}>
      <AdminSidebar active="components" />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <AdminHeader
          title="Components"
          crumbs={['Workspace']}
          actions={<>
            <Button variant="secondary" size="sm" icon={<Icons.Upload size={14} />}>Import</Button>
            <Button size="sm" icon={<Icons.Plus size={14} />}>New component</Button>
          </>}
        />
        <main style={{ flex: 1, overflow: 'auto', padding: 28, background: 'var(--bg)' }}>
          {/* Toolbar */}
          <div style={{
            display: 'flex', gap: 8, alignItems: 'center',
            background: 'var(--surface)', border: '1px solid var(--border)',
            borderRadius: 'var(--r-card)', padding: 10, marginBottom: 16,
            boxShadow: 'var(--shadow-card)',
          }}>
            <div style={{ width: 280 }}>
              <Input size="sm" leading={<Icons.Search size={14} />} placeholder="Search 48 components…" />
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              <FilterChip label="Status" value="All · 48" />
              <FilterChip label="Tag" value="Any" />
              <FilterChip label="Maintainer" value="Any" />
              <FilterChip label="Updated" value="Last 30d" />
            </div>
            <div style={{ flex: 1 }} />
            <span style={{ fontSize: 12, color: 'var(--text-tertiary)', marginRight: 4 }}>Sort: Recent</span>
            <Divider vertical style={{ height: 20 }} />
            <Segmented2 options={['Grid', 'List']} active="Grid" />
          </div>

          {/* Status tabs */}
          <div style={{ display: 'flex', gap: 24, borderBottom: '1px solid var(--border)', marginBottom: 20 }}>
            {[
              ['All', 48, true], ['Approved', 34, false], ['Draft', 12, false],
              ['Deprecated', 2, false], ['Archived', 6, false],
            ].map(([n, c, a], i) => (
              <span key={i} style={{
                padding: '12px 0', fontSize: 13.5, fontWeight: a ? 600 : 500,
                color: a ? 'var(--text)' : 'var(--text-secondary)',
                borderBottom: a ? '2px solid var(--primary)' : '2px solid transparent',
                marginBottom: -1, display: 'inline-flex', alignItems: 'center', gap: 6,
              }}>
                {n}
                <span style={{ fontSize: 11, color: 'var(--text-tertiary)', fontVariantNumeric: 'tabular-nums' }}>{c}</span>
              </span>
            ))}
          </div>

          {/* Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
            {COMPONENTS.map(c => <ComponentCard key={c.name} {...c} />)}
          </div>
        </main>
      </div>
    </div>
  </div>
);

const FilterChip = ({ label, value }) => (
  <span style={{
    display: 'inline-flex', alignItems: 'center', gap: 6,
    padding: '6px 10px', background: 'var(--surface-2)',
    borderRadius: 6, fontSize: 12.5, fontWeight: 500,
  }}>
    <span style={{ color: 'var(--text-tertiary)' }}>{label}:</span>
    <span style={{ color: 'var(--text)', fontWeight: 600 }}>{value}</span>
    <Icons.ChevronDown size={12} style={{ color: 'var(--text-tertiary)' }} />
  </span>
);

const COMPONENTS = [
  { name: 'Button', status: 'approved', tags: ['inputs', 'action'], v: '1.4.0', who: 'Jay', updated: '2d', glyph: 'btn' },
  { name: 'Input', status: 'approved', tags: ['inputs', 'form'], v: '1.2.1', who: 'Mira', updated: '4d', glyph: 'input' },
  { name: 'Select', status: 'approved', tags: ['inputs', 'form'], v: '1.1.0', who: 'Mira', updated: '1w', glyph: 'select' },
  { name: 'Checkbox', status: 'approved', tags: ['inputs', 'form'], v: '1.0.4', who: 'Sun', updated: '2w', glyph: 'check' },
  { name: 'Switch', status: 'approved', tags: ['inputs'], v: '1.0.2', who: 'Eli', updated: '3w', glyph: 'switch' },
  { name: 'Textarea', status: 'approved', tags: ['inputs', 'form'], v: '1.0.1', who: 'Jay', updated: '1mo', glyph: 'area' },
  { name: 'Badge', status: 'approved', tags: ['display'], v: '1.1.0', who: 'Sun', updated: '5d', glyph: 'badge' },
  { name: 'Card', status: 'approved', tags: ['display', 'layout'], v: '1.0.6', who: 'Eli', updated: '2w', glyph: 'card' },
  { name: 'Table', status: 'approved', tags: ['display', 'data'], v: '1.2.0', who: 'Mira', updated: '6d', glyph: 'table' },
  { name: 'Tooltip', status: 'approved', tags: ['overlay'], v: '1.0.3', who: 'Jay', updated: '2w', glyph: 'tip' },
  { name: 'Modal', status: 'approved', tags: ['overlay'], v: '1.1.4', who: 'Mira', updated: '1w', glyph: 'modal' },
  { name: 'Toast', status: 'draft', tags: ['overlay', 'feedback'], v: '0.9.0', who: 'Eli', updated: 'today', glyph: 'toast' },
  { name: 'Drawer', status: 'draft', tags: ['overlay'], v: '1.1.0-rc.1', who: 'Sun', updated: '1d', glyph: 'drawer' },
  { name: 'Popover', status: 'approved', tags: ['overlay'], v: '1.0.5', who: 'Jay', updated: '3w', glyph: 'pop' },
  { name: 'Tabs', status: 'approved', tags: ['nav'], v: '1.2.0', who: 'Mira', updated: '4d', glyph: 'tabs' },
  { name: 'Accordion', status: 'approved', tags: ['display'], v: '1.0.0', who: 'Eli', updated: '2mo', glyph: 'accord' },
  { name: 'OldDropdown', status: 'deprecated', tags: ['nav'], v: '0.8.0', who: 'Mira', updated: '1d', glyph: 'drop' },
  { name: 'Avatar', status: 'approved', tags: ['display'], v: '1.1.0', who: 'Sun', updated: '1w', glyph: 'avatar' },
  { name: 'Breadcrumb', status: 'approved', tags: ['nav'], v: '1.0.0', who: 'Jay', updated: '1mo', glyph: 'crumb' },
  { name: 'Pagination', status: 'approved', tags: ['nav'], v: '1.0.0', who: 'Mira', updated: '6w', glyph: 'page' },
];

const tones = { approved: 'success', draft: 'warning', deprecated: 'neutral' };

const ComponentCard = ({ name, status, tags, v, who, updated, glyph }) => (
  <Card padded={false} style={{ cursor: 'pointer', overflow: 'hidden' }}>
    <div style={{
      height: 132, background: status === 'deprecated' ? 'var(--surface-2)' : 'var(--bg)',
      borderBottom: '1px solid var(--border)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      position: 'relative',
      backgroundImage: 'radial-gradient(circle at 1px 1px, var(--border) 1px, transparent 1px)',
      backgroundSize: '16px 16px',
      opacity: status === 'deprecated' ? 0.6 : 1,
    }}>
      <Glyph kind={glyph} />
      <Badge tone={tones[status]} dot style={{ position: 'absolute', top: 10, right: 10 }}>{status}</Badge>
    </div>
    <div style={{ padding: '14px 16px' }}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 6 }}>
        <div style={{ fontWeight: 600, fontSize: 14.5 }}>{name}</div>
        <div style={{ fontFamily: 'var(--f-mono)', fontSize: 11, color: 'var(--text-tertiary)' }}>{v}</div>
      </div>
      <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginBottom: 12 }}>
        {tags.map(t => <span key={t} style={{ fontSize: 10.5, fontFamily: 'var(--f-mono)', color: 'var(--text-tertiary)' }}>#{t}</span>)}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <Avatar name={who} size={20} />
        <span style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>{who} · {updated}</span>
      </div>
    </div>
  </Card>
);

// Tiny diagrammatic glyphs for component thumbnails
const Glyph = ({ kind }) => {
  const wrap = { display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' };
  if (kind === 'btn') return <div style={wrap}><Button size="sm">Continue</Button></div>;
  if (kind === 'input') return <div style={wrap}><div style={{ width: 140, height: 30, border: '1px solid var(--border)', borderRadius: 6, background: 'var(--surface)', padding: '0 10px', fontSize: 12, color: 'var(--text-tertiary)', display: 'flex', alignItems: 'center' }}>Type to search</div></div>;
  if (kind === 'select') return <div style={wrap}><div style={{ width: 130, height: 30, border: '1px solid var(--border)', borderRadius: 6, background: 'var(--surface)', padding: '0 10px', fontSize: 12, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>Option <Icons.ChevronDown size={12} /></div></div>;
  if (kind === 'check') return <div style={{ ...wrap, gap: 6 }}>
    <div style={{ width: 16, height: 16, borderRadius: 4, background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}><Icons.Check size={11} /></div>
    <span style={{ fontSize: 12, color: 'var(--text)', fontWeight: 500 }}>Remember me</span>
  </div>;
  if (kind === 'switch') return <div style={wrap}><div style={{ width: 38, height: 22, background: 'var(--primary)', borderRadius: 999, position: 'relative' }}><div style={{ position: 'absolute', right: 2, top: 2, width: 18, height: 18, borderRadius: 999, background: 'white' }} /></div></div>;
  if (kind === 'area') return <div style={wrap}><div style={{ width: 130, height: 60, border: '1px solid var(--border)', borderRadius: 6, background: 'var(--surface)', padding: 8, fontSize: 11, color: 'var(--text-tertiary)', lineHeight: 1.4 }}>Your feedback…</div></div>;
  if (kind === 'badge') return <div style={{ ...wrap, gap: 6 }}>
    <Badge tone="primary">v2</Badge><Badge tone="success" dot>live</Badge><Badge tone="warning">beta</Badge>
  </div>;
  if (kind === 'card') return <div style={wrap}><div style={{ width: 120, height: 64, border: '1px solid var(--border)', borderRadius: 8, background: 'var(--surface)', padding: 10, fontSize: 11, fontWeight: 600 }}>Title<div style={{ fontWeight: 400, color: 'var(--text-tertiary)', marginTop: 4, fontSize: 10 }}>Subtitle line</div></div></div>;
  if (kind === 'table') return <div style={wrap}><div style={{ width: 130, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 4 }}>
    {[0,1,2].map(i=><div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', borderBottom: i<2?'1px solid var(--border)':'none', fontSize: 9, padding: '4px 6px', color: i===0?'var(--text-secondary)':'var(--text)', fontWeight: i===0?600:400 }}>
      <span>{i===0?'name':'Item '+(i)}</span><span>{i===0?'role':'admin'}</span><span>{i===0?'·':'✓'}</span></div>)}
  </div></div>;
  if (kind === 'tip') return <div style={wrap}><div style={{ background: 'var(--text)', color: 'white', padding: '5px 9px', borderRadius: 4, fontSize: 11, fontWeight: 500 }}>Hello!</div></div>;
  if (kind === 'modal') return <div style={wrap}><div style={{ width: 130, height: 70, border: '1px solid var(--border)', borderRadius: 8, background: 'var(--surface)', boxShadow: 'var(--shadow-elev)', padding: 10, fontSize: 11 }}>
    <div style={{ fontWeight: 600, marginBottom: 2 }}>Confirm</div>
    <div style={{ color: 'var(--text-tertiary)', fontSize: 9.5, lineHeight: 1.3 }}>This will delete…</div>
  </div></div>;
  if (kind === 'toast') return <div style={wrap}><div style={{ display: 'flex', gap: 8, alignItems: 'center', width: 150, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8, padding: 8, boxShadow: 'var(--shadow-elev)' }}>
    <div style={{ width: 6, height: 6, borderRadius: 999, background: 'var(--success)' }}/>
    <div style={{ flex: 1 }}>
      <div style={{ fontSize: 11, fontWeight: 600 }}>Saved</div>
      <div style={{ fontSize: 9.5, color: 'var(--text-tertiary)' }}>Changes published</div>
    </div></div></div>;
  if (kind === 'drawer') return <div style={wrap}><div style={{ width: 100, height: 80, border: '1px solid var(--border)', borderLeft: '3px solid var(--primary)', borderRadius: 4, background: 'var(--surface)', padding: 8 }}><div style={{ width: '60%', height: 6, background: 'var(--surface-3)', borderRadius: 2, marginBottom: 6 }} /><div style={{ width: '80%', height: 4, background: 'var(--surface-2)', borderRadius: 2, marginBottom: 4 }} /><div style={{ width: '40%', height: 4, background: 'var(--surface-2)', borderRadius: 2 }} /></div></div>;
  if (kind === 'pop') return <div style={wrap}><div style={{ position: 'relative' }}><div style={{ width: 130, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 6, padding: 8, fontSize: 11, boxShadow: 'var(--shadow-elev)' }}>Set status<div style={{ marginTop: 4, fontSize: 10, color: 'var(--text-tertiary)' }}>Approve · Decline</div></div></div></div>;
  if (kind === 'tabs') return <div style={wrap}><div style={{ display: 'flex', gap: 14, borderBottom: '1px solid var(--border)', paddingBottom: 4, fontSize: 11.5 }}>
    <span style={{ color: 'var(--primary)', borderBottom: '2px solid var(--primary)', paddingBottom: 4, fontWeight: 600 }}>Active</span>
    <span style={{ color: 'var(--text-tertiary)' }}>Settings</span>
    <span style={{ color: 'var(--text-tertiary)' }}>Members</span>
  </div></div>;
  if (kind === 'accord') return <div style={wrap}><div style={{ width: 130 }}>
    {['Section A','Section B'].map((s,i)=><div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 8px', border: '1px solid var(--border)', borderBottom: i===0?'none':'1px solid var(--border)', borderRadius: i===0?'4px 4px 0 0':'0 0 4px 4px', fontSize: 11, fontWeight: 500 }}>{s}<Icons.ChevronDown size={11} /></div>)}
  </div></div>;
  if (kind === 'drop') return <div style={{ ...wrap, opacity: 0.7 }}><div style={{ width: 110, padding: 6, border: '1px solid var(--border)', borderRadius: 6, background: 'var(--surface)', fontSize: 11, display: 'flex', justifyContent: 'space-between' }}><span>Choose…</span><Icons.ChevronDown size={11} /></div></div>;
  if (kind === 'avatar') return <div style={{ ...wrap, display: 'flex' }}>{['Mira','Jay','Sun','Eli'].map((n,i)=><div key={i} style={{ marginLeft: i?-6:0 }}><Avatar name={n} size={26} style={{ border: '2px solid var(--bg)' }}/></div>)}</div>;
  if (kind === 'crumb') return <div style={{ ...wrap, fontSize: 11, color: 'var(--text-tertiary)', gap: 6, display: 'flex', alignItems: 'center' }}>Home <Icons.ChevronRight size={10} /> Workspace <Icons.ChevronRight size={10} /> <span style={{ color: 'var(--text)', fontWeight: 600 }}>Settings</span></div>;
  if (kind === 'page') return <div style={{ ...wrap, gap: 4, display: 'flex' }}>{[1,2,3].map(n=><div key={n} style={{ width: 22, height: 22, borderRadius: 4, border: '1px solid var(--border)', background: n===1?'var(--primary)':'transparent', color: n===1?'white':'var(--text)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 600 }}>{n}</div>)}</div>;
  return null;
};

Object.assign(window, { AdminComponents, FilterChip, COMPONENTS, ComponentCard, Glyph });
