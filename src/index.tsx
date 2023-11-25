import './../public/icons/icon16.png';
import './../public/icons/icon48.png';
import './../public/icons/icon128.png';
import 'bootstrap/dist/css/bootstrap.css';
import 'font-awesome/css/font-awesome.css';
import { render } from 'solid-js/web';
import { App } from './components/App';
import { StoreProvider } from './components/StoreProvider';
import { ApiProvider } from './components/ApiProvider';

const root = document.createElement('div');
root.id = 'root';
document.body.appendChild(root);
const element = document.getElementById('root');

if (element) {
    render(() =>
        <StoreProvider>
            <ApiProvider>
                <App page={window.location.pathname} />
            </ApiProvider>
        </StoreProvider>, element);
} else {
    console.error('Element with id "root" not found');
}
