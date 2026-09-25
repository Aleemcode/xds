export const metadata = { title: 'The four planes' };

// xds-eval-disable XDS-03 — this page shows the market plane's own colours as
// the subject of the page. It renders no value, so there is nothing to encode
// twice.
// xds-eval-disable XDS-10 — the inline background is a variable holding token
// references, which the checker cannot see through.
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

        <h2>Why planes</h2>
        <p>
          The AFEX brand is red. A falling price is red. On a dense board those
          two reds are not far enough apart for anyone to separate reliably, and
          for a colour-blind trader they are the same colour.
        </p>
        <p>
          A palette cannot fix that, because the two reds are genuinely the same
          red. What fixes it is never putting them in the same place.
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
          Four planes take most of the hue wheel. Brand holds red, the system
          holds four status hues, the market holds a green and a red — and what
          is left for chart series is a narrow arc of cyan through magenta.
        </p>
        <p>
          That is why the chart palette is six colours rather than eight, and
          why those six separate on lightness as well as hue. It is a constraint
          of the system, not a preference, and it is the answer when someone
          asks for a seventh.
        </p>
      </div>
    </main>
  );
}
