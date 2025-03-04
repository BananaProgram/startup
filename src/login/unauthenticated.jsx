import React from 'react';

export function Unauthenticated(props) {
    const [userName, setUserName] = React.useState(props.userName);
    const [password, setPassword] = React.useState('');

    async function loginUser() {
        localStorage.setItem('userName', userName);
        props.onLogin(userName);
    }

    async function createUser() {
        localStorage.setItem('userName', userName);
        props.onLogin(userName);
    }
    
    <form method="get" action="enclosure.html">
        <div>
            <span>Email: </span>
            <input type="text" value={userName} onChange={(e) => setUserName(e.target.value)} placeholder="Email address" />
        </div>
        <div>
            <span>Password: </span>
            <input type="password" onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
        </div>
        <button type="submit" onClick={() => loginUser()} disabled={!userName || !password} >Login</button>
        <button type="submit" onClick={() => createUser()} disabled={!userName || !password} >Create Account</button>
    </form>


    return;
}