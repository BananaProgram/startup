import React, { useEffect, useState, useRef } from 'react';

import { Dino } from './dino';

import './enclosure.css';

export function Enclosure({ balances, setBalances, userName, dinos: initialDinos }) {
    const [dinos, setDinos] = useState([]);
    const [socket, setSocket] = useState(null);
    const [searchInput, setSearchInput] = useState('');
    const [searchError, setSearchError] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [viewingEnclosure, setViewingEnclosure] = useState(null);
    const [viewingFriendEmail, setViewingFriendEmail] = useState(null);
    const dinosRef = useRef([]);
    const balancesRef = useRef([]);

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
        } else {
            alert("Not enough food!");
        }
    };

    useEffect(() => {
        dinosRef.current = dinos;
    }, [dinos]);

    useEffect(() => {
        balancesRef.current = balances;
    }, [balances]);

    useEffect(() => {
        if (initialDinos && initialDinos.length > 0) {
            setDinos(initialDinos);
        } else {
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
        }
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
          // Gain 1 scale per dino per minute
          const earned = dinos.length;
          setBalances(prev => ({
            ...prev,
            scales: prev.scales + earned,
          }));
      
          // Decrease health slightly
          setDinos(prev =>
            prev.map(dino => ({
              ...dino,
              health: Math.max(dino.health - 0.2, 0),
            }))
          );
        }, 60000); // every 60 seconds
      
        return () => clearInterval(interval);
      }, [dinos.length]);
      

    useEffect(() => {
        localStorage.setItem('dinos', JSON.stringify(dinos));
    }, [dinos]);

    useEffect(() => {
        const ws = new WebSocket(`wss://${window.location.hostname}`);
        setSocket(ws);
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
                            data: { dinosaurs: dinosRef.current },
                        }));
                        break;
        
                    case 'enclosure-data':
                        console.log('Got friend enclosure:', msg.data);
                        setViewingEnclosure(msg.data); // Set it in state so we render it
                        break;              
                
                    case 'error':
                        console.error(msg.msg);
                        setSearchError(msg.msg);
                        break;
                
                    default:
                        console.log('Unknown message:', msg);
                }
                }      
            handleSocketMessage(msg);
        };
            
        return () => ws.close();
      }, []);

      useEffect(() => {
        const interval = setInterval(() => {
          const saveData = async () => {
            try {
              await fetch('/api/user/save', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include', // ensures cookie token is sent
                body: JSON.stringify({
                    dinos: dinosRef.current,
                    balances: balancesRef.current,
                }),
              });
              console.log('Auto-save successful');
            } catch (err) {
              console.error('Auto-save failed:', err);
            }
          };
      
          saveData();
        }, 10 * 60 * 1000); // 10 minutes
      
        return () => clearInterval(interval); // cleanup if component unmounts
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
                        <button
                        key={index}
                        className="search-result"
                        onClick={() => viewFriendEnclosure(user.email)}
                        >
                        {user.email}
                        </button>
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