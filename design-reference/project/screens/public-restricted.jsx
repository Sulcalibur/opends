// ============================================================
// PUBLIC — Team-only page hit while unauthenticated
// Shows the doc shell with a centred lock/sign-in card in place
// of the page body. Sidebar shows the lock pattern in context.
// 1440 × 900
// ============================================================

const PublicRestricted = () => (
  <div className="ds ds-light ds-screen" data-screen-label="Public · Restricted">
    <DocsHeader />
    <div style={{ flex: 1, display: 'flex', minHeight: 0 }}>
      <DocsSidebar active="brand-voice" />
      <main style={{ flex: 1, overflow: 'auto', padding: 0, background: 'var(--bg)', display: 'flex', flexDirection: 'column' }}>
        {/* Page header strip with the audience chip */}
        <div style={{
          padding: '20px 40px', borderBottom: '1px solid var(--border)',
          background: 'var(--bg)', display: 'flex', alignItems: 'center', gap: 12,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12.5, color: 'var(--text-tertiary)', fontWeight: 500 }}>
            <span>Guidelines</span>
            <Icons.ChevronRight size={11} />
            <span>Internal</span>
            <Icons.ChevronRight size={11} />
            <span style={{ color: 'var(--text-secondary)' }}>Brand voice</span>
          </div>
          <div style={{ flex: 1 }} />
          <AudienceChip level="team" size="lg" />
        </div>

        {/* Empty content with the gate */}
        <div style={{
          flex: 1, display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
          padding: '56px 40px',
          background: `
            radial-gradient(500px 280px at 50% 20%, rgba(42,111,219,0.07), transparent 60%),
            radial-gradient(400px 240px at 50% 100%, rgba(255,107,74,0.06), transparent 60%),
            var(--bg)
          `,
        }}>
          <div style={{
            maxWidth: 520, width: '100%',
            background: 'var(--surface)', border: '1px solid var(--border)',
            borderRadius: 'var(--r-card)', boxShadow: 'var(--shadow-card)',
            overflow: 'hidden',
          }}>
            {/* Decorative strip */}
            <div style={{
              padding: '28px 32px 20px', textAlign: 'center',
              borderBottom: '1px solid var(--border)',
              background: AUDIENCES.team.soft,
              color: AUDIENCES.team.color,
            }}>
              <div style={{
                width: 56, height: 56, borderRadius: 16,
                background: 'rgba(255,255,255,0.75)',
                margin: '0 auto 14px',
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Icons.Lock size={24} />
              </div>
              <div style={{ fontFamily: 'var(--f-display)', fontWeight: 800, fontSize: 22, letterSpacing: '-0.02em', marginBottom: 4 }}>
                This page is for team members
              </div>
              <div style={{ fontSize: 13.5, opacity: 0.85, lineHeight: 1.5, maxWidth: 380, margin: '0 auto' }}>
                Brand voice, contributor playbooks and the token roadmap are visible to signed-in members of the Lumen workspace.
              </div>
            </div>

            {/* Sign-in card body */}
            <div style={{ padding: '24px 32px 28px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <Button size="lg" full icon={<Icons.Github size={16} />}>Sign in with GitHub</Button>
                <Button size="lg" full variant="secondary" icon={
                  <svg width="16" height="16" viewBox="0 0 16 16"><path fill="#4285F4" d="M15.5 8.2c0-.5 0-1-.1-1.5H8v2.9h4.2c-.2 1-.7 1.8-1.6 2.4v2h2.6c1.5-1.4 2.3-3.4 2.3-5.8z"/><path fill="#34A853" d="M8 16c2.2 0 4-.7 5.3-2l-2.6-2c-.7.5-1.6.8-2.7.8-2.1 0-3.8-1.4-4.5-3.3H.9v2C2.2 14.1 4.9 16 8 16z"/><path fill="#FBBC04" d="M3.5 9.5c-.2-.5-.3-1-.3-1.5s.1-1 .3-1.5v-2H.9C.3 5.7 0 6.8 0 8s.3 2.3.9 3.5l2.6-2z"/><path fill="#EA4335" d="M8 3.2c1.2 0 2.3.4 3.1 1.2l2.3-2.3C12 .9 10.2 0 8 0 4.9 0 2.2 1.9.9 4.5l2.6 2C4.2 4.6 5.9 3.2 8 3.2z"/></svg>
                }>Sign in with Google</Button>
                <Button size="lg" full variant="ghost" icon={<Icons.Mail size={15} />}>Use a magic link</Button>
              </div>

              <div style={{
                marginTop: 22, padding: '14px 16px',
                background: 'var(--surface-2)', borderRadius: 'var(--r-card)',
                fontSize: 12.5, color: 'var(--text-secondary)', lineHeight: 1.55,
                display: 'flex', alignItems: 'flex-start', gap: 10,
              }}>
                <Icons.AlertCircle size={14} style={{ color: 'var(--text-tertiary)', flex: '0 0 auto', marginTop: 2 }} />
                <div>
                  <strong style={{ color: 'var(--text)' }}>Not on the team?</strong> Most of the system is fully public — components, tokens, and guidelines. <span style={{ color: 'var(--primary)', fontWeight: 600 }}>Browse the public docs →</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer-y mini summary of what they CAN see */}
        <div style={{
          borderTop: '1px solid var(--border)', background: 'var(--bg-elevated)',
          padding: '16px 40px', display: 'flex', alignItems: 'center', gap: 18, fontSize: 12.5,
        }}>
          <span style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>You can still read:</span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
            <Icons.Component size={13} style={{ color: 'var(--text-tertiary)' }} /> 48 components
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
            <Icons.Palette size={13} style={{ color: 'var(--text-tertiary)' }} /> 218 tokens
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
            <Icons.FileText size={13} style={{ color: 'var(--text-tertiary)' }} /> 29 public guidelines
          </span>
          <div style={{ flex: 1 }} />
          <AudienceChip level="public" />
        </div>
      </main>
    </div>
  </div>
);

window.PublicRestricted = PublicRestricted;
