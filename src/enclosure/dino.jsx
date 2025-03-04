import React from 'react';

export function Dino(dinoType, happiness, health) {
    return (
        <div>
                <h4>{dinoType}</h4>
                <div>
                    <img src="/dino.png"/>
                </div>
                <div>
                    Health <meter min="0" max="100" value="{health}" ></meter>
                </div>
                <div>
                    Happiness <meter min="0" max="100" value="{happiness}" ></meter>
                </div>
                <button>Feed me!</button>
            </div>
    );
}