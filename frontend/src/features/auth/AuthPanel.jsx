import { useMemo, useState } from 'react';
import { getCurrentUser, login, logout, refreshSession, register } from '../../api/endpoints';
import { SectionCard } from '../../components/SectionCard';
import { StatusBanner } from '../../components/StatusBanner';

const initialLoginState = {
  email: '',
  username: '',
  password: '',
};

const initialRegisterState = {
  fullname: '',
  email: '',
  username: '',
  password: '',
  avatar: null,
  coverImage: null,
};

export const AuthPanel = ({ authState, setAuthState }) => {
  const [loginForm, setLoginForm] = useState(initialLoginState);
  const [registerForm, setRegisterForm] = useState(initialRegisterState);
  const [status, setStatus] = useState({ type: 'info', message: '' });
  const [loading, setLoading] = useState(false);

  const isAuthenticated = useMemo(() => Boolean(authState.accessToken), [authState.accessToken]);

  const updateLoginField = (event) => {
    const { name, value } = event.target;
    setLoginForm((current) => ({ ...current, [name]: value }));
  };

  const updateRegisterField = (event) => {
    const { name, value, files } = event.target;
    setRegisterForm((current) => ({
      ...current,
      [name]: files ? files[0] : value,
    }));
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    setLoading(true);
    setStatus({ type: 'info', message: 'Signing you in…' });

    try {
      const response = await login(loginForm);
      setAuthState({
        accessToken: response.data.accessToken,
        refreshToken: response.data.refreshToken,
        user: response.data.user,
      });
      setStatus({ type: 'success', message: 'Frontend and backend session connected successfully.' });
      setLoginForm(initialLoginState);
    } catch (error) {
      setStatus({ type: 'error', message: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (event) => {
    event.preventDefault();
    setLoading(true);
    setStatus({ type: 'info', message: 'Creating your account…' });

    try {
      const formData = new FormData();
      Object.entries(registerForm).forEach(([key, value]) => {
        if (value) {
          formData.append(key, value);
        }
      });

      const response = await register(formData);
      setStatus({ type: 'success', message: `${response.message}. You can now log in with the new account.` });
      setRegisterForm(initialRegisterState);
    } catch (error) {
      setStatus({ type: 'error', message: error.message });
    } finally {
      setLoading(false);
    }
  };

  const refreshProfile = async () => {
    if (!authState.accessToken) return;
    setLoading(true);

    try {
      const response = await getCurrentUser(authState.accessToken);
      setAuthState((current) => ({ ...current, user: response.data }));
      setStatus({ type: 'success', message: 'Fetched current user from backend.' });
    } catch (error) {
      setStatus({ type: 'error', message: error.message });
    } finally {
      setLoading(false);
    }
  };

  const refreshTokens = async () => {
    if (!authState.refreshToken) {
      setStatus({ type: 'error', message: 'No refresh token available.' });
      return;
    }

    setLoading(true);

    try {
      const response = await refreshSession(authState.refreshToken);
      setAuthState((current) => ({
        ...current,
        accessToken: response.data.accessToken,
        refreshToken: response.data.refreshToken,
      }));
      setStatus({ type: 'success', message: response.message });
    } catch (error) {
      setStatus({ type: 'error', message: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    if (!authState.accessToken) {
      setAuthState({ accessToken: '', refreshToken: '', user: null });
      return;
    }

    setLoading(true);

    try {
      await logout(authState.accessToken);
      setStatus({ type: 'success', message: 'Logged out from backend and cleared the frontend session.' });
    } catch (error) {
      setStatus({
        type: 'error',
        message: `${error.message}. Local session was still cleared to avoid a stale login state.`,
      });
    } finally {
      setAuthState({ accessToken: '', refreshToken: '', user: null });
      setLoading(false);
    }
  };

  return (
    <SectionCard
      title="Authentication"
      subtitle="Login, register, refresh, and validate the actual session returned by your backend."
      actions={
        isAuthenticated ? (
          <div className="button-group">
            <button className="secondary-button" onClick={refreshProfile} type="button">
              Fetch profile
            </button>
            <button className="secondary-button" onClick={refreshTokens} type="button">
              Refresh tokens
            </button>
          </div>
        ) : null
      }
    >
      <StatusBanner status={status.type} message={status.message} />
      <div className="split-grid">
        <form className="panel-form" onSubmit={handleLogin}>
          <div>
            <p className="eyebrow">Login</p>
            <h3>Connect to live auth routes</h3>
          </div>
          <label>
            Email
            <input name="email" onChange={updateLoginField} placeholder="you@example.com" value={loginForm.email} />
          </label>
          <label>
            Username
            <input name="username" onChange={updateLoginField} placeholder="or username" value={loginForm.username} />
          </label>
          <label>
            Password
            <input name="password" onChange={updateLoginField} placeholder="••••••••" type="password" value={loginForm.password} />
          </label>
          <button className="primary-button" disabled={loading} type="submit">
            {loading ? 'Please wait…' : 'Login'}
          </button>
        </form>

        <form className="panel-form" onSubmit={handleRegister}>
          <div>
            <p className="eyebrow">Register</p>
            <h3>Create backend user</h3>
          </div>
          <label>
            Full name
            <input name="fullname" onChange={updateRegisterField} value={registerForm.fullname} />
          </label>
          <label>
            Email
            <input name="email" onChange={updateRegisterField} type="email" value={registerForm.email} />
          </label>
          <label>
            Username
            <input name="username" onChange={updateRegisterField} value={registerForm.username} />
          </label>
          <label>
            Password
            <input name="password" onChange={updateRegisterField} type="password" value={registerForm.password} />
          </label>
          <label>
            Avatar
            <input accept="image/*" name="avatar" onChange={updateRegisterField} type="file" />
          </label>
          <label>
            Cover image
            <input accept="image/*" name="coverImage" onChange={updateRegisterField} type="file" />
          </label>
          <button className="primary-button" disabled={loading} type="submit">
            {loading ? 'Please wait…' : 'Register'}
          </button>
        </form>
      </div>

      <div className="auth-summary">
        <div>
          <p className="eyebrow">Session</p>
          <h3>{isAuthenticated ? 'Backend session active' : 'Not signed in'}</h3>
          <p>
            Access token, refresh token, and the current user payload are stored together so protected routes can be called immediately after login.
          </p>
        </div>
        <button className="ghost-button" onClick={handleLogout} type="button">
          Logout
        </button>
      </div>

      <pre className="code-block">{JSON.stringify(authState, null, 2)}</pre>
    </SectionCard>
  );
};
