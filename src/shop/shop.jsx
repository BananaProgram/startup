import React from 'react';
import './shop.css';

export function Shop() {
  return (
    <main className="container-fluid bg-secondary text-center">
        <div id="title-menu">
            <div className="title-menu" id="balances">
                <div className="balances" id="scales">
                    <img src="dragon-scales.png"/><p className="balance-labels">123</p>
                </div>
                <div className="balances" id="food">
                    <img src="food.png"/><p className="balance-labels">123</p>
                </div>
            </div>
            <div className="title-menu">
                <h1>Shop</h1>
            </div>
            <div className="title-menu" id="find-friends">
                <input type="text" placeholder="Find friends" style={{ visibility: "hidden" }} />
            </div>
        </div>
        <div id="shop-items">
            <div className="shop-item">
                <h3>Dinosaur Egg</h3>
                <div><img src="dino-egg.png" width="40%"/></div>
                <div className="price"><img src="dragon-scales.png" width="18%"/><p className="price-label">1,000</p></div>
            </div>
            <div className="shop-item">
                <h3>Dinosaur Food x5</h3>
                <div><img src="dino-egg.png" width="40%"/></div>
                <div className="price"><img src="dragon-scales.png" width="18%"/><p className="price-label">200</p></div>
            </div>
            <div className="shop-item">
                <h3>Dinosaur Food x10</h3>
                <div><img src="dino-egg.png" width="40%"/></div>
                <div className="price"><img src="dragon-scales.png" width="18%"/><p className="price-label">300</p></div>
            </div>
        </div>
    </main>
  );
}