import React from 'react';
import './enclosure.css';

export function Enclosure() {
  return (
    <main className="container-fluid bg-secondary text-center">
        <div id="title-menu">
            <div className="title-menu" id="balances">
                <div className="balances" id="scales">
                    <img src="/public/dragon-scales.png"/><p className="balance-labels">123</p>
                </div>
                <div className="balances" id="food">
                    <img src="/public/food.png"/><p className="balance-labels">123</p>
                </div>
            </div>
            <div className="title-menu">
                <h1>user_name's Dino Enclosure</h1>
            </div>
            <div className="title-menu" id="find-friends">
                <input type="text" placeholder="Find friends" />
            </div>
        </div>
        
        <div id="dino-grid">
            <div>
                <h4>Type of Dinosaur</h4>
                <div>
                    <img src="/public/dino.png"/>
                </div>
                <div>
                    Health <meter min="0" max="100" value="68" ></meter>
                </div>
                <div>
                    Happiness <meter min="0" max="100" value="88" ></meter>
                </div>
                <button>Feed me!</button>
            </div>
            <div>
                <h4>Type of Dinosaur</h4>
                <div>
                    <img src="/public/dino.png"/>
                </div>
                <div>
                    Health <meter min="0" max="100" value="68" ></meter>
                </div>
                <div>
                    Happiness <meter min="0" max="100" value="88" ></meter>
                </div>
                <button>Feed me!</button>
            </div>
            <div>
                <h4>Type of Dinosaur</h4>
                <div>
                    <img src="/public/dino.png"/>
                </div>
                <div>
                    Health <meter min="0" max="100" value="68" ></meter>
                </div>
                <div>
                    Happiness <meter min="0" max="100" value="88" ></meter>
                </div>
                <button>Feed me!</button>
            </div>
            <div>
                <h4>Type of Dinosaur</h4>
                <div>
                    <img src="/public/dino.png"/>
                </div>
                <div>
                    Health <meter min="0" max="100" value="68" ></meter>
                </div>
                <div>
                    Happiness <meter min="0" max="100" value="88" ></meter>
                </div>
                <button>Feed me!</button>
            </div>
            <div>
                <h4>Type of Dinosaur</h4>
                <div>
                    <img src="/public/dino.png"/>
                </div>
                <div>
                    Health <meter min="0" max="100" value="68" ></meter>
                </div>
                <div>
                    Happiness <meter min="0" max="100" value="88" ></meter>
                </div>
                <button>Feed me!</button>
            </div>
        </div>
    </main>
  );
}