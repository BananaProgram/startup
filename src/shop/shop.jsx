import React, { useState, useEffect} from 'react';
import './shop.css';

export function Shop({ balances, setBalances }) {
    const [dinos, setDinos] = useState([]);

    useEffect(() => {
        const storedDinos = localStorage.getItem('dinos');
        if (storedDinos) {
            setDinos(JSON.parse(storedDinos));
        }
    }, []);

    const buyFood = ({ price, amount }) => {
        if (balances.scales > price) {
            setBalances({
                ...balances,
                scales: balances.scales - price,
                food: balances.food + amount
            });
        } else {
            alert("Not enough scales!");
        }
    };

    const buyDino = () => {
        if (balances.scales >= 1000) {
            const newDinoObject = {
                id: dinos.length > 0 ? Math.max(...dinos.map(dino => dino.id)) + 1 : 1,
                name: "T-Rex",
                health: 50,
                happiness: 50,
            };
    
            setDinos(prevDinos => {
                const updatedDinos = [...prevDinos, newDinoObject];
                localStorage.setItem('dinos', JSON.stringify(updatedDinos)); // Save updated dinos list
                return updatedDinos;
            });

            setBalances({
                ...balances,
                scales: balances.scales - 1000
            })
        } else {
            alert("Not enough scales!")
        }
    }

    return (
        <main className="container-fluid bg-secondary text-center">
            <div id="title-menu">
                <div className="title-menu" id="balances">
                    <div className="balances" id="scales">
                        <img src="dragon-scales.png"/><p className="balance-labels">{balances.scales}</p>
                    </div>
                    <div className="balances" id="food">
                        <img src="food.png"/><p className="balance-labels">{balances.food}</p>
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
                    <div className="price" onClick={() => buyDino()}><img src="dragon-scales.png" width="18%"/><p className="price-label">1,000</p></div>
                </div>
                <div className="shop-item">
                    <h3>Dinosaur Food x5</h3>
                    <div><img src="dino-egg.png" width="40%"/></div>
                    <div className="price" onClick={() => buyFood({ price: 200, amount: 5 })}><img src="dragon-scales.png" width="18%"/><p className="price-label">200</p></div>
                </div>
                <div className="shop-item">
                    <h3>Dinosaur Food x10</h3>
                    <div><img src="dino-egg.png" width="40%"/></div>
                    <div className="price" onClick={() => buyFood({ price: 300, amount: 10 })} ><img src="dragon-scales.png" width="18%"/><p className="price-label">300</p></div>
                </div>
            </div>
            <div className='fun-fact'>
                <h3>Extinct Animal</h3>
                <h4>Animal Name</h4>
                <img src='dino-egg.png' width="40%" />
            </div>
        </main>
    );
}