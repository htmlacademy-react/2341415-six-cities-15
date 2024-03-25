import { FormEvent, useRef } from 'react';
import { useAppDispatch } from '../../hooks/app-dispatch';
import { loginAction } from '../../store/api-actions';

function LoginScreen(): JSX.Element {
  const emailRef = useRef('');
  const passwordRef = useRef('');
  const dispatch = useAppDispatch();

  function handleSubmit(evt: FormEvent) {
    evt.preventDefault();
    dispatch(loginAction({ login: emailRef.current, password: passwordRef.current }));
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
                onChange={(evt) => {
                  emailRef.current = evt.currentTarget.value;
                }}
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
                onChange={(evt) => {
                  passwordRef.current = evt.currentTarget.value;
                }}
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
              <span>Amsterdam</span>
            </a>
          </div>
        </section>
      </div>
    </main>
  );
}

export default LoginScreen;
