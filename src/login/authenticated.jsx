import React from 'react';
import { useNavigate } from 'react-router-dom';

export function Authenticated(props) {
    const navigate = useNavigate();
    
    function logout() {
        localStorage.removeItem('userName');
        props.onLogout();
    }

    return (
        <div>
            <div className='playerName'>{props.userName}</div>
            <button variant='primary' onClick={() => navigate('/enclosure')}>Play</button>
            <button variant='secondary' onClick={() => logout()}>Logout</button>
        </div>
    );
}