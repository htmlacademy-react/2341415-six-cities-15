import ReactDOM from 'react-dom/client';
import App from './app/app';
import { Provider } from 'react-redux';
import store from './store/store';
import { StrictMode } from 'react';
import AppPreloader from './app/app-preloader';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <StrictMode>
    <Provider store={store}>
      <AppPreloader>
        <App/>
      </AppPreloader>
    </Provider>
  </StrictMode>
);
