import type { JSX } from 'solid-js';
import { render } from 'solid-js/web';
import { ApiProvider } from './provider/ApiProvider';
import { StoreProvider } from './provider/StoreProvider';

interface ProviderWrapperProps {
  children: JSX.Element;
}

const ProviderWrapper = (props: ProviderWrapperProps) => (
  <StoreProvider>
    <ApiProvider>{props.children}</ApiProvider>
  </StoreProvider>
);

export const renderApp = (Component: () => JSX.Element) => {
  const element = document.getElementById('root');
  if (element) {
    render(
      () => (
        <ProviderWrapper>
          <Component />
        </ProviderWrapper>
      ),
      element
    );
  } else {
    console.error(`Element with id root not found`);
  }
};
