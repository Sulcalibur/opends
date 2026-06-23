// ============================================================
// AUTH — Login / first-run setup
// 1440 × 900
// ============================================================

const AuthLogin = () => (
  <div className="ds ds-light ds-screen" data-screen-label="Auth · Login" style={{ display: 'flex' }}>
    {/* Left: form */}
    <div style={{
      flex: '0 0 540px', display: 'flex', flexDirection: 'column',
      padding: '40px 64px', background: 'var(--bg-elevated)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <Icons.Logo size={28} />
        <span style={{ fontFamily: 'var(--f-display)', fontWeight: 800, fontSize: 18, letterSpacing: '-0.01em' }}>OpenDS</span>
        <Badge tone="neutral" style={{ marginLeft: 6, fontSize: 10.5 }}>v2.4 · self-hosted</Badge>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', maxWidth: 380 }}>
        <h1 style={{ fontSize: 36, fontWeight: 800, letterSpacing: '-0.025em', lineHeight: 1.05, marginBottom: 8 }}>
          Welcome back
        </h1>
        <p style={{ fontSize: 15, color: 'var(--text-secondary)', marginBottom: 32 }}>
          Sign in to your Lumen workspace.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <Button variant="secondary" size="lg" full icon={<Icons.Github size={16} />}>Continue with GitHub</Button>
          <Button variant="secondary" size="lg" full icon={
            <svg width="16" height="16" viewBox="0 0 16 16"><path fill="#4285F4" d="M15.5 8.2c0-.5 0-1-.1-1.5H8v2.9h4.2c-.2 1-.7 1.8-1.6 2.4v2h2.6c1.5-1.4 2.3-3.4 2.3-5.8z"/><path fill="#34A853" d="M8 16c2.2 0 4-.7 5.3-2l-2.6-2c-.7.5-1.6.8-2.7.8-2.1 0-3.8-1.4-4.5-3.3H.9v2C2.2 14.1 4.9 16 8 16z"/><path fill="#FBBC04" d="M3.5 9.5c-.2-.5-.3-1-.3-1.5s.1-1 .3-1.5v-2H.9C.3 5.7 0 6.8 0 8s.3 2.3.9 3.5l2.6-2z"/><path fill="#EA4335" d="M8 3.2c1.2 0 2.3.4 3.1 1.2l2.3-2.3C12 .9 10.2 0 8 0 4.9 0 2.2 1.9.9 4.5l2.6 2C4.2 4.6 5.9 3.2 8 3.2z"/></svg>
          }>Continue with Google</Button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '24px 0' }}>
          <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
          <span style={{ fontSize: 12, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>or</span>
          <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <Field label="Email">
            <Input size="lg" placeholder="you@lumen.co" leading={<Icons.Mail size={16} />} value="mira@lumen.co" />
          </Field>
          <Field
            label="Password"
            extra={<span style={{ fontSize: 12, color: 'var(--primary)', fontWeight: 600 }}>Forgot?</span>}
          >
            <Input size="lg" type="password" placeholder="••••••••••" leading={<Icons.Lock size={16} />} value="••••••••••" />
          </Field>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--text-secondary)', marginTop: 4 }}>
            <span style={{ width: 16, height: 16, borderRadius: 4, background: 'var(--primary)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}><Icons.Check size={11} /></span>
            Keep me signed in for 30 days
          </label>
          <Button size="lg" full style={{ marginTop: 12 }}>Sign in</Button>
        </div>

        <div style={{ marginTop: 32, fontSize: 13, color: 'var(--text-secondary)', textAlign: 'center' }}>
          New to Lumen? <span style={{ color: 'var(--primary)', fontWeight: 600 }}>Request access →</span>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 12, color: 'var(--text-tertiary)' }}>
        <span>© 2026 Lumen</span>
        <span style={{ display: 'inline-flex', gap: 12 }}>
          <span>Privacy</span><span>Terms</span><span>Status</span>
        </span>
      </div>
    </div>

    {/* Right: brand panel */}
    <div style={{
      flex: 1, position: 'relative', overflow: 'hidden',
      background: `
        radial-gradient(circle at 30% 15%, rgba(255,209,102,.22), transparent 55%),
        radial-gradient(circle at 85% 85%, rgba(255,107,74,.20), transparent 55%),
        #1A1D21
      `,
      color: 'white', padding: 64,
      display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
    }}>
      {/* Subtle dotted texture */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'radial-gradient(rgba(255,255,255,0.05) 1px, transparent 1px)',
        backgroundSize: '22px 22px', maskImage: 'radial-gradient(circle at 60% 45%, black, transparent 75%)',
        WebkitMaskImage: 'radial-gradient(circle at 60% 45%, black, transparent 75%)',
      }} />

      <div style={{ zIndex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Badge tone="primary" style={{ background: 'rgba(255,107,74,.18)', color: '#FFB8A3' }}>
          <Icons.Sparkles size={11} /> v2.4.0
        </Badge>
        <span style={{ fontFamily: 'var(--f-mono)', fontSize: 11, color: '#6B7280', letterSpacing: '0.02em' }}>opends.dev</span>
      </div>

      {/* Centered, fully-contained component-docs preview */}
      <div style={{
        zIndex: 1, flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
        perspective: 1400, margin: '32px 0',
      }}>
        <div style={{
          width: '100%', maxWidth: 460,
          background: '#21242B', border: '1px solid #353B45', borderRadius: 14,
          boxShadow: '0 30px 70px -20px rgba(0,0,0,0.65)',
          transform: 'rotateY(-9deg) rotateX(3deg)', transformOrigin: 'center',
          overflow: 'hidden',
        }}>
          {/* Window chrome */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '13px 16px', borderBottom: '1px solid #353B45', background: '#1C1F25' }}>
            <span style={{ width: 9, height: 9, borderRadius: 999, background: '#FF6B4A' }} />
            <span style={{ width: 9, height: 9, borderRadius: 999, background: '#FFD166' }} />
            <span style={{ width: 9, height: 9, borderRadius: 999, background: '#3E4551' }} />
            <span style={{ marginLeft: 10, fontFamily: 'var(--f-mono)', fontSize: 10.5, color: '#7B8494' }}>components / button</span>
          </div>
          {/* Body: nav + content */}
          <div style={{ display: 'grid', gridTemplateColumns: '124px 1fr' }}>
            <div style={{ padding: '16px 14px', borderRight: '1px solid #2C313A', display: 'flex', flexDirection: 'column', gap: 9, fontSize: 12 }}>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#6B7280', marginBottom: 2 }}>Inputs</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#F0F1F5', fontWeight: 600, background: 'rgba(255,107,74,0.14)', margin: '0 -8px', padding: '6px 8px', borderRadius: 7 }}>
                <span style={{ width: 5, height: 5, borderRadius: 999, background: '#FF8A70' }} /> Button
              </div>
              <div style={{ color: '#8A91A0', padding: '0 0 0 13px' }}>Checkbox</div>
              <div style={{ color: '#8A91A0', padding: '0 0 0 13px' }}>Input</div>
              <div style={{ color: '#8A91A0', padding: '0 0 0 13px' }}>Select</div>
            </div>
            <div style={{ padding: '18px 20px' }}>
              <div style={{ fontFamily: 'var(--f-display)', fontWeight: 800, fontSize: 22, color: '#F0F1F5', letterSpacing: '-0.02em' }}>Button</div>
              <div style={{ fontSize: 11.5, color: '#8A91A0', marginTop: 3, marginBottom: 16 }}>Triggers an action or event.</div>
              <div style={{ background: '#15171B', border: '1px solid #2C313A', borderRadius: 10, padding: '22px 16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
                <span style={{ background: '#FF6B4A', color: '#FFFFFF', padding: '8px 15px', borderRadius: 7, fontSize: 12.5, fontWeight: 600 }}>Save changes</span>
                <span style={{ background: 'transparent', color: '#C7CCD4', padding: '8px 15px', borderRadius: 7, fontSize: 12.5, fontWeight: 600, border: '1px solid #3E4551' }}>Cancel</span>
              </div>
              <div style={{ display: 'flex', gap: 6, marginTop: 12 }}>
                <span style={{ fontFamily: 'var(--f-mono)', fontSize: 10, color: '#7B8494', background: '#15171B', border: '1px solid #2C313A', borderRadius: 5, padding: '3px 7px' }}>primary</span>
                <span style={{ fontFamily: 'var(--f-mono)', fontSize: 10, color: '#7B8494', background: '#15171B', border: '1px solid #2C313A', borderRadius: 5, padding: '3px 7px' }}>secondary</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ zIndex: 1 }}>
        <div style={{ fontFamily: 'var(--f-display)', fontWeight: 700, fontSize: 34, lineHeight: 1.12, letterSpacing: '-0.02em', marginBottom: 12, maxWidth: 460 }}>
          One source of truth for everything Lumen ships.
        </div>
        <div style={{ fontSize: 14.5, color: '#9AA3B2', maxWidth: 440, lineHeight: 1.55 }}>
          OpenDS hosts your design system docs, tokens, and component reference — self-hosted, open-source, deployed in minutes.
        </div>
      </div>
    </div>
  </div>
);

const Field = ({ label, extra, children }) => (
  <div>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6 }}>
      <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>{label}</label>
      {extra}
    </div>
    {children}
  </div>
);

window.AuthLogin = AuthLogin;
