// ============================================================
// ADMIN — Visibility & Access
// Workspace-level view of which pages are visible to whom,
// + per-audience comment permissions.
// 1440 × 1100
// ============================================================
//
// Audience model:
//   public  · world-readable, no login         (globe)
//   team    · signed-in members only           (people)
//   admin   · admins only                      (shield)
//
// Each content item has ONE visibility level. Comments are a separate
// per-audience toggle (read access doesn't imply comment access).

// ----- Shared chip + picker (used across the admin app) -----------
const AUDIENCES = {
  public: { label: 'Public',  short: 'Public', icon: <Icons.Globe size={11} />,  color: '#1F8A5B', soft: '#E1F3EA', desc: 'World-readable, no login required.' },
  team:   { label: 'Team',    short: 'Team',   icon: <Icons.Users size={11} />,  color: '#2A6FDB', soft: '#E2EBFA', desc: 'Visible to signed-in workspace members.' },
  admin:  { label: 'Admin',   short: 'Admin',  icon: <Icons.Shield size={11} />, color: '#8A311F', soft: '#FBE0D6', desc: 'Visible to admins only.' },
};

const AudienceChip = ({ level = 'public', size = 'sm', style }) => {
  const a = AUDIENCES[level];
  const dims = size === 'lg'
    ? { p: '4px 10px', fs: 12.5, gap: 6 }
    : { p: '2px 7px', fs: 11, gap: 4 };
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: dims.gap,
      padding: dims.p, borderRadius: 'var(--r-input)',
      background: a.soft, color: a.color,
      fontSize: dims.fs, fontWeight: 600,
      ...style,
    }}>
      {a.icon}{a.label}
    </span>
  );
};

const AudiencePicker = ({ value = 'team', dense }) => (
  <div style={{
    display: 'inline-flex', padding: 2, gap: 2,
    background: 'var(--surface-2)', borderRadius: 'var(--r-input)',
  }}>
    {['public', 'team', 'admin'].map(k => {
      const a = AUDIENCES[k];
      const on = value === k;
      return (
        <span key={k} style={{
          display: 'inline-flex', alignItems: 'center', gap: dense ? 4 : 6,
          padding: dense ? '4px 8px' : '6px 11px',
          borderRadius: 4, fontSize: dense ? 12 : 12.5, fontWeight: 600,
          color: on ? a.color : 'var(--text-secondary)',
          background: on ? 'var(--surface)' : 'transparent',
          boxShadow: on ? 'var(--shadow-card)' : 'none',
        }}>
          <span style={{ color: on ? a.color : 'var(--text-tertiary)' }}>
            {React.cloneElement(a.icon, { size: dense ? 11 : 12 })}
          </span>
          {a.label}
        </span>
      );
    })}
  </div>
);

// ----- Main screen -----------------------------------------------
const AdminVisibility = () => (
  <div className="ds ds-light ds-screen" data-screen-label="Admin · Visibility">
    <div style={{ display: 'flex', height: '100%' }}>
      <AdminSidebar active="visibility" />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <AdminHeader
          title="Visibility & access"
          crumbs={['Workspace']}
          actions={<>
            <Button variant="secondary" size="sm" icon={<Icons.Download size={14} />}>Export audit</Button>
            <Button size="sm" icon={<Icons.Check size={14} />}>Save changes</Button>
          </>}
        />

        <main style={{ flex: 1, overflow: 'auto', padding: 28, background: 'var(--bg)' }}>
          {/* Audience legend & top-line numbers */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 24 }}>
            <AudienceCard
              level="public" count="58"
              detail="32 docs · 22 components · 4 token groups"
              desc="The world reads these. Indexed by search engines."
            />
            <AudienceCard
              level="team" count="34"
              detail="14 docs · 18 components · 2 token groups"
              desc="Signed-in members of Lumen. Drafts and in-progress work."
            />
            <AudienceCard
              level="admin" count="12"
              detail="3 docs · 0 components · 9 settings pages"
              desc="Admins only. Roles, billing, dangerous actions."
            />
          </div>

          {/* Defaults / comments — two cards side by side */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: 16, marginBottom: 24 }}>
            {/* Defaults */}
            <Card padded={false}>
              <CardHeader
                title="Default visibility"
                sub="Where new content starts out. Authors can change per item."
              />
              <div style={{ padding: '14px 20px 18px' }}>
                <DefaultRow icon={<Icons.Component size={14} />} label="New components" value="team" />
                <DefaultRow icon={<Icons.Palette size={14} />} label="New tokens" value="team" />
                <DefaultRow icon={<Icons.FileText size={14} />} label="New doc pages" value="team" />
                <DefaultRow icon={<Icons.Layers size={14} />} label="New patterns" value="team" />
                <DefaultRow icon={<Icons.Sliders size={14} />} label="Foundations" value="public" />
              </div>
            </Card>

            {/* Comments — per audience */}
            <Card padded={false}>
              <CardHeader
                title="Comments on pages"
                sub="Independent of read access. Off for an audience = no comment UI for them."
                trailing={<Badge tone="primary" dot>workspace</Badge>}
              />
              <div style={{ padding: '0 0 14px' }}>
                <CommentRow
                  level="public"
                  on
                  detail="Visitors must enter name + email. Held for moderation."
                  modSetting="Hold for moderation"
                />
                <CommentRow
                  level="team"
                  on
                  detail="All workspace members. Posts immediately. Notifies authors."
                  modSetting="Auto-publish"
                />
                <CommentRow
                  level="admin"
                  on
                  detail="Internal-only thread. Always on."
                  modSetting="Always on"
                  locked
                />
              </div>
              <div style={{
                borderTop: '1px solid var(--border)', padding: '12px 20px',
                fontSize: 12, color: 'var(--text-tertiary)',
                display: 'flex', alignItems: 'center', gap: 8,
              }}>
                <Icons.AlertCircle size={13} />
                <span style={{ flex: 1 }}>
                  Page authors can override the workspace setting per page.
                </span>
                <span style={{ color: 'var(--primary)', fontWeight: 600 }}>Manage moderation queue →</span>
              </div>
            </Card>
          </div>

          {/* The matrix */}
          <Card padded={false} style={{ marginBottom: 0 }}>
            <div style={{
              padding: '14px 20px', borderBottom: '1px solid var(--border)',
              display: 'flex', alignItems: 'center', gap: 12,
            }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 16 }}>Pages &amp; audience</div>
                <div style={{ fontSize: 12.5, color: 'var(--text-tertiary)', marginTop: 2 }}>
                  Every page in the workspace, who sees it, who can comment.
                </div>
              </div>
              <div style={{ width: 260 }}>
                <Input size="sm" leading={<Icons.Search size={14} />} placeholder="Filter pages…" />
              </div>
              <FilterChip label="Type" value="All" />
              <FilterChip label="Audience" value="Any" />
              <Segmented2 options={['Tree', 'Flat']} active="Flat" />
            </div>

            {/* Header row */}
            <div style={{
              display: 'grid', gridTemplateColumns: '1fr 110px 110px 110px 120px 100px 36px',
              padding: '10px 20px', background: 'var(--surface-2)',
              fontSize: 11, fontWeight: 700, color: 'var(--text-tertiary)',
              letterSpacing: '0.06em', textTransform: 'uppercase',
              borderBottom: '1px solid var(--border)',
              alignItems: 'center', gap: 10,
            }}>
              <span>Page</span>
              <span style={{ textAlign: 'center' }}>Public</span>
              <span style={{ textAlign: 'center' }}>Team</span>
              <span style={{ textAlign: 'center' }}>Admin</span>
              <span>Comments</span>
              <span>Updated</span>
              <span />
            </div>

            {MATRIX.map((row, i) => (
              <MatrixRow key={i} {...row} last={i === MATRIX.length - 1} />
            ))}

            {/* Footer */}
            <div style={{
              padding: '12px 20px', borderTop: '1px solid var(--border)',
              display: 'flex', alignItems: 'center', gap: 12,
              fontSize: 12.5, color: 'var(--text-secondary)',
              background: 'var(--bg-elevated)',
            }}>
              <span>Showing 10 of 104</span>
              <div style={{ flex: 1 }} />
              <span style={{ color: 'var(--text-tertiary)' }}>
                <span style={{ fontWeight: 700, color: 'var(--text)' }}>3</span> rows unsaved
              </span>
              <Button variant="ghost" size="sm">Discard</Button>
              <Button size="sm" icon={<Icons.Check size={14} />}>Apply</Button>
            </div>
          </Card>
        </main>
      </div>
    </div>
  </div>
);

// ----- Audience summary card (top of page) ------------------------
const AudienceCard = ({ level, count, detail, desc }) => {
  const a = AUDIENCES[level];
  return (
    <Card padded={false} style={{ overflow: 'hidden' }}>
      <div style={{
        padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 10,
        background: a.soft, borderBottom: `1px solid ${a.color}22`,
        color: a.color,
      }}>
        <span style={{
          width: 28, height: 28, borderRadius: 7, background: 'rgba(255,255,255,0.6)',
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        }}>
          {React.cloneElement(a.icon, { size: 14 })}
        </span>
        <span style={{ fontFamily: 'var(--f-display)', fontWeight: 700, fontSize: 17, letterSpacing: '-0.01em' }}>{a.label}</span>
        <div style={{ flex: 1 }} />
        <span style={{
          fontFamily: 'var(--f-display)', fontWeight: 800, fontSize: 28,
          letterSpacing: '-0.02em', lineHeight: 1,
        }}>{count}</span>
        <span style={{ fontSize: 11, fontWeight: 600, opacity: 0.8, alignSelf: 'flex-end', marginBottom: 4 }}>pages</span>
      </div>
      <div style={{ padding: 18 }}>
        <div style={{ fontSize: 12.5, color: 'var(--text-secondary)', fontFamily: 'var(--f-mono)', marginBottom: 8 }}>{detail}</div>
        <div style={{ fontSize: 13, color: 'var(--text)', lineHeight: 1.5 }}>{desc}</div>
      </div>
    </Card>
  );
};

// ----- Default-visibility row -------------------------------------
const DefaultRow = ({ icon, label, value }) => (
  <div style={{
    display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0',
    borderTop: '1px solid var(--border)',
  }}>
    <span style={{ color: 'var(--text-tertiary)' }}>{icon}</span>
    <span style={{ fontSize: 13.5, fontWeight: 600, flex: 1 }}>{label}</span>
    <AudiencePicker value={value} dense />
  </div>
);

// ----- Comments per audience row ----------------------------------
const CommentRow = ({ level, on, detail, modSetting, locked }) => {
  const a = AUDIENCES[level];
  return (
    <div style={{
      padding: '14px 20px', borderTop: '1px solid var(--border)',
      display: 'flex', alignItems: 'center', gap: 12,
    }}>
      <span style={{
        width: 28, height: 28, borderRadius: 7,
        background: a.soft, color: a.color,
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      }}>
        {React.cloneElement(a.icon, { size: 14 })}
      </span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13.5, fontWeight: 600 }}>
          {a.label}
          {locked && <span style={{ marginLeft: 8, fontSize: 11, color: 'var(--text-tertiary)', fontWeight: 500, fontFamily: 'var(--f-mono)' }}>· locked</span>}
        </div>
        <div style={{ fontSize: 12, color: 'var(--text-tertiary)', marginTop: 2 }}>{detail}</div>
      </div>
      <span style={{ fontSize: 11.5, color: 'var(--text-secondary)', fontFamily: 'var(--f-mono)' }}>{modSetting}</span>
      <span style={{
        width: 38, height: 22,
        background: on ? (locked ? 'var(--text-tertiary)' : 'var(--primary)') : 'var(--border-strong)',
        borderRadius: 999, position: 'relative', flex: '0 0 auto',
        opacity: locked ? 0.7 : 1,
      }}>
        <span style={{
          position: 'absolute', [on ? 'right' : 'left']: 2, top: 2,
          width: 18, height: 18, borderRadius: 999, background: 'white',
          boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
        }} />
      </span>
    </div>
  );
};

// ----- Matrix row (one page) --------------------------------------
const MatrixRow = ({ kind, name, audience, comments, time, who, draft, indent = 0, last, unsaved }) => {
  const icons = {
    docs: <Icons.FileText size={14} />,
    component: <Icons.Component size={14} />,
    token: <Icons.Palette size={14} />,
    folder: <Icons.Folder size={14} />,
    settings: <Icons.Settings size={14} />,
  };
  return (
    <div style={{
      display: 'grid', gridTemplateColumns: '1fr 110px 110px 110px 120px 100px 36px',
      padding: '12px 20px', alignItems: 'center', gap: 10,
      borderBottom: last ? 'none' : '1px solid var(--border)',
      background: unsaved ? 'rgba(255,209,102,0.10)' : 'transparent',
      fontSize: 13,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, paddingLeft: indent * 18, minWidth: 0 }}>
        <span style={{ color: 'var(--text-tertiary)' }}>{icons[kind]}</span>
        <span style={{
          fontWeight: 600, fontFamily: kind === 'token' ? 'var(--f-mono)' : 'inherit',
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>{name}</span>
        {draft && <Badge tone="warning" style={{ fontSize: 10 }}>draft</Badge>}
        {unsaved && <Badge tone="primary" style={{ fontSize: 10 }}>edited</Badge>}
      </div>
      <RadioDot on={audience === 'public'} color={AUDIENCES.public.color} />
      <RadioDot on={audience === 'team'}   color={AUDIENCES.team.color} />
      <RadioDot on={audience === 'admin'}  color={AUDIENCES.admin.color} />
      <div style={{ display: 'flex', gap: 4 }}>
        {comments.map((c, i) => (
          <CommentDot key={i} level={c.level} on={c.on} />
        ))}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{time}</span>
        <span style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>{who}</span>
      </div>
      <Icons.MoreH size={15} style={{ color: 'var(--text-tertiary)', justifySelf: 'center' }} />
    </div>
  );
};

const RadioDot = ({ on, color }) => (
  <div style={{
    width: 20, height: 20, justifySelf: 'center',
    borderRadius: 999,
    background: on ? color : 'transparent',
    border: on ? `2px solid ${color}` : '2px solid var(--border-strong)',
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
  }}>
    {on && <Icons.Check size={11} style={{ color: 'white' }} />}
  </div>
);

const CommentDot = ({ level, on }) => {
  const a = AUDIENCES[level];
  return (
    <span title={`${a.label} · ${on ? 'enabled' : 'off'}`} style={{
      width: 20, height: 20, borderRadius: 5,
      background: on ? a.soft : 'transparent',
      border: on ? `1px solid ${a.color}33` : '1px solid var(--border)',
      color: on ? a.color : 'var(--text-tertiary)', opacity: on ? 1 : 0.4,
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    }}>
      {React.cloneElement(a.icon, { size: 10 })}
    </span>
  );
};

// ----- Demo data --------------------------------------------------
const MATRIX = [
  { kind: 'docs', name: 'Introduction', audience: 'public',
    comments: [{ level: 'public', on: true }, { level: 'team', on: true }, { level: 'admin', on: true }],
    time: '2d', who: 'Mira' },
  { kind: 'docs', name: 'Installation', audience: 'public',
    comments: [{ level: 'public', on: false }, { level: 'team', on: true }, { level: 'admin', on: true }],
    time: '1w', who: 'Jay' },
  { kind: 'component', name: 'Button', audience: 'public',
    comments: [{ level: 'public', on: true }, { level: 'team', on: true }, { level: 'admin', on: true }],
    time: '12m', who: 'Jay' },
  { kind: 'component', name: 'Toast', audience: 'team', draft: true,
    comments: [{ level: 'public', on: false }, { level: 'team', on: true }, { level: 'admin', on: true }],
    time: 'today', who: 'Eli' },
  { kind: 'component', name: 'BillingTable', audience: 'admin',
    comments: [{ level: 'public', on: false }, { level: 'team', on: false }, { level: 'admin', on: true }],
    time: '3d', who: 'Mira' },
  { kind: 'token', name: 'color.primary', audience: 'public',
    comments: [{ level: 'public', on: true }, { level: 'team', on: true }, { level: 'admin', on: true }],
    time: '2d', who: 'Sun' },
  { kind: 'token', name: 'color.gold', audience: 'team', draft: true, unsaved: true,
    comments: [{ level: 'public', on: false }, { level: 'team', on: true }, { level: 'admin', on: true }],
    time: '5m', who: 'Sun' },
  { kind: 'docs', name: 'Brand voice (internal)', audience: 'team', unsaved: true,
    comments: [{ level: 'public', on: false }, { level: 'team', on: true }, { level: 'admin', on: true }],
    time: '1d', who: 'Eli' },
  { kind: 'docs', name: 'Contributor playbook', audience: 'team',
    comments: [{ level: 'public', on: false }, { level: 'team', on: true }, { level: 'admin', on: true }],
    time: '6d', who: 'Mira' },
  { kind: 'settings', name: 'API keys', audience: 'admin', unsaved: true,
    comments: [{ level: 'public', on: false }, { level: 'team', on: false }, { level: 'admin', on: true }],
    time: '1h', who: 'Mira' },
];

// ----- Inline comment toggle row used in side rails ---------------
const CommentMiniRow = ({ level, on }) => {
  const a = AUDIENCES[level];
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12.5 }}>
      <span style={{
        width: 18, height: 18, borderRadius: 4, background: a.soft, color: a.color,
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flex: '0 0 auto',
      }}>
        {React.cloneElement(a.icon, { size: 10 })}
      </span>
      <span style={{ flex: 1, color: 'var(--text-secondary)' }}>{a.label} can comment</span>
      <span style={{
        width: 28, height: 16, borderRadius: 999,
        background: on ? 'var(--primary)' : 'var(--border-strong)',
        position: 'relative', flex: '0 0 auto',
      }}>
        <span style={{
          position: 'absolute', [on ? 'right' : 'left']: 2, top: 2,
          width: 12, height: 12, borderRadius: 999, background: 'white',
        }} />
      </span>
    </div>
  );
};

Object.assign(window, {
  AdminVisibility, AUDIENCES, AudienceChip, AudiencePicker,
  AudienceCard, DefaultRow, CommentRow, MatrixRow, CommentMiniRow,
});
