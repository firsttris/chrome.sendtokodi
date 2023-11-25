import 'bootstrap/dist/css/bootstrap.css';
import 'font-awesome/css/font-awesome.css';
import { render } from 'solid-js/web';
import { StoreProvider } from './provider/StoreProvider';
import { ApiProvider } from './provider/ApiProvider';
import type { JSX } from 'solid-js';

interface ProviderWrapperProps {
    children: JSX.Element;
}

const ProviderWrapper = (props: ProviderWrapperProps) => (
    <StoreProvider>
        <ApiProvider>
            {props.children}
        </ApiProvider>
    </StoreProvider>
);

export const renderApp = (Component: () => JSX.Element) => {
    const element = document.getElementById('root');
    if (element) {
        render(() => <ProviderWrapper><Component /></ProviderWrapper>, element);
    } else {
        console.error(`Element with id root not found`);
    }
}