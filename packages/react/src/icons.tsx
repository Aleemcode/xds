import * as React from 'react';
import {
  ArrowUp2, ArrowDown2, MinusCirlce,
  TickCircle, InfoCircle, Warning2, CloseCircle,
  Copy, SearchNormal1, Maximize4, Scan, DocumentDownload, Filter, Setting2,
  Lock1, ExportSquare, Refresh2, Play, Pause, TickSquare, CloseSquare,
  More, Eye, EyeSlash, Archive, Trash,
  Sun1, Moon, Monitor,
  Chart, StatusUp, Building4, Card, Receipt2, DocumentText, Verify, Clock,
  Colorfilter, TextBlock, Ruler, Layer, Component, Grid2, RowVertical,
  Book1, Code1, Box, Home2,
} from 'iconsax-reactjs';

/**
 * The xDS icon layer.
 *
 * Nothing outside this file imports `iconsax-reactjs`. That is deliberate: the
 * icon vendor is the single most likely thing in a design system to be
 * swapped, and when it is, this is the only file that changes. Products import
 * names from `@afex/xds-react`, never from the pack.
 *
 * Imports are explicit rather than a namespace, which is what lets the bundler
 * drop the other 950 icons — Iconsax ships ~995 components behind one barrel.
 *
 * It also fixes the two things a raw icon pack always gets wrong inside a
 * design system: size becomes a token rather than a number, and colour is
 * forced to `currentColor` so an icon inherits the text beside it instead of
 * being coloured separately and drifting out of step.
 *
 * Deliberately NOT a `'use client'` module. Icons are presentational, and an
 * object of components exported across a client boundary arrives on the server
 * as an opaque reference — `Icon.Up` would be undefined at prerender. Keeping
 * this server-renderable is what lets both server and client pages use it.
 */

export type IconVariant = 'Linear' | 'Outline' | 'Broken' | 'Bold' | 'Bulk' | 'TwoTone';

/** Named, not numeric. 16 is the default because it is what a dense table row
 *  can carry; 20 for buttons; 24 for nav and empty states. */
export const ICON_SIZE = { xs: 14, sm: 16, md: 20, lg: 24, xl: 32 } as const;
export type IconSize = keyof typeof ICON_SIZE;

export interface IconProps {
  size?: IconSize | number;
  variant?: IconVariant;
  className?: string;
  /** Icons are decorative by default. Pass a label only when the icon is the
   *  only thing carrying the meaning — a bare icon button, for instance. */
  label?: string;
}

type PackIcon = React.ComponentType<{
  size?: string | number; color?: string; variant?: IconVariant;
}>;

function wrap(Pack: PackIcon, displayName: string, defaultVariant: IconVariant = 'Linear') {
  if (!Pack) throw new Error(`xDS icons: '${displayName}' resolved to undefined from iconsax-reactjs`);
  const Comp = ({ size = 'sm', variant = defaultVariant, className, label }: IconProps) => {
    const px = typeof size === 'number' ? size : ICON_SIZE[size];
    return (
      <span
        className={['xds-icon', className].filter(Boolean).join(' ')}
        role={label ? 'img' : undefined}
        aria-label={label}
        aria-hidden={label ? undefined : true}
        style={{ width: px, height: px }}
      >
        <Pack size={px} variant={variant} color="currentColor" />
      </span>
    );
  };
  Comp.displayName = `Icon.${displayName}`;
  return Comp;
}

/**
 * The curated set. Iconsax ships ~995 icons; a design system that exposes all
 * of them has not made a decision. These are the ones xDS uses, each named for
 * its job rather than its picture — `Icon.Up`, not `Icon.ArrowUp2` — so
 * swapping the underlying glyph later does not ripple through products.
 */
export const Icon = {
  // market
  Up:        wrap(ArrowUp2, 'Up', 'Bold'),
  Down:      wrap(ArrowDown2, 'Down', 'Bold'),
  Flat:      wrap(MinusCirlce, 'Flat'),

  // status — these four are the only icons allowed to carry a system tone
  Success:   wrap(TickCircle, 'Success', 'Bold'),
  Info:      wrap(InfoCircle, 'Info', 'Bold'),
  Warning:   wrap(Warning2, 'Warning', 'Bold'),
  Danger:    wrap(CloseCircle, 'Danger', 'Bold'),

  // actions
  Copy:      wrap(Copy, 'Copy'),
  Search:    wrap(SearchNormal1, 'Search'),
  Expand:    wrap(Maximize4, 'Expand'),
  Collapse:  wrap(Scan, 'Collapse'),
  Download:  wrap(DocumentDownload, 'Download'),
  Filter:    wrap(Filter, 'Filter'),
  Settings:  wrap(Setting2, 'Settings'),
  Lock:      wrap(Lock1, 'Lock', 'Bold'),
  External:  wrap(ExportSquare, 'External'),
  Refresh:   wrap(Refresh2, 'Refresh'),
  Play:      wrap(Play, 'Play', 'Bold'),
  Pause:     wrap(Pause, 'Pause', 'Bold'),
  Check:     wrap(TickSquare, 'Check'),
  Close:     wrap(CloseSquare, 'Close'),
  More:      wrap(More, 'More'),
  Show:      wrap(Eye, 'Show'),
  Hide:      wrap(EyeSlash, 'Hide'),
  Archive:   wrap(Archive, 'Archive'),
  Delete:    wrap(Trash, 'Delete'),
  Sun:       wrap(Sun1, 'Sun'),
  Moon:      wrap(Moon, 'Moon'),
  Monitor:   wrap(Monitor, 'Monitor'),

  // domain — the exchange's own vocabulary
  Chart:     wrap(Chart, 'Chart'),
  Trend:     wrap(StatusUp, 'Trend'),
  Warehouse: wrap(Building4, 'Warehouse'),
  Wallet:    wrap(Card, 'Wallet'),
  Receipt:   wrap(Receipt2, 'Receipt'),
  Document:  wrap(DocumentText, 'Document'),
  Grade:     wrap(Verify, 'Grade'),
  Clock:     wrap(Clock, 'Clock'),

  // documentation navigation
  Palette:   wrap(Colorfilter, 'Palette'),
  Type:      wrap(TextBlock, 'Type'),
  Ruler:     wrap(Ruler, 'Ruler'),
  Layers:    wrap(Layer, 'Layers'),
  Component: wrap(Component, 'Component'),
  Grid:      wrap(Grid2, 'Grid'),
  Table:     wrap(RowVertical, 'Table'),
  Book:      wrap(Book1, 'Book'),
  Code:      wrap(Code1, 'Code'),
  Box:       wrap(Box, 'Box'),
  Home:      wrap(Home2, 'Home'),
} as const;

export type IconName = keyof typeof Icon;
export const ICON_NAMES = Object.keys(Icon) as IconName[];

/** Every variant Iconsax ships, for the documentation page. */
export const ICON_VARIANTS: IconVariant[] =
  ['Linear', 'Outline', 'Broken', 'Bold', 'Bulk', 'TwoTone'];
