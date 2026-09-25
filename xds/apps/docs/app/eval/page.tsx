import { RULES, RUBRIC } from '@afex/xds-eval/rules';

export const metadata = { title: 'Eval' };

export default function EvalPage() {
  const errors = RULES.filter(r => r.severity === 'error').length;

  return (
    <main className="page">
      <div className="prose">
        <p className="eyebrow">Conformance</p>
        <h1>Eval</h1>
        <p className="lede">
          A design system that depends on everyone remembering it does not hold.
          These are the rules stated in a form a machine can check, and the
          questions that need a reviewer — human or agent — with the evidence
          written down.
        </p>

        <h2>Run it</h2>
        <pre><code>{`npx xds-eval .             # report
npx xds-eval . --json      # for an agent to act on
npx xds-eval . --rubric    # the questions a checker cannot answer`}</code></pre>
        <p>
          {errors} of the {RULES.length} rules are error severity: the check
          exits 1, so it gates a build the same way the token audit does. A
          finding is fixed, not silenced. Where a rule is genuinely wrong for
          one file, it is disabled on the line above with a reason:
        </p>
        <pre><code>{`// xds-eval-disable XDS-03 — this page is about the market plane itself`}</code></pre>

        <h2>What a machine decides</h2>
        <p>
          A rule earns a place here only if a checker can settle it without
          judgement. Everything else is in the rubric below.
        </p>
      </div>

      <table className="spec spec--eval">
        <thead>
          <tr><th>ID</th><th>Rule</th><th>Why</th><th>Fix</th></tr>
        </thead>
        <tbody>
          {RULES.map(r => (
            <tr key={r.id}>
              <td>
                <code>{r.id}</code>
                <span className={`evalsev evalsev--${r.severity}`}>{r.severity}</span>
              </td>
              <td><strong>{r.title}</strong></td>
              <td>{r.rule}</td>
              <td>{r.fix}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="prose">
        <h2>What a reviewer decides</h2>
        <p>
          Twelve questions, answered against the change in front of you. Each
          answer states the file and line that makes it true. &ldquo;Not
          applicable&rdquo; is a valid answer; &ldquo;looks fine&rdquo; is not.
        </p>
      </div>

      <table className="spec spec--map">
        <thead>
          <tr><th>Question</th><th>Passes when</th><th>Fails when</th></tr>
        </thead>
        <tbody>
          {RUBRIC.map(r => (
            <tr key={r.id}>
              <td>
                <strong>{r.question}</strong>
                <span className="xds-table-note">{r.id} · {r.area}</span>
              </td>
              <td>{r.pass}</td>
              <td>{r.fail}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="note">
        <p>
          <strong>The agent brief is a file, not a paragraph in a ticket.</strong>{' '}
          <code>AGENTS.md</code> ships inside <code>@afex/xds-eval</code>. Copied
          to the root of a product repository, it gives an agent the
          non-negotiables, the component inventory it should reach for before
          building anything, and the two commands to run before opening a pull
          request.
        </p>
      </div>
    </main>
  );
}
