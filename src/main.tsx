import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ThemeProvider } from './context/ThemeContext';
import { SoundProvider } from './context/SoundContext';
import { StoreProvider } from './context/StoreContext';
import { CartProvider } from './context/CartContext';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <StoreProvider>
      <ThemeProvider>
        <SoundProvider>
          <CartProvider>
            <App />
          </CartProvider>
        </SoundProvider>
      </ThemeProvider>
    </StoreProvider>
  </React.StrictMode>,
);

