'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
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
          {group.items.map(item => (
            <Link key={item.href} href={item.href}
                  aria-current={path === item.href ? 'page' : undefined}>
              {item.label}
            </Link>
          ))}
        </div>
      ))}
    </nav>
  );
}
