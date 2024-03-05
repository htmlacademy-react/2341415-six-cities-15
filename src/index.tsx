import ReactDOM from 'react-dom/client';
import App from './app/app';
import { offers } from './mocks/offer';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <App
    offers={offers}
  />
);
