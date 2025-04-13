import React from 'react';

import { Unauthenticated } from './unauthenticated';
import { Authenticated } from './authenticated';
import { AuthState } from './authState';

export function Login({ userName, authState, onAuthChange }) {

  return (
    <main className="container-fluid bg-secondary text-center">
      <div>
        {authState !== AuthState.Unknown && <h1>Welcome to Dinosaur Pals!</h1>}
        {authState === AuthState.Authenticated && (
                  <Authenticated userName={userName} onLogout={() => onAuthChange(userName, AuthState.Unauthenticated)} />
                )}
        {authState === AuthState.Unauthenticated && (
                  <Unauthenticated
                    userName={userName}
                    onLogin={(loginUserName, updatedData) => {
                      onAuthChange(loginUserName, AuthState.Authenticated, updatedData);
                    }}
                  />
                )}

      </div>
    </main>
  );
}