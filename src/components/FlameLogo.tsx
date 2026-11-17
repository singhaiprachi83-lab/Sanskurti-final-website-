/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

interface FlameLogoProps {
  size?: number;
  className?: string;
}

export function FlameLogo({ size = 46, className = '' }: FlameLogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={`drop-shadow-[0_0_14px_rgba(255,42,102,0.85)] ${className}`}
    >
      <path
        d="M12 2.5C12 2.5 17.5 6.8 17.5 13C17.5 16.59 15.04 19.5 12 19.5C8.96 19.5 6.5 16.59 6.5 13C6.5 11.15 7.22 9.42 8.2 8.15C8.32 9.65 9.15 10.65 10.1 10.95C9.65 9.1 10.1 6.1 12 2.5Z"
        stroke="#ff2965"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 19.5C10.34 19.5 9.15 18.2 9.15 16.55C9.15 15.15 10.05 13.9 11.4 13.15C11.4 14.35 12.1 15.1 12.9 15.35C13.9 15.65 14.65 16.5 14.65 17.55C14.65 18.65 13.46 19.5 12 19.5Z"
        stroke="#ff2965"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
