import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import App from './App';
import { pageStore } from './store';

ReactDOM.render(
  <React.StrictMode>
    <Provider store={pageStore}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

//export const backendAddress = 'https://localhost';
export const backendAddress = 'https://wrkagel-revature-project1.eastus.cloudapp.azure.com'