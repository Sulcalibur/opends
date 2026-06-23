// ============================================================
// PUBLIC DOCS — Docs / markdown page
// 1440 × 1100
// ============================================================

const PublicDocs = () => (
  <div className="ds ds-light ds-screen" data-screen-label="Public · Docs page">
    <DocsHeader />
    <div style={{ flex: 1, display: 'flex', height: 'calc(100% - 56px)' }}>
      <DocsSidebar />
      <main style={{ flex: 1, overflow: 'auto', padding: '48px 64px', minWidth: 0, maxWidth: 880 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12.5, color: 'var(--text-tertiary)', marginBottom: 24, fontWeight: 500 }}>
          <span>Guidelines</span><Icons.ChevronRight size={12} /><span style={{ color: 'var(--text-secondary)' }}>Writing for buttons</span>
        </div>
        <h1 style={{ fontSize: 48, fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.05, marginBottom: 12 }}>
          Writing for buttons
        </h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 32 }}>
          <Avatar name="Jay Patel" size={28} />
          <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
            <span style={{ fontWeight: 600, color: 'var(--text)' }}>Jay Patel</span> · Updated 2 days ago · 6 min read
          </div>
        </div>

        <p style={{ fontSize: 19, lineHeight: 1.6, color: 'var(--text-secondary)', marginBottom: 28 }}>
          Button labels are the most-read words in your product. Treat them as design material—not as a label slot.
        </p>

        <P>Every button is a promise. The label is the contract. When a label is vague, users hesitate, click defensively, or do the wrong thing entirely. The team that wins is the team that writes button labels with the same care as they pick colors.</P>

        <H2>The four rules</H2>

        <Callout tone="primary" icon={<Icons.Sparkles size={16} />} title="Start with the verb">
          Labels start with what happens, not what the button is. "Save" is a verb. "Submit" is a verb. "OK" is not a verb—it's an acknowledgement, and it leaves users guessing.
        </Callout>

        <P>That gives us our first rule: <strong>start with the verb.</strong> Then add the object only when it disambiguates:</P>

        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, margin: '24px 0',
        }}>
          <DoDont kind="do" items={['Save changes', 'Send invite', 'Delete repository', 'Apply filter']} />
          <DoDont kind="dont" items={['OK', 'Submit', 'Done', 'Cancel*']} hint="*Cancel is the one exception; users expect it." />
        </div>

        <H2>Match the destination</H2>
        <P>If clicking opens a modal, say <Code>Open settings</Code>. If clicking sends an email, say <Code>Send invite</Code>. The label and the destination should match so closely that the user could predict one from the other.</P>

        <CodeBlock lang="Vue · do this" style={{ margin: '20px 0' }}>
          {<><C.t>&lt;UButton</C.t>{' '}<C.a>icon</C.a>=<C.s>"i-lucide-mail"</C.s><C.t>&gt;</C.t>Send invite<C.t>&lt;/UButton&gt;</C.t></>}
        </CodeBlock>

        <H2>Don't ask permission</H2>
        <P>Labels should not be polite questions. Skip "Would you like to…" and "Click here to…" prefixes. The button itself is the question; the label is the answer.</P>

        <Callout tone="warning" icon={<Icons.AlertCircle size={16} />} title="Don't pre-announce">
          A label that says "Click to continue" wastes a click. The button is already a click target. The label needs to tell the user where the click goes.
        </Callout>

        <H2>Match the action's weight</H2>
        <P>A destructive action gets a sharp, specific label. <Code>Delete</Code> alone is dangerous because users don't know what they're deleting. <Code>Delete 3 components</Code> is safer—it forces a moment of recognition.</P>

        <p style={{ fontSize: 16, color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 20 }}>
          For confirmations, the label restates the consequence:
        </p>

        <div style={{ display: 'flex', gap: 8, margin: '16px 0 28px', padding: 18, background: 'var(--surface-2)', borderRadius: 'var(--r-card)', border: '1px solid var(--border)' }}>
          <Button variant="secondary">Keep editing</Button>
          <Button style={{ background: 'var(--danger)', borderColor: 'var(--danger)' }}>Delete 3 components</Button>
        </div>

        <H2>Quick reference</H2>
        <RefTable />

        {/* Footer */}
        <div style={{
          marginTop: 56, paddingTop: 24,
          borderTop: '1px solid var(--border)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <span style={{ fontSize: 13, color: 'var(--text-tertiary)' }}>Was this page helpful?</span>
          <div style={{ display: 'flex', gap: 8 }}>
            <Button variant="secondary" size="sm">👎 Not really</Button>
            <Button variant="secondary" size="sm">👍 Yes</Button>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
          <NavCard side="prev" title="Writing for inputs" />
          <NavCard side="next" title="Tone & voice" />
        </div>
      </main>
      <Toc
        items={['Introduction', 'The four rules', 'Match the destination', 'Don\u2019t ask permission', 'Action weight', 'Quick reference']}
        active="The four rules"
      />
    </div>
    <DocsFooter />
  </div>
);

const P = ({ children }) => (
  <p style={{ fontSize: 16, color: 'var(--text)', lineHeight: 1.75, marginBottom: 18 }}>{children}</p>
);
const H2 = ({ children }) => (
  <h2 style={{ fontSize: 26, fontWeight: 700, marginTop: 40, marginBottom: 14, letterSpacing: '-0.02em' }}>{children}</h2>
);
const Code = ({ children }) => (
  <code style={{
    fontFamily: 'var(--f-mono)', fontSize: 13.5,
    background: 'var(--surface-2)', padding: '2px 6px',
    borderRadius: 4, color: 'var(--primary)', fontWeight: 500,
  }}>{children}</code>
);

const Callout = ({ tone = 'primary', icon, title, children }) => {
  const palette = {
    primary: { bg: 'var(--primary-soft)', color: 'var(--primary)', text: 'var(--text)' },
    warning: { bg: 'var(--warning-soft)', color: 'var(--warning)', text: 'var(--text)' },
    info: { bg: 'var(--info-soft)', color: 'var(--info)', text: 'var(--text)' },
  }[tone];
  return (
    <div style={{
      borderLeft: `3px solid ${palette.color}`, background: palette.bg,
      padding: '16px 18px', borderRadius: '0 var(--r-card) var(--r-card) 0',
      margin: '20px 0', display: 'flex', gap: 12, alignItems: 'flex-start',
    }}>
      <span style={{ color: palette.color, marginTop: 2 }}>{icon}</span>
      <div>
        <div style={{ fontWeight: 700, fontSize: 14.5, color: palette.text, marginBottom: 4 }}>{title}</div>
        <div style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{children}</div>
      </div>
    </div>
  );
};

const DoDont = ({ kind, items, hint }) => {
  const ok = kind === 'do';
  return (
    <div style={{
      border: `1px solid ${ok ? 'var(--success)' : 'var(--danger)'}`,
      borderRadius: 'var(--r-card)', padding: 18,
      background: ok ? 'var(--success-soft)' : 'var(--danger-soft)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
        {ok
          ? <Icons.CheckCircle size={18} style={{ color: 'var(--success)' }} />
          : <Icons.X size={18} style={{ color: 'var(--danger)' }} />
        }
        <span style={{ fontFamily: 'var(--f-display)', fontWeight: 700, fontSize: 14, color: ok ? 'var(--success)' : 'var(--danger)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          {ok ? 'Do' : 'Don’t'}
        </span>
      </div>
      <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 6 }}>
        {items.map((it, i) => (
          <li key={i} style={{ fontFamily: 'var(--f-mono)', fontSize: 13, color: 'var(--text)' }}>{it}</li>
        ))}
      </ul>
      {hint && <div style={{ fontSize: 12, color: 'var(--text-tertiary)', marginTop: 10 }}>{hint}</div>}
    </div>
  );
};

const RefTable = () => {
  const rows = [
    ['Confirm save', 'Save changes', 'Verb + object'],
    ['Send email', 'Send invite', 'Match destination'],
    ['Cancel modal', 'Keep editing', 'Reframe negative'],
    ['Open settings', 'Open settings', 'Verb + object'],
    ['Delete item', 'Delete 3 components', 'Quantify destruction'],
    ['Loading', 'Saving…', 'Verb + ellipsis'],
  ];
  return (
    <div style={{ border: '1px solid var(--border)', borderRadius: 'var(--r-card)', overflow: 'hidden' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr 1fr', padding: '12px 18px', background: 'var(--surface-2)', fontSize: 11.5, fontWeight: 700, color: 'var(--text-tertiary)', letterSpacing: '0.06em', textTransform: 'uppercase', borderBottom: '1px solid var(--border)' }}>
        <span>Action</span><span>Label</span><span>Pattern</span>
      </div>
      {rows.map(([a, b, c], i) => (
        <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr 1fr', padding: '12px 18px', alignItems: 'center', borderBottom: i < rows.length - 1 ? '1px solid var(--border)' : 'none', fontSize: 13.5 }}>
          <span style={{ color: 'var(--text-secondary)' }}>{a}</span>
          <span style={{ fontFamily: 'var(--f-mono)', fontWeight: 600, color: 'var(--text)' }}>{b}</span>
          <span style={{ color: 'var(--text-tertiary)', fontSize: 12.5 }}>{c}</span>
        </div>
      ))}
    </div>
  );
};

const NavCard = ({ side, title }) => (
  <div style={{ flex: 1, border: '1px solid var(--border)', borderRadius: 'var(--r-card)', padding: 16, cursor: 'pointer' }}>
    <div style={{
      fontSize: 11, fontWeight: 600, color: 'var(--text-tertiary)',
      letterSpacing: '0.06em', textTransform: 'uppercase',
      display: 'flex', alignItems: 'center', gap: 6,
      justifyContent: side === 'prev' ? 'flex-start' : 'flex-end',
      marginBottom: 8,
    }}>
      {side === 'prev' ? <><Icons.ChevronLeft size={12} /> Previous</> : <>Next <Icons.ChevronRight size={12} /></>}
    </div>
    <div style={{ fontWeight: 600, fontSize: 15, color: 'var(--text)', textAlign: side === 'prev' ? 'left' : 'right' }}>{title}</div>
  </div>
);

Object.assign(window, { PublicDocs, P, H2, Code, Callout, DoDont, RefTable, NavCard });
