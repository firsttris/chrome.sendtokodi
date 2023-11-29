import { Connection } from './types';
import { useApi } from ".././provider/ApiProvider";
import { useStore } from './../provider/StoreProvider';

type InputFieldProps = {
  name: keyof Connection;
  type: string;
  placeholder: string;
  label: string;
};

const InputField = (props: InputFieldProps) => {
  const { getSelectedConnection, updateConnectionAttribute } = useStore();
  
  
  const handleInputChange = (event: Event) => {
    const htmlInputElement = (event.target as HTMLInputElement);
    updateConnectionAttribute(htmlInputElement.name as keyof Connection, htmlInputElement.value);
  };

  const value = () => getSelectedConnection()?.[props.name] ?? '';

  return (
    <div class="form-group mt-2">
      <label for={props.name}>{props.label}</label>
      <input
        class={`form-control ${value() || props.name === 'pw' ? '' : 'is-invalid'}`}
        type={props.type}
        name={props.name}
        placeholder={props.placeholder}
        id={props.name}
        value={value()}
        onChange={handleInputChange}
      />
    </div>
  );
};

export const Form = () => {
  
  const { status, sendPing: testConnection } = useApi();
  return (
    <div>
      <InputField name="name" type="text" placeholder="Connection Name" label="Name" />
      <InputField name="ip" type="text" placeholder="127.0.0.1" label="IP Address" />
      <InputField name="port" type="text" placeholder="8080" label="Port" />
      <InputField name="login" type="text" placeholder="kodi" label="Login" />
      <InputField name="pw" type="password" placeholder="kodi" label="Password" />
      <div class="form-group my-2 d-flex align-items-center">
        <button class="btn btn-secondary" onClick={testConnection}>
          Ping
        </button>
        <span class="d-flex align-items-center ms-1">{status()}</span>
      </div>
    </div>
  );
};