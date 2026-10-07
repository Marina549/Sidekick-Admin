import type { CSSProperties } from 'react';
import { ICO, type IconName } from '../icons';

/** Single-colour icon drawn with a CSS mask, so it takes `currentColor` and recolours on hover. */
export function MaskIcon({ name, size, style }: { name: IconName; size: number; style?: CSSProperties }) {
  const mask = `url("${ICO[name]}") center / contain no-repeat`;
  return (
    <span
      aria-hidden="true"
      style={{ display: 'block', flexShrink: 0, width: size, height: size, background: 'currentColor', mask, WebkitMask: mask, ...style }}
    />
  );
}

/** An <img> icon from public/assets/icons. */
export function ImgIcon({ src, size, style }: { src: string; size: number; style?: CSSProperties }) {
  return <img src={'/assets/icons/' + src} alt="" aria-hidden="true" width={size} height={size} style={{ display: 'block', flexShrink: 0, ...style }} />;
}
