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

//export const backendAddress = 'http://localhost:47477';
export const backendAddress = 'https://wrkagel-revature-project1.eastus.cloudapp.azure.com:47477'