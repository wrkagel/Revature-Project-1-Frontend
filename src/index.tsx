import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import App from './App';
import { pageStore } from './store';
import './style/bootstrap.min.css'

//export const backendAddress = 'https://localhost';
export const backendAddress = 'https://wk-revature-vm.eastus.cloudapp.azure.com'

ReactDOM.render(
  <React.StrictMode>
    <Provider store={pageStore}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);