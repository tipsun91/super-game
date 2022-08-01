import React, { useCallback, useEffect, useRef } from 'react';
import './Signin.css';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { signIn } from '../../store/userReducer/reducer';

// const URL = '/api/sign/in/';

export default function Signin() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const signInForm = useRef();

  const onSubmit = useCallback(
    (event) => {
      event.preventDefault();
      event.stopPropagation();

      dispatch(signIn(event));
    },
    [signInForm],
  );

  useEffect(
    () => {
      if (user && user.id) {
        navigate('/main');
      }
    },
    [user],
  );

  return (
    <div className="login-box anim-show-singin">
      <form className="form_login" autoComplete="off" ref={signInForm} onSubmit={onSubmit}>
        <div className="input-section">
          <i className="far" />
          <input
            name="email"
            required
            className="input-area"
            type="email"
            placeholder="Email"
          />
        </div>
        <div className="input-section">
          <i className="fas" />
          <input
            name="password"
            required
            className="input-area"
            type="password"
            placeholder="Password"
          />
        </div>
        <button type="submit" className="btn" id="login-btn">
          Войти
        </button>
      </form>
    </div>
  );
}
