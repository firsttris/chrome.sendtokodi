import { Connection } from './types';
import { getSelectedConnection, updateConnectionAttribute } from './globalState';
import { status, testConnection } from "./api";

const InputField = ({ name, type, placeholder, label }: { name: keyof Connection, type: string, placeholder: string, label: string }) => {
  const handleInputChange = (event: Event) => {
    const htmlInputElement = (event.target as HTMLInputElement);
    updateConnectionAttribute(htmlInputElement.name as keyof Connection, htmlInputElement.value);
  };

  const value = () => getSelectedConnection()?.[name] ?? '';

  return (
    <div class="form-group">
      <label for={name}>{label}</label>
      <input
        class={`form-control ${value() ? '' : 'is-invalid'}`}
        type={type}
        name={name}
        placeholder={placeholder}
        id={name}
        value={value()}
        onChange={handleInputChange}
      />
      <div class={`invalid-feedback ${value() ? 'd-none' : ''}`}>Please provide {label}</div>
    </div>
  );
};

export const Form = () => {
  

  return (
    <div>
      <InputField name="name" type="text" placeholder="Connection Name" label="Name" />
      <InputField name="ip" type="text" placeholder="127.0.0.1" label="IP Address" />
      <InputField name="port" type="text" placeholder="8080" label="Port" />
      <InputField name="login" type="text" placeholder="kodi" label="Login" />
      <InputField name="pw" type="password" placeholder="kodi" label="Password" />
      <div class="form-group">
        <button class="btn btn-secondary" onClick={testConnection}>
          Test
        </button>{' '}
        <p class="mt-3">{status()}</p>
      </div>
    </div>
  );
};