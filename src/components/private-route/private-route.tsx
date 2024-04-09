import { Navigate } from 'react-router-dom';
import { AppRoute } from '../../const';

type PrivateRouteProps = {
  predicate: boolean;
  falsePredicateRoute: AppRoute;
  children: JSX.Element;
};

function PrivateRoute(props: PrivateRouteProps): JSX.Element {
  const { predicate, children, falsePredicateRoute } = props;

  function getLocation() {
    if (predicate) {
      return children;
    }

    return <Navigate to={falsePredicateRoute} replace />;
  }

  return getLocation();
}

export default PrivateRoute;
