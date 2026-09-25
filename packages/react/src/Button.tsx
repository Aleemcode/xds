import * as React from 'react';
export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: 'md' | 'sm';
}
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  function Button({ variant = 'secondary', size = 'md', className = '', ...rest }, ref) {
    const cls = ['xds-btn', `xds-btn--${variant}`, size === 'sm' && 'xds-btn--sm', className]
      .filter(Boolean).join(' ');
    return <button ref={ref} className={cls} {...rest} />;
  }
);
