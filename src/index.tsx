import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import App from './App';
import { pageStore } from './store';
import './style/bootstrap.min.css'

ReactDOM.render(
  <React.StrictMode>
    <Provider store={pageStore}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root') || document.createElement('div')
);