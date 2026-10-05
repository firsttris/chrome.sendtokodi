import { createSignal, onCleanup, Show } from 'solid-js';
import { useStore } from '../provider/StoreProvider';
import { t } from '../utils/i18n';
import { PlusIcon, TrashIcon } from './icons';
import { SelectOne } from './SelectOne';
import { Button } from './ui';

const CONFIRM_TIMEOUT_MS = 3000;

/** Deleting takes two clicks: the first one only asks for confirmation. */
export const useConfirmDelete = () => {
  const { deleteConnection } = useStore();
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

  return { confirming, handleDelete };
};

export const ConnectionManager = () => {
  const { createNewConnection } = useStore();
  const { confirming, handleDelete } = useConfirmDelete();

  return (
    <SelectOne id="connection-select" label={t('activeConnection')}>
      <Button variant="outline" size="icon" title={t('btnNew')} aria-label={t('btnNew')} onClick={createNewConnection}>
        <PlusIcon />
      </Button>
      <Button
        variant={confirming() ? 'destructive' : 'destructive-outline'}
        size={confirming() ? 'compact' : 'icon'}
        title={t('btnDelete')}
        aria-label={confirming() ? t('btnDeleteConfirm') : t('btnDelete')}
        onClick={handleDelete}
      >
        <TrashIcon class={confirming() ? 'h-3.5 w-3.5' : 'h-4 w-4'} />
        <Show when={confirming()}>{t('btnDeleteConfirm')}</Show>
      </Button>
    </SelectOne>
  );
};
