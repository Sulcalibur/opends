// Shared layout shells for the public docs and admin surfaces.
// Both expose a sidebar + content area sized to the artboard.

// === Public docs header (team brand + search + theme toggle) ===
// The deployed instance belongs to a team — we use "Lumen" as the example
// tenant. OpenDS itself is the host platform (credited in footer).
const DocsHeader = ({ theme = 'light', team = 'Lumen' }) => (
  <header style={{
    display: 'flex', alignItems: 'center', gap: 16,
    height: 56, padding: '0 24px',
    borderBottom: '1px solid var(--border)',
    background: 'var(--bg-elevated)',
    flex: '0 0 auto',
  }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, width: 248, flex: '0 0 auto' }}>
      {/* Team's own mark — a simple geometric placeholder for the team's logo */}
      <svg width="26" height="26" viewBox="0 0 32 32" aria-hidden="true">
        <rect x="2" y="2" width="28" height="28" rx="7" fill="#1A1D21" />
        <circle cx="16" cy="16" r="7" fill="none" stroke="#FF6B4A" strokeWidth="2.4" />
        <circle cx="16" cy="16" r="2.5" fill="#FF6B4A" />
      </svg>
      <span style={{ fontFamily: 'var(--f-display)', fontWeight: 800, fontSize: 18, letterSpacing: '-0.01em' }}>{team}</span>
      <Badge tone="neutral" style={{ marginLeft: 'auto', fontSize: 10.5, padding: '2px 6px' }}>v2.4</Badge>
    </div>
    <div style={{ flex: 1, maxWidth: 520 }}>
      <Input
        leading={<Icons.Search size={16} />}
        placeholder="Search components, tokens, docs…"
        kbd="⌘K"
        size="sm"
      />
    </div>
    <div style={{ flex: 1 }} />
    <nav style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13.5, fontWeight: 500, color: 'var(--text-secondary)' }}>
      <span style={{ padding: '6px 10px' }}>Components</span>
      <span style={{ padding: '6px 10px' }}>Tokens</span>
      <span style={{ padding: '6px 10px' }}>Guidelines</span>
      <span style={{ padding: '6px 10px', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
        Changelog <Badge tone="primary" dot style={{ padding: '1px 6px', fontSize: 10 }}>3</Badge>
      </span>
    </nav>
    <Divider vertical style={{ height: 24 }} />
    <IconButton variant="ghost" title="Theme"><Icons.Sun size={16} /></IconButton>
    <IconButton variant="ghost"><Icons.Github size={16} /></IconButton>
  </header>
);

// === Public docs left sidebar (hierarchical nav) ===
const DocsSidebar = ({ active = 'button' }) => (
  <aside style={{
    width: 268, flex: '0 0 auto',
    borderRight: '1px solid var(--border)',
    background: 'var(--bg)',
    overflow: 'auto', padding: '12px 8px 24px',
  }}>
    <SidebarSection>Getting Started</SidebarSection>
    <NavItem icon={<Icons.Sparkles size={16} />}>Introduction</NavItem>
    <NavItem icon={<Icons.Zap size={16} />}>Installation</NavItem>
    <NavItem icon={<Icons.Book size={16} />}>Theming</NavItem>
    <NavItem icon={<Icons.Layers size={16} />}>Contributing</NavItem>

    <SidebarSection>Foundations</SidebarSection>
    <NavItem icon={<Icons.Palette size={16} />} active={active === 'color'}>Color</NavItem>
    <NavItem icon={<Icons.Type size={16} />}>Typography</NavItem>
    <NavItem icon={<Icons.Ruler size={16} />}>Spacing</NavItem>
    <NavItem icon={<Icons.Cube size={16} />}>Radius &amp; Shadow</NavItem>
    <NavItem icon={<Icons.Sliders size={16} />}>Motion</NavItem>

    <SidebarSection>Components</SidebarSection>
    <NavItem indent={0}>Overview</NavItem>
    <div style={{ paddingLeft: 6 }}>
      <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-tertiary)', padding: '8px 10px 4px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Inputs</div>
      <NavItem indent={1} active={active === 'button'}>Button</NavItem>
      <NavItem indent={1}>Checkbox</NavItem>
      <NavItem indent={1}>Input</NavItem>
      <NavItem indent={1}>Radio Group</NavItem>
      <NavItem indent={1}>Select</NavItem>
      <NavItem indent={1}>Switch</NavItem>
      <NavItem indent={1}>Textarea</NavItem>

      <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-tertiary)', padding: '12px 10px 4px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Display</div>
      <NavItem indent={1}>Avatar</NavItem>
      <NavItem indent={1}>Badge</NavItem>
      <NavItem indent={1}>Card</NavItem>
      <NavItem indent={1}>Table</NavItem>
      <NavItem indent={1}>Tooltip</NavItem>

      <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-tertiary)', padding: '12px 10px 4px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Overlay</div>
      <NavItem indent={1}>Dialog</NavItem>
      <NavItem indent={1}>Drawer</NavItem>
      <NavItem indent={1}>Popover</NavItem>
      <NavItem indent={1}>Toast</NavItem>
    </div>

    <SidebarSection>Patterns</SidebarSection>
    <NavItem icon={<Icons.FileText size={16} />}>Forms</NavItem>
    <NavItem icon={<Icons.FileText size={16} />}>Empty States</NavItem>
    <NavItem icon={<Icons.FileText size={16} />}>Loading &amp; Errors</NavItem>

    <SidebarSection>Internal · Team</SidebarSection>
    <NavItem icon={<Icons.Users size={16} />} faint count={<Icons.Lock size={11} style={{ color: 'var(--text-tertiary)' }} />}>Brand voice</NavItem>
    <NavItem icon={<Icons.Users size={16} />} faint count={<Icons.Lock size={11} style={{ color: 'var(--text-tertiary)' }} />}>Contributor playbook</NavItem>
    <NavItem icon={<Icons.Users size={16} />} faint count={<Icons.Lock size={11} style={{ color: 'var(--text-tertiary)' }} />}>Token roadmap</NavItem>
    <div style={{ padding: '8px 12px 4px' }}>
      <div style={{
        fontSize: 11.5, color: 'var(--text-tertiary)', lineHeight: 1.45,
        padding: '8px 10px', background: 'var(--surface-2)', borderRadius: 6,
      }}>
        3 pages need sign-in. <span style={{ color: 'var(--primary)', fontWeight: 600 }}>Sign in →</span>
      </div>
    </div>
  </aside>
);

// === Right-hand table-of-contents ===
const Toc = ({ items = ['Overview', 'Anatomy', 'Variants', 'Sizes', 'States', 'Props', 'Accessibility', 'Code'], active = 'Overview' }) => (
  <aside style={{
    width: 220, flex: '0 0 auto',
    padding: '32px 20px 32px 16px', overflow: 'auto',
    borderLeft: '1px solid var(--border)',
  }}>
    <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', color: 'var(--text-tertiary)', textTransform: 'uppercase', marginBottom: 12 }}>On this page</div>
    <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {items.map(i => (
        <div key={i} style={{
          padding: '6px 10px', fontSize: 13,
          fontWeight: i === active ? 600 : 500,
          color: i === active ? 'var(--primary)' : 'var(--text-secondary)',
          borderLeft: `2px solid ${i === active ? 'var(--primary)' : 'transparent'}`,
          marginLeft: -2,
        }}>{i}</div>
      ))}
    </div>
    <div style={{ height: 1, background: 'var(--border)', margin: '20px 0 16px' }} />
    <div style={{ fontSize: 12, color: 'var(--text-tertiary)', display: 'flex', flexDirection: 'column', gap: 8 }}>
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--text-secondary)' }}>
        <Icons.Edit size={13} /> Edit on GitHub
      </span>
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
        <Icons.Clock size={13} /> Updated 2 days ago
      </span>
    </div>
  </aside>
);

// === Public docs footer (OpenDS attribution) ===
const DocsFooter = ({ team = 'Lumen' }) => (
  <footer style={{
    padding: '24px 32px', borderTop: '1px solid var(--border)',
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    fontSize: 12.5, color: 'var(--text-tertiary)', background: 'var(--bg)',
  }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
      <span>© 2026 {team}</span>
      <span style={{ width: 3, height: 3, borderRadius: 999, background: 'var(--border-strong)' }} />
      <span>Privacy</span>
      <span>Terms</span>
      <span>Contact</span>
    </div>
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
      <span>Powered by</span>
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontWeight: 600, color: 'var(--text-secondary)' }}>
        <Icons.Logo size={14} />
        OpenDS
      </span>
      <span style={{ fontFamily: 'var(--f-mono)', color: 'var(--text-tertiary)' }}>v2.4.0</span>
    </div>
  </footer>
);

// === Admin header ===
const AdminHeader = ({ title, crumbs = [], actions, search = true }) => (
  <header style={{
    display: 'flex', alignItems: 'center', gap: 16,
    height: 60, padding: '0 28px',
    borderBottom: '1px solid var(--border)',
    background: 'var(--bg-elevated)',
    flex: '0 0 auto',
  }}>
    <div style={{ display: 'flex', flexDirection: 'column', gap: 2, flex: 1, minWidth: 0 }}>
      {crumbs.length > 0 && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--text-tertiary)', fontWeight: 500 }}>
          {crumbs.map((c, i) => (
            <React.Fragment key={i}>
              <span style={{ color: i === crumbs.length - 1 ? 'var(--text-secondary)' : 'var(--text-tertiary)' }}>{c}</span>
              {i < crumbs.length - 1 && <Icons.ChevronRight size={12} />}
            </React.Fragment>
          ))}
        </div>
      )}
      <div style={{ fontFamily: 'var(--f-display)', fontWeight: 700, fontSize: 19, letterSpacing: '-0.01em' }}>{title}</div>
    </div>
    {search && (
      <div style={{ width: 280 }}>
        <Input size="sm" leading={<Icons.Search size={15} />} placeholder="Search…" kbd="⌘K" />
      </div>
    )}
    {actions}
    <IconButton variant="ghost"><Icons.Bell size={16} /></IconButton>
    <Avatar name="Mira Quinn" size={30} />
  </header>
);

// === Admin sidebar ===
const AdminSidebar = ({ active = 'dashboard' }) => (
  <aside style={{
    width: 240, flex: '0 0 auto',
    borderRight: '1px solid var(--border)',
    background: 'var(--bg)',
    overflow: 'auto',
    display: 'flex', flexDirection: 'column',
  }}>
    <div style={{ padding: '16px 16px 12px', display: 'flex', alignItems: 'center', gap: 10 }}>
      <Icons.Logo size={28} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: 'var(--f-display)', fontWeight: 800, fontSize: 16, letterSpacing: '-0.01em' }}>OpenDS</div>
        <div style={{ fontSize: 11, color: 'var(--text-tertiary)', fontFamily: 'var(--f-mono)' }}>lumen.opends.dev</div>
      </div>
      <IconButton size="sm" variant="ghost"><Icons.ChevronDown size={14} /></IconButton>
    </div>

    <div style={{ padding: '0 8px 8px' }}>
      <Input size="sm" leading={<Icons.Search size={14} />} placeholder="Jump to…" kbd="⌘K"
        wrapStyle={{ height: 32, background: 'var(--surface-2)', borderColor: 'transparent' }} />
    </div>

    <div style={{ padding: '0 8px', flex: 1, overflow: 'auto' }}>
      <NavItem icon={<Icons.Home size={16} />} active={active === 'dashboard'}>Dashboard</NavItem>
      <NavItem icon={<Icons.Component size={16} />} active={active === 'components'} count={48}>Components</NavItem>
      <NavItem icon={<Icons.Palette size={16} />} active={active === 'tokens'} count="218">Tokens</NavItem>
      <NavItem icon={<Icons.FileText size={16} />} active={active === 'docs'} count={32}>Docs</NavItem>

      <SidebarSection>Workspace</SidebarSection>
      <NavItem icon={<Icons.Users size={16} />} active={active === 'users'} count={9}>Users &amp; Roles</NavItem>
      <NavItem icon={<Icons.Shield size={16} />} active={active === 'visibility'}>Visibility &amp; access</NavItem>
      <NavItem icon={<Icons.Activity size={16} />}>Activity</NavItem>
      <NavItem icon={<Icons.Key size={16} />}>API Keys</NavItem>
      <NavItem icon={<Icons.Settings size={16} />} active={active === 'settings'}>Settings</NavItem>

      <SidebarSection>Status</SidebarSection>
      <NavItem dotColor="#FF6B4A" faint>Draft <span style={{ fontFeatureSettings: '"tnum"', color: 'var(--text-tertiary)' }}>12</span></NavItem>
      <NavItem dotColor="#1F8A5B" faint>Approved <span style={{ fontFeatureSettings: '"tnum"', color: 'var(--text-tertiary)' }}>34</span></NavItem>
      <NavItem dotColor="#8A91A0" faint>Deprecated <span style={{ fontFeatureSettings: '"tnum"', color: 'var(--text-tertiary)' }}>2</span></NavItem>
    </div>

    <div style={{ padding: 12, borderTop: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 10 }}>
      <Avatar name="Mira Quinn" size={28} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>Mira Quinn</div>
        <div style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>Admin · Lumen</div>
      </div>
      <IconButton size="sm" variant="ghost"><Icons.MoreH size={16} /></IconButton>
    </div>
  </aside>
);

Object.assign(window, { DocsHeader, DocsSidebar, DocsFooter, Toc, AdminHeader, AdminSidebar });
