import { SelectOne } from './SelectOne';
import { useApi } from './ApiProvider';

type ButtonProps = { loading: boolean, onClick: () => void, icon: string }

const Button = ({ loading, onClick, icon }: ButtonProps) => (
  <button class="btn btn-light" disabled={loading} onClick={onClick}>
    {loading ? <i class="fa fa-spinner fa-pulse fa-1x" /> : <i class={icon} aria-hidden={true} />}
  </button>
);

export const Popup = () => {

  const { loading, sendToKodi, setUrl, url } = useApi();

  const handleInputChange = (event: Event) => {
    setUrl((event.target as HTMLTextAreaElement).value);
  };

  return (
    <div style={{ width: '300px' }}>
      <textarea
        class="form-control"
        rows={3}
        value={url()}
        onChange={handleInputChange}
      />
      <div class="row m-1">
        <div class="col-7">
          <SelectOne />
        </div>
        <div class="col-5">
          <Button loading={loading()} onClick={sendToKodi} icon="fa fa-play fa-1x" />
          <Button loading={loading()} onClick={stop} icon="fa fa-stop fa-1x" />
        </div>
      </div>
    </div>
  );
};