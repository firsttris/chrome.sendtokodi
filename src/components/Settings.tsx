import { Form } from './Form';
import { SelectOne } from './SelectOne';
import { useStore } from './StoreProvider';


export const Settings = () => {

  const { createNewConnection, deleteConnection } = useStore();

  return (
    <div class="container mt-3" style={{ width: '500px' }}>
      <div class="form-group">
        <SelectOne
        />
      </div>
      <div class="form-group my-2">
        <button class="btn btn-secondary" onClick={createNewConnection}>
          New
        </button>{' '}
        <button class="btn btn-secondary" onClick={deleteConnection}>
          Delete
        </button>
      </div>
      <Form
      />
    </div>
  );
};