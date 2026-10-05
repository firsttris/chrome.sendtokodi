import type { JSX } from 'solid-js';

// Icons from Lucide (https://lucide.dev), the icon set used by shadcn/ui.

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
    <polygon points="6 3 20 12 6 21 6 3" fill="currentColor" />
  </Svg>
);

export const QueueIcon = (props: IconProps) => (
  <Svg {...props}>
    <path d="M11 12H3M16 6H3M16 18H3M18 9v6M21 12h-6" />
  </Svg>
);

export const StopIcon = (props: IconProps) => (
  <Svg {...props}>
    <rect width="14" height="14" x="5" y="5" rx="2" />
  </Svg>
);

export const GearIcon = (props: IconProps) => (
  <Svg {...props}>
    <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
    <circle cx="12" cy="12" r="3" />
  </Svg>
);

export const BackIcon = (props: IconProps) => (
  <Svg {...props}>
    <path d="m12 19-7-7 7-7M19 12H5" />
  </Svg>
);

export const ExternalIcon = (props: IconProps) => (
  <Svg {...props}>
    <path d="M15 3h6v6M10 14 21 3M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
  </Svg>
);

export const PlusIcon = (props: IconProps) => (
  <Svg {...props}>
    <path d="M5 12h14M12 5v14" />
  </Svg>
);

export const TrashIcon = (props: IconProps) => (
  <Svg {...props}>
    <path d="M3 6h18M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
  </Svg>
);

export const BoltIcon = (props: IconProps) => (
  <Svg {...props}>
    <path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z" />
  </Svg>
);

export const TvIcon = (props: IconProps) => (
  <Svg {...props}>
    <rect width="20" height="15" x="2" y="7" rx="2" />
    <polyline points="17 2 12 7 7 2" />
  </Svg>
);

export const ChevronsUpDownIcon = (props: IconProps) => (
  <Svg {...props}>
    <path d="m7 15 5 5 5-5M7 9l5-5 5 5" />
  </Svg>
);

export const CheckIcon = (props: IconProps) => (
  <Svg {...props}>
    <path d="M20 6 9 17l-5-5" />
  </Svg>
);

export const CheckCircleIcon = (props: IconProps) => (
  <Svg {...props}>
    <circle cx="12" cy="12" r="10" />
    <path d="m9 12 2 2 4-4" />
  </Svg>
);

export const AlertIcon = (props: IconProps) => (
  <Svg {...props}>
    <circle cx="12" cy="12" r="10" />
    <path d="M12 8v4M12 16h.01" />
  </Svg>
);

export const WarningIcon = (props: IconProps) => (
  <Svg {...props}>
    <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3M12 9v4M12 17h.01" />
  </Svg>
);

export const Spinner = (props: IconProps) => (
  <Svg class={`animate-spin ${props.class ?? 'h-4 w-4'}`}>
    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
  </Svg>
);
