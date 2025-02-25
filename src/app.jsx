import React from 'react';
import './app.css';
import { BrowserRouter, NavLink, Route, Routes } from 'react-router-dom';
import { Login } from './login/login';
import { Shop } from './shop/shop';
import { Enclosure } from './enclosure/enclosure';

export default function App() {
    return (
        <BrowserRouter>
            <div className="body bg-dark text-light">
                <header>
                        <h1>Dinosaur Pals</h1>
                        <nav>
                            <menu>
                                <li><NavLink className='nav-link' to=''>Login</NavLink></li>
                                <li><NavLink className='nav-link' to='enclosure'>My Enclosure</NavLink></li>
                                <li><NavLink className='nav-link' to='shop'>Shop</NavLink></li>
                            </menu>
                        </nav>

                    </header>

                    <Routes>
                        <Route path='/' element={<Login />} exact />
                        <Route path='/enclosure' element={<Enclosure />} />
                        <Route path='/shop' element={<Shop />} />
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