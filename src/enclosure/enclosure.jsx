import React, { useEffect, useState } from 'react';

import { Dino } from './dino';

import './enclosure.css';

export function Enclosure({ balances, setBalances, userName }) {
    const [dinos, setDinos] = useState([]);

    const feedDino = ({id}) => {
        if (balances.food > 0) {
            setBalances({
                ...balances,
                food: balances.food - 10
            });
            setDinos(prevDinos =>
                prevDinos.map(dino =>
                    dino.id === id ? {...dino, health: dino.health + 5} : dino
                )
            );
            localStorage.setItem('dinos', JSON.stringify(dinos));
        } else {
            alert("Not enough food!");
        }
    };

    useEffect(() => {
        const storedDinos = localStorage.getItem('dinos');
        if (storedDinos) {
            setDinos(JSON.parse(storedDinos));
        } else {
            const defaultDinos = [
                { id: 1, name: "T-Rex", health: 90, happiness: 75 },
            ];
            setDinos(defaultDinos);
            localStorage.setItem('dinos', JSON.stringify(defaultDinos));  // Save to localStorage
        }
    }, []);


    return (
    <main className="container-fluid bg-secondary text-center">
        <div id="title-menu">
            <div className="title-menu" id="balances">
                <div className="balances" id="scales">
                    <img src="/dragon-scales.png"/><p className="balance-labels">{balances.scales}</p>
                </div>
                <div className="balances" id="food">
                    <img src="/food.png"/><p className="balance-labels">{balances.food}</p>
                </div>
            </div>
            <div className="title-menu">
                <h1>{userName}'s Dino Enclosure</h1>
            </div>
            <div className="title-menu" id="find-friends">
                <input type="text" placeholder="Find friends" />
            </div>
        </div>
        
        <div id="dino-grid">
            {dinos.map((dino) => (
                <Dino 
                    key={dino.id} 
                    dinoType={dino.name} 
                    health={dino.health} 
                    happiness={dino.happiness} 
                    onFeed={() => feedDino({ id: dino.id })}
                />
            ))}
        </div>
    </main>
  );
}