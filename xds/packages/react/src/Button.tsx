import * as React from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: 'md' | 'sm';
  /** Leading icon. Pass an Icon from @afex/xds-react, not a raw pack import. */
  icon?: React.ReactNode;
  /** Trailing icon — for disclosure and external links, never for the action. */
  trailing?: React.ReactNode;
  /** Icon-only. Requires aria-label; the icon carries the whole meaning. */
  iconOnly?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  function Button({ variant = 'secondary', size = 'md', icon, trailing, iconOnly,
                    className = '', children, ...rest }, ref) {
    const cls = ['xds-btn', `xds-btn--${variant}`,
      size === 'sm' && 'xds-btn--sm', iconOnly && 'xds-btn--icon', className]
      .filter(Boolean).join(' ');
    return (
      <button ref={ref} className={cls} {...rest}>
        {icon}
        {!iconOnly && children}
        {trailing}
      </button>
    );
  }
);
