import React from 'react';
import { render } from 'react-dom';
import 'bootstrap/dist/css/bootstrap.css';
import 'font-awesome/css/font-awesome.css';
import App from './../components/App.jsx';

let root = document.createElement('div');
root.id = 'root';
document.body.appendChild(root);

render(<App page="options" />, document.getElementById('root'));
