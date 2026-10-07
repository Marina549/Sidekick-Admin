// Typed ports of the Pantry Design System React components this app uses.
// Markup and class names match _ds_bundle.js so the PDS CSS in src/pds applies unchanged.
import type { ButtonHTMLAttributes, CSSProperties, HTMLAttributes, ReactNode } from 'react';

type ButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> & {
  children: ReactNode;
  variant?: 'filled' | 'outlined';
  tone?: 'primary';
  size?: 'small' | 'medium' | 'large';
};

/** <button class="pds-btn pds-btn-size__{size} pds-btn-{variant}--{tone}"> */
export function Button({ children, variant = 'filled', tone = 'primary', size = 'large', className = '', type = 'button', ...rest }: ButtonProps) {
  const classes = ['pds-btn', `pds-btn-size__${size}`, `pds-btn-${variant}--${tone}`, className].filter(Boolean).join(' ');
  return (
    <button type={type} className={classes} aria-label={typeof children === 'string' ? children : undefined} {...rest}>
      {children}
    </button>
  );
}

type ModalProps = {
  size?: 'small' | 'medium' | 'large';
  children: ReactNode;
  'aria-label': string;
  style?: CSSProperties;
};

/**
 * PDS Modal, always open. The title and close button are rendered by the caller inside
 * `children` (as in the design) so the X can sit centred on the title.
 */
export function Modal({ size = 'medium', children, style, ...rest }: ModalProps) {
  const pad = size === 'large' ? 'large' : 'small';
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 90 }}>
    <div
      className="pds-modal show"
      role="presentation"
      style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--pds-global-color-general-black-a50)' }}
    >
      <div
        className={`pds-modal-dialog pds-modal-size__${size}`}
        role="dialog"
        aria-modal="true"
        style={{ width: '100%', background: 'var(--pds-theme-color-background-baseline)', ...style }}
        {...rest}
      >
        <div className="pds-modal-content">
          <div className={`pds-modal-header pds-modal-header--${pad}`} style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
            <div className="pds-modal-header__box" />
          </div>
          <div className={`pds-modal-body--${pad}`}>
            <div className="text-m">{children}</div>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}

export interface ToastAction { label: string; onClick: () => void }
const TONE_ICON = {
  positive: 'pds-svg-positive-icon_inverse',
  error: 'pds-svg-error-icon_inverse',
  warning: 'pds-svg-warning-icon_inverse',
  info: 'pds-svg-info-icon_inverse',
} as const;
export type ToastTone = keyof typeof TONE_ICON;

export function Toast({ tone = 'positive', message, actions = [], onDismiss }: { tone?: ToastTone; message: ReactNode; actions?: ToastAction[]; onDismiss: () => void }) {
  return (
    <div className="pds-toasts" role="alert">
      <div style={{ display: 'flex', gap: 8 }}>
        <span className={TONE_ICON[tone]} aria-hidden="true" />
        <div className="pds-toasts__body">
          <p className="text-m--snow" style={{ margin: 0 }}>{message}</p>
        </div>
        <button
          type="button"
          className="pds-icon-btn pds-icon-btn-size_small pds-icon-btn-transparent--inverse-neutral pds-toasts__button pds-toasts__close"
          style={{ marginLeft: 'auto' }}
          aria-label="Close"
          onClick={onDismiss}
        >
          <span className="pds-svg-close pds-icon-btn-transparent--inverse-neutral__icon" aria-hidden="true" />
        </button>
      </div>
      {actions.length > 0 && (
        <div className="pds-toasts__footer" style={{ paddingTop: 8, marginLeft: 'auto', gap: 12 }}>
          {actions.map(a => (
            <button key={a.label} type="button" className="pds-btn pds-btn-size__small pds-btn-outlined--inverse-neutral pds-toasts__button" aria-label={a.label} onClick={a.onClick}>
              {a.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function ProgressBar({ value, size = 'medium', ...rest }: { value: number; size?: 'small' | 'medium' } & HTMLAttributes<HTMLDivElement>) {
  const pct = Math.min(100, Math.max(0, value));
  const base = 'pds-loading-progress-bar';
  return (
    <div className={`${base} ${base}--${size}`} role="progressbar" aria-valuenow={value} aria-valuemin={0} aria-valuemax={100} {...rest}>
      <div className={`${base}__track ${base}--solid__track`}>
        <div className={[`${base}__fill`, `${base}--solid__fill`, pct > 0 && `${base}__fill--active`].filter(Boolean).join(' ')} style={{ width: pct + '%' }} />
      </div>
    </div>
  );
}

/** The PDS close icon button used in modal headers. */
export function ModalClose({ onClick }: { onClick: () => void }) {
  return (
    <button type="button" className="pds-icon-btn pds-icon-btn-size_medium pds-icon-btn-transparent--neutral" aria-label="Close" onClick={onClick} style={{ flexShrink: 0, marginRight: -8 }}>
      <span className="pds-svg-close-medium pds-icon-btn-transparent--neutral__icon" aria-hidden="true" />
    </button>
  );
}
