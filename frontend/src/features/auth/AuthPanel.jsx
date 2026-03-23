import { useMemo, useState } from 'react';
import { getCurrentUser, login, register } from '../../api/endpoints';
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

  const isAuthenticated = useMemo(() => Boolean(authState.accessToken), [authState]);

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
      const nextAuthState = {
        accessToken: response.data.accessToken,
        refreshToken: response.data.refreshToken,
        user: response.data.user,
      };

      setAuthState(nextAuthState);
      setStatus({ type: 'success', message: response.message });
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
      setStatus({ type: 'success', message: response.message });
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
      setStatus({ type: 'success', message: response.message });
    } catch (error) {
      setStatus({ type: 'error', message: error.message });
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setAuthState({ accessToken: '', refreshToken: '', user: null });
    setStatus({ type: 'success', message: 'Local session cleared.' });
  };

  return (
    <SectionCard
      title="Authentication"
      subtitle="Login, register, and inspect the authenticated user payload returned by your backend."
      actions={
        isAuthenticated ? (
          <button className="secondary-button" onClick={refreshProfile} type="button">
            Refresh profile
          </button>
        ) : null
      }
    >
      <StatusBanner status={status.type} message={status.message} />
      <div className="split-grid">
        <form className="panel-form" onSubmit={handleLogin}>
          <div>
            <p className="eyebrow">Login</p>
            <h3>Use existing credentials</h3>
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
            <h3>Create a new account</h3>
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
          <h3>{isAuthenticated ? 'Authenticated' : 'Not signed in'}</h3>
          <p>
            The frontend stores access and refresh tokens locally so you can call
            protected routes like `/users/current-user` and `/dashboard/stats`.
          </p>
        </div>
        <button className="ghost-button" onClick={logout} type="button">
          Clear local session
        </button>
      </div>

      <pre className="code-block">{JSON.stringify(authState.user, null, 2) || 'null'}</pre>
    </SectionCard>
  );
};
