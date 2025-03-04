import React from 'react';

export function Authenticated(props) {
    function logout() {
        localStorage.removeItem('userName');
        props.onLogout();
    }

    return (
        <div>
            <div className='playerName'>{props.userName}</div>
            <button variant='primary' onClick={() => navigate('/play')}>Play</button>
            <button variant='secondary' onClick={() => logout()}>Logout</button>
        </div>
    );
}