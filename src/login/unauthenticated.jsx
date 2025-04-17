import React from 'react';

export function Unauthenticated(props) {
    const [userName, setUserName] = React.useState(props.userName);
    const [password, setPassword] = React.useState('');
    const [error, setError] = React.useState('');

    async function loginUser() {
        loginOrCreate('/api/auth/login');
    }
    
    async function createUser() {
        loginOrCreate('/api/auth/create');
    }
    
    async function loginOrCreate(endpoint) {
        const response = await fetch(endpoint, {
          method: 'post',
          body: JSON.stringify({ email: userName, password: password }),
          headers: {
            'Content-type': 'application/json; charset=UTF-8',
          },
        });
        if (response?.status === 200) {
          const user = await response.json();
          console.log("Login Response:", user);
          localStorage.setItem('userName', userName);
          props.onLogin(user.email, {
            balances: user.balances,
            dinos: user.dinos
          });
        } else {
          const body = await response.json();
          setError(`⚠ Error: ${body.msg}`);
        }
    }

    return (
        <div>
            <form>
                <div>
                    <span>Email: </span>
                    <input type="text" value={userName} onChange={(e) => setUserName(e.target.value)} placeholder="Email address" />
                </div>
                <div>
                    <span>Password: </span>
                    <input type="password" onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
                </div>
                <button type="button" onClick={(e) => { e.preventDefault(); loginUser(); }} disabled={!userName || !password} >Login</button>
                <button type="button" onClick={(e) => { e.preventDefault(); createUser(); }} disabled={!userName || !password} >Create Account</button>
            </form>
    </div>
    );
}