import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import App from './App';
import { pageStore } from './store';
import './style/bootstrap.min.css'

//export const backendAddress = 'http://localhost:8080';
export const backendAddress = 'https://wk-reimbursements-backend.azurewebsites.net'

ReactDOM.render(
  <React.StrictMode>
    <Provider store={pageStore}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);