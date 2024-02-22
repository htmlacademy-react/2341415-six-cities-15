import ReactDOM from 'react-dom/client';
import App from './app';
import { Setting } from './const';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <App
    offersCount={Setting.OffersCount}
  />
);
