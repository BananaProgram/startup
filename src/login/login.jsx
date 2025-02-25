import React from 'react';

export function Login() {
  return (
    <main className="container-fluid bg-secondary text-center">
      <div>
        <h1>Welcome to Dinosaur Pals!</h1>
        <h3>Curate your very own collection of dino friends</h3>
            
        <form method="get" action="enclosure.html">
            <div>
                <span>Email: </span>
                <input type="text" placeholder="Email address" />
            </div>
            <div>
                <span>Password: </span>
                <input type="password" placeholder="Password" />
            </div>
            <button type="submit">Login</button>
            <button type="submit">Create Account</button>
        </form>

      </div>
    </main>
  );
}