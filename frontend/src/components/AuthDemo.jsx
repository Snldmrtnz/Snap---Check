
import React, { useState, useEffect, useRef } from 'react';
import { login, logout, signup, supabase } from '../utils/supabaseClient';
import { getProfile, setProfile } from '../utils/profileApi';

export default function AuthDemo({ onAuth }) {


  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const [isSignup, setIsSignup] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const [profileLoaded, setProfileLoaded] = useState(false);
  const displayNameLoaded = useRef(false);


  const handleAuth = async (e) => {
    e.preventDefault();
    setError('');
    if (isSignup) {
      const { error } = await signup(email, password);
      if (error) setError(error.message);
      else {
        // Always fetch the current user from Supabase Auth
        const { data, error: userError } = await supabase.auth.getUser();
        if (userError) setError(userError.message);
        else {
          setUser(data.user);
          if (onAuth) onAuth(data.user);
        }
      }
    } else {
      const { error } = await login(email, password);
      if (error) setError(error.message);
      else {
        // Always fetch the current user from Supabase Auth
        const { data, error: userError } = await supabase.auth.getUser();
        if (userError) setError(userError.message);
        else {
          setUser(data.user);
          if (onAuth) onAuth(data.user);
        }
      }
    }
  };

  const handleLogout = async () => {
    await logout();
    setUser(null);
    if (onAuth) onAuth(null);
  };



  useEffect(() => {
    async function fetchProfile() {
      if (user && user.id && !displayNameLoaded.current) {
        const { displayName } = await getProfile(user.id);
        setProfileLoaded(true);
        if (displayName) {
          setDisplayName(displayName);
        }
        displayNameLoaded.current = true;
      }
    }
    fetchProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const handleDisplayNameSubmit = async (e) => {
    e.preventDefault();
    if (user && displayName) {
      const { error } = await setProfile(user.id, displayName);
      if (!error) {
        // After saving, fetch profile again to confirm
        const { displayName: newDisplayName } = await getProfile(user.id);
        if (newDisplayName) {
          setDisplayName(newDisplayName);
          setProfileLoaded(true);
        }
      } else {
        setError(error.message);
      }
    }
  };

  if (user) {
    // If profile not loaded or displayName not set, prompt for display name
    if ((!displayName || displayName.length === 0) && profileLoaded) {
      return (
        <form onSubmit={handleDisplayNameSubmit} style={{ margin: 24, display: 'flex', flexDirection: 'column', maxWidth: 300 }}>
          <h2>Choose a Display Name</h2>
          <input
            type="text"
            placeholder="Display Name"
            value={displayName}
            onChange={e => {
              setDisplayName(e.target.value);
              displayNameLoaded.current = true;
            }}
            required
            style={{ marginBottom: 8 }}
          />
          <button type="submit">Save</button>
          {error && <p style={{ color: 'red' }}>{error}</p>}
        </form>
      );
    }
    return (
      <div style={{ margin: 24 }}>
        <p>Welcome, {displayName ? displayName : user.email}!</p>
        <button onClick={handleLogout}>Log out</button>
      </div>
    );
  }


  return (
    <form onSubmit={handleAuth} style={{ margin: 24, display: 'flex', flexDirection: 'column', maxWidth: 300 }}>
      <h2>{isSignup ? 'Sign Up' : 'Login'}</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        required
        style={{ marginBottom: 8 }}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        required
        style={{ marginBottom: 8 }}
      />
      <button type="submit">{isSignup ? 'Sign up' : 'Log in'}</button>
      <button type="button" style={{ marginTop: 8 }} onClick={() => setIsSignup(!isSignup)}>
        {isSignup ? 'Already have an account? Log in' : "Don't have an account? Sign up"}
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </form>
  );
}
