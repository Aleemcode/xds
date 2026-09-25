'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Icon } from '@afex/xds-react';
import type { IconName } from '@afex/xds-react';
import { NAV } from './nav';

export function Rail() {
  const path = usePathname();
  return (
    <nav className="rail" aria-label="Design system">
      <Link href="/" className="brandmark">
        <b>xDS</b><span>Xpert Design System</span>
      </Link>
      {NAV.map(group => (
        <div className="navgroup" key={group.title}>
          <h4>{group.title}</h4>
          {group.items.map(item => {
            const Glyph = Icon[item.icon as IconName];
            const active = path === item.href;
            return (
              <Link key={item.href} href={item.href} aria-current={active ? 'page' : undefined}>
                <Glyph size="sm" variant={active ? 'Bold' : 'Linear'} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      ))}
    </nav>
  );
}
