import './index.css'
import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import { supabase } from './lib/supabaseClient';

function App(){
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    setError("");
    setLoading(true);
    const {data, error} = await supabase.auth.signUp({email, password});
    setLoading(false);
    
    if(error) return setError(error.message);

    setUser(data.user ?? null);
  }

  const handleLogin = async () => {
    setError("");
    setLoading(true);
    const {data, error} = await supabase.auth.signInWithPassword({email, password});
    setLoading(false);
    
    if(error) return setError(error.message);

    setUser(data.user ?? null);
  }

  const handleLogout= async ()=>{
    setError("");
    setLoading(true);
    const {data,error} = await supabase.auth.signOut({email,password});
    setLoading(false);
    if (error) return setError(error.message);
    setUser(data.user ?? null);
  }

  useEffect(() => {

    const init = async () => {
      const {data: {session}} = await supabase.auth.getSession();
      setUser(session ?.user ?? null);
    };

    init();

    const { data: {subscription}} =
      supabase.auth.onAuthStateChange((_event, session) => {
        setUser(session ?.user ?? null);
      });

    return () => subscription.unsubscribe();
  }, []);

  return (

    <div>
      {!user ? (
      <div>
        <h2>Login</h2>
        {error && <p>{error}</p>}
        <label>Email:</label>
        <input type="email" value={email} onChange={e => setEmail(e.target.value)} />
        <br />
        <label>Password:</label>
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} />
        <div>
          <button onClick={handleLogin} disabled={loading || !email || !password}>Login</button>
          <button onClick={handleSignUp} disabled={loading || !email || !password}>Sign up</button>
          {loading ? <h2 >Please wait...</h2> : ""}
        </div>
      </div>
      ) : (
        <div>
          <h1>Welcome, {user.email}</h1>
          {loading ? "Please wait..." : ""}
          <button onClick={handleLogout} disabled={loading}>Log Out</button>
        </div>
      )}
    </div>
  )
}

export default App;