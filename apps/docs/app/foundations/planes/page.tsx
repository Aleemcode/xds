export const metadata = { title: 'The four planes' };

const PLANES = [
  { name: 'Brand', band: 'var(--bg-brand-solid)', owns: 'Fills, primary actions, links, the mark itself.', never: 'never a data value' },
  { name: 'System', band: 'linear-gradient(90deg,var(--bg-success-solid),var(--bg-info-solid),var(--bg-warning-solid),var(--bg-danger-solid))', owns: 'Interface state — success, info, warning, danger.', never: 'never a price' },
  { name: 'Market', band: 'linear-gradient(90deg,var(--text-up),var(--text-flat),var(--text-down))', owns: 'Price direction. Up, down, flat.', never: 'never a button' },
  { name: 'Chart', band: 'linear-gradient(90deg,var(--chart-1),var(--chart-2),var(--chart-3),var(--chart-4),var(--chart-5),var(--chart-6))', owns: 'Series identity inside a plot.', never: 'never a status' },
];

export default function Planes() {
  return (
    <main className="page">
      <div className="prose">
        <p className="eyebrow">Foundations</p>
        <h1>The four planes</h1>
        <p className="lede">
          The one idea the rest of the system depends on. Read this before any
          other page, because every colour decision downstream is an application
          of it.
        </p>

        <h2>The problem</h2>
        <p>
          AFEX&apos;s brand is red. A commodity exchange shows a falling price in red.
          Those two facts fight, and the measurement is unambiguous: the brand red
          <code>#E1261C</code> and the error red <code>#E5484D</code> are{' '}
          <strong>5.3 apart</strong> in OKLab, against a floor of roughly 15 for a
          full-colour reader. Under deuteranopia it falls to 4.4.
        </p>
        <p>
          There is no palette fix. They are the same red, and asking a trader to
          distinguish them on a dense board is asking them to make a mistake.
        </p>

        <h2>The rule</h2>
      </div>

      <div className="note">
        <p><strong>A plane owns its colours and never lends them out.</strong></p>
        <p>A brand red cannot appear in a data cell. A market red cannot appear on a button. The two never meet, so they never have to be told apart.</p>
      </div>

      <div className="grid grid--2">
        {PLANES.map(p => (
          <div className="planecard" key={p.name}>
            <div className="band" style={{ background: p.band }} />
            <div className="body">
              <h3>{p.name}</h3>
              <p>{p.owns}</p>
              <span className="never">{p.never}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="prose">
        <h2>What it costs</h2>
        <p>
          Reserving four planes uses up most of the hue wheel. Once brand red,
          four status hues and a green/red market pair are spoken for, only the
          arc from <strong>204° to 330°</strong> is free — cyan, through blue, to
          magenta. That is why the chart palette is six colours and not eight, and
          why it separates on lightness as well as hue.
        </p>
        <p>
          That is a real constraint rather than a stylistic preference, and it is
          worth knowing before someone asks for a seventh series colour.
        </p>
      </div>
    </main>
  );
}
