import { Settings } from './Settings';
import { Popup } from './Popup';

interface AppProps {
  page: string;
}

export const App = (props: AppProps) => {
  return (
    <div>
      {props.page === '/options.html' ? (
        <Settings
        />
      ) : (
        <Popup
        />
      )}
    </div>
  );
}