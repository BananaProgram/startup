import React, { useEffect, useState } from 'react';

import { Dino } from './dino';

import './enclosure.css';

export function Enclosure({ balances, setBalances, userName }) {
    const [dinos, setDinos] = useState([]);
    const [socket, setSocket] = useState(null);
    const [searchInput, setSearchInput] = useState('');
    const [searchError, setSearchError] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [viewingEnclosure, setViewingEnclosure] = useState(null);
    const [viewingFriendEmail, setViewingFriendEmail] = useState(null);

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

    useEffect(() => {
        const ws = new WebSocket('ws://dinosaurpals.org');
        ws.onopen = () => {
          console.log('WebSocket connected');
          ws.send(JSON.stringify({ type: 'identify', email: userName }));
        };
      
        ws.onmessage = (event) => {
          const msg = JSON.parse(event.data);
          
          function handleSocketMessage(msg) {
              switch (msg.type) {
                  case 'request-enclosure':
                      // Friend is asking for your enclosure data
                      ws.send(JSON.stringify({
                      type: 'enclosure-data',
                      to: msg.from,
                      data: { dinosaurs: dinos },
                      }));
                      break;
      
                  case 'enclosure-data':
                      console.log('Got friend enclosure:', msg.data);
                      setViewingEnclosure(msg.data); // Set it in state so we render it
                      break;              
              
                  case 'error':
                      console.error(msg.msg);
                      break;
              
                  default:
                      console.log('Unknown message:', msg);
              }
            }      
          handleSocketMessage(msg);
        };
            
        return () => ws.close();
      }, []);

    async function searchFriend(email) {
        try {
            const response = await fetch(`/api/user/${email}`);
            if (response.ok) {
            const user = await response.json();
            setSearchResults([user]); // If you later support multi-user search, make this an array
            setSearchError('');
            } else {
            setSearchResults([]);
            setSearchError('User not found.');
            }
        } catch (err) {
            console.error('Search failed:', err);
            setSearchResults([]);
            setSearchError('An error occurred.');
        }
    }

    function viewFriendEnclosure(friendEmail) {
        if (!socket) return;
        setViewingEnclosure(null);
        setViewingFriendEmail(friendEmail);
    
        socket.send(JSON.stringify({
            type: 'view-enclosure',
            target: friendEmail,
        }));
    }

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
                <input
                    type="text"
                    placeholder="Find friends"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                        searchFriend(searchInput);
                    }
                    }}
                />
                {searchError && <div className="error-message">{searchError}</div>}

                {searchResults.length > 0 && (
                <div className="search-results">
                    {searchResults.map((user, index) => (
                    <div
                        key={index}
                        className="search-result"
                        onClick={() => viewFriendEnclosure(user.email)}
                    >
                        {user.email}
                    </div>
                    ))}
                </div>
                )}
            </div>
        </div>
        
        <div id="dino-grid">
            {viewingEnclosure
            ? viewingEnclosure.dinosaurs.map((dino, i) => (
                <Dino
                    key={i}
                    dinoType={dino.name}
                    health={dino.health}
                    happiness={dino.happiness}
                    onFeed={null}
                />
                ))
            : dinos.map((dino) => (
                <Dino
                    key={dino.id}
                    dinoType={dino.name}
                    health={dino.health}
                    happiness={dino.happiness}
                    onFeed={() => feedDino({ id: dino.id })}
                />
                ))}
        </div>

        {viewingEnclosure && (
            <button onClick={() => setViewingEnclosure(null)}>Back to My Enclosure</button>
        )}
    </main>
  );
}