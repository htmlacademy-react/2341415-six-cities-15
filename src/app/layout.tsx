import { Outlet, useLocation, Link } from 'react-router-dom';
import { AppRoute, AuthorizationStatus, DEFAULT_CITY } from '../const';
import { getLayoutState } from '../utils';
import { useAppDispatch, useAppSelector } from '../hooks/app-dispatch';
import { cityChangeAction } from '../store/city-offers-slice';
import { logoutAction, selectAuthorizationStatus, selectFavoriteOffers, selectUser } from '../store/auth-slice';

function Layout(): JSX.Element {
  const { pathname } = useLocation();
  const favoriteOffers = useAppSelector(selectFavoriteOffers);
  const { rootClassName, linkClassName, shouldRenderUser, shouldRenderFooter } = getLayoutState(pathname as AppRoute, favoriteOffers.length);
  const authorizationStatus = useAppSelector(selectAuthorizationStatus);
  const user = useAppSelector(selectUser);
  const dispatch = useAppDispatch();

  function handleLogoClick() {
    dispatch(cityChangeAction(DEFAULT_CITY));
  }

  return (
    <div className={`page${rootClassName}`}>
      <header className="header">
        <div className="container">
          <div className="header__wrapper">
            <div className="header__left">
              <Link
                className={`header__logo-link${linkClassName}`}
                to={AppRoute.Main}
                onClick={handleLogoClick}
              >
                <img className="header__logo" src="img/logo.svg" alt="6 cities logo" width="81" height="41" />
              </Link>
            </div>
            {
              shouldRenderUser ? (
                <nav className="header__nav">
                  <ul className="header__nav-list">
                    <li className="header__nav-item user">
                      <Link
                        className="header__nav-link header__nav-link--profile"
                        to={AppRoute.Favorites}
                      >
                        <div className="header__avatar-wrapper user__avatar-wrapper">
                          {authorizationStatus === AuthorizationStatus.Auth ? (
                            <img className="header__avatar user__avatar" src={user?.avatarUrl} alt="User avatar" />
                          ) : null}
                        </div>
                        {authorizationStatus === AuthorizationStatus.Auth ? (
                          <>
                            <span className="header__user-name user__name">{user?.email}</span>
                            <span className="header__favorite-count">{favoriteOffers.length}</span>
                          </>
                        ) : <span className="header__login">Sign in</span>}
                      </Link>
                    </li>
                    {authorizationStatus === AuthorizationStatus.Auth ? (
                      <li className="header__nav-item">
                        <a
                          onClick={(evt) => {
                            evt.preventDefault();
                            dispatch(logoutAction());
                          }}
                          className="header__nav-link" href="#"
                        >
                          <span className="header__signout">Sign out</span>
                        </a>
                      </li>
                    ) : null}
                  </ul>
                </nav>
              ) : null
            }
          </div>
        </div>
      </header>
      <Outlet />
      {
        shouldRenderFooter ? (
          <footer className="footer container">
            <a className="footer__logo-link" href="main.html">
              <img className="footer__logo" src="img/logo.svg" alt="6 cities logo" width="64" height="33" />
            </a>
          </footer>
        ) : null
      }
    </div>
  );
}

export default Layout;

