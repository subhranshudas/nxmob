import { StrictMode } from 'react';
import { render } from 'react-dom';
import App from './app/app';

const container = document.getElementById('root');

render((
  <StrictMode>
    <App />
  </StrictMode>
), container);