import * as React from 'react';
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
  error?: string;
  /** Renders with tabular figures, right-aligned. Use for every price and quantity. */
  numeric?: boolean;
}
export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  function Input({ label, hint, error, numeric, id, className = '', ...rest }, ref) {
    const auto = React.useId();
    const inputId = id ?? auto;
    const describedBy = error ? `${inputId}-err` : hint ? `${inputId}-hint` : undefined;
    return (
      <div className="xds-field">
        {label && <label className="xds-label" htmlFor={inputId}>{label}</label>}
        <input
          ref={ref} id={inputId} className={`xds-input ${className}`.trim()}
          data-numeric={numeric ? 'true' : undefined}
          data-invalid={error ? 'true' : undefined}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          {...rest}
        />
        {error
          ? <span className="xds-hint xds-hint--error" id={`${inputId}-err`}>{error}</span>
          : hint ? <span className="xds-hint" id={`${inputId}-hint`}>{hint}</span> : null}
      </div>
    );
  }
);
