import './globals.css';
import type { Metadata } from 'next';
import { Rail } from '../site/Rail';
import { ThemeToggle } from '../site/ThemeToggle';

export const metadata: Metadata = {
  title: { default: 'xDS · Xpert Design System', template: '%s · xDS' },
  description:
    'The AFEX design system. Tokens, components and the rules that keep a red brand from being mistaken for a falling price.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <div className="shell">
          <Rail />
          <div className="main">
            <div className="topbar"><ThemeToggle /></div>
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
