import React, { useEffect, useState } from 'react';

import { Dino } from './dino';

import './enclosure.css';

export function Enclosure() {
    const [dinos, setDinos] = useState([]);

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
                    <img src="/dragon-scales.png"/><p className="balance-labels">123</p>
                </div>
                <div className="balances" id="food">
                    <img src="/food.png"/><p className="balance-labels">123</p>
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
            {dinos.map((dino) => (
                <Dino key={dino.id} dinoType={dino.name} health={dino.health} happiness={dino.happiness} />
            ))}
        </div>
    </main>
  );
}