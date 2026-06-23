// ============================================================
// ADMIN — Users & Roles
// 1440 × 900
// ============================================================

const AdminUsers = () => (
  <div className="ds ds-light ds-screen" data-screen-label="Admin · Users">
    <div style={{ display: 'flex', height: '100%' }}>
      <AdminSidebar active="users" />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <AdminHeader
          title="Users & Roles"
          crumbs={['Workspace']}
          actions={<>
            <Button variant="secondary" size="sm" icon={<Icons.Mail size={14} />}>Invitation links</Button>
            <Button size="sm" icon={<Icons.Plus size={14} />}>Invite member</Button>
          </>}
        />
        <main style={{ flex: 1, overflow: 'auto', padding: 28, background: 'var(--bg)' }}>
          {/* Roles overview */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 24 }}>
            <RoleCard tone="primary" name="Admin" count="2" perms={['Manage workspace', 'Invite & remove users', 'Publish components', 'Edit tokens']} />
            <RoleCard tone="info" name="Editor" count="5" perms={['Draft components', 'Edit drafts', 'Comment on reviews', 'Read tokens']} />
            <RoleCard tone="neutral" name="Viewer" count="2" perms={['Read everything', 'Comment on pages', '—', '—']} />
          </div>

          {/* Toolbar */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: 12, background: 'var(--surface)',
            border: '1px solid var(--border)', borderRadius: 'var(--r-card)',
            boxShadow: 'var(--shadow-card)', marginBottom: 0,
            borderRadius: 'var(--r-card) var(--r-card) 0 0', borderBottom: 'none',
          }}>
            <div style={{ width: 280 }}>
              <Input size="sm" leading={<Icons.Search size={14} />} placeholder="Search 9 members…" />
            </div>
            <FilterChip label="Role" value="All" />
            <FilterChip label="Status" value="Active" />
            <div style={{ flex: 1 }} />
            <span style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>Sort: Last active</span>
          </div>

          {/* Members table */}
          <div style={{
            border: '1px solid var(--border)', borderRadius: '0 0 var(--r-card) var(--r-card)',
            background: 'var(--surface)', overflow: 'hidden',
          }}>
            <div style={{
              display: 'grid', gridTemplateColumns: '2fr 1.4fr 1fr 1fr 90px 40px',
              padding: '12px 20px', background: 'var(--surface-2)',
              fontSize: 11, fontWeight: 700, color: 'var(--text-tertiary)',
              letterSpacing: '0.06em', textTransform: 'uppercase',
              borderBottom: '1px solid var(--border)',
            }}>
              <span>Member</span><span>Role</span><span>Status</span><span>Last active</span><span>Joined</span><span></span>
            </div>
            {[
              ['Mira Quinn', 'mira@lumen.co', 'Admin', 'active', '5m ago', 'Jan 2025', true],
              ['Jay Patel', 'jay@lumen.co', 'Admin', 'active', '12m ago', 'Jan 2025'],
              ['Sun Park', 'sun@lumen.co', 'Editor', 'active', '1h ago', 'Mar 2025'],
              ['Eli Wright', 'eli@lumen.co', 'Editor', 'active', '2h ago', 'Apr 2025'],
              ['Avery Lin', 'avery@lumen.co', 'Editor', 'active', 'Yesterday', 'Jun 2025'],
              ['Reza Khan', 'reza@lumen.co', 'Editor', 'active', '3d ago', 'Jul 2025'],
              ['Cameron Sato', 'cam@lumen.co', 'Editor', 'invited', '—', 'Pending', false, 'invited'],
              ['Tomas Vega', 'tomas@lumen.co', 'Viewer', 'active', '1w ago', 'Sep 2025'],
              ['Hana Lee', 'hana@lumen.co', 'Viewer', 'active', '2w ago', 'Nov 2025'],
            ].map(([name, email, role, status, last, joined, isMe, special], i, arr) => (
              <div key={email} style={{
                display: 'grid', gridTemplateColumns: '2fr 1.4fr 1fr 1fr 90px 40px',
                padding: '14px 20px', alignItems: 'center',
                borderBottom: i < arr.length - 1 ? '1px solid var(--border)' : 'none',
                fontSize: 13.5,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <Avatar name={name} size={32} />
                  <div>
                    <div style={{ fontWeight: 600 }}>
                      {name}
                      {isMe && <span style={{ marginLeft: 6, fontSize: 11, color: 'var(--text-tertiary)', fontWeight: 500 }}>(you)</span>}
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>{email}</div>
                  </div>
                </div>
                <div>
                  <span style={{
                    display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 10px',
                    borderRadius: 'var(--r-input)', fontSize: 12.5, fontWeight: 600,
                    background: role === 'Admin' ? 'var(--primary-soft)' : role === 'Editor' ? 'var(--info-soft)' : 'var(--surface-2)',
                    color: role === 'Admin' ? 'var(--primary)' : role === 'Editor' ? 'var(--info)' : 'var(--text-secondary)',
                  }}>
                    {role} <Icons.ChevronDown size={12} />
                  </span>
                </div>
                <div>
                  {status === 'invited'
                    ? <Badge tone="warning" dot>invited</Badge>
                    : <Badge tone="success" dot>active</Badge>
                  }
                </div>
                <div style={{ color: 'var(--text-secondary)' }}>{last}</div>
                <div style={{ color: 'var(--text-tertiary)', fontSize: 12.5 }}>{joined}</div>
                <Icons.MoreH size={16} style={{ color: 'var(--text-tertiary)' }} />
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  </div>
);

const RoleCard = ({ tone, name, count, perms }) => (
  <Card style={{ padding: 20 }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
      <span style={{
        width: 32, height: 32, borderRadius: 8,
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        background: tone === 'primary' ? 'var(--primary-soft)' : tone === 'info' ? 'var(--info-soft)' : 'var(--surface-2)',
        color: tone === 'primary' ? 'var(--primary)' : tone === 'info' ? 'var(--info)' : 'var(--text-secondary)',
      }}>
        {tone === 'primary' ? <Icons.Shield size={16} /> : tone === 'info' ? <Icons.Edit size={16} /> : <Icons.Eye size={16} />}
      </span>
      <span style={{ fontFamily: 'var(--f-display)', fontWeight: 700, fontSize: 17 }}>{name}</span>
      <Badge tone={tone === 'primary' ? 'primary' : tone === 'info' ? 'info' : 'neutral'}>{count}</Badge>
      <div style={{ flex: 1 }} />
      <span style={{ fontSize: 12, color: 'var(--text-tertiary)', fontWeight: 500 }}>Edit →</span>
    </div>
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {perms.map((p, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: p === '—' ? 'var(--text-tertiary)' : 'var(--text-secondary)' }}>
          {p !== '—' && <Icons.Check size={14} style={{ color: 'var(--success)' }} />}
          {p === '—' && <Icons.X size={14} />}
          <span>{p === '—' ? 'No edit access' : p}</span>
        </div>
      ))}
    </div>
  </Card>
);

window.AdminUsers = AdminUsers;
