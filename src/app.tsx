import { StrictMode } from 'react';
import MainScreen from './pages/main-screen/main-screen';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

type AppScreenProps = {
  offersCount: number;
};

function App({offersCount}: AppScreenProps): JSX.Element {
  return (
    <StrictMode>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<MainScreen offersCount={offersCount} />}>
          </Route>
        </Routes>
      </BrowserRouter>
    </StrictMode>
  );
}

export default App;
