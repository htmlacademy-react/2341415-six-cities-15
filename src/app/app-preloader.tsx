import { DEFAULT_CITY } from '../const';
import { useAppDispatch } from '../hooks/app-dispatch';
import { fetchOffersAction } from '../store/api-actions';

type Props = {
  children: JSX.Element;
};

function AppPreloader({ children }: Props): JSX.Element {
  const dispatch = useAppDispatch();
  dispatch(fetchOffersAction(DEFAULT_CITY));

  return children;
}

export default AppPreloader;
