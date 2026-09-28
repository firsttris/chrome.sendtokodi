import type { JSX } from 'solid-js';

type IconProps = { class?: string };

const Svg = (props: IconProps & { children: JSX.Element }) => (
  <svg
    class={props.class ?? 'h-4 w-4'}
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    {props.children}
  </svg>
);

export const PlayIcon = (props: IconProps) => (
  <Svg {...props}>
    <path d="M8 6v12l10-6z" fill="currentColor" />
  </Svg>
);

export const QueueIcon = (props: IconProps) => (
  <Svg {...props}>
    <path d="M4 7h10M4 12h10M4 17h7" />
    <path d="M18 14v6m-3-3h6" />
  </Svg>
);

export const StopIcon = (props: IconProps) => (
  <Svg {...props}>
    <rect x="7" y="7" width="10" height="10" rx="1.5" fill="currentColor" />
  </Svg>
);

export const GearIcon = (props: IconProps) => (
  <Svg {...props}>
    <path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </Svg>
);

export const BackIcon = (props: IconProps) => (
  <Svg {...props}>
    <path d="M15 19l-7-7 7-7" />
  </Svg>
);

export const ExternalIcon = (props: IconProps) => (
  <Svg {...props}>
    <path d="M14 4h6v6M10 14L20 4M18 14v5a1 1 0 01-1 1H5a1 1 0 01-1-1V7a1 1 0 011-1h5" />
  </Svg>
);

export const PlusIcon = (props: IconProps) => (
  <Svg {...props}>
    <path d="M12 5v14m7-7H5" />
  </Svg>
);

export const TrashIcon = (props: IconProps) => (
  <Svg {...props}>
    <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </Svg>
);

export const BoltIcon = (props: IconProps) => (
  <Svg {...props}>
    <path d="M13 10V3L4 14h7v7l9-11h-7z" />
  </Svg>
);

export const InfoIcon = (props: IconProps) => (
  <Svg {...props}>
    <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </Svg>
);

export const Spinner = (props: IconProps) => (
  <svg class={`animate-spin ${props.class ?? 'h-4 w-4'}`} fill="none" viewBox="0 0 24 24" aria-hidden="true">
    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
  </svg>
);
