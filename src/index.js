import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { unregister } from './registerServiceWorker';
import { HashRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import createStore from './store';

ReactDOM.render(
    <Provider store ={createStore}>
        <HashRouter>
            <App />
        </HashRouter>
    </Provider>
    , document.getElementById('root'));
unregister();
