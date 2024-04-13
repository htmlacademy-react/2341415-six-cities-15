import { FormEvent, useState, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/app-dispatch';
import { loginAction, selectUser } from '../../store/auth-slice';
import { processErrorHandle } from '../../services/process-error-handle';
import { useNavigate } from 'react-router-dom';
import { AppRoute, CITIES } from '../../const';
import { sample } from 'lodash';
import { cityChangeAction } from '../../store/city-offers-slice';

function isPasswordValid(password: string) {
  return /[A-z]+/.test(password) && /\d+/.test(password);
}

function LoginScreen(): JSX.Element {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const user = useAppSelector(selectUser);
  const isAuthorizationSuccessful = !!user;
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  if (isAuthorizationSuccessful) {
    navigate(AppRoute.Main);
  }

  function handleSubmit(evt: FormEvent) {
    evt.preventDefault();

    if (isPasswordValid(password)) {
      dispatch(loginAction({ login, password }));
    } else {
      processErrorHandle('Password must includes at least one digit and one letter');
    }
  }

  const randomCity = useMemo(() => sample(CITIES)!, []);

  function handleOnCityClick() {
    dispatch(cityChangeAction(randomCity));
    navigate(AppRoute.Main);
  }

  return (
    <main className="page__main page__main--login">
      <div className="page__login-container container">
        <section className="login">
          <h1 className="login__title">Sign in</h1>
          <form onSubmit={handleSubmit} className="login__form form" action="#" method="post">
            <div className="login__input-wrapper form__input-wrapper">
              <label className="visually-hidden">E-mail</label>
              <input
                onChange={(evt) => setLogin(evt.currentTarget.value)}
                className="login__input form__input"
                type="email"
                name="email"
                placeholder="Email"
                required
              />
            </div>
            <div className="login__input-wrapper form__input-wrapper">
              <label className="visually-hidden">Password</label>
              <input
                onChange={(evt) => setPassword(evt.currentTarget.value)}
                className="login__input form__input"
                type="password"
                name="password"
                placeholder="Password"
                required
              />
            </div>
            <button className="login__submit form__submit button" type="submit">Sign in</button>
          </form>
        </section>
        <section className="locations locations--login locations--current">
          <div className="locations__item">
            <a className="locations__item-link" href="#">
              <span onClick={handleOnCityClick}>{randomCity}</span>
            </a>
          </div>
        </section>
      </div>
    </main>
  );
}

export default LoginScreen;
