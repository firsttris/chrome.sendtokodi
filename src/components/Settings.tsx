import { Form } from './Form';
import { SelectOne } from './SelectOne';
import { createNewConnection, deleteConnection } from './globalState';


export const Settings = () => {

  return (
    <div class="container mt-3" style={{ width: '500px' }}>
      <div class="form-group">
        <SelectOne
        />
      </div>
      <div class="form-group">
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