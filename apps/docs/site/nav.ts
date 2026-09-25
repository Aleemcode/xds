export type NavItem = { href: string; label: string; icon: string };
export const NAV: { title: string; items: NavItem[] }[] = [
  { title: 'Start', items: [
    { href: '/', label: 'Overview', icon: 'Home' },
    { href: '/install', label: 'Install', icon: 'Box' },
  ]},
  { title: 'Foundations', items: [
    { href: '/foundations/planes', label: 'The four planes', icon: 'Layers' },
    { href: '/foundations/color', label: 'Colour', icon: 'Palette' },
    { href: '/foundations/typography', label: 'Typography', icon: 'Type' },
    { href: '/foundations/space', label: 'Space & radius', icon: 'Ruler' },
    { href: '/foundations/icons', label: 'Icons', icon: 'Grid' },
  ]},
  { title: 'Components', items: [
    { href: '/components/button', label: 'Button', icon: 'Component' },
    { href: '/components/badge', label: 'Badge', icon: 'Grade' },
    { href: '/components/input', label: 'Input', icon: 'Document' },
    { href: '/components/toast', label: 'Toast & Alert', icon: 'Info' },
    { href: '/components/change', label: 'Change', icon: 'Trend' },
    { href: '/components/table', label: 'Data table', icon: 'Table' },
  ]},
  { title: 'Conformance', items: [
    { href: '/eval', label: 'Eval', icon: 'Check' },
  ]},
];
