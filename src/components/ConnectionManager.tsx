import { createSignal, onCleanup } from 'solid-js';
import { useStore } from '../provider/StoreProvider';
import { t } from '../utils/i18n';
import { PlusIcon, TrashIcon } from './icons';
import { SelectOne } from './SelectOne';

const CONFIRM_TIMEOUT_MS = 3000;

export const ConnectionManager = (props: { compact?: boolean }) => {
  const { createNewConnection, deleteConnection } = useStore();
  const [confirming, setConfirming] = createSignal(false);
  let confirmTimer: ReturnType<typeof setTimeout> | undefined;
  onCleanup(() => clearTimeout(confirmTimer));

  const handleDelete = () => {
    if (!confirming()) {
      setConfirming(true);
      confirmTimer = setTimeout(() => setConfirming(false), CONFIRM_TIMEOUT_MS);
      return;
    }
    clearTimeout(confirmTimer);
    setConfirming(false);
    deleteConnection();
  };

  const buttonSize = () => (props.compact ? 'text-xs' : 'text-sm');
  const iconSize = () => (props.compact ? 'h-3.5 w-3.5' : 'h-4 w-4');

  return (
    <div class={props.compact ? 'mb-3' : 'mb-6 border-b border-gray-700 pb-6'}>
      <SelectOne id="connection-select" label={t('activeConnection')} compact={props.compact} />
      <div class="mt-2 grid grid-cols-2 gap-2">
        <button
          type="button"
          class={`btn-secondary flex items-center justify-center gap-2 ${buttonSize()}`}
          onClick={createNewConnection}
        >
          <PlusIcon class={iconSize()} />
          {t('btnNew')}
        </button>
        <button
          type="button"
          class={`btn-danger flex items-center justify-center gap-2 ${buttonSize()}`}
          onClick={handleDelete}
        >
          <TrashIcon class={iconSize()} />
          {confirming() ? t('btnDeleteConfirm') : t('btnDelete')}
        </button>
      </div>
    </div>
  );
};
