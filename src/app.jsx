import React from 'react';
import './app.css';

export default function App() {
    return (
        <div className="body bg-dark text-light">
            <header>
                    <h1>Dinosaur Pals</h1>
                    <nav>
                        <menu>
                            <li><a href="index.html">Home</a></li>
                            <li><a href="enclosure.html">My Enclosure</a></li>
                            <li><a href="shop.html">Shop</a></li>
                        </menu>
                    </nav>

                </header>

                <main>
                    App content goes here
                </main>
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
    );
}