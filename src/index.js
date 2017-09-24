import './../public/icons/icon16.png';
import './../public/icons/icon48.png';
import './../public/icons/icon128.png';
import 'bootstrap/dist/css/bootstrap.css';
import 'font-awesome/css/font-awesome.css';
import React from 'react';
import { render } from 'react-dom';
import App from './components/App.jsx';

let root = document.createElement('div');
root.id = 'root';
document.body.appendChild(root);

render(<App page={window.location.pathname} />, document.getElementById('root'));
