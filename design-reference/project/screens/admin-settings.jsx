// ============================================================
// ADMIN — Settings (Branding, registration, API keys)
// 1440 × 900
// ============================================================

const AdminSettings = () => (
  <div className="ds ds-light ds-screen" data-screen-label="Admin · Settings">
    <div style={{ display: 'flex', height: '100%' }}>
      <AdminSidebar active="settings" />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <AdminHeader title="Settings" crumbs={['Workspace']} actions={<>
          <Badge tone="warning" dot>3 unsaved changes</Badge>
          <Button variant="secondary" size="sm">Discard</Button>
          <Button size="sm">Save changes</Button>
        </>} />
        <main style={{ flex: 1, display: 'grid', gridTemplateColumns: '240px 1fr', minHeight: 0 }}>
          {/* Settings nav */}
          <div style={{ borderRight: '1px solid var(--border)', overflow: 'auto', padding: '20px 10px', background: 'var(--bg)' }}>
            <SidebarSection style={{ paddingTop: 0 }}>Workspace</SidebarSection>
            <NavItem icon={<Icons.Building size={16} />} active>General</NavItem>
            <NavItem icon={<Icons.Palette size={16} />}>Branding</NavItem>
            <NavItem icon={<Icons.Globe size={16} />}>Domain</NavItem>
            <NavItem icon={<Icons.Lock size={16} />}>Authentication</NavItem>
            <NavItem icon={<Icons.Users size={16} />}>Roles &amp; permissions</NavItem>

            <SidebarSection>Developer</SidebarSection>
            <NavItem icon={<Icons.Key size={16} />}>API keys</NavItem>
            <NavItem icon={<Icons.Code size={16} />}>Webhooks</NavItem>
            <NavItem icon={<Icons.Github size={16} />}>Git sync</NavItem>

            <SidebarSection>Account</SidebarSection>
            <NavItem icon={<Icons.User size={16} />}>Profile</NavItem>
            <NavItem icon={<Icons.Bell size={16} />}>Notifications</NavItem>
            <NavItem icon={<Icons.Download size={16} />}>Backups &amp; export</NavItem>

            <SidebarSection>Danger zone</SidebarSection>
            <NavItem icon={<Icons.Trash size={16} />} style={{ color: 'var(--danger)' }}>Delete workspace</NavItem>
          </div>

          {/* Content */}
          <div style={{ overflow: 'auto', padding: '32px 48px', background: 'var(--bg)' }}>
            <div style={{ maxWidth: 760 }}>
              <h2 style={{ fontSize: 26, fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 8 }}>General</h2>
              <p style={{ fontSize: 14.5, color: 'var(--text-secondary)', marginBottom: 28 }}>
                Workspace identity. Visible to everyone with access.
              </p>

              {/* Identity */}
              <SettingsCard
                title="Identity"
                desc="The name and avatar shown across the public docs and admin dashboard."
              >
                <FormRow label="Workspace name">
                  <Input value="Lumen Design System" />
                </FormRow>
                <FormRow label="URL slug">
                  <Input value="lumen" wrapStyle={{ paddingRight: 0 }}
                    trailing={<span style={{ fontFamily: 'var(--f-mono)', fontSize: 12.5, color: 'var(--text-tertiary)', padding: '0 12px 0 8px', borderLeft: '1px solid var(--border)', marginRight: -12, height: 38, display: 'flex', alignItems: 'center' }}>.opends.dev</span>}
                  />
                </FormRow>
                <FormRow label="Logo">
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    <div style={{
                      width: 56, height: 56, borderRadius: 12,
                      background: '#1A1D21',
                      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <svg width="36" height="36" viewBox="0 0 32 32">
                        <circle cx="16" cy="16" r="9" fill="none" stroke="#FF6B4A" strokeWidth="2.6" />
                        <circle cx="16" cy="16" r="3" fill="#FF6B4A" />
                      </svg>
                    </div>
                    <div style={{ flex: 1 }}>
                      <Button variant="secondary" size="sm" icon={<Icons.Upload size={14} />}>Upload logo</Button>
                      <div style={{ fontSize: 12, color: 'var(--text-tertiary)', marginTop: 6 }}>SVG, PNG, JPG · max 512KB · 1:1 aspect</div>
                    </div>
                  </div>
                </FormRow>
              </SettingsCard>

              {/* Audience & comments */}
              <SettingsCard
                title="Audience &amp; comments"
                desc="Workspace-level defaults for who can read and comment. Page authors can override per item."
                action={<Button variant="ghost" size="sm" icon={<Icons.ArrowUpRight size={13} />} style={{ color: 'var(--primary)' }}>Visibility matrix</Button>}
              >
                <div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-secondary)', letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: 10 }}>Default audience for new pages</div>
                  <AudiencePicker value="team" />
                  <div style={{ fontSize: 12.5, color: 'var(--text-tertiary)', marginTop: 8, lineHeight: 1.5 }}>
                    {AUDIENCES['team'].desc} New components, tokens and docs start here.
                  </div>
                </div>
                <div style={{ height: 1, background: 'var(--border)', margin: '4px -22px' }} />
                <div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-secondary)', letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: 10 }}>Comments — who can post</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <CommentMiniRow level="public" on={true} />
                    <CommentMiniRow level="team" on={true} />
                    <CommentMiniRow level="admin" on={true} />
                  </div>
                  <div style={{ fontSize: 12.5, color: 'var(--text-tertiary)', marginTop: 10, lineHeight: 1.5 }}>
                    Comments from public visitors require a name + email and are held for moderation. Team and admin comments post immediately.
                  </div>
                </div>
              </SettingsCard>

              {/* API keys */}
              <SettingsCard
                title="API keys"
                desc="Read tokens, components and docs from your own apps."
                action={<Button size="sm" icon={<Icons.Plus size={13} />}>Create key</Button>}
              >
                <ApiKeyRow name="Production build" scopes={['read:tokens', 'read:components']} key1="opds_prod_********fa2b" created="3 months ago" lastUsed="12m ago" />
                <ApiKeyRow name="Storybook sync" scopes={['read:components']} key1="opds_sb_********e91c" created="6 weeks ago" lastUsed="2h ago" />
                <ApiKeyRow name="Figma plugin" scopes={['read:tokens']} key1="opds_fg_********7d31" created="1 week ago" lastUsed="—" warn />
              </SettingsCard>
            </div>
          </div>
        </main>
      </div>
    </div>
  </div>
);

const SettingsCard = ({ title, desc, children, action }) => (
  <Card style={{ marginBottom: 20, padding: 0 }} padded={false}>
    <div style={{ padding: '18px 22px', borderBottom: '1px solid var(--border)', display: 'flex', gap: 12 }}>
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 700, fontSize: 16, fontFamily: 'var(--f-display)', marginBottom: 4 }}>{title}</div>
        <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{desc}</div>
      </div>
      {action}
    </div>
    <div style={{ padding: 22, display: 'flex', flexDirection: 'column', gap: 16 }}>
      {children}
    </div>
  </Card>
);

const FormRow = ({ label, hint, children }) => (
  <div style={{ display: 'grid', gridTemplateColumns: '180px 1fr', gap: 24, alignItems: 'flex-start' }}>
    <div>
      <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', marginBottom: 2 }}>{label}</div>
      {hint && <div style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>{hint}</div>}
    </div>
    <div>{children}</div>
  </div>
);

const ToggleRow = ({ on, title, body }) => (
  <div style={{
    display: 'flex', alignItems: 'flex-start', gap: 16,
    padding: 16, background: 'var(--surface-2)',
    border: '1px solid var(--border)', borderRadius: 'var(--r-input)',
  }}>
    <div style={{ flex: 1 }}>
      <div style={{ fontSize: 14, fontWeight: 600 }}>{title}</div>
      <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 4, lineHeight: 1.5 }}>{body}</div>
    </div>
    <span style={{ width: 38, height: 22, background: on ? 'var(--primary)' : 'var(--border-strong)', borderRadius: 999, position: 'relative', cursor: 'pointer', flex: '0 0 auto' }}>
      <span style={{ position: 'absolute', [on ? 'right' : 'left']: 2, top: 2, width: 18, height: 18, borderRadius: 999, background: 'white', boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }} />
    </span>
  </div>
);

const ApiKeyRow = ({ name, scopes, key1, created, lastUsed, warn }) => (
  <div style={{
    display: 'flex', alignItems: 'center', gap: 16, padding: 14,
    background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 'var(--r-input)',
  }}>
    <span style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--surface)', border: '1px solid var(--border)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}>
      <Icons.Key size={15} />
    </span>
    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 2 }}>{name}</div>
      <div style={{ fontFamily: 'var(--f-mono)', fontSize: 11.5, color: 'var(--text-tertiary)' }}>{key1}</div>
    </div>
    <div style={{ display: 'flex', gap: 4 }}>
      {scopes.map(s => <Badge key={s} tone="neutral" style={{ fontFamily: 'var(--f-mono)', fontSize: 11 }}>{s}</Badge>)}
    </div>
    <div style={{ fontSize: 12, color: 'var(--text-tertiary)', minWidth: 90 }}>
      Used {lastUsed}{warn && <span style={{ display: 'block', color: 'var(--warning)', fontWeight: 600 }}>· never used</span>}
    </div>
    <IconButton variant="ghost" size="sm"><Icons.MoreH size={15} /></IconButton>
  </div>
);

window.AdminSettings = AdminSettings;
