// ============================================================
// ADMIN — Dashboard
// 1440 × 900
// ============================================================

const AdminDashboard = () => (
  <div className="ds ds-light ds-screen" data-screen-label="Admin · Dashboard">
    <div style={{ display: 'flex', height: '100%' }}>
      <AdminSidebar active="dashboard" />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <AdminHeader
          title="Welcome back, Mira"
          crumbs={['Workspace']}
          actions={<>
            <Button variant="secondary" size="sm" icon={<Icons.Download size={14} />}>Export</Button>
            <Button size="sm" icon={<Icons.Plus size={14} />}>New component</Button>
          </>}
        />
        <main style={{ flex: 1, overflow: 'auto', padding: 28, background: 'var(--bg)' }}>
          {/* Stat cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
            <StatCard label="Components" value="48" delta="+3" deltaTone="success" sub="this week" icon={<Icons.Component size={18} />} />
            <StatCard label="Tokens" value="218" delta="+12" deltaTone="success" sub="this week" icon={<Icons.Palette size={18} />} />
            <StatCard label="Published pages" value="32" delta="2 drafts" deltaTone="warning" sub="pending review" icon={<Icons.FileText size={18} />} />
            <StatCard label="Active contributors" value="9" delta="3 online" deltaTone="info" sub="now" icon={<Icons.Users size={18} />} />
          </div>

          {/* Two-column */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: 16 }}>
            {/* Recent activity */}
            <Card padded={false}>
              <CardHeader title="Recent activity" sub="Last 7 days · 26 changes" trailing={
                <div style={{ display: 'flex', gap: 6 }}>
                  <Segmented2 options={['All', 'Components', 'Tokens', 'Docs']} active="All" />
                </div>
              } />
              <div>
                <Activity
                  who="Jay Patel" what="updated"
                  target="Button"
                  kind="component" time="12m ago"
                  detail="Added variant=&quot;soft&quot;, refined focus ring"
                  status="approved"
                />
                <Activity
                  who="Sun Park" what="created"
                  target="color.gold.200"
                  kind="token" time="44m ago"
                  detail="New shade for warning tints"
                  status="draft"
                />
                <Activity
                  who="Eli Wright" what="published"
                  target="Writing for buttons"
                  kind="docs" time="2h ago"
                  detail="6 min read · 4 do/don't examples"
                  status="approved"
                />
                <Activity
                  who="Mira Quinn" what="deprecated"
                  target="OldDropdown"
                  kind="component" time="Yesterday"
                  detail="Migration guide attached → use Select instead"
                  status="deprecated"
                />
                <Activity
                  who="Jay Patel" what="invited"
                  target="taylor@acme.co"
                  kind="user" time="Yesterday"
                  detail="Role: Editor"
                  status=""
                />
              </div>
              <div style={{
                padding: '12px 20px', borderTop: '1px solid var(--border)',
                fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              }}>
                <span>Showing 5 of 26</span>
                <span style={{ color: 'var(--primary)', fontWeight: 600 }}>View activity log →</span>
              </div>
            </Card>

            {/* Adoption chart */}
            <Card padded={false}>
              <CardHeader title="Component adoption" sub="Pageviews · last 30 days" />
              <div style={{ padding: 20 }}>
                <BarList items={[
                  ['Button', 1342, 1, 'approved'],
                  ['Input', 982, 0.73, 'approved'],
                  ['Card', 712, 0.53, 'approved'],
                  ['Badge', 504, 0.38, 'approved'],
                  ['Modal', 401, 0.30, 'approved'],
                  ['Avatar', 318, 0.24, 'approved'],
                  ['Toast', 188, 0.14, 'draft'],
                ]} />
              </div>
            </Card>
          </div>

          {/* Bottom row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 16 }}>
            <Card padded={false}>
              <CardHeader title="Needs review" sub="3 pending" trailing={<Badge tone="warning" dot>3</Badge>} />
              <ReviewItem name="Toast" v="0.9.0-rc.1" who="Jay Patel" days={2} />
              <ReviewItem name="Drawer" v="1.1.0" who="Eli Wright" days={1} />
              <ReviewItem name="color.danger.100" v="—" who="Sun Park" days={0} kind="token" />
            </Card>

            <Card padded={false}>
              <CardHeader title="Quick actions" />
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 0 }}>
                <QuickAction icon={<Icons.Component size={18} />} title="New component" />
                <QuickAction icon={<Icons.Palette size={18} />} title="New token" />
                <QuickAction icon={<Icons.FileText size={18} />} title="New doc page" />
                <QuickAction icon={<Icons.Upload size={18} />} title="Import tokens" />
                <QuickAction icon={<Icons.Mail size={18} />} title="Invite teammate" />
                <QuickAction icon={<Icons.Download size={18} />} title="Backup export" />
              </div>
            </Card>
          </div>
        </main>
      </div>
    </div>
  </div>
);

const StatCard = ({ label, value, delta, deltaTone, sub, icon }) => (
  <Card>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
      <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)' }}>{label}</span>
      <span style={{
        width: 32, height: 32, borderRadius: 8,
        background: 'var(--surface-2)', color: 'var(--text-secondary)',
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      }}>{icon}</span>
    </div>
    <div style={{ fontFamily: 'var(--f-display)', fontWeight: 800, fontSize: 32, letterSpacing: '-0.02em', lineHeight: 1, marginBottom: 8 }}>{value}</div>
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12 }}>
      <Badge tone={deltaTone} style={{ fontSize: 11, padding: '2px 6px' }}>{delta}</Badge>
      <span style={{ color: 'var(--text-tertiary)' }}>{sub}</span>
    </div>
  </Card>
);

const CardHeader = ({ title, sub, trailing }) => (
  <div style={{
    padding: '16px 20px', borderBottom: '1px solid var(--border)',
    display: 'flex', alignItems: 'center', gap: 12,
  }}>
    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={{ fontWeight: 600, fontSize: 15 }}>{title}</div>
      {sub && <div style={{ fontSize: 12.5, color: 'var(--text-tertiary)', marginTop: 2 }}>{sub}</div>}
    </div>
    {trailing}
  </div>
);

const Segmented2 = ({ options, active }) => (
  <div style={{ display: 'flex', background: 'var(--surface-2)', borderRadius: 6, padding: 2, gap: 2 }}>
    {options.map(o => (
      <span key={o} style={{
        padding: '4px 10px', fontSize: 12, fontWeight: 600,
        background: o === active ? 'var(--surface)' : 'transparent',
        color: o === active ? 'var(--text)' : 'var(--text-secondary)',
        borderRadius: 4, boxShadow: o === active ? 'var(--shadow-card)' : 'none',
      }}>{o}</span>
    ))}
  </div>
);

const Activity = ({ who, what, target, kind, time, detail, status }) => {
  const kindIcon = {
    component: <Icons.Component size={14} />,
    token: <Icons.Palette size={14} />,
    docs: <Icons.FileText size={14} />,
    user: <Icons.User size={14} />,
  }[kind];
  const statusTone = { approved: 'success', draft: 'warning', deprecated: 'neutral' };
  return (
    <div style={{
      padding: '14px 20px', borderBottom: '1px solid var(--border)',
      display: 'flex', alignItems: 'center', gap: 12,
    }}>
      <Avatar name={who} size={32} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13.5, lineHeight: 1.4 }}>
          <span style={{ fontWeight: 600 }}>{who}</span>
          <span style={{ color: 'var(--text-secondary)' }}> {what} </span>
          <span style={{
            fontFamily: kind === 'token' ? 'var(--f-mono)' : 'inherit',
            fontWeight: 600, color: 'var(--primary)',
            display: 'inline-flex', alignItems: 'center', gap: 4,
            verticalAlign: 'baseline',
          }}>
            <span style={{ color: 'var(--text-tertiary)' }}>{kindIcon}</span>
            {target}
          </span>
        </div>
        <div style={{ fontSize: 12.5, color: 'var(--text-tertiary)', marginTop: 2 }}>{detail}</div>
      </div>
      {status && <Badge tone={statusTone[status]} dot>{status}</Badge>}
      <span style={{ fontSize: 12, color: 'var(--text-tertiary)', minWidth: 70, textAlign: 'right' }}>{time}</span>
    </div>
  );
};

const BarList = ({ items }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
    {items.map(([name, count, ratio, status]) => (
      <div key={name}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4, fontSize: 13 }}>
          <span style={{ fontWeight: 600 }}>{name} {status === 'draft' && <Badge tone="warning" style={{ marginLeft: 6, fontSize: 10, padding: '1px 5px' }}>draft</Badge>}</span>
          <span style={{ fontFamily: 'var(--f-mono)', fontWeight: 500, fontVariantNumeric: 'tabular-nums', color: 'var(--text-secondary)' }}>{count.toLocaleString()}</span>
        </div>
        <div style={{ height: 6, background: 'var(--surface-2)', borderRadius: 999, overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${ratio * 100}%`, background: status === 'draft' ? 'var(--warning)' : 'var(--primary)', borderRadius: 999 }} />
        </div>
      </div>
    ))}
  </div>
);

const ReviewItem = ({ name, v, who, days, kind = 'component' }) => (
  <div style={{
    padding: '14px 20px', borderBottom: '1px solid var(--border)',
    display: 'flex', alignItems: 'center', gap: 12,
  }}>
    <div style={{
      width: 36, height: 36, borderRadius: 8, background: 'var(--surface-2)',
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)',
    }}>{kind === 'token' ? <Icons.Palette size={18} /> : <Icons.Component size={18} />}</div>
    <div style={{ flex: 1 }}>
      <div style={{ fontSize: 13.5, fontWeight: 600, fontFamily: kind === 'token' ? 'var(--f-mono)' : 'inherit' }}>{name}</div>
      <div style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>{v} · by {who} · {days === 0 ? 'today' : `${days}d ago`}</div>
    </div>
    <Button variant="ghost" size="sm">Skip</Button>
    <Button size="sm">Review</Button>
  </div>
);

const QuickAction = ({ icon, title }) => (
  <div style={{
    padding: 18, borderRight: '1px solid var(--border)', borderBottom: '1px solid var(--border)',
    cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12,
  }}>
    <span style={{
      width: 36, height: 36, borderRadius: 8, background: 'var(--primary-soft)', color: 'var(--primary)',
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    }}>{icon}</span>
    <div style={{ fontSize: 13.5, fontWeight: 600 }}>{title}</div>
  </div>
);

Object.assign(window, { AdminDashboard, StatCard, CardHeader, Segmented2, Activity, BarList, ReviewItem, QuickAction });
