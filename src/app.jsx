import React, { useState, useEffect } from 'react';
import './app.css';
import { BrowserRouter, NavLink, Route, Routes } from 'react-router-dom';
import { Login } from './login/login';
import { Shop } from './shop/shop';
import { Enclosure } from './enclosure/enclosure';
import { AuthState } from './login/authState';

export default function App() {
    const [userName, setUserName] = React.useState(localStorage.getItem('userName') || '');
    const currentAuthState = userName ? AuthState.Authenticated : AuthState.Unauthenticated;
    const [authState, setAuthState] = React.useState(currentAuthState);
    // Compute the initial balances first
    let initialBalances;
    try {
    const storedBalancesRaw = localStorage.getItem('balances');
    const parsed = JSON.parse(storedBalancesRaw);
    if (parsed && typeof parsed === 'object') {
        initialBalances = parsed;
    } else {
        initialBalances = { food: 100, scales: 1500 };
    }
    } catch {
    initialBalances = { food: 100, scales: 1500 };
    }

    // Then call useState ONCE
    const [balances, setBalances] = useState(initialBalances);

    const [dinos, setDinos] = useState([]);

    React.useEffect(() => {
        const storedUser = localStorage.getItem('userName');
        if (storedUser) {
            setUserName(storedUser);
            setAuthState(AuthState.Authenticated);
        } else {
            setAuthState(AuthState.Unauthenticated);
        }
    }, []);

    React.useEffect(() => {
        localStorage.setItem('balances', JSON.stringify(balances));
    }, [balances]);


    return (
        <BrowserRouter>
            <div className="body bg-dark text-light">
                <header>
                        <h1>Dinosaur Pals</h1>
                        <nav>
                            <menu>
                                <li><NavLink className='nav-link' to=''>Login</NavLink></li>
                                {authState === AuthState.Authenticated && (
                                    <li className='nav-item'>
                                    <NavLink className='nav-link' to='/enclosure'>My Enclosure</NavLink>
                                    </li>
                                )}
                                {authState === AuthState.Authenticated && (
                                    <li className='nav-item'>
                                    <NavLink className='nav-link' to='/shop'>Shop</NavLink>
                                    </li>
                                )}
                            </menu>
                        </nav>

                    </header>

                    <Routes>
                    <Route
                        path='/'
                        element={
                            <Login
                                userName={userName}
                                authState={authState}
                                onAuthChange={(newUserName, newAuthState, updatedData) => {
                                    console.log("updatedData", updatedData)
                                    setAuthState(newAuthState);
                                    setUserName(newUserName);
                                
                                    if (updatedData) {
                                        setBalances(updatedData.balances);
                                        setDinos(updatedData.dinos);
                                    }
                                
                                    if (newAuthState === AuthState.Authenticated) {
                                        localStorage.setItem('userName', newUserName);
                                    } else {
                                        localStorage.removeItem('userName');
                                    }
                                }}                            
                            />
                        }
                        exact
                    />
                        <Route path='/enclosure' element={<Enclosure
                                                            userName={userName}
                                                            balances={balances}
                                                            setBalances={setBalances}
                                                            dinos={dinos}
                                                            setDinos={setDinos}
                                                            />
                                                        } />
                        <Route path='/shop' element={<Shop balances={balances} setBalances={setBalances} />} />
                        <Route path='*' element={<NotFound />} />
                    </Routes>

                    <footer>
                        Problems? Let us know!
                        <br />
                        elenakay@byu.edu
                        <br />
                        <span className="text-reset">Elena Ketcheson</span>
                        <br />
                        <a href="https://github.com/BananaProgram/startup">GitHub</a>
                    </footer>
            </div>
        </BrowserRouter>
    );
}

function NotFound() {
    return <main className="container-fluid bg-secondary text-center">404: Return to sender. Address unknown.</main>;
}