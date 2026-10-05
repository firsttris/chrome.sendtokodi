import type { JSX } from 'solid-js';
import { For, Show, splitProps } from 'solid-js';
import { Dynamic } from 'solid-js/web';
import { AlertIcon, CheckCircleIcon, TvIcon, WarningIcon } from './icons';

// Small shadcn/ui-style primitives, styled with the design tokens from index.css.

const cx = (...classes: (string | false | undefined)[]) => classes.filter(Boolean).join(' ');

const BUTTON_VARIANTS = {
  default: 'bg-primary font-semibold text-primary-foreground hover:bg-primary/90',
  secondary: 'bg-foreground font-semibold text-background hover:bg-foreground/90',
  outline: 'border border-border bg-transparent hover:bg-accent',
  ghost: 'text-muted-foreground hover:bg-accent hover:text-foreground',
  destructive: 'bg-red-700 text-red-50 hover:bg-red-700/90',
  'destructive-outline': 'border border-destructive/35 text-destructive hover:bg-destructive/10',
} as const;

const BUTTON_SIZES = {
  default: 'h-9 px-4 text-[13px]',
  compact: 'h-9 px-2 text-xs',
  sm: 'h-8 px-3 text-xs',
  md: 'h-10 px-4 text-[13px]',
  lg: 'h-11 px-6 text-sm',
  icon: 'h-9 w-9',
  'icon-sm': 'h-8 w-8',
} as const;

type ButtonProps = JSX.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: keyof typeof BUTTON_VARIANTS;
  size?: keyof typeof BUTTON_SIZES;
};

export const Button = (props: ButtonProps) => {
  const [local, others] = splitProps(props, ['variant', 'size', 'class', 'type']);
  return (
    <button
      type={local.type ?? 'button'}
      class={cx(
        'inline-flex shrink-0 items-center justify-center gap-2 rounded-lg font-medium whitespace-nowrap transition-colors disabled:pointer-events-none disabled:opacity-50',
        BUTTON_VARIANTS[local.variant ?? 'default'],
        BUTTON_SIZES[local.size ?? 'default'],
        local.class
      )}
      {...others}
    />
  );
};

const FIELD = 'w-full rounded-lg border bg-input/30 text-foreground placeholder:text-muted-foreground/80';

const fieldBorder = (invalid: boolean | undefined) =>
  invalid ? 'border-destructive focus-visible:outline-destructive/60' : 'border-input';

export const Input = (props: JSX.InputHTMLAttributes<HTMLInputElement> & { invalid?: boolean }) => {
  const [local, others] = splitProps(props, ['class', 'invalid']);
  return (
    <input
      class={cx(FIELD, 'h-9 px-3 text-[13px]', fieldBorder(local.invalid), local.class)}
      aria-invalid={local.invalid}
      {...others}
    />
  );
};

export const Textarea = (props: JSX.TextareaHTMLAttributes<HTMLTextAreaElement>) => {
  const [local, others] = splitProps(props, ['class']);
  return <textarea class={cx(FIELD, 'resize-none px-3 py-2', fieldBorder(false), local.class)} {...others} />;
};

export const Label = (props: { for: string; invalid?: boolean; class?: string; children: JSX.Element }) => (
  <label
    for={props.for}
    class={cx('block text-[13px] font-medium', props.invalid ? 'text-destructive' : 'text-foreground', props.class)}
  >
    {props.children}
  </label>
);

export const Logo = () => (
  <div class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
    <TvIcon class="h-[18px] w-[18px]" />
  </div>
);

export const Separator = (props: { class?: string }) => (
  <div role="none" class={cx('h-px shrink-0 bg-border', props.class)} />
);

export const Card = (props: { class?: string; children: JSX.Element }) => (
  <section class={cx('rounded-xl border border-border bg-card', props.class)}>{props.children}</section>
);

export const CardHeader = (props: { title: string; description?: string; children?: JSX.Element }) => (
  <div class="flex flex-wrap items-start gap-4">
    <div class="min-w-0 flex-1">
      <h2 class="text-base font-semibold tracking-tight break-words">{props.title}</h2>
      <Show when={props.description}>
        <p class="mt-1 text-[13px] text-muted-foreground">{props.description}</p>
      </Show>
    </div>
    {props.children}
  </div>
);

export const Switch = (props: {
  id?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
}) => (
  <button
    type="button"
    role="switch"
    id={props.id}
    aria-checked={props.checked}
    aria-label={props.label}
    class={cx(
      'inline-flex h-5 w-9 shrink-0 items-center rounded-full p-0.5 transition-colors',
      props.checked ? 'bg-primary' : 'bg-zinc-700'
    )}
    onClick={() => props.onChange(!props.checked)}
  >
    <span
      class={cx(
        'h-4 w-4 rounded-full bg-foreground shadow transition-transform',
        props.checked ? 'translate-x-4' : 'translate-x-0'
      )}
    />
  </button>
);

const KBD_VARIANTS = {
  default: 'border-zinc-700 bg-muted text-zinc-300',
  primary: 'border-transparent bg-primary-foreground/15 text-primary-foreground',
} as const;

/** Renders a shortcut like "Alt+Shift+K" as separate keys. */
export const Kbd = (props: { shortcut: string; variant?: keyof typeof KBD_VARIANTS }) => (
  <span class="inline-flex gap-1">
    <For each={props.shortcut.split('+')}>
      {(key) => (
        <kbd
          class={cx(
            'rounded-[5px] border px-1.5 py-px font-mono text-[11px] font-medium',
            KBD_VARIANTS[props.variant ?? 'default']
          )}
        >
          {key}
        </kbd>
      )}
    </For>
  </span>
);

const ALERT_VARIANTS = {
  success: {
    box: 'border-success/30 bg-success/5',
    title: 'text-emerald-200',
    icon: CheckCircleIcon,
    color: 'text-success',
  },
  error: {
    box: 'border-destructive/30 bg-destructive/5',
    title: 'text-red-200',
    icon: AlertIcon,
    color: 'text-destructive',
  },
  warning: { box: 'border-warning/30 bg-warning/5', title: 'text-amber-200', icon: WarningIcon, color: 'text-warning' },
} as const;

export const Alert = (props: {
  variant: keyof typeof ALERT_VARIANTS;
  title: string;
  children?: JSX.Element;
  class?: string;
}) => {
  const variant = () => ALERT_VARIANTS[props.variant];
  return (
    <div class={cx('flex gap-2.5 rounded-lg border p-3', variant().box, props.class)}>
      <Dynamic component={variant().icon} class={cx('mt-px h-4 w-4 shrink-0', variant().color)} />
      <div class="flex min-w-0 flex-col gap-1">
        <p class={cx('text-[13px] font-medium break-words', variant().title)}>{props.title}</p>
        <Show when={props.children}>
          <div class="text-xs leading-relaxed text-muted-foreground">{props.children}</div>
        </Show>
      </div>
    </div>
  );
};
